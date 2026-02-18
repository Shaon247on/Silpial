import { Button } from "@/components/ui/button";

export function SuggestionCard() {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-xl
        p-6 sm:p-8
        w-full
        max-w-2xl lg:max-w-4xl
        mx-auto
        border border-gray-100
      "
    >
      {/* Top skeleton lines */}
      <div className="flex gap-6 mb-6 px-1">
        <div className="h-1.5 w-28 rounded-full bg-gray-200" />
        <div className="h-1.5 w-20 rounded-full bg-gray-200 ml-auto" />
      </div>

      {/* Suggestion detected card */}
      <div className="rounded-xl bg-gray-100 border-l-4 border-[#07162D] p-6 mb-6">
        <p className="text-sm sm:text-base font-bold text-[#07162D] tracking-widest uppercase mb-2">
          Suggestion Detected
        </p>
        <p className="text-base text-gray-600 leading-relaxed">
          Clause 4.2 requires per law 9/2017…
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-5">
        <Button
          size="sm"
          
          className="flex-1 py-5 bg-[#07162D] hover:bg-white hover:text-[#07162D] text-white text-sm font-semibold rounded-full border-2 border-[#07162D]"
        >
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 py-5 border-2 border-[#07162D] text-[#07162D] hover:bg-[#07162D] hover:text-white text-sm font-semibold rounded-full"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
