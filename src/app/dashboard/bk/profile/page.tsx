export const dynamic = 'force-dynamic'

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return notFound();
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
    const guruId = decoded.reference_id;

    const findById = await fetch(
      `${process.env.LOCAL_TEST_API}/api/guru/${guruId}`
    );
    const data = await findById.json();

    return (
      <section className="p-5 mt-10">
        {!data ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">Tidak ada data</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Profil Guru BK</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Nama</p>
                <p className="text-lg font-medium">{data.nama}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">NIP</p>
                <p className="text-lg">{data.nip}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="text-lg">{data.alamat}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">No. Telepon</p>
                <p className="text-lg">{data.no_telepon}</p>
              </div>
              <div className="grid gap-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg">{data.email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    );
  } catch (error) {
    return notFound();
  }
};

export default Page;