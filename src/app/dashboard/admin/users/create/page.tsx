// "use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SiswaTable } from "@/components/tableui/table-users-siswa";
import { GuruTable } from "@/components/tableui/table-users-guru";

export default async function Page() {
  const resSiswa = await fetch(
    `${process.env.LOCAL_TEST_API}/api/users/withoutuser`
  );
  const dataSiswa = await resSiswa.json();

  const resGuru = await fetch(
    `${process.env.LOCAL_TEST_API}/api/users/withoutuserguru`
  );
  const dataGuru = await resGuru.json();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Tambah User Baru</h1>
          <p className="text-sm text-muted-foreground">
            Pilih tipe user yang akan ditambahkan
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="siswa">
            <TabsList className="mb-4">
              <TabsTrigger value="siswa">Siswa</TabsTrigger>
              <TabsTrigger value="guru">Guru</TabsTrigger>
            </TabsList>
            <TabsContent value="siswa">
              <SiswaTable children={dataSiswa} />
            </TabsContent>
            <TabsContent value="guru">
              <GuruTable children={dataGuru} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
