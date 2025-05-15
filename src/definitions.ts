import { z } from 'zod'

export interface Guru {
    nip: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    no_telepon: string;
    email: string;
    status_aktif: boolean;
}
export interface ResponseTableGuru {
    id: number;
    nip: string;
    nama: string;
    jenis_kelamin: string;
    alamat: string;
    no_telepon: string;
    email: string;
    status_aktif: boolean;
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
}

export interface JadwalPerKelas {
    [kelas: string]: JadwalPerHari;
}

export interface Mapel {
    kode_mapel: string;
    nama_mapel: string;
}

export interface ResponseTableMapel {
    id: number;
    kode_mapel: string;
    nama_mapel: string;
    cretead_at: string
    updated_at: string
}

export interface Kelas {
    nama_kelas: string;
    tahun_ajaran_id: number;
    walikelas_id: string;
}
export interface ResponseTableKelas {
    id: number;
    nama_kelas: string;
    wali_kelas: string;
    tahun_ajaran: string;
    cretead_at: string
    updated_at: string
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

export interface ResponseTableJadwal {
    id: number;
    mata_pelajaran: string;
    kelas: string;
    nama_guru: string;
    tahun_ajaran: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    cretead_at: string
    updated_at: string
}

export interface TahunAjaran {
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean
}

export interface ResponseTableTahunAjaran {
    id: number;
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    status_aktif: boolean;
    cretead_at: string
    updated_at: string
}

export interface Absensi {
    siswa_id: string;
    jadwal_id: string;
    guru_id: string;
    tanggal: string;
    status: string;
    keterangan?: string;
    waktu_absen?: string; // Added the missing property
}

export interface ResponseTableAbsensi {
    id: number;
    nama_siswa: number;
    jadwal: number;
    nama_guru: number
    tanggal: string;
    status: string;
    keterangan?: string;
    waktu_absen: string;
    created_at: string;
    updated_at: string;
}

export interface Users {
    username: string;
    role: string;
    hashedPassword: string;
    reference_id: string;
    reference_type: string;
}
export interface LoginUser {
    username: string;
    password: string;
}

export interface SiswaAbsen {
    id: string;
    nama: string;
    nis: string;
    nama_kelas: string;
    tahun_ajaran: string;
}
type StudentList = SiswaAbsen[]