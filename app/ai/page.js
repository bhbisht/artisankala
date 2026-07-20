"use client";

import { useState } from "react";
import { Loader, Toast } from "@/components/ui";

const initialForm = {
  name: "",
  category: "",
  material: "",
  features: "",
};

export default function AIPage() {
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

    setLoading(true);
    setDescription("");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/ai/generate-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate description.");
      }

      setDescription(data.description);
    } catch (err) {
      if (err.name === "AbortError") {
        showToast("Request timed out. Please try again.");
      } else {
        showToast(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-8">🤖 AI Product Description Generator</h1>

      <input
        className="border p-3 w-full mb-4 rounded"
        placeholder="Product Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        className="border p-3 w-full mb-4 rounded"
        placeholder="Category"
        name="category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        className="border p-3 w-full mb-4 rounded"
        placeholder="Material"
        name="material"
        value={form.material}
        onChange={handleChange}
      />

      <textarea
        className="border p-3 w-full mb-4 rounded"
        rows="4"
        placeholder="Features"
        name="features"
        value={form.features}
        onChange={handleChange}
      />

      <button
        onClick={generateDescription}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded disabled:opacity-50"
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
          <p>{description}</p>
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
