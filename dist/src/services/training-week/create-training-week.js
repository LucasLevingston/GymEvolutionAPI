"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrainingWeek = createTrainingWeek;
const prisma_1 = require("../../lib/prisma");
const create_history_entry_1 = require("../history/create-history-entry");
const client_error_1 = require("../../errors/client-error");
async function createTrainingWeek({ weekNumber, information, userId, trainingDays, }) {
    const existingWeek = await prisma_1.prisma.trainingWeek.findFirst({
        where: {
            userId,
            weekNumber,
        },
    });
    if (existingWeek) {
        throw new client_error_1.ClientError('A training week with this number already exists');
    }
    const trainingWeek = await prisma_1.prisma.trainingWeek.create({
        data: {
            weekNumber,
            information,
            userId,
            trainingDays: {
                create: trainingDays.map((trainingDay) => {
                    const { exercises, ...trainingDayData } = trainingDay;
                    return {
                        ...trainingDayData,
                        exercises: {
                            create: exercises,
                        },
                    };
                }),
            },
        },
        include: {
            trainingDays: {
                include: {
                    exercises: true,
                },
            },
        },
    });
    await (0, create_history_entry_1.createHistoryEntry)(userId, `Training week ${weekNumber} created`);
    return trainingWeek;
}
