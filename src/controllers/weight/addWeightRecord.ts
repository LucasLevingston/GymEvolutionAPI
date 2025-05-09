import { User } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { isProfessionalAssignedToStudent } from 'services/training-week/is-professional-assigned-to-student';
import { addWeightRecord } from 'services/weight/add-weight-record';

export const addWeightRecordController = async (
  request: FastifyRequest<{
    Body: {
      weight: string;
      bf?: string;
      date?: string;
      studentId?: string;
    };
  }>,
  reply: FastifyReply
) => {
  const { id: userId, role } = request.user as User;
  const { weight, bf, date, studentId } = request.body;

  let targetUserId = userId;

  if ((role === 'NUTRITIONIST' || role === 'TRAINER') && studentId) {
    const isAssigned = await isProfessionalAssignedToStudent(userId, studentId, role);

    if (!isAssigned) {
      return reply.status(403).send({ message: 'You are not assigned to this student' });
    }

    targetUserId = studentId;
  } else if (studentId && role === 'STUDENT') {
    return reply
      .status(403)
      .send({ message: 'Students can only add weight for themselves' });
  }

  const weightRecord = await addWeightRecord({
    weight,
    bf: bf || '0',
    date: date || new Date().toISOString(),
    userId: targetUserId,
  });

  return reply.status(201).send(weightRecord);
};
