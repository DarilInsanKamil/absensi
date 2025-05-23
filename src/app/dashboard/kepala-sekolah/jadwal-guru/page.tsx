import { getJadwalGuru } from "@/app/libs/features/queryDashboardKepsek";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { notFound } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return notFound();

  const decoded = jwt.verify(token, process.env.SESSION_SECRET || "") as any;
  const data = await getJadwalGuru();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jadwal Mengajar Guru</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((guru) => (
          <Card key={guru.guru_id} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">{guru.nama_guru}</CardTitle>
              <p className="text-sm text-muted-foreground">NIP: {guru.nip}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Jadwal Mengajar:
                </p>
                {guru.jadwal ? (
                  guru.jadwal.split("\n").map((jadwal: any, idx: number) => (
                    <p key={idx} className="text-sm pl-2">
                      {jadwal}
                    </p>
                  ))
                ) : (
                  <p className="text-sm pl-2 text-muted-foreground italic">
                    Belum ada jadwal
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
