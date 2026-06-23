type PropertyProps = {
  property: {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
  };
};

export default function PropertyCard({
  property,
}: PropertyProps) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden p-6">

      <h3 className="text-2xl font-bold text-black">
        {property.title}
      </h3>

      <p className="text-gray-700 mt-2">
        {property.description}
      </p>

      <p className="text-green-600 font-semibold mt-2">
        Price: ₹ {property.price}
      </p>

      <p className="text-blue-600 mt-2">
        Location: {property.location}
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        View Property
      </button>

    </div>
  );
}