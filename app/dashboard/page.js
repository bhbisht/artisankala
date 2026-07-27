"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Toast } from "@/components/ui";
import { getToken, getUser, authFetch } from "@/lib/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    setUser(getUser());

    authFetch("/api/products/mine")
      .then((data) => setProducts(data))
      .catch((err) => {
        if (err.status === 401) {
          router.push("/login");
          return;
        }
        setToast({ show: true, message: err.message, type: "error" });
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="p-8">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>

      {user && (
        <p className="mt-2 text-gray-600">
          Welcome back, <strong>{user.name || user.email}</strong>
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border rounded-lg p-6">
          <p className="text-sm text-gray-500">Your products</p>
          <p className="text-3xl font-bold mt-1">{products.length}</p>
        </div>

        <a
          href="/products/manage"
          className="border rounded-lg p-6 flex flex-col justify-center hover:bg-gray-50"
        >
          <p className="font-semibold">Manage products</p>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or remove your listings</p>
        </a>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-4">Your recent products</h2>

      {products.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          No products yet — add your first one to get started.
          <div className="mt-4">
            <a
              href="/products/manage"
              className="bg-blue-600 text-white px-4 py-2 rounded inline-block"
            >
              Add a product
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.slice(0, 6).map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="mt-1">₹{product.price}</p>
            </div>
          ))}
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}