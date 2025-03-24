import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getProfessionalByIdService(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user || (user.role !== 'NUTRITIONIST' && user.role !== 'TRAINER')) {
    return null;
  }

  const specialties = user.specialties ? JSON.parse(user.specialties) : [];
  const certifications = user.certifications ? JSON.parse(user.certifications) : [];
  const education = user.education ? JSON.parse(user.education) : [];
  const availability = user.availability ? JSON.parse(user.availability) : [];
  const reviews = user.reviews ? JSON.parse(user.reviews) : [];

  return {
    id: user.id,
    name: user.name || 'Unknown',
    email: user.email,
    role: user.role,
    bio: user.bio || '',
    city: user.city || 'Remote',
    state: user.state || '',
    phone: user.phone || '',
    imageUrl: user.imageUrl || '',
    experience: user.experience || 0,
    rating: user.rating || 4.5,
    specialties,
    certifications,
    education,
    availability,
    reviews,
  };
}
