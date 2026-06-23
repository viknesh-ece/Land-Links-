"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function CreatePropertyPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
  });

  const handleCreate = async () => {
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded shadow">

        <h1 className="text-3xl font-bold mb-6">
          Add Property
        </h1>

        <input
          type="text"
          placeholder="Property Title"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          placeholder="Property Description"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Save Property
        </button>

      </div>
    </div>
  );
}