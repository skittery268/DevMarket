import { cn } from "@/lib/utils";

// Consistent page width + horizontal padding, with a wider 1440px+ track.
function Container({ className, ...props }) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 2xl:max-w-[1400px]", className)}
      {...props}
    />
  );
}

export default Container;
