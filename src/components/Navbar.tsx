export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 bg-blue-700 text-white">
      <h2 className="text-2xl font-bold">LandLinkX</h2>

      <div className="space-x-6">
  <a href="/">Home</a>
  <a href="/listings">Listings</a>
  <a href="/login">Login</a>
  <a href="/signup">Signup</a>
</div>
    </nav>
  );
}