"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEvent = validateEvent;
const prisma_1 = require("lib/prisma");
async function validateEvent(user, updatedUser) {
    const changes = [];
    const fieldsToCheck = [
        'name',
        'email',
        'street',
        'number',
        'zipCode',
        'city',
        'state',
        'sex',
        'phone',
        'birthDate',
    ];
    fieldsToCheck.forEach((field) => {
        if (user[field] !== updatedUser[field]) {
            changes.push(`The field ${field} has been changed from ${user[field]} to ${updatedUser[field]}`);
        }
    });
    if (changes.length > 0) {
        for (const change of changes) {
            await prisma_1.prisma.history.create({
                data: {
                    event: change,
                    date: new Date().toISOString(),
                    userId: user.id,
                },
            });
        }
    }
}
