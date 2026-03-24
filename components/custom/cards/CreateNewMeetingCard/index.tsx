import { Video, ArrowRight } from "lucide-react";

export function CreateNewMeetingCard() {
  return (
    <div className="bg-[#edf2fe] rounded-xl p-8 w-full shadow-sm border flex flex-col gap-5">
      
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
        <Video className="text-white w-5 h-5" />
      </div>

      {/* Title + Description */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">
          Create New Meeting
        </h3>

        <p className="text-md text-gray-600 leading-relaxed mb-4">
          Start an instant session and invite others to collaborate with you.
        </p>
      </div>

      {/* Divider */}
      <hr className="border-t border-gray-200" />

      {/* CTA */}
      <div className="flex items-center justify-between text-[#1a73e8] font-medium cursor-pointer group">
        
        {/* Text + underline wrapper */}
        <div className="flex flex-col">
          <span className="transition-transform group-hover:translate-x-1">
            Start meeting
          </span>

          {/* Animated underline */}
          <span className="h-[2px] mt-1 w-0 bg-[#1a73e8] transition-all duration-300 group-hover:w-full group-hover:translate-x-1" />
        </div>

        <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
      </div>

    </div>
  );
}