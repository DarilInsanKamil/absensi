'use server'

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    (await cookies()).delete('token');
    (await cookies()).delete('role');
    return { success: true, redirectTo: '/' };
}

export async function loginAccount(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const { username, password } = data;

        const req = await fetch(`${process.env.LOCAL_TEST_API}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!req.ok) {
            throw new Error('Invalid credentials');
        }

        const response = await req.json();

        // Set cookies
        const cookieStore = await cookies();

        cookieStore.set({
            name: 'token',
            value: response.token,
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
            sameSite: 'strict',
            secure: false,
        });

        cookieStore.set({
            name: 'role',
            value: response.user.role,
            httpOnly: false,
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: 'strict',
            secure: false,
        });

        // Handle redirect based on role
        const userRole = response.user.role;
        let redirectPath = '/dashboard';

        switch (userRole) {
            case 'admin':
                redirectPath = '/dashboard/admin';
                break;
            case 'guru':
                redirectPath = '/dashboard/guru';
                break;
            case 'siswa':
                redirectPath = '/dashboard/siswa';
                break;
            case 'kepala-sekolah':
                redirectPath = '/dashboard/kepala-sekolah';
                break;
            case 'bk':
                redirectPath = '/dashboard/bk';
                break;
        }

        return { success: true, redirectTo: redirectPath };

    } catch (err) {
        console.error("Error login: ", err);
        return { success: false, error: 'Failed to login' };
    }
}

export async function useSignUpAccount(formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const {
        username,
        role,
        password
    } = data;
    const req = await fetch(`${process.env.LOCAL_TEST_API}/api/signup`, {
        method: 'POST',
        body: JSON.stringify({
            username, role, password
        })
    })
    if (!req.ok) {
        console.log("Gagal :D");
    }
    return { success: true };

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
        const deleteGuru = await fetch(`${process.env.LOCAL_TEST_API}/api/guru/${id}`, {
            method: 'DELETE',

        })
        if (!deleteGuru.ok) {
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
    try {
        const req = await fetch(`${process.env.LOCAL_TEST_API}/api/jadwal/${id}`, { method: 'DELETE' });
        if (!req.ok) {
            console.log("Gagal Menghapus data jadwal");
        }
    } catch (err) {
        console.error("Error saat menghapus data jadwal: ", err)
        throw new Error("Gagal menghapus data jadwal")
    }
}

export async function useCreateTahunAjaran(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            nama,
            tanggal_mulai,
            tanggal_selesai,
            status,
        } = data;
        const status_aktif = status as string == "1" ? true : false
        const res = await fetch(`${process.env.LOCAL_TEST_API}/api/tahunajaran`, {
            method: 'POST',
            body: JSON.stringify({
                nama,
                tanggal_mulai,
                tanggal_selesai,
                status_aktif
            })
        })
        if (!res.ok) {
            console.log("Gagal Menambah Data")
        }
    } catch (err) {
        console.error("Error saat menambah data tahun ajaran: ", err)
        throw new Error("Gagal menambah data tahun ajaran")
    }
}

export async function useDeleteTahunAjaran(id: number) {
    try {
        try {
            const req = await fetch(`${process.env.LOCAL_TEST_API}/api/tahunajaran/${id}`, { method: 'DELETE' });
            if (!req.ok) {
                console.log("Gagal Menghapus data jadwal");
            }
        } catch (err) {
            console.error("Error saat menghapus data jadwal: ", err)
            throw new Error("Gagal menghapus data jadwal")
        }
    } catch (err) {

    }
}

export async function useCreateMatpel(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const {
            nama,
            kode_mapel,
            nama_mapel,
        } = data;
        const res = await fetch(`${process.env.LOCAL_TEST_API}/api/matpel`, {
            method: 'POST',
            body: JSON.stringify({
                nama,
                kode_mapel,
                nama_mapel
            })
        })
        if (!res.ok) {
            console.log("Gagal Menambah Data")
        }
    } catch (err) {
        console.error("Error saat menambah data mata pelajaran: ", err)
        throw new Error("Gagal menambah data mata pelajaran")
    }
}

export async function useDeleteMatpel(id: number) {
    try {
        try {
            const req = await fetch(`${process.env.LOCAL_TEST_API}/api/matpel/${id}`, { method: 'DELETE' });
            if (!req.ok) {
                console.log("Gagal Menghapus data mata pelajaran");
            }
        } catch (err) {
            console.error("Error saat menghapus data mata pelajaran: ", err)
            throw new Error("Gagal menghapus data mata pelajaran")
        }
    } catch (err) {

    }
}

export async function useUpdateSiswa(id: string, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/siswa/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nis: data.nis,
                nip: data.nip,
                nama: data.nama,
                jenis_kelamin: data.jenis_kelamin,
                alamat: data.alamat,
                no_telpon: data.no_telpon,
                email: data.email,
                kelas_id: data.kelas,
                status_aktif: data.status === 'true'
            })
        })
        if (!response.ok) {
            throw new Error('Failed to update teacher');
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
}


export async function useUpdateMatpel(id: number, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/matpel/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                kode_mapel: data.kode_mapel,
                nama_mapel: data.nama_mapel
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update mapel');
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating mapel:', error);
        throw error;
    }
}

export async function useUpdateGuru(id: number, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/guru/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nip: data.nip,
                nama: data.nama,
                jenis_kelamin: data.jenis_kelamin,
                alamat: data.alamat,
                no_telpon: data.no_telpon,
                email: data.email,
                status_aktif: data.status === 'true'
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update teacher');
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
}

export async function useUpdateKelas(id: number, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const response = await fetch(`${process.env.LOCAL_TEST_API}/api/kelas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama_kelas: data.nama_kelas,
                tahun_ajaran_id: data.tahun_ajaran_id,
                walikelas_id: data.walikelas_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update kelas');
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating kelas:', error);
        throw error;
    }
}