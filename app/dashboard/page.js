"use client";

import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              🛍️ ArtisanKala Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome {session?.user?.name || "User"} 👋
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            User Information
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {session?.user?.name}
            </p>

            <p>
              <strong>Email:</strong> {session?.user?.email}
            </p>

            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full border mt-3"
              />
            )}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">🎨 Products</h2>
            <p className="text-gray-600 mt-2">
              Manage artisan handmade products.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">📦 Orders</h2>
            <p className="text-gray-600 mt-2">
              View customer orders.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold">📊 Analytics</h2>
            <p className="text-gray-600 mt-2">
              Sales and performance overview.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}