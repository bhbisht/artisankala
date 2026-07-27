"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Loader, Toast, Modal } from "@/components/ui";
import { getToken, getUser, authFetch } from "@/lib/api";

const emptyForm = { name: "", description: "", price: "", image: "", category: "" };

export default function ManageProducts() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "error") => setToast({ show: true, message, type });

  const loadProducts = () => {
    setLoading(true);
    authFetch("/api/products/mine")
      .then(setProducts)
      .catch((err) => {
        if (err.status === 401) {
          router.push("/login");
          return;
        }
        showToast(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    setUser(getUser());
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image,
      category: product.category,
    });
    setFormErrors({});
    setFormOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.description.trim()) errors.description = "Description is required";
    if (!form.price || Number(form.price) <= 0) errors.price = "Enter a valid price";
    if (!form.image.trim()) errors.image = "Image URL is required";
    if (!form.category.trim()) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingId) {
        await authFetch(`/api/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        showToast("Product updated.", "success");
      } else {
        await authFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(form),
        });
        showToast("Product created.", "success");
      }
      setFormOpen(false);
      loadProducts();
    } catch (err) {
      if (err.status === 401) {
        router.push("/login");
        return;
      }
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authFetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      showToast("Product deleted.", "success");
      setDeleteTarget(null);
      loadProducts();
    } catch (err) {
      if (err.status === 401) {
        router.push("/login");
        return;
      }
      showToast(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold">Manage Products</h1>
          {user && (
            <p className="mt-2 text-gray-600">
              Signed in as <strong>{user.name || user.email}</strong>
            </p>
          )}
        </div>

        <Button onClick={openCreateForm}>+ Add Product</Button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-gray-500">
            No products yet — add your first one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 flex flex-col">
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="text-sm mt-1 line-clamp-2">{product.description}</p>
                <p className="mt-2 font-semibold">₹{product.price}</p>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditForm(product)}>
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(product)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            error={formErrors.description}
          />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            error={formErrors.price}
          />
          <Input
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            error={formErrors.image}
          />
          <Input
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            error={formErrors.category}
          />

          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Create Product"}
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product"
      >
        <p>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This can't be undone.
        </p>
        <Button
          variant="secondary"
          onClick={confirmDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, delete it"}
        </Button>
      </Modal>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}