"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function SignupPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

     const data = await res.json();

alert(data.message);

console.log(data); 

    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex justify-center mt-20">

        <div className="bg-white p-10 rounded-xl shadow w-96">

          <h1 className="text-3xl font-bold mb-6 text-center">
            Create Account
          </h1>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Create Password"
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded mb-4"
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option>Select Role</option>
            <option>Landowner</option>
            <option>Investor</option>
            <option>Builder</option>
          </select>

          <button
            onClick={handleSignup}
            className="w-full bg-green-600 text-white p-3 rounded"
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}