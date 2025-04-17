import { PutObjectCommand } from '@aws-sdk/client-s3'
import { prisma } from '@/lib/prisma'
import { s3Client } from '@/lib/s3Client'
import { env } from '@/env'

interface DocumentFile {
  file: any
  name: string
  description?: string
}

const { AWS_S3_BUCKET_NAME } = env

export async function saveDocumentsService(
  documents: DocumentFile[],
  userId: string
): Promise<void> {
  try {
    for (const doc of documents) {
      const fileName = `documents/${userId}/`

      await s3Client.send(
        new PutObjectCommand({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: fileName,
          Body: await doc.file.toBuffer(),
          ContentType: doc.file.mimetype,
        })
      )

      await prisma.document.create({
        data: {
          name: doc.name,
          description: doc.description || null,
          url: `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
          type: doc.file.mimetype,
          userId,
        },
      })
    }
  } catch (error) {
    console.error('Error saving documents:', error)
    throw new Error('Failed to save documents')
  }
}
