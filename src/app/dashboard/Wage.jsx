import Navbar from "@/components/Navbar";
export default function Dashboard() {
    return (<div>
      <Navbar />

      <div className="p-10">
        <h1 className="text-4xl font-bold">
          Welcome to LandLinkX Dashboard
        </h1>

        <p className="mt-4">
          Login successful.
        </p>
      </div>
    </div>);
}
