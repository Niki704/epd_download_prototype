import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";

export default function Header() {
  return (
    <header className="relative h-56 w-full overflow-hidden sm:h-64">
      <Image
        src="/top-banner.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#0F4C4A]/45" />

      <div className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8">
        <Image
          src="/main-logo.png"
          alt="Education Publications Department"
          width={751}
          height={102}
          priority
          className="h-auto w-44 sm:w-64 md:w-84"
        />
      </div>

      <p className="absolute right-5 bottom-34 z-10 flex max-w-[132px] sm:max-w-[220px] items-start gap-1.5 text-left text-[10px] leading-snug text-white/60 sm:right-6 sm:bottom-8.5 sm:text-[12px]">
        <Info className="mt-0.5 shrink-0" size={13} />
        Frontend-only prototype - not a live data platform
      </p>

      <div className="absolute bottom-42 right-6 z-10 flex flex-col items-end gap-1 sm:gap-2 text-right sm:bottom-18 sm:right-8">
        <span className="rounded-full bg-white/10 px-1.5 sm:px-3 py-1 font-mono text-[8px] sm:text-[11px] font-medium tracking-wide text-[#F2C14E]">
          v1.02
        </span>
        <Link
          href="https://github.com/Niki704"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-[10px] sm:text-[12px] text-white/60 transition-colors hover:text-[#A855F7]"
        >
          <Image
            src="/github.png"
            alt="GitHub"
            width={14}
            height={14}
            className="shrink-0 opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span>
            Created by <span className="font-medium text-inherit">Niki704</span>
          </span>
        </Link>
      </div>

      <div className="absolute bottom-6 left-6 z-10 max-w-lg sm:bottom-8 sm:left-10">
        <h1 className="font-display text-2xl text-white sm:text-3xl">
          School Book Download Archive
        </h1>
        <p className="mt-2 text-[13px] text-white/85 sm:text-[15px]">
          Browse Textbooks, Modules, and Other Books by category, medium, and
          grade or you can search directly to find the book you need.
        </p>
      </div>
    </header>
  );
}
