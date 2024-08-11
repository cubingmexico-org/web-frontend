import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- explicit function return type is not needed here
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
