"use client";

import { useState } from "react";

const SignupForm = () => {
  //   const [state, action, pending] = useActionState(signup, undefined);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "siswa", // Default role
  });
  console.log(formData);

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Kirim data dalam format JSON
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
      } else {
        alert(data.message || "Failed to create account.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="role" className="block font-medium">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        >
          <option value="siswa">Siswa</option>
          <option value="guru">Guru</option>
          <option value="kepsek">Kepala Sekolah</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Signup
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </form>
  );
};

export default SignupForm;
