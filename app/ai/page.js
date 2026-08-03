"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Toast } from "@/components/ui";
import { getToken, authFetch } from "@/lib/api";

const initialForm = {
  name: "",
  category: "",
  material: "",
  features: "",
};

export default function AIPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
  };

  const generateDescription = async () => {
    if (!form.name || !form.category || !form.material || !form.features) {
      showToast("Please fill in all fields.");
      return;
    }

    const token = getToken();
    if (!token) {
      showToast("Please log in to use this feature.");
      setTimeout(() => router.push("/login"), 1200);
      return;
    }

    setLoading(true);
    setDescription("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const data = await authFetch("/api/ai/generate-description", {
        method: "POST",
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      setDescription(data.description);
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Request timed out. Please try again.");
      } else if (err.status === 401) {
        showToast("Your session has expired. Please log in again.");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        showToast(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">🤖 AI Product Description Generator</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          className="border p-3 w-full rounded"
          placeholder="Product Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Material"
          name="material"
          value={form.material}
          onChange={handleChange}
        />

        <input
          className="border p-3 w-full rounded"
          placeholder="Features (comma separated)"
          name="features"
          value={form.features}
          onChange={handleChange}
        />
      </div>

      <button
        onClick={generateDescription}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50 w-full sm:w-auto"
      >
        {loading ? "Generating..." : "Generate Description"}
      </button>

      {loading && (
        <div className="mt-6">
          <Loader />
        </div>
      )}

      {description && !loading && (
        <div className="mt-8 border rounded p-4 bg-gray-100">
          <h2 className="font-bold mb-2">Generated Description</h2>
          <p className="whitespace-pre-line leading-relaxed">{description}</p>
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