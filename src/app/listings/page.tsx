"use client";

import Navbar from "@/components/Navbar";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties");
        const data = await res.json();
        setProperties(data);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">
            Available Properties
          </h1>
          <input
  type="text"
  placeholder="Search by Location..."
  className="border p-3 rounded w-80 mt-4"
  onChange={(e) => setSearch(e.target.value)}
/>
          <Link href="/listings/create">
            <button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              + Add Property
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-center text-gray-600">No properties available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties
  .filter((property: any) =>
    property.location
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .map((property: any) => (
    <PropertyCard key={property.id} property={property} />
  ))}
          </div>
        )}
      </div>
    </div>
  );
}