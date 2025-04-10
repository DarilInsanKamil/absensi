import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen bg-white">
      <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
      <LoaderCircle className="animate-spin" />
    </section>
  );
}
