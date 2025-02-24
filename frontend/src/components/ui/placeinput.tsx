import * as React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PlaceInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-[318px] h-[42px]">
        <MapPin
          className="
          w-[15px] h-[15px]
          text-gray-400 absolute left-4 items-center"
        />
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
PlaceInput.displayName = "PlaceInput";

export { PlaceInput };
