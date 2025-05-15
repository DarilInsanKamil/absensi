import { createAbsensi, getAbsensi } from "@/app/libs/features/queryAbsensi";

export async function GET(req: Request) {
    try {
        const res = await getAbsensi();

        return new Response(JSON.stringify(res), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (err) {
        console.error('Error executing query', err);
        let errorMessage = 'An error occurred while fetching data';
        if (err instanceof Error) {
            errorMessage = err.message;
        }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
}

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { absensi } = body;
  
      // Validate required fields
      if (!Array.isArray(absensi) || !absensi.length) {
        return new Response(
          JSON.stringify({ error: 'Invalid attendance data' }),
          { status: 400 }
        );
      }
  
      // Validate each attendance record
      for (const record of absensi) {
        if (!record.siswa_id || !record.jadwal_id || !record.guru_id || 
            !record.tanggal || !record.status) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            { status: 400 }
          );
        }
      }
  
      // Create attendance records
      const results = await Promise.all(
        absensi.map(async (record) => {
          return await createAbsensi({
            siswa_id: record.siswa_id,
            jadwal_id: record.jadwal_id,
            guru_id: record.guru_id,
            tanggal: record.tanggal,
            status: record.status,
            keterangan: record.keterangan || '',
            waktu_absen: record.waktu_absen
          });
        })
      );
  
      return new Response(JSON.stringify(results), { status: 201 });
    } catch (error) {
      console.error('Error creating attendance:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create attendance records' }),
        { status: 500 }
      );
    }
  }