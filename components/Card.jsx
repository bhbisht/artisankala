export default function Card({ title, description }) {
  return (
    <div className="border p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{description}</p>
    </div>
  );
}