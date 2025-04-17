import { prisma } from 'lib/prisma'

interface RegisterProfessionalParams {
  userId: string
  role: 'TRAINER' | 'NUTRITIONIST'
  bio: string
  experience: number
  specialties: string[]
  certifications: string
  education: string
  availability: string
  imageUrl: string | null
}
export async function registerProfessionalService(
  params: RegisterProfessionalParams
): Promise<string> {
  const {
    userId,
    role,
    bio,
    experience,
    specialties,
    certifications,
    education,
    availability,
    imageUrl,
  } = params

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      bio,
      experience,
      specialties: specialties.join(','),
      certifications:
        Array.isArray(certifications) || typeof certifications === 'object'
          ? JSON.stringify(certifications)
          : certifications,

      education:
        Array.isArray(education) || typeof education === 'object'
          ? JSON.stringify(education)
          : education,
      availability,
      imageUrl,
      approvalStatus: 'PENDING',
    },
  })

  return user.id
}
