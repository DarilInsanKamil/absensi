import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" className="border p-2 w-full" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        {/* <input type="password" className="border p-2 w-full" required /> */}
        <Input/>
      </div>
      <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
