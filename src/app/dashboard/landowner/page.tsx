import Navbar from "@/components/Navbar";

export default function LandownerDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-10">

        <h1 className="text-4xl font-bold mb-6">
          Landowner Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded shadow">
            My Listings
          </div>

          <div className="bg-white p-6 rounded shadow">
            Add Property
          </div>

          <div className="bg-white p-6 rounded shadow">
            Messages
          </div>

          <div className="bg-white p-6 rounded shadow">
            Billing
          </div>

        </div>

      </div>

    </div>
  );
}