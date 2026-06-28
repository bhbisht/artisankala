export default function Card({ name, price }) {
  return (
    <div className="border p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold">{name}</h2>
      <p>Price: ₹{price}</p>
    </div>
  );
}