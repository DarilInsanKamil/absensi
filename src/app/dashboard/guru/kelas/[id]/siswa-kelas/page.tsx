const Page = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  const res = await fetch(`${process.env.LOCAL_TEST_API}/api/kelas/${id}`);
  const data = await res.json();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Siswa</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">NIS</th>
              <th className="border p-2 text-left">Nama</th>
              <th className="border p-2 text-left">Jenis Kelamin</th>
              <th className="border p-2 text-left">Tanggal Lahir</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">No. Telepon</th>
              <th className="border p-2 text-left">Alamat</th>
            </tr>
          </thead>
          <tbody>
            {data.map((siswa: any) => (
              <tr key={siswa.id} className="hover:bg-gray-50">
                <td className="border p-2">{siswa.nis}</td>
                <td className="border p-2">{siswa.nama}</td>
                <td className="border p-2">
                  {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                </td>
                <td className="border p-2">
                  {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </td>
                <td className="border p-2">{siswa.email}</td>
                <td className="border p-2">{siswa.no_telepon}</td>
                <td className="border p-2">{siswa.alamat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;