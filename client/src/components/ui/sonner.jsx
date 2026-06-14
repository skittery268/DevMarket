import { Toaster as Sonner } from "sonner";

// App-wide toast host. Styled to match the brand surface tokens.
function Toaster(props) {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group rounded-xl border border-border/70 bg-card text-card-foreground shadow-card",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-secondary text-secondary-foreground",
        },
      }}
      style={{ fontFamily: "Inter, sans-serif" }}
      {...props}
    />
  );
}

export { Toaster };
