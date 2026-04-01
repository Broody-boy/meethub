import { MeetingAttendeesPermissions } from "../enums";

export const ALLOWED_PROFILE_PIC_MIMETYPES = ["image/jpeg", "image/png"];
export const MAX_PERMISSIBLE_PROFILE_PIC_SIZE = 5 * 1024 * 1024; // 5mb limit

export const MEETING_ATTENDEES_PERMISSIONS = Object.values(MeetingAttendeesPermissions) as readonly string[];
