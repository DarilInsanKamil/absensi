"use client";

import { useSignUpAccount } from "@/app/libs/action";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await useSignUpAccount(formData);

      if (result.success) {
        toast.success("Sign Up Berhasil");
        router.push("/");
      } else {
        toast.error("Gagal Sign Up", {
          description: "Masukan data yang valid",
        });
      }
    } catch (error) {
      console.error("Sign Up failed:", error);
      toast.error("Sign Up Error", {
        description: "Terjadi kesalahan saat sign up",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="grid md:grid-cols-12 grid-cols-6 md:px-2 px-5 md:py-10">
      <div className="md:col-start-1 md:col-end-13 col-start-1 col-end-7 flex items-center flex-col mb-10">
        <Image src="/absensiteknomedia/logosekolah.png" width={100} height={100} alt="logo" />
        <h1 className="font-bold text-2xl mt-5">SMK TECHNO MEDIA</h1>
      </div>
      <div className="md:col-start-5 md:col-end-9 col-start-1 items-center  col-end-7 bg-red-400">
        <Card className="">
          <CardHeader>
            <h4 className="font-bold">Signup for create accoint</h4>
            <p className="text-[14px] -mt-2">
              Enter your data to create your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>User Id</label>
                <Input placeholder="masukan user id" name="username" />
              </div>
              <div className="mb-3">
                <label>Wali Kelas</label>
                <br></br>
                <select
                  name="role"
                  id="role"
                  className="w-full bg-white outline-2 p-2 rounded-sm"
                >
                  <option value="">===Pilih Role===</option>
                  <option value="admin">Admin</option>
                  <option value="guru">Guru</option>
                  <option value="siswa">Siswa</option>
                  <option value="kepsek">Kepala Sekolah</option>
                  <option value="bk">BK</option>
                </select>
              </div>
              <div>
                <label>Password</label>
                <Input
                  placeholder="masukan password"
                  name="password"
                  type="password"
                  minLength={4}
                />
              </div>
              <Button className="w-full mt-5" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
