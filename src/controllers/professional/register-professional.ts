import type { FastifyRequest, FastifyReply } from 'fastify'
import type { User } from '@prisma/client'
import { saveProfileImageService } from '@/services/documents/save-profile-image'
import { registerProfessionalService } from '@/services/professional/register-professional'
import { saveDocumentsService } from '@/services/documents/save-documents'

export async function registerProfessionalController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id: userId } = request.user as User

    const parts = request.parts()

    const formData: Record<string, any> = {}
    const files: Record<string, any> = {}

    for await (const part of parts) {
      if (part.type === 'file') {
        files[part.fieldname] = {
          buffer: await part.toBuffer(),
          filename: part.filename,
          mimetype: part.mimetype,
          toBuffer: async () => part.file, // Ensure toBuffer method is available
        }
      } else {
        formData[part.fieldname] = part.value
      }
    }

    const role = formData.role
    const bio = formData.bio
    const experience = Number.parseInt(formData.experience)
    const availability = formData.availability

    const specialties = JSON.parse(formData.specialties || '[]')
    const certifications = JSON.parse(formData.certifications || '[]')
    const education = JSON.parse(formData.education || '[]')

    const documentCount = Number.parseInt(formData.documentCount || '0')

    let profileImageUrl = null

    if (files.profileImage) {
      profileImageUrl = await saveProfileImageService(files.profileImage, userId)
    }

    // Format documents as an array of DocumentFile objects
    const documentsArray = []
    for (let i = 0; i < documentCount; i++) {
      const documentFile = files[`document_${i}`]
      if (documentFile) {
        documentsArray.push({
          file: documentFile,
          name:
            formData[`document_${i}_name`] ||
            documentFile.filename ||
            `Document ${i + 1}`,
          description: formData[`document_${i}_description`] || '',
        })
      }
    }

    // Only call saveDocumentsService if there are documents to save
    if (documentsArray.length > 0) {
      try {
        await saveDocumentsService(documentsArray, userId)
      } catch (error) {
        console.error('Error saving documents:', error)
        // Continue with registration even if document saving fails
      }
    }

    const professional = await registerProfessionalService({
      userId,
      role,
      bio,
      experience,
      specialties,
      certifications,
      education,
      availability,
      imageUrl: profileImageUrl,
    })

    return reply.status(201).send({
      success: true,
      message: 'Professional registered successfully',
      data: professional,
    })
  } catch (error) {
    console.error('Error in registerProfessionalController:', error)
    return reply.status(500).send({
      success: false,
      message: 'Failed to register professional',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
