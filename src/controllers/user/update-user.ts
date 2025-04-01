import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateUserService } from '../../services/user/update-user'
import type { User } from '@prisma/client'
import { ClientError } from '../../errors/client-error'
import crypto from 'crypto'
import { s3Client } from 'lib/s3Client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getUserByIdService } from 'services/user/get-user-by-id'
import { env } from '@/env'
// import { addToHistory } from 'services/history/add'

interface Params {
  id: string
}

export async function updateUserController(
  request: FastifyRequest<{
    Params: Params
    Body: Partial<User>
  }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params
    const { id: userId, role } = request.user as User

    if (id !== userId && role !== 'ADMIN') {
      throw new ClientError('Forbidden')
    }
    if (request.body) {
      const user = await getUserByIdService(userId)
      const data = request.body as User

      if (data.useGooglePicture) {
        try {
          const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              Authorization: `Bearer ${user?.GoogleConnection?.accessToken}`,
            },
          })

          if (!response.ok) {
            throw new Error(
              `Error fetching Google picture: ${response.status} ${response.statusText}`
            )
          }

          const responseData = await response.json()
          const photoUrl = responseData.picture

          if (photoUrl) {
            data.imageUrl = photoUrl
          }
        } catch (error) {
          console.error('Error fetching Google picture:', error)
        }
      }

      const updatedUser = await updateUserService(data)
      return updatedUser
    }

    let updateData: Partial<User> = {}

    const data = await request.file()

    if (data) {
      if (data.file) {
        const fileBuffer = await data.toBuffer()

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME as string,
          Key: userId,
          Body: fileBuffer,
          ContentType: data.mimetype,
        }

        const command = new PutObjectCommand(params)
        await s3Client.send(command)

        const region = process.env.AWS_REGION || 'us-east-1'
        const bucketName = process.env.AWS_S3_BUCKET_NAME
        const imageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${userId}`

        const formFields: Record<string, any> = {}
        for (const [key, value] of Object.entries(data.fields)) {
          try {
            if (value?.value) {
              formFields[key] = JSON.parse(value.value)
            }
          } catch {
            formFields[key] = value.value
          }
        }

        const typedFormFields = formFields as Partial<User>

        updateData = {
          ...typedFormFields,
          phone: typedFormFields.phone ? String(typedFormFields.phone) : undefined,
          height: typedFormFields.height ? String(typedFormFields.height) : undefined,
          currentWeight: typedFormFields.currentWeight
            ? String(typedFormFields.currentWeight)
            : undefined,
          currentBf: typedFormFields.currentBf
            ? String(typedFormFields.currentBf)
            : undefined,
          imageUrl,
        }
      }
    } else {
      const body = request.body as User

      updateData = {
        ...body,
        height: body.height !== undefined ? String(body.height) : undefined,
        phone: body.phone !== undefined ? String(body.phone) : undefined,
        currentWeight:
          body.currentWeight !== undefined ? String(body.currentWeight) : undefined,
        currentBf: body.currentBf !== undefined ? String(body.currentBf) : undefined,
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new ClientError('No data provided for update')
    }

    updateData.id = id

    const updatedUser = await updateUserService(updateData as User)

    return reply.status(200).send(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof ClientError) {
      return reply.status(400).send({ error: error.message })
    }
    return reply.status(500).send({ error: 'Internal server error' })
  }
}
