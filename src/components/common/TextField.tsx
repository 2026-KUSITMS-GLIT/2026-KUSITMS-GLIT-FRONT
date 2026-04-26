import { cn } from "@/lib/utils";
import React, { forwardRef } from "react";

type TextFieldVariant = "default" | "error";

const WRAPPER_VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default: "border-gray-800 focus-within:border-gray-300",
  error: "border-error-primary",
};

const TEXTFIELD_VARIANT_STYLES: Record<TextFieldVariant, string> = {
  default: "text-gray-300 placeholder:text-gray-500",
  error: "text-gray-300 placeholder:text-gray-500",
};

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color"> {
  variant?: TextFieldVariant;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ variant = "default", rightIcon, errorMessage, className, ...props }, ref) => {
    return (
      <div className="flex flex-col mx-auto w-83.75">
        <div
          className={cn(
            "relative flex w-full items-center border-b pb-2 transition-colors",
            WRAPPER_VARIANT_STYLES[variant]
          )}
        >
          <input
            ref={ref}
            className={cn(
              "w-full bg-transparent outline-none body-2 caret-white",
              TEXTFIELD_VARIANT_STYLES[variant],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="ml-2 flex shrink-0 items-center justify-start [&_svg]:size-6">
              {rightIcon}
            </div>
          )}
        </div>
        {variant === "error" && errorMessage && (
          <p className="ml-1 mt-2 text-error-primary body-4">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);
TextField.displayName = "TextField";

export default TextField;
