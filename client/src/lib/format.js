import { IMG_FALLBACK } from "./constants";

// Format a number as a USD price
export const formatPrice = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
};

// Human friendly absolute date
export const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

// Short time for chat messages
export const formatTime = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

// Relative-ish "time ago" for chat lists
export const timeAgo = (value) => {
  if (!value) return "";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
};

// First image url of a product, with a graceful fallback
export const productImage = (product, index = 0) => {
  const images = product?.universal?.images;
  return images?.[index]?.url || IMG_FALLBACK;
};

// Category image url with fallback
export const categoryImage = (category) => category?.image?.url || IMG_FALLBACK;

// Avatar url with fallback to initials handled by the UI Avatar component
export const avatarUrl = (user) => user?.avatar?.url || "";

// Initials for avatar fallback
export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "U";

// Extract a readable API error message from an axios error
export const apiError = (err, fallback = "Something went wrong") =>
  err?.response?.data?.message || err?.message || fallback;
