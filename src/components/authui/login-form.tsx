"use client";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { loginAccount } from "@/app/libs/action";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAccount(formData);

      if (result.success) {
        toast.success("Login Berhasil");
        router.push(result.redirectTo ?? "/dashboard");
      } else {
        toast.error("Gagal Login", {
          description: "Masukan UserId dan Password yang valid",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Error", {
        description: "Terjadi kesalahan saat login",
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
            <h4 className="font-bold">Login to your account</h4>
            <p className="text-[14px] -mt-2">
              Enter your NIP or NISN below to login to your account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>User Id</label>
                <Input
                  placeholder="masukan user id"
                  name="username"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <Input
                  placeholder="masukan password"
                  name="password"
                  type="password"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                className="w-full mt-5"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
