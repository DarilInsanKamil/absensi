import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const GuruForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="nama">Nama Lengkap</label>
        <input type="nama" className="border p-2 w-full" required />
      </div>
      <div>
        <label htmlFor="nis">NIP</label>
        <input type="number" className="border p-2 w-full" required />
      </div>
      <div>
        <label htmlFor="jenis_kelamin" className="block font-medium">
          Jenis Kelamin
        </label>
        <div>
          <label htmlFor="perempuan" className="block font-medium">
            Perempuan
          </label>
          <input
            type="radio"
            id="perempuan"
            name="jenis_kelamin"
            value="Perempuan"
          />
        </div>
        <div>
          <label htmlFor="laki-laki" className="block font-medium">
            Laki-laki
          </label>
          <input
            type="radio"
            id="laki-laki"
            name="jenis_kelamin"
            value="Laki-laki"
          />
        </div>
      </div>
      <div>
        <label htmlFor="ttl">Tanggal Lahir</label>
        <input type="date" className="border p-2 w-full" required />
      </div>
      <div>
        <label htmlFor="alamat">Alamat</label>
        <input type="alamat" className="border p-2 w-full" required />
      </div>
      <div>
        <label htmlFor="nama">Email</label>
        <input type="nama" className="border p-2 w-full" required />
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Login
      </Button>
    </form>
  );
};

export default GuruForm;
