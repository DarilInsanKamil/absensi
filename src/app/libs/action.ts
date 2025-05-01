'use server'

import { redirect } from "next/navigation"

export async function loginAccount(formData: FormData) {
    console.log(formData)
    redirect('/dashboard')
}
export async function signUpAccount(formData: FormData) {
    console.log(formData)
    redirect('/dashboard')
}
export async function useCreateGuru(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            nip,
            nama,
            jenis_kelamin,
            alamat,
            no_telepon,
            email,
            status
        } = data;
        const status_aktif = status as string == "1" ? true : false
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/guru`, {
            method: 'POST',
            body: JSON.stringify({
                nip,
                nama,
                jenis_kelamin,
                alamat,
                no_telepon,
                email,
                status_aktif
            }),
        })
        if (!response.ok) {
            console.log("Gagal menambah data guru")
        }
    } catch (err) {
        console.error("Error creating guru: ", err)
        throw new Error('Failed to create guru')
    }
}
export async function useDeleteGuru(id: number) {
    try {
        const deleteSiswa = await fetch(`${process.env.LOCAL_TEST_API}/api/guru/${id}`, {
            method: 'DELETE',

        })
        if (!deleteSiswa.ok) {
            console.log("Gagal menghapus data")
        }
    } catch (err) {
        console.error("Error deleting guru: ", err)
        throw new Error('Failed to deleting guru')
    }
}

export async function useCreateKelas(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            nama_kelas,
            tahun_ajaran_id,
            walikelas_id,
        } = data;
        const res = await fetch(`${process.env.LOCAL_TEST_API}/api/kelas`, {
            method: 'POST',
            body: JSON.stringify({
                nama_kelas,
                tahun_ajaran_id,
                walikelas_id,
            })
        })
        if (!res.ok) {
            console.log("Gagal Menambah Data Kelas");
        }
    } catch (err) {
        console.error("Error creating kelas: ", err)
        throw new Error('Failed to create kelas')
    }
}
export async function useDeleteKelas(id: number) {
    try {
        const res = await fetch(`${process.env.LOCAL_TEST_API}/api/kelas/${id}`, {
            method: 'DELETE',

        })
        if (!res.ok) {
            console.log("Gagal Mengahapus Data Kelas");
        }
    } catch (err) {

    }
}
export async function useCreateSiswa(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            nis,
            nama,
            jenis_kelamin,
            ttl,
            alamat,
            no_telepon,
            email,
            kelas
        } = data;
        const kelas_id = parseInt(kelas as string)
        const tanggal_lahir = new Date(ttl as string)

        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/siswa`, {
            method: 'POST',
            body: JSON.stringify({
                nis,
                nama,
                jenis_kelamin,
                tanggal_lahir,
                alamat,
                no_telepon,
                email,
                kelas_id
            }),
        })
        if (response.ok) {
            console.log("Berhasil menambahkan data")
        }
        return response.json();
    } catch (err) {
        console.error("Error creating siswa: ", err)
        throw new Error('Failed to create student')
    }
}

export async function useDeleteSiswa(id: number) {
    try {
        const deleteSiswa = await fetch(`${process.env.LOCAL_TEST_API}/api/siswa/${id}`, {
            method: 'DELETE',

        })
        if (deleteSiswa.ok) {
            console.log("Berhasil menghapus data")
        }
    } catch (err) {
        console.error("Error saat menghapus data siswa: ", err)
        throw new Error("Gagal menghapus data siswa")
    }
}

export async function useCreateJadwal(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            mata_pelajaran_id,
            kelas_id,
            tahun_ajaran_id,
            guru_id,
            hari,
            jam_mulai,
            jam_selesai,
        } = data;
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/jadwal/`, {
            method: 'POST',
            body: JSON.stringify({
                mata_pelajaran_id,
                kelas_id,
                guru_id,
                tahun_ajaran_id,
                hari,
                jam_mulai,
                jam_selesai
            })
        })
        if (!response.ok) {
            console.log("Gagal Menambah data jadwal");

        }
    } catch (err) {
        console.error("Error saat menambah data jadwal: ", err)
        throw new Error("Gagal menambah data jadwal")
    }
} 

export async function useDeleteJadwal(id: number) {
    try{
        const req = await fetch(`${process.env.LOCAL_TEST_API}/api/jadwal/${id}`, {method: 'DELETE'});
        if (!req.ok) {
            console.log("Gagal Menghapus data jadwal");
        }
    } catch(err) {
        console.error("Error saat menghapus data jadwal: ", err)
        throw new Error("Gagal menghapus data jadwal")
    }
}