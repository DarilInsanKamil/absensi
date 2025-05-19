export const dynamic = 'force-dynamic'

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const Page = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const siswaId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const findById = await fetch(
    `${process.env.LOCAL_TEST_API}/api/siswa/${siswaId}`
  );
  const data = await findById.json();
  return (
    <section className="p-5 mt-10">
      {!data ? (
        <p>Tidak ada data</p>
      ) : (
        <div key={data.id}>
          <p>{data.nama}</p>
          <p>{data.nip}</p>
          <p>{data.alamat}</p>
          <p>{data.no_telepon}</p>
          <p>{data.email}</p>
        </div>
      )}
    </section>
  );
};

export default Page;
