export enum HostType {
  ME = "ME",
  OTHER = "OTHER",
}

export enum MeetingStatus {
  ACTIVE = "ACTIVE",
}

export enum MeetingOptions {
  WAITING_ROOM = "waiting-room",
}

export enum MeetingAttendeesPermissions {
  MIC_UNMUTE = "attendees:mic-unmute",
  VIDEO_START = "attendees:video-start",
  SCREEN_SHARE = "attendees:screen-share",
  CHAT_MESSAGE_SEND_RECEIVE = "attendees:chat_message-send-receive",
}