import {JoinWithCodeCard, CreateNewMeetingCard, MeetingCard} from "@/components/custom";
import Image from "next/image";
import { HostType, MeetingStatus } from "@/enums";

export default function MeetingsPage() {
  return (
    <div className="bg-dashboard-background">
      {/* Banner */}
      <div className="w-full mb-8 overflow-hidden">
        <Image
          src="/images/home_banner.jpg"
          alt="Meeting Banner"
          width={1920}
          height={400}
          className="w-full h-auto object-cover -mb-[120px]"
          priority
        />
      </div>


      <div className="px-60 space-y-8">

        {/* Top Cards */}
        <div className="grid grid-cols-2 gap-6">
          <JoinWithCodeCard />
          <CreateNewMeetingCard />
        </div>

        {/* Meetings */}
        <div>
          <h2 className="text-sm tracking-widest text-gray-500 mb-4">
            RECENT MEETINGS (ONGOING + PAST): read comment
            {/* Button: Ongoing-rejoin, Expired (closed by other host)-no button, Completed (current person was host and ended it) - restart subject to availability of id
            recording icon in the card: when available */}
          </h2>

          <div className="space-y-4">

            <MeetingCard
              title="Product Sync: Weekly Overview"
              hostType={HostType.ME}
              hostName="Arshdeep"
              startedAt={new Date(Date.now() - 25 * 60 * 1000).toISOString()}
              meetingStatus={MeetingStatus.ACTIVE}
              participants={[
                { name: "A", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "B", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "C", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "D", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
              ]}
            />

            <MeetingCard
              title="Design Review: Q4 Hub"
              hostType={HostType.OTHER}
              hostName="Marcus"
              startedAt={new Date(Date.now() - 12 * 60 * 1000).toISOString()}
              meetingStatus={MeetingStatus.ACTIVE}
              participants={[
                { name: "A", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "B", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "C", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
              ]}
            />

            <MeetingCard
              title="Sprint Planning"
              hostType={HostType.OTHER}
              hostName="Sarah"
              startedAt={new Date(Date.now() - 45 * 60 * 1000).toISOString()}
              meetingStatus={MeetingStatus.ACTIVE}
              participants={[
                { name: "A", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "B", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "C", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "D", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
                { name: "E", profile_url: "https://img.freepik.com/free-photo/curly-man-with-broad-smile-shows-perfect-teeth-being-amused-by-interesting-talk-has-bushy-curly-dark-hair-stands-indoor-against-white-blank-wall_273609-17092.jpg?semt=ais_hybrid&w=740&q=80" },
              ]}
            />

          </div>
        </div>
      </div>
    </div>
  );
}