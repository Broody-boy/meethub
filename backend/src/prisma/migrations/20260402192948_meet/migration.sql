-- CreateTable
CREATE TABLE "Meeting" (
    "id" SERIAL NOT NULL,
    "meetingId" TEXT NOT NULL,
    "meetingName" TEXT NOT NULL,
    "attendeesPermissions" TEXT[],
    "isRecordingAutoEnabledOnStart" BOOLEAN NOT NULL,
    "isWaitingRoomEnabled" BOOLEAN NOT NULL,
    "startTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hostClientId" INTEGER NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_meetingId_key" ON "Meeting"("meetingId");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_hostClientId_fkey" FOREIGN KEY ("hostClientId") REFERENCES "User"("clientId") ON DELETE RESTRICT ON UPDATE CASCADE;
