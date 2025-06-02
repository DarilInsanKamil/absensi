import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatStatus(status: boolean) {
  return status ? "Aktif" : "Tidak Aktif"
}

export function convertTahunAjaranToKelas(tahunAjaran: string): number {
  // Get current year
  const currentYear = new Date().getFullYear();

  // Get start year from tahun_ajaran (e.g., "2025/2026" -> 2025)
  const startYear = parseInt(tahunAjaran.split('/')[0]);

  // Calculate class level based on difference between current and start year
  const kelasLevel = currentYear - startYear + 1;

  // Ensure class level is between 1-3 (for SMK)
  if (kelasLevel < 1) return 1;
  if (kelasLevel > 3) return 3;

  return kelasLevel;
}


export function convertDay(day: number): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  return days[day];
}

export function formatTimeForInput(timeString: string | undefined | null): string {
  if (!timeString) return "";
  return timeString.slice(0, 5); // Takes "07:40" from "07:40:00"
}