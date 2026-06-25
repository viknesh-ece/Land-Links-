"use client";

import Navbar from "@/components/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/auth";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const role = user.role.toLowerCase();
    if (role === "landowner") {
      router.push("/dashboard/landowner");
    } else if (role === "investor") {
      router.push("/dashboard/investor");
    } else if (role === "builder") {
      router.push("/dashboard/builder");
    } else {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-405 font-semibold text-sm mt-4">Verifying credential tokens...</p>
      </div>
    </div>
  );
}