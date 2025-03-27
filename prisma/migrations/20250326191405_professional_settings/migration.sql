-- CreateTable
CREATE TABLE "professionalSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workStartHour" INTEGER NOT NULL DEFAULT 9,
    "workEndHour" INTEGER NOT NULL DEFAULT 17,
    "appointmentDuration" INTEGER NOT NULL DEFAULT 60,
    "workDays" TEXT NOT NULL DEFAULT '1,2,3,4,5',
    "timeZone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "bufferBetweenSlots" INTEGER NOT NULL DEFAULT 0,
    "maxAdvanceBooking" INTEGER NOT NULL DEFAULT 30,
    "autoAcceptMeetings" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "professionalSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "professionalSettings_userId_key" ON "professionalSettings"("userId");
