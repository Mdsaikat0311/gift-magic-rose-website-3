interface NavbarProps {
  onQuickOrder: () => void;
}

export function Navbar({ onQuickOrder }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#F7CBD7] bg-[#FFF8FA]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1040px] items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Single-line Brand Title */}
        <a
          href="#top"
          className="font-display text-xl font-bold tracking-tight text-[#D81B53] whitespace-nowrap shrink-0 sm:text-2xl"
        >
          Gift Magic
        </a>

        {/* Zone 2: Single-line Editorial Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#3D202A]">
          <a
            href="#top"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#D81B53] hover:underline hover:underline-offset-4"
          >
            প্যাকেজ পরিচিতি
          </a>
          <a
            href="#inside-box"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#D81B53] hover:underline hover:underline-offset-4"
          >
            ১৫টি উপহার
          </a>
          <a
            href="#gallery-strip"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#D81B53] hover:underline hover:underline-offset-4"
          >
            ক্লোজ-আপ ছবি
          </a>
          <a
            href="#order-form"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#D81B53] hover:underline hover:underline-offset-4"
          >
            অর্ডার ফর্ম
          </a>
        </nav>

        {/* Zone 3: Single Primary Conversion CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onQuickOrder}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#F0185B] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#D3134E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0185B] whitespace-nowrap shrink-0 cursor-pointer"
          >
            অর্ডার করুন · ৳৫৯৯
          </button>
        </div>
      </div>
    </header>
  );
}
