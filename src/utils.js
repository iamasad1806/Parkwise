// /Users/m.asad/Desktop/CPP/frontend/src/utils.js
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
