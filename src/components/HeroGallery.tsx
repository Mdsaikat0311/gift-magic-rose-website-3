import { ChevronLeft, ChevronRight, Gift } from 'lucide-react';
import {
  GALLERY_IMAGES,
  GiftPackage,
  formatBDT,
} from '../data/products';
import { ProductImage } from './ProductImage';

interface HeroGalleryProps {
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  selectedPackage: GiftPackage;
  onQuickOrder: () => void;
}

export function HeroGallery({
  activeImageIndex,
  onSelectImage,
  selectedPackage,
  onQuickOrder,
}: HeroGalleryProps) {
  const activeImage = GALLERY_IMAGES[activeImageIndex] ?? GALLERY_IMAGES[0];

  function handlePrevImage() {
    onSelectImage(
      activeImageIndex === 0 ? GALLERY_IMAGES.length - 1 : activeImageIndex - 1
    );
  }

  function handleNextImage() {
    onSelectImage(
      activeImageIndex === GALLERY_IMAGES.length - 1 ? 0 : activeImageIndex + 1
    );
  }

  return (
    <section id="top" className="pt-5 pb-6 sm:pt-8 sm:pb-8">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6">
        {/* Top Crimson-Rose Framed Headline Banner */}
        <div className="rounded-2xl bg-[#C8102E] p-1.5 shadow-md">
          <div className="rounded-xl border border-white/75 px-4 py-4 text-center sm:px-8 sm:py-5">
            <h1
              className="font-display text-lg font-bold leading-snug text-white sm:text-2xl lg:text-[28px]"
              style={{ textWrap: 'balance' }}
            >
              প্রিয় মানুষের মুখে হাসি ফোটাতে উপহার দিন আকর্ষণীয় এই গিফট বক্স! সম্পর্ক হোক আরও মিষ্টি ও মজবুত!
            </h1>
          </div>
        </div>

        {/* Full Uncropped Product Gallery Box */}
        <div id="gallery" className="mx-auto mt-5 max-w-[740px]">
          <div className="relative overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md">
            <ProductImage
              src={activeImage.src}
              alt={activeImage.alt}
              priority
              className="block h-auto w-full"
            />

            <button
              type="button"
              onClick={handlePrevImage}
              aria-label="আগের ছবি"
              className="absolute top-1/2 left-2.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#241319] shadow-md transition-colors hover:bg-white cursor-pointer sm:left-3.5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              aria-label="পরের ছবি"
              className="absolute top-1/2 right-2.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#241319] shadow-md transition-colors hover:bg-white cursor-pointer sm:right-3.5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* 4 Thumbnail Switchers */}
          <div className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3">
            {GALLERY_IMAGES.map((img, index) => {
              const isActive = index === activeImageIndex;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => onSelectImage(index)}
                  aria-label={img.caption}
                  className={`aspect-square overflow-hidden rounded-xl border-2 bg-white p-0.5 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#F0185B] ring-2 ring-[#F0185B]/25'
                      : 'border-white opacity-85 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Centered Free Delivery & Offer CTA Button */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={onQuickOrder}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#F0185B] px-7 py-3 text-sm font-bold text-white shadow-md transition-colors duration-150 hover:bg-[#D4114E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0185B] whitespace-nowrap cursor-pointer sm:text-base"
          >
            <Gift className="h-4 w-4 shrink-0" />
            <span>সারাদেশে ডেলিভারি চার্জ ফ্রি · অর্ডার করুন ৳{formatBDT(selectedPackage.price)}</span>
          </button>
          <p className="text-xs font-medium text-[#5D3342] tabular-nums sm:text-sm">
            রেগুলার মূল্য <span className="line-through">৳{formatBDT(selectedPackage.regularPrice)}</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            অফার মূল্য <span className="font-bold text-[#C8102E]">৳{formatBDT(selectedPackage.price)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
