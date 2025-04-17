import { prisma } from 'lib/prisma'

export async function getProfessionalsService() {
  const professionals = await prisma.user.findMany({
    where: {
      OR: [{ role: 'NUTRITIONIST' }, { role: 'TRAINER' }],
    },
  })

  return professionals.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    city: user.city,
    state: user.state,
    imageUrl: user.imageUrl,
    experience: user.experience,
    rating: user.rating,
    approvalStatus: user.approvalStatus,
    specialties: user.specialties ? user.specialties.split(',') : [],
    certifications: user.certifications ? JSON.parse(user.certifications) : [],
    education: user.education ? JSON.parse(user.education) : [],
    availability: user.availability ? user.availability.split(',') : [],
    reviews: user.reviews ? JSON.parse(user.reviews) : [],
  }))
}
