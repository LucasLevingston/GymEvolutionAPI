import { prisma } from 'lib/prisma';
import { UpdatePlanInput } from 'schemas/plan-schema';

export async function updatePlanService(id: string, data: UpdatePlanInput): Promise<any> {
  const updateData: any = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.duration !== undefined) updateData.duration = data.duration;
  if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const plan = await prisma.plan.update({
    where: { id },
    data: updateData,
  });

  return {
    ...plan,
    features: JSON.parse(plan.features),
  };
}
