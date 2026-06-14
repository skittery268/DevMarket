// How many items to request per paginated page
export const PAGE_SIZE = 12;

// Decorative Unsplash imagery — used ONLY for site chrome (hero, banners, empty
// states). Real product/category images always come from the API (.url field).
export const UNSPLASH = {
  heroProduct:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  heroSecondary:
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1000&q=80",
  bannerCode:
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
  emptyBox:
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=900&q=80",
  sellerCta:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
};

// Local, dependency-free fallback for missing product/category imagery.
export const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#7e14ff'/>
          <stop offset='0.55' stop-color='#863bff'/>
          <stop offset='1' stop-color='#47bfff'/>
        </linearGradient>
      </defs>
      <rect width='400' height='400' fill='url(#g)' opacity='0.12'/>
      <path d='M200 132c-12 0-22 10-22 22s10 22 22 22 22-10 22-22-10-22-22-22zm-70 136 44-56 30 36 26-30 40 50z' fill='#863bff' opacity='0.45'/>
    </svg>`
  );

export const ROLE_LABELS = {
  user: "Buyer",
  seller: "Seller",
  admin: "Admin",
};
