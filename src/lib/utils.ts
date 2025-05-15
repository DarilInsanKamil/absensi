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


export function convertDay(dayNow: Date) {

  const day = dayNow.getDay();

  switch (day) {
    case 0:
      return 'Minggu';
      break;
    case 1:
      return 'Senin';
      break;
    case 2:
      return 'Selasa';
      break;
    case 3:
      return 'Rabu'
      break;
    case 4:
      return "Kamis"
      break;
    case 5:
      return "Jum'at"
      break;
    case 6:
      return "Sabtu"
      break;
    default:
      return 'Minggu'
  }
}