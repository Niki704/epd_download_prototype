import Image from "next/image";
import SearchBar from "./SearchBar";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export default function Header({ query, onQueryChange }: HeaderProps) {
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
          className="h-auto w-44 sm:w-64"
        />
      </div>

      <div className="absolute right-6 top-6 z-10 sm:right-10 sm:top-8">
        <SearchBar value={query} onChange={onQueryChange} />
      </div>

      <div className="absolute bottom-6 left-6 z-10 max-w-lg sm:bottom-8 sm:left-10">
        <h1 className="font-display text-2xl text-white sm:text-3xl">
          School Book Download Archive
        </h1>
        <p className="mt-2 text-[14px] text-white/85 sm:text-[15px]">
          Browse textbooks by grade category, medium, and grade to find and
          download the books you need.
        </p>
      </div>
    </header>
  );
}
