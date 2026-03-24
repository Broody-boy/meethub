import { HostType, MeetingStatus } from "@/enums";
import { Participant } from "@/types";
import { timeAgo } from "@/utils";

interface Props {
  title: string;
  hostType: HostType;
  hostName: string;
  participants: Participant[];
  startedAt: string;
  meetingStatus: MeetingStatus;
}

export function MeetingCard({
  title,
  hostType,
  hostName,
  participants,
  startedAt,
  meetingStatus,
}: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{title}</h4>

        <p className="text-sm text-gray-500 mt-1">
          Started {timeAgo(startedAt)} •{" "}
          {hostType === HostType.ME
            ? "You are the host"
            : `Hosted by ${hostName}`}
        </p>

        <div className="flex items-center gap-2 mt-3">
          {participants.slice(0, 3).map((p, i) => (
            <img
              key={i}
              src={p.profile_url}
              className="w-6 h-6 rounded-full"
            />
          ))}
          {participants.length > 3 && (
            <span className="text-xs text-gray-500">
              +{participants.length - 3}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        {meetingStatus === MeetingStatus.ACTIVE && (
          <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">
            ACTIVE
          </span>
        )}

        <button className="bg-gray-100 text-[#1a73e8] px-4 py-1.5 rounded-md text-sm">
          Join
        </button>
      </div>
    </div>
  );
}