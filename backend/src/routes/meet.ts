import express from "express";

// Custom imports
import { authenticate } from "../middleware/authenticate";
import { MeetingAttendeesPermissions } from "../enums";
import { prisma } from "../config/prisma";

const router = express.Router();

function validateMeetingRequest(body: any): string | null {
  // Validate meetingName is present and non-empty string
  if (!body.meetingName || typeof body.meetingName !== "string" || body.meetingName.trim() === "") {
    return "meetingName must be a non-empty string";
  }

  // Validate attendeesPermissions is an array
  if (!Array.isArray(body.attendeesPermissions)) {
    return "attendeesPermissions must be an array";
  }

  // Validate meetingOptions is an object
  if (!body.meetingOptions || typeof body.meetingOptions !== "object" || Array.isArray(body.meetingOptions)) {
    return "meetingOptions must be an object";
  }

  // Validate isRecordingAutoEnabledOnStart is a boolean
  if (typeof body.meetingOptions.isRecordingAutoEnabledOnStart !== "boolean") {
    return "meetingOptions.isRecordingAutoEnabledOnStart must be a boolean";
  }

  // Validate isWaitingRoomEnabled is a boolean
  if (typeof body.meetingOptions.isWaitingRoomEnabled !== "boolean") {
    return "meetingOptions.isWaitingRoomEnabled must be a boolean";
  }

  return null;
}

function validatePermissions(permissions: string[]): string | null {
  // Get all valid permission values from the enum
  const validPermissions = Object.values(MeetingAttendeesPermissions);

  // Validate each permission in the array
  for (const permission of permissions) {
    if (!validPermissions.includes(permission as MeetingAttendeesPermissions)) {
      return `Invalid permission: ${permission}`;
    }
  }

  return null;
}


function generateMeetingId(): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  
  const generateSegment = (): string => {
    const char1 = letters[Math.floor(Math.random() * letters.length)];
    const char2 = letters[Math.floor(Math.random() * letters.length)];
    const digit = digits[Math.floor(Math.random() * digits.length)];
    return `${char1}${char2}${digit}`;
  };
  
  return `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
}

router.post("/", authenticate, async (req, res) => {
  try {
    // Call request validation function
    const requestValidationError = validateMeetingRequest(req.body);
    if (requestValidationError) {
      return res.status(400).json({ message: requestValidationError });
    }

    // Call permission validation function
    const permissionValidationError = validatePermissions(req.body.attendeesPermissions);
    if (permissionValidationError) {
      return res.status(400).json({ message: permissionValidationError });
    }

    // Call meeting ID generator
    const meetingId = generateMeetingId();

    // Create meeting in database
    await prisma.meeting.create({
      data: {
        meetingId,
        meetingName: req.body.meetingName,
        attendeesPermissions: req.body.attendeesPermissions,
        isRecordingAutoEnabledOnStart: req.body.meetingOptions.isRecordingAutoEnabledOnStart,
        isWaitingRoomEnabled: req.body.meetingOptions.isWaitingRoomEnabled,
        startedAt: new Date(),
        hostClientId: req.user.id
      }
    });

    // Return HTTP 201 Created with meetingId only
    return res.status(201).json({ meetingId });
  } catch (err) {
    console.error("Error creating meeting:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
