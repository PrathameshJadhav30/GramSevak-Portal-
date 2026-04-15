import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import InputField from "../components/InputField";
import StatusBadge from "../components/StatusBadge";
import { complaintApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatters";

export default function ComplaintsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
    action: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await (isAdmin ? complaintApi.getAll({ limit: 100 }) : complaintApi.getMine({ limit: 100 }));
      setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const submit = async (e) => {
    e.preventDefault();
    await complaintApi.create(form);
    toast.success("Complaint submitted");
    setForm({ title: "", description: "" });
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await complaintApi.updateStatus(id, { status });
    toast.success("Complaint updated");
    fetchData();
  };

  const remove = async (id) => {
    await complaintApi.remove(id);
    toast.success("Complaint deleted");
    fetchData();
  };

  const openConfirm = ({ title, message, confirmText, confirmVariant, action }) => {
    setConfirmState({ isOpen: true, title, message, confirmText, confirmVariant, action });
  };

  const closeConfirm = () => {
    if (confirmLoading) return;
    setConfirmState({
      isOpen: false,
      title: "",
      message: "",
      confirmText: "Confirm",
      confirmVariant: "primary",
      action: null,
    });
  };

  const onConfirm = async () => {
    if (!confirmState.action) {
      closeConfirm();
      return;
    }

    setConfirmLoading(true);
    try {
      await confirmState.action();
      closeConfirm();
    } finally {
      setConfirmLoading(false);
    }
  };

  const requestStatusUpdate = (id, status) => {
    const label = status === "resolved" ? "resolve" : "mark as in progress";
    openConfirm({
      title: "Confirm Complaint Update",
      message: `Are you sure you want to ${label} this complaint?`,
      confirmText: "Update",
      confirmVariant: "primary",
      action: () => updateStatus(id, status),
    });
  };

  const requestDelete = (id) => {
    openConfirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this complaint?",
      confirmText: "Delete",
      confirmVariant: "danger",
      action: () => remove(id),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Complaints</h2>

      {!isAdmin ? (
        <form onSubmit={submit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <InputField id="title" label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <Button type="submit">Submit Complaint</Button>
        </form>
      ) : null}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">No complaints found</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
                </div>

                <div className="space-y-2">
                  <StatusBadge status={item.status} />
                  <div className="flex flex-wrap gap-2">
                    {isAdmin ? (
                      <>
                        <Button className="px-2 py-1 text-xs" onClick={() => requestStatusUpdate(item.id, "in_progress")}>In Progress</Button>
                        <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => requestStatusUpdate(item.id, "resolved")}>Resolve</Button>
                      </>
                    ) : null}
                    <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => requestDelete(item.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        confirmVariant={confirmState.confirmVariant}
        onConfirm={onConfirm}
        onCancel={closeConfirm}
        loading={confirmLoading}
      />
    </div>
  );
}
