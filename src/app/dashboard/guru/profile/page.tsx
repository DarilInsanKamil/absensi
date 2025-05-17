import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Page = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const guruId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const findById = await fetch(
    `${process.env.LOCAL_TEST_API}/api/guru/${guruId}`
  );
  const data = await findById.json();
  return (
    <section className="p-5 mt-10">
      {!data ? (
        <p>Tidak ada data</p>
      ) : (
        <Card key={data.id} className="flex justify-center items-center w-2xl">
          <div className="w-full p-5">
            <Image
              src={
                data.jenis_kelamin === "L" ? "/teacher-l.svg" : "/teacher-p.svg"
              }
              width={100}
              height={100}
              alt="profile guru"
            />
            <table className="mt-5 w-full">
              <tbody>
                <tr>
                  <td>Nama</td>
                  <td>{data.nama}</td>
                </tr>
                <tr>
                  <td>NIP</td>
                  <td>{data.nip}</td>
                </tr>
                <tr>
                  <td>Jenis Kelamin</td>
                  <td>
                    {data.jenis_kelamin === "L" ? "Laki-Laki" : "Perempuan"}
                  </td>
                </tr>
                <tr>
                  <td>Wali Kelas</td>
                  <td>{data.nama_kelas}</td>
                </tr>
                <tr>
                  <td>Alamat</td>
                  <td>{data.alamat}</td>
                </tr>
                <tr>
                  <td>No Telepon</td>
                  <td>{data.no_telepon}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{data.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
};

export default Page;
