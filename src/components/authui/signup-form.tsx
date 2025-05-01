import { signUpAccount } from "@/app/libs/action";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import Form from "next/form";

export function SignupForm() {
  return (
    <section className="grid md:grid-cols-12 grid-cols-6 md:px-2 px-5 md:py-10">
      <div className="md:col-start-1 md:col-end-13 col-start-1 col-end-7 flex items-center flex-col mb-10">
        <div className="w-[86px] h-[86px] rounded-full bg-blue-300"></div>
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
            <Form action={signUpAccount}>
              <div className="mb-3">
                <label>NIP atau NISN</label>
                <Input placeholder="masukan nip atau nisn" name="userid" />
              </div>
              <div className="mb-3">
                <label>Role</label>
                <Input placeholder="masukan password" name="role" />
              </div>
              <div>
                <label>Password</label>
                <Input placeholder="masukan password" name="password" />
              </div>
              <Button className="w-full mt-5">Sign Up</Button>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
