"use client";
import { logout } from "@/app/libs/action";
import { Button } from "./button";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutBtn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const result = await logout();

      if (result.success) {
        toast.success("Logout Berhasil");
        router.push(result.redirectTo ?? "/");
      } else {
        toast.error("Gagal Logout");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout Error", {
        description: "Terjadi kesalahan saat Logout",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      variant="noShadow"
      className="bg-red-500 text-white"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        "Logout"
      )}
    </Button>
  );
}
