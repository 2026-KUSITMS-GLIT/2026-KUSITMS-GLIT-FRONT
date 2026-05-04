import type { ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

function DatingWeekday({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("body-4 first:text-error-primary text-center text-white", className)}
      {...props}
    />
  );
}

export { DatingWeekday };
