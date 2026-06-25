"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function AIPricePage() {
  const [acres, setAcres] = useState("");
  const [result, setResult] = useState("");

  const predictPrice = () => {
    const estimate = Number(acres) * 2000000;
    setResult("Estimated Price: ₹ " + estimate);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-xl mx-auto mt-20 bg-white p-8 rounded shadow">

        <h1 className="text-3xl font-bold mb-6">
          AI Land Price Prediction
        </h1>

        <input
          type="number"
          placeholder="Enter Acres"
          className="w-full p-3 border rounded mb-4"
          onChange={(e) => setAcres(e.target.value)}
        />

        <button
          onClick={predictPrice}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Predict Price
        </button>

        {result && (
          <h2 className="mt-6 text-2xl text-green-600">
            {result}
          </h2>
        )}

      </div>
    </div>
  );
}