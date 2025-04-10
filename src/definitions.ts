import { z } from 'zod'

export interface Guru {
    nip: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    no_telepon: string;
    email: string;
    username: string;
    hashedPassword: string;
}

export interface UpdatedGuru {
    nip: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    no_telepon: string;
    email: string;
    username: string;
    password: string;
}

export interface Siswa {
    nis: string;
    nama: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    alamat: string;
    no_telepon: string;
    email: string;
    kelas_id: number;
    status_aktif: boolean
}

export interface ResponseTableSiswa {
    id: number;
    nis: string;
    nama: string;
    jenis_kelamin: string;
    tanggal_lahir: string;
    alamat: string;
    no_telepon: string;
    email: string;
    nama_kelas: string;
    status_aktif: boolean
}


export interface JadwalItem {
    id: string;
    mata_pelajaran: string;
    guru: string;
    jam_mulai: string;
    jam_selesai: string;
}

export interface JadwalPerHari {
    [hari: string]: JadwalItem[];
    /* The `JadwalPerHari` interface in the TypeScript code snippet is defining a type that represents a
    schedule for a specific day. It is a mapping of days (represented as strings) to an array of
    `JadwalItem` objects. Each `JadwalItem` object contains details about a particular scheduled item
    such as the subject, teacher, start time, and end time. */
}

export interface JadwalPerKelas {
    [kelas: string]: JadwalPerHari;
    /* The line `[kelas: string]: JadwalPerHari;` in the TypeScript code snippet is defining an
    interface called `JadwalPerKelas`. This interface represents a mapping where the keys are of
    type `string` (representing class names) and the values are of type `JadwalPerHari`
    (representing schedules for each day of the week for a specific class). */
}

export interface Mapel {
    kode_mapel: string;
    nama_mapel: string;
}

export interface Kelas {
    nama_kelas: string;
    tahun_ajaran_id: number;
    walikelas_id: string;
}

export interface Jadwal {
    mata_pelajaran_id: number;
    kelas_id: number;
    guru_id: number;
    tahun_ajaran_id: number;
    hari: string;
    jam_mulai: Date;
    jam_selesai: Date
}

export interface TahunAjaran {
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean
}

export interface Absensi {
    siswa_id: number;
    jadwal_id: number;
    guru_id: number
    tanggal: string;
    status: string;
    keterangan?: string;
}


export const SignupFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    role: z
        .string()
        .min(2, { message: 'Role must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
})

export type FormState =
    | {
        errors?: {
            name?: string[]
            email?: string[]
            password?: string[]
        }
        message?: string
    }
    | undefined