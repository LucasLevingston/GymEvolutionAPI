import { getAllNutritionists } from '../../services/user/get-all-nutritionists';

export async function getAllNutritionistsController() {
  try {
    const nutritionists = await getAllNutritionists();

    return nutritionists;
  } catch (error) {
    throw error;
  }
}
