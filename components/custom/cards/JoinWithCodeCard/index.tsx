// import { Link } from "lucide-react";

export function JoinWithCodeCard() {
  return (
    <div className="bg-white rounded-2xl p-9 w-full border shadow-sm flex flex-col h-full">
      
      {/* Top Content */}
      <div>
        <div className="flex items-center gap-3 mt-3 ">
          <div className="text-[#1a73e8]">
            {/* <Link className="w-8 h-8" /> */}
          </div>
          <h3 className="text-3xl font-semibold text-[#1a73e8]">
            Join with code or link
          </h3>
        </div>

        <p className="text-lg text-gray-600 mt-15">
          Paste a meeting link or enter a code to join an existing session.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-5 flex items-center gap-3">
        <input
          placeholder="Meeting code or link"
          className="flex-1 px-4 py-3 rounded-xl bg-[#f9f9ff] text-sm outline-none placeholder:text-gray-500"
        />

        <button className="bg-[#1a73e8] text-white px-6 py-3 rounded-xl text-sm font-medium shadow-md hover:bg-[#1669c1] transition">
          Join
        </button>
      </div>
    </div>
  );
}