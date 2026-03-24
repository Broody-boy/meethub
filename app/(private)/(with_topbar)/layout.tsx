import {TopBar} from "@/components/custom";

export default function MeetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <TopBar />
      {children}
    </div>
  );
}