import { useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  Heart,
  Mail,
  ShieldAlert,
  Sparkles,
  Star,
} from 'lucide-react';
import {
  COMBO_ITEMS,
  GALLERY_IMAGES,
  GIFT_PACKAGES,
  formatBDT,
} from '../data/products';
import { ProductImage } from './ProductImage';

interface ComboShowcaseProps {
  onQuickOrder: () => void;
}

const WHY_BUY_REASONS = [
  {
    icon: Sparkles,
    text: 'আর্টিফিশিয়াল লাল গোলাপ — যা কখনো মলিন হবে না ও বহুদিন সতেজ দেখাবে।',
  },
  {
    icon: Star,
    text: 'ডায়মন্ড-কাট রিংটি ফ্রি সাইজ, যেকোনো হাতে খুব সহজে পরা যাবে।',
  },
  {
    icon: Mail,
    text: 'সাথে থাকা চিরকুটে আপনার মনের গভীর কথাগুলো লিখে উপহার দিতে পারবেন।',
  },
  {
    icon: CheckCircle2,
    text: 'আকর্ষণীয় পায়েল, কানের দুল ও নোজপিন বর্তমান সময়ের খুবই পছন্দের অলংকার।',
  },
  {
    icon: Heart,
    text: 'যা পেয়ে ও পরে আপনার প্রিয় মানুষটি নিঃসন্দেহে অসম্ভব খুশি হবে।',
  },
  {
    icon: Gift,
    text: 'পুরো গিফট বক্সটি আপনার রুচি ও ভালোবাসা সুন্দরভাবে ফুটিয়ে তুলবে।',
  },
];

export function ComboShowcase({ onQuickOrder }: ComboShowcaseProps) {
  const pkg = GIFT_PACKAGES[0];
  const detailPhotos = GALLERY_IMAGES.slice(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function goToPrevSlide() {
    setActiveSlide((prev) =>
      prev === 0 ? detailPhotos.length - 1 : prev - 1
    );
  }

  function goToNextSlide() {
    setActiveSlide((prev) =>
      prev === detailPhotos.length - 1 ? 0 : prev + 1
    );
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (typeof endX === 'number') {
      const diff = touchStartX.current - endX;
      if (diff > 40) {
        goToNextSlide();
      } else if (diff < -40) {
        goToPrevSlide();
      }
    }
    touchStartX.current = null;
  }

  return (
    <>
      {/* Band 1: Soft Blush 15-Item Box + Close-Up Uncropped Slider */}
      <section id="inside-box" className="pb-10">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6">
          {/* Framed Blush Card Listing All 15 Items */}
          <div className="rounded-2xl border-2 border-white bg-[#FFEAF0]/90 p-5 shadow-sm sm:p-8">
            <h2 className="font-display text-center text-xl font-bold text-[#241319] sm:text-2xl">
              মায়াভরা গিফট প্যাকেজে যা থাকছে (১৫ আইটেম)
            </h2>

            <ol className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 text-sm leading-relaxed text-[#2F161F] sm:grid-cols-2 sm:text-[15px] lg:grid-cols-3">
              {COMBO_ITEMS.map((item) => (
                <li
                  key={item.number}
                  className="flex items-start gap-2 rounded-lg bg-white/70 px-3 py-2"
                >
                  <span className="font-bold text-[#D81B53] tabular-nums shrink-0">
                    {item.number}.
                  </span>
                  <span className="font-medium">{item.name}</span>
                </li>
              ))}
            </ol>

            <p className="mt-4 text-center text-xs font-bold text-[#9F1239] sm:text-sm">
              বাবুল প্যাকেজিং করা থাকবে ফ্রি · সাথে সারাদেশে ডেলিভারি চার্জ একদম ফ্রি
            </p>
          </div>

          {/* Uncropped 3-Photo Rose Ring Box Slider */}
          <div id="gallery-strip" className="mx-auto mt-7 max-w-[680px]">
            <div
              className="relative overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex items-start transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {detailPhotos.map((photo) => (
                  <div key={photo.id} className="w-full shrink-0">
                    <ProductImage
                      src={photo.src}
                      alt={photo.alt}
                      className="block h-auto w-full"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={goToPrevSlide}
                aria-label="আগের ছবি"
                className="absolute top-1/2 left-2.5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#241319] shadow-md transition-colors hover:text-[#D81B53] cursor-pointer sm:left-3"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="পরের ছবি"
                className="absolute top-1/2 right-2.5 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#241319] shadow-md transition-colors hover:text-[#D81B53] cursor-pointer sm:right-3"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex flex-col items-center gap-2 text-center">
              <p className="text-xs font-medium text-[#5D3342] sm:text-sm">
                {detailPhotos[activeSlide]?.caption}
              </p>
              <div className="flex items-center justify-center gap-2">
                {detailPhotos.map((photo, index) => {
                  const isActive = index === activeSlide;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      aria-label={`ছবি ${formatBDT(index + 1)}`}
                      className={`h-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'w-7 bg-[#F0185B]'
                          : 'w-2.5 bg-[#E7B7C5] hover:bg-[#D17B96]'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order CTA */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onQuickOrder}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#F0185B] px-7 py-3 text-sm font-bold text-white shadow-md transition-colors duration-150 hover:bg-[#D4114E] whitespace-nowrap cursor-pointer sm:text-base"
            >
              <Gift className="h-4 w-4 shrink-0" />
              <span>অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </section>

      {/* Band 2: Clean White Section — Why Choose This Gift Box + Soft Quote Cards */}
      <section className="border-y border-[#F6D3DD] bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-[820px] px-4 sm:px-6">
          {/* Rose Section Heading */}
          <div className="flex justify-center">
            <h2 className="font-display inline-block rounded-xl bg-[#F0185B] px-7 py-3 text-center text-lg font-bold text-white shadow-sm sm:text-2xl">
              কেন নিবেন এই গিফট বক্সটি
            </h2>
          </div>

          {/* 6 Concise Reasons */}
          <ul className="mt-7 divide-y divide-[#F7E8ED]">
            {WHY_BUY_REASONS.map((reason, idx) => {
              const Icon = reason.icon;
              return (
                <li key={idx} className="flex items-start gap-3.5 py-3.5">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#F0185B]" />
                  <span className="text-sm font-medium leading-relaxed text-[#2D1820] sm:text-base">
                    {reason.text}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onQuickOrder}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#F0185B] px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#D4114E] whitespace-nowrap cursor-pointer"
            >
              <Gift className="h-4 w-4 shrink-0" />
              <span>অর্ডার করুন · ৳{formatBDT(pkg.price)}</span>
            </button>
          </div>

          {/* Two Soft Blush Double-Framed Quote Cards */}
          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border-2 border-dashed border-[#4B363D]/55 bg-[#FFF0F4] p-4 text-center shadow-xs sm:p-5">
              <p className="font-display text-sm font-semibold leading-relaxed text-[#2D1820] sm:text-base">
                ছোট্ট এই আকর্ষণীয় উপহার ভালোবাসার মানুষের সাথে আপনার বন্ধনকে আরও মধুর করবে।
              </p>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-[#4B363D]/55 bg-[#FFF0F4] p-4 text-center shadow-xs sm:p-5">
              <p className="font-display text-sm font-semibold leading-relaxed text-[#2D1820] sm:text-base">
                আপনি যেখানেই থাকুন, আমার মনের মাঝে আপনি সবসময় থাকুন। এটা একটা ছোট্ট উপহার আপনার জন্য, যা আপনাকে প্রতিটা মুহূর্তে মনে করিয়ে দেবে।
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onQuickOrder}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-[#F0185B] px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#D4114E] whitespace-nowrap cursor-pointer"
            >
              <Gift className="h-4 w-4 shrink-0" />
              <span>এখনই অর্ডার করুন</span>
            </button>
          </div>

          {/* Special Offer Strip + Honest Ordering Notice */}
          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-[#F0185B] px-5 py-3.5 text-center text-white shadow-sm">
              <p className="font-display text-base font-bold sm:text-lg">
                বিশেষ অফার: সম্পূর্ণ ১৫ আইটেম মাত্র ৳{formatBDT(pkg.price)} (সারাদেশে ফ্রি ডেলিভারি)
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-[#F3D27A] bg-[#FFFBEB] p-4 text-xs leading-relaxed text-[#3F2E00] sm:text-sm">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#B45309]" />
              <p>
                <span className="font-bold text-[#92400E]">বিঃদ্রঃ </span>
                দয়া করে ১০০% নিশ্চিত হয়ে অর্ডার করবেন। ছবি এবং বর্ণনার সাথে পণ্যের শতভাগ মিল পাবেন; ডেলিভারি ম্যানের সামনে দেখে বুঝে তবেই মূল্য পরিশোধ করবেন।
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
