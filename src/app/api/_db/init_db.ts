import { connectionPool } from "./db";

export async function initDb() {
    // Cek apakah tabel USERS sudah ada
    const checkTable = await connectionPool.query(`
    SELECT to_regclass('public."USERS"') as exists;
  `);

    const tableExists = checkTable.rows[0].exists !== null;

    if (tableExists) {
        console.log('Tabel sudah ada, skip migration & seeding.');
        return;
    }

    await connectionPool.query(`
        CREATE TABLE "TAHUN_AJARAN" (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(20) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "GURU" (
    id SERIAL PRIMARY KEY,
    nip VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL,
    alamat TEXT,
    no_telepon VARCHAR(15),
    email VARCHAR(100),
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "KELAS" (
    id SERIAL PRIMARY KEY,
    nama_kelas VARCHAR(20) NOT NULL,
    tahun_ajaran_id INTEGER REFERENCES "TAHUN_AJARAN"(id) ON DELETE CASCADE,
    walikelas_id INTEGER REFERENCES "GURU"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SISWA" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nis VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jenis_kelamin CHAR(1) NOT NULL,
    tanggal_lahir DATE,
    alamat TEXT,
    no_telepon VARCHAR(15),
    email VARCHAR(100),
    kelas_id INTEGER REFERENCES "KELAS"(id) ON DELETE CASCADE,
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MATA_PELAJARAN" (
    id SERIAL PRIMARY KEY,
    kode_mapel VARCHAR(10) UNIQUE NOT NULL,
    nama_mapel VARCHAR(100) NOT NULL,
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GURU_MATA_PELAJARAN" (
    id SERIAL PRIMARY KEY,
    guru_id INTEGER REFERENCES "GURU"(id) ON DELETE CASCADE,
    mata_pelajaran_id INTEGER REFERENCES "MATA_PELAJARAN"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(guru_id, mata_pelajaran_id)
);

CREATE TABLE "JADWAL" (
    id SERIAL PRIMARY KEY,
    mata_pelajaran_id INTEGER REFERENCES "MATA_PELAJARAN"(id) ON DELETE CASCADE,
    kelas_id INTEGER REFERENCES "KELAS"(id) ON DELETE CASCADE,
    guru_id INTEGER REFERENCES "GURU"(id) ON DELETE CASCADE,
    tahun_ajaran_id INTEGER REFERENCES "TAHUN_AJARAN"(id) ON DELETE CASCADE,
    hari VARCHAR(10) NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ABSENSI" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES "SISWA"(id) ON DELETE CASCADE,
    jadwal_id INTEGER REFERENCES "JADWAL"(id) ON DELETE CASCADE,
    guru_id INTEGER REFERENCES "GURU"(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    keterangan TEXT,
    waktu_absen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "USERS" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'guru', 'siswa', 'kepsek', 'bk')),
    reference_id VARCHAR(100) NOT NULL, 
    reference_type VARCHAR(10) NOT NULL CHECK (reference_type IN ('ADMIN', 'GURU', 'SISWA', 'KEPSEK', 'BK')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ADMIN" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    no_telepon VARCHAR(15),
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`)
    console.log('Database initialized.');
}