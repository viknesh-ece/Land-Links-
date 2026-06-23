"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleLogin() {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data?.user?.role === "Landowner") {
        window.location.href = "/dashboard/landowner";
      } else if (data?.user?.role === "Investor") {
        window.location.href = "/dashboard/investor";
      } else if (data?.user?.role === "Builder") {
        window.location.href = "/dashboard/builder";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex justify-center mt-20">
        <div className="bg-white p-10 rounded-xl shadow w-96">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Login
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-3 rounded"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}