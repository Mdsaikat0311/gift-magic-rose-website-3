export function Footer() {
  return (
    <footer className="border-t border-[#F4C2CF] bg-[#FFDCE6] text-[#351A24]">
      <div className="mx-auto flex max-w-[1040px] flex-col items-center justify-between gap-3 px-4 py-7 text-center text-xs sm:flex-row sm:px-6 sm:text-left sm:text-sm">
        <div>
          <span className="font-display text-base font-bold text-[#C8102E]">
            Gift Magic
          </span>
          <span className="mx-2 text-[#B87D90]" aria-hidden="true">
            ·
          </span>
          <span>
            মায়াভরা ১৫ আইটেমের গিফট প্যাকেজ · সারাদেশে ডেলিভারি চার্জ ফ্রি
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <a href="#top" className="hover:text-[#C8102E] hover:underline">
            উপরে যান
          </a>
          <a href="#inside-box" className="hover:text-[#C8102E] hover:underline">
            ১৫টি উপহার
          </a>
          <a href="#order-form" className="hover:text-[#C8102E] hover:underline">
            অর্ডার ফর্ম
          </a>
          <span className="text-[#6F4755]">© ২০২৬ Gift Magic</span>
        </div>
      </div>
    </footer>
  );
}
