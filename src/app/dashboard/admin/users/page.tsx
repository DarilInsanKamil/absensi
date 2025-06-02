import { UsersTable } from "@/components/tableui/table-user";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default async function Page() {
  const res = await fetch(`${process.env.LOCAL_TEST_API}/api/users`);
  const data = await res.json();
  return (
    <section className="p-6 mt-5">
      <Card className="flex md:flex-row justify-between relative mb-10">
        <CardHeader className="w-full">
          <h1 className="text-2xl font-bold">Manajemen Data User</h1>
          <p className="text-base text-muted-foreground -mt-2">
            Atur dan kelola daftar user, serta informasi penting lainnya.
          </p>
        </CardHeader>
        <CardFooter>
          <Link href="/dashboard/admin/users/create/">
            <Button>Tambah User</Button>
          </Link>
        </CardFooter>
      </Card>

      <UsersTable children={data} />
    </section>
  );
}
