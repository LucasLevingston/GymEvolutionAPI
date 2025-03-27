import { prisma } from 'lib/prisma';
import { google } from 'googleapis';
import { oauth2Client } from 'lib/oauth2Client';
import { startOfDay, endOfDay, parseISO, format, addMinutes } from 'date-fns';
import { ClientError } from 'errors/client-error';
import { getUserByIdService } from 'services/user/get-user-by-id';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export async function getProfessionalAvailabilityService(
  professionalId: string,
  dateString: string
): Promise<TimeSlot[]> {
  // Parse the date
  const parsedDate = parseISO(dateString);
  const dayStart = startOfDay(parsedDate);
  const dayEnd = endOfDay(parsedDate);

  // Get the professional's Google connection
  const googleConnection = await prisma.googleConnection.findFirst({
    where: {
      userId: professionalId,
    },
  });

  if (!googleConnection) {
    throw new ClientError('Professional has not connected their Google Calendar');
  }

  // Set credentials from stored tokens
  oauth2Client.setCredentials({
    access_token: googleConnection.accessToken,
    refresh_token: googleConnection.refreshToken || undefined,
    expiry_date: googleConnection.expiresAt?.getTime() || undefined,
    token_type: googleConnection.tokenType,
  });

  // Create calendar client
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Get the professional's busy slots from Google Calendar
  const busyTimesResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = busyTimesResponse.data.calendars?.primary?.busy || [];

  // Get the professional's working hours from the database
  const professional = await getUserByIdService(professionalId);

  if (!professional) throw new ClientError('Professional not found');
  // Default working hours if not set (9 AM to 5 PM)
  const workStartHour = professional.ProfessionalSettings?.workStartHour || 9;
  const workEndHour = professional.ProfessionalSettings?.workEndHour || 17;
  const slotDurationMinutes =
    professional.ProfessionalSettings?.appointmentDuration || 60;

  // Generate all possible time slots for the day
  const allTimeSlots: TimeSlot[] = [];

  // Current date for comparing with past slots
  const now = new Date();

  // Loop through each hour in the working day
  for (let hour = workStartHour; hour < workEndHour; hour++) {
    // For each hour, create slots based on the duration
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      const slotStart = new Date(dayStart);
      slotStart.setHours(hour, minute, 0, 0);

      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + slotDurationMinutes);

      // Skip slots that end after working hours
      if (
        slotEnd.getHours() > workEndHour ||
        (slotEnd.getHours() === workEndHour && slotEnd.getMinutes() > 0)
      ) {
        continue;
      }

      // Skip slots in the past
      if (slotStart < now) {
        continue;
      }

      // Check if the slot overlaps with any busy time
      const isOverlapping = busySlots.some((busySlot) => {
        const busyStart = new Date(busySlot.start!);
        const busyEnd = new Date(busySlot.end!);

        return (
          (slotStart >= busyStart && slotStart < busyEnd) || // Slot start is within busy period
          (slotEnd > busyStart && slotEnd <= busyEnd) || // Slot end is within busy period
          (slotStart <= busyStart && slotEnd >= busyEnd) // Busy period is within slot
        );
      });

      allTimeSlots.push({
        startTime: slotStart.toISOString(),
        endTime: slotEnd.toISOString(),
        available: !isOverlapping,
      });
    }
  }

  // Get existing meetings from the database for this professional on this day
  const existingMeetings = await prisma.meeting.findMany({
    where: {
      professionalId,
      startTime: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        not: 'CANCELLED', // Don't consider cancelled meetings
      },
    },
  });

  // Mark slots as unavailable if they overlap with existing meetings
  const availableTimeSlots = allTimeSlots.map((slot) => {
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);

    const overlapsWithMeeting = existingMeetings.some((meeting) => {
      const meetingStart = new Date(meeting.startTime);
      const meetingEnd = new Date(meeting.endTime);

      return (
        (slotStart >= meetingStart && slotStart < meetingEnd) ||
        (slotEnd > meetingStart && slotEnd <= meetingEnd) ||
        (slotStart <= meetingStart && slotEnd >= meetingEnd)
      );
    });

    return {
      ...slot,
      available: slot.available && !overlapsWithMeeting,
    };
  });
  console.log(availableTimeSlots);
  return availableTimeSlots;
}
