"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockHistoryService = exports.mockWeightService = exports.mockMealItemsService = exports.mockMealService = exports.mockDietService = exports.mockSerieService = exports.mockExerciseService = exports.mockTrainingDayService = exports.mockTrainingWeekService = exports.mockUserService = exports.mockAuthService = void 0;
const vitest_1 = require("vitest");
const data_1 = require("./data");
// Auth Service Mock
exports.mockAuthService = {
    register: vitest_1.vi.fn().mockResolvedValue({
        user: {
            id: data_1.mockUser.id,
            name: data_1.mockUser.name,
            email: data_1.mockUser.email,
            role: data_1.mockUser.role,
        },
        token: 'mocked-token',
    }),
    login: vitest_1.vi.fn().mockResolvedValue({
        user: {
            id: data_1.mockUser.id,
            name: data_1.mockUser.name,
            email: data_1.mockUser.email,
            role: data_1.mockUser.role,
        },
        token: 'mocked-token',
    }),
    forgotPassword: vitest_1.vi.fn().mockResolvedValue({
        message: 'Password reset link sent',
        resetToken: 'mocked-reset-token',
    }),
    resetPassword: vitest_1.vi.fn().mockResolvedValue({
        message: 'Password has been reset',
    }),
    getCurrentUser: vitest_1.vi.fn().mockResolvedValue({
        id: data_1.mockUser.id,
        name: data_1.mockUser.name,
        email: data_1.mockUser.email,
        role: data_1.mockUser.role,
    }),
};
// User Service Mock
exports.mockUserService = {
    getAllUsers: vitest_1.vi.fn().mockResolvedValue([data_1.mockUser]),
    getUserById: vitest_1.vi.fn().mockResolvedValue(data_1.mockUser),
    updateUser: vitest_1.vi.fn().mockResolvedValue(data_1.mockUser),
    deleteUser: vitest_1.vi.fn().mockResolvedValue(true),
    getAllNutritionists: vitest_1.vi.fn().mockResolvedValue([data_1.mockUser]),
    getAllTrainers: vitest_1.vi.fn().mockResolvedValue([data_1.mockUser]),
    assignNutritionist: vitest_1.vi.fn().mockResolvedValue({
        id: 'relationship-id',
        nutritionistId: 'nutritionist-id',
        studentId: 'student-id',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    assignTrainer: vitest_1.vi.fn().mockResolvedValue({
        id: 'relationship-id',
        trainerId: 'trainer-id',
        student2Id: 'student-id',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
    }),
    getNutritionistStudents: vitest_1.vi.fn().mockResolvedValue([data_1.mockUser]),
    getTrainerStudents: vitest_1.vi.fn().mockResolvedValue([data_1.mockUser]),
};
// Training Week Service Mock
exports.mockTrainingWeekService = {
    createTrainingWeek: vitest_1.vi.fn().mockResolvedValue(data_1.mockTrainingWeek),
    getAllTrainingWeeks: vitest_1.vi.fn().mockResolvedValue([data_1.mockTrainingWeek]),
    getTrainingWeekById: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockTrainingWeek,
        trainingDays: [data_1.mockTrainingDay],
        user: {
            id: data_1.mockUser.id,
            name: data_1.mockUser.name,
        },
    }),
    updateTrainingWeek: vitest_1.vi.fn().mockResolvedValue(data_1.mockTrainingWeek),
    deleteTrainingWeek: vitest_1.vi.fn().mockResolvedValue(true),
    isTrainerAssignedToStudent: vitest_1.vi.fn().mockResolvedValue(true),
    isProfessionalAssignedToStudent: vitest_1.vi.fn().mockResolvedValue(true),
};
// Training Day Service Mock
exports.mockTrainingDayService = {
    createTrainingDay: vitest_1.vi.fn().mockResolvedValue(data_1.mockTrainingDay),
    getTrainingDayById: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockTrainingDay,
        exercises: [data_1.mockExercise],
    }),
    updateTrainingDay: vitest_1.vi.fn().mockResolvedValue(data_1.mockTrainingDay),
    deleteTrainingDay: vitest_1.vi.fn().mockResolvedValue(true),
    markTrainingDayAsDone: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockTrainingDay,
        done: true,
    }),
};
// Exercise Service Mock
exports.mockExerciseService = {
    createExercise: vitest_1.vi.fn().mockResolvedValue(data_1.mockExercise),
    getExerciseById: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockExercise,
        seriesResults: [data_1.mockSerie],
    }),
    updateExercise: vitest_1.vi.fn().mockResolvedValue(data_1.mockExercise),
    deleteExercise: vitest_1.vi.fn().mockResolvedValue(true),
    markExerciseAsDone: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockExercise,
        done: true,
    }),
};
// Serie Service Mock
exports.mockSerieService = {
    createSerie: vitest_1.vi.fn().mockResolvedValue(data_1.mockSerie),
    getSerieById: vitest_1.vi.fn().mockResolvedValue(data_1.mockSerie),
    updateSerie: vitest_1.vi.fn().mockResolvedValue(data_1.mockSerie),
    deleteSerie: vitest_1.vi.fn().mockResolvedValue(true),
};
// Diet Service Mock
exports.mockDietService = {
    createDiet: vitest_1.vi.fn().mockResolvedValue(data_1.mockDiet),
    getAllDiets: vitest_1.vi.fn().mockResolvedValue([
        {
            ...data_1.mockDiet,
            meals: [data_1.mockMeal],
        },
    ]),
    getDietById: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockDiet,
        meals: [
            {
                ...data_1.mockMeal,
                mealItems: [data_1.mockMealItem],
            },
        ],
        User: {
            id: data_1.mockUser.id,
            name: data_1.mockUser.name,
        },
    }),
    updateDiet: vitest_1.vi.fn().mockResolvedValue(data_1.mockDiet),
    deleteDiet: vitest_1.vi.fn().mockResolvedValue(true),
};
// Meal Service Mock
exports.mockMealService = {
    createMeal: vitest_1.vi.fn().mockResolvedValue(data_1.mockMeal),
    getMealById: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockMeal,
        mealItems: [data_1.mockMealItem],
    }),
    updateMeal: vitest_1.vi.fn().mockResolvedValue(data_1.mockMeal),
    deleteMeal: vitest_1.vi.fn().mockResolvedValue(true),
    markMealAsCompleted: vitest_1.vi.fn().mockResolvedValue({
        ...data_1.mockMeal,
        isCompleted: true,
    }),
};
// Meal Items Service Mock
exports.mockMealItemsService = {
    createMealItem: vitest_1.vi.fn().mockResolvedValue(data_1.mockMealItem),
    getMealItemById: vitest_1.vi.fn().mockResolvedValue(data_1.mockMealItem),
    updateMealItem: vitest_1.vi.fn().mockResolvedValue(data_1.mockMealItem),
    deleteMealItem: vitest_1.vi.fn().mockResolvedValue(true),
};
// Weight Service Mock
exports.mockWeightService = {
    addWeightRecord: vitest_1.vi.fn().mockResolvedValue(data_1.mockWeight),
    getWeightHistory: vitest_1.vi.fn().mockResolvedValue([data_1.mockWeight]),
};
// History Service Mock
exports.mockHistoryService = {
    getUserHistory: vitest_1.vi.fn().mockResolvedValue([data_1.mockHistory]),
    createHistoryEntry: vitest_1.vi.fn().mockResolvedValue(data_1.mockHistory),
};
