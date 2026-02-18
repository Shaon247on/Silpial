import Link from "next/link";

function Logo() {
  return (
    <Link href={"/"}>
      <div>
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[#07162D] flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-[#07162D] tracking-tight text-lg">
            RedactAI
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Logo;
