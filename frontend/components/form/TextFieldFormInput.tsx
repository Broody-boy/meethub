"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // shadcn utility (clsx + tailwind-merge)
import { Input } from "@/components/ui/input";

interface TextFieldFormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const TextFieldFormInput = React.forwardRef<
  HTMLInputElement,
  TextFieldFormInputProps
>(
  (
    {
      label,
      error,
      description,
      required,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {/* Label */}
        {label && (
          <label className="text-sm font-medium text-foreground mx-1">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <Input
          ref={ref}
          className={cn(
            `h-12 rounded-xl bg-textbox-background border-0 px-4`,
            "focus-visible:ring-2",
            "placeholder:text-muted-foreground",
            error && "focus-visible:ring-textbox-error-focus-ring focus-visible:ring-3",
            className
          )}
          // aria-invalid={!!error}
          {...props}
        />

        {/* Description */}
        {description && !error && (
          <p className="text-xs text-muted-foreground ml-2">{description}</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-xs text-destructive ml-2">{error}</p>
        )}
      </div>
    );
  }
);

TextFieldFormInput.displayName = "TextFieldFormInput";