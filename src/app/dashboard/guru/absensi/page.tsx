

const Page = async () => {
  const getData = await fetch(`${process.env.LOCAL_TEST_API}/api/absensi`)
  const data = await getData.json()
  return (
    <section className="mt-10 flex gap-4 flex-wrap p-5">
      {
        data.map((res:any, idx:number) => (
          <div key={idx} className="mt-5 border p-2 rounded-md">
            <p>{res.nama_siswa}</p>
            <p>{res.nis}</p>
            <p>{res.nama_kelas}</p>
            <p>{res.nama_guru}</p>
            <p>{res.status}</p>
            <p>{res.keterangan}</p>
          </div>
        ))
      }
    </section>
  );
};

export default Page;
