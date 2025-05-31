import { AttendanceSummary } from "@/definitions";

export async function kelasConverter(kelasId: number) {
    switch (kelasId) {
        case 4:
            return "X Broadcast 1"
            break;
        case 5:
            return "X DKV 1"
            break;
        case 9:
            return "X Broadcast 2"
            break;
        case 10:
            return "X DKV 2"
            break;
        case 14:
            return "X Broadcast 3"
            break;
        case 15:
            return "X DKV 3"
            break;
        default:
            break;
    }
}

export const dataBulan = [
    {
        value: 1,
        nama: "Januari"
    },
    {
        value: 2,
        nama: "Februari"
    },
    {
        value: 3,
        nama: "Maret"
    },
    {
        value: 4,
        nama: "April"
    },
    {
        value: 5,
        nama: "Mei"
    },
    {
        value: 6,
        nama: "Juni"
    },
    {
        value: 7,
        nama: "Juli"
    },
    {
        value: 8,
        nama: "Agustus"
    },
    {
        value: 9,
        nama: "September"
    },
    {
        value: 10,
        nama: "Oktober"
    },
    {
        value: 11,
        nama: "November"
    },
    {
        value: 12,
        nama: "Desember"
    },
]
export const dataTahun = [
    {
        value: 2025,
        nama: "2025"
    },
    {
        value: 2026,
        nama: "2026"
    },
    {
        value: 2027,
        nama: "2027"
    }
]



interface AttendanceData {
  status: 'hadir' | 'sakit' | 'izin' | 'alpha';
}

export function calculateAttendanceSummary(data: AttendanceData[]): AttendanceSummary {
  // Handle empty or invalid data
  if (!Array.isArray(data) || data.length === 0) {
    return {
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
      total: 0
    };
  }

  return data.reduce((acc, curr) => {
    // Check if status exists and is valid
    if (curr && curr.status && ['hadir', 'sakit', 'izin', 'alpha'].includes(curr.status)) {
      acc[curr.status]++;
      acc.total++;
    }
    return acc;
  }, {
    hadir: 0,
    sakit: 0,
    izin: 0,
    alpha: 0,
    total: 0
  });
}