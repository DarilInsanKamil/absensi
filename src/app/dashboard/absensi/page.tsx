import React from "react";

const Page = async () => {
  const res = await fetch("http://localhost:3000/api/absensi/");
  const data = await res.json();
  return <div>{JSON.stringify(data)}</div>;
};

export default Page;
