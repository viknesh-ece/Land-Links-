"use client";

import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "investor",
  });

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert("User created successfully");
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Signup
      </h1>

      <input
        className="border p-3 m-2 w-80"
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="border p-3 m-2 w-80"
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        className="border p-3 m-2 w-80"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <select
        className="border p-3 m-2 w-80"
        onChange={(e) =>
          setForm({ ...form, role: e.target.value })
        }
      >
        <option value="investor">Investor</option>
        <option value="landowner">Landowner</option>
        <option value="builder">Builder</option>
      </select>

      <button
        onClick={handleSignup}
        className="bg-blue-700 text-white px-6 py-3 mt-4 rounded"
      >
        Create Account
      </button>

    </div>
  );
}