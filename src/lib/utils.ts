import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatStatus(status: boolean) {
  return status ? "Aktif" : "Tidak Aktif"
}