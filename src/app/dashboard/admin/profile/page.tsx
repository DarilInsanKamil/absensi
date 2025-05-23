import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const Page = async () => {
  const cookieStore = await cookies();
  const token = (await cookieStore).get("token")?.value || "";
  const decoded = jwt.verify(token, `${process.env.SESSION_SECRET}`);
  const adminId =
    typeof decoded !== "string" && decoded.reference_id
      ? (decoded.reference_id as string)
      : "";

  const findById = await fetch(
    `${process.env.LOCAL_TEST_API}/api/admin/${adminId}`
  );
  const data = await findById.json();
  return (
    <section className="p-5 mt-10">
      {!data ? (
        <p>Tidak ada data</p>
      ) : (
        <Card key={data.id} className="flex justify-center items-center w-2xl">
          <div className="w-full p-5">
            <table className="w-full ">
              <tbody>
                <tr>
                  <td>Nama</td>
                  <td>:</td>
                  <td className="pl-5">{data.nama}</td>
                </tr>
                <tr>
                  <td>NIP</td>
                  <td>:</td>
                  <td className="pl-5">{data.username}</td>
                </tr>
                <tr>
                  <td>No Telepon</td>
                  <td>:</td>
                  <td className="pl-5">{data.no_telepon}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>:</td>
                  <td className="pl-5">{data.email}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>:</td>
                  <td className="pl-5">{data.status_aktif == true ? 'Aktif' : 'Tidak Aktif'}</td>
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
