import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import { noticeApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatters";

export default function NoticesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [items, setItems] = useState([]);
  const [language, setLanguage] = useState("en");
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    confirmVariant: "primary",
    action: null,
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", language: "en" });

  const fetchData = async () => {
    const { data } = await noticeApi.getAll({ language, limit: 100 });
    setItems(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, [language]);

  const onSave = async (e) => {
    e.preventDefault();
    if (editing) {
      openConfirm({
        title: "Confirm Notice Update",
        message: "Are you sure you want to update this notice?",
        confirmText: "Update",
        confirmVariant: "primary",
        action: async () => {
          await noticeApi.update(editing.id, form);
          toast.success("Notice updated");
          setOpenModal(false);
          setEditing(null);
          setForm({ title: "", description: "", language: "en" });
          fetchData();
        },
      });
    } else {
      await noticeApi.create(form);
      toast.success("Notice created");

      setOpenModal(false);
      setEditing(null);
      setForm({ title: "", description: "", language: "en" });
      fetchData();
    }
  };

  const onDelete = async (id) => {
    await noticeApi.remove(id);
    toast.success("Notice deleted");
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

  const requestDelete = (id) => {
    openConfirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this notice?",
      confirmText: "Delete",
      confirmVariant: "danger",
      action: () => onDelete(id),
    });
  };

  const onEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, description: item.description, language: item.language });
    setOpenModal(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Notices</h2>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="en">English</option>
            <option value="mr">Marathi</option>
          </select>
          {isAdmin ? <Button onClick={() => setOpenModal(true)}>Create Notice</Button> : null}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
              {isAdmin ? (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onEdit(item)}>Edit</Button>
                  <Button variant="danger" onClick={() => requestDelete(item.id)}>Delete</Button>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <Modal isOpen={openModal} title={editing ? "Edit Notice" : "Create Notice"} onClose={() => setOpenModal(false)}>
        <form onSubmit={onSave} className="space-y-3">
          <InputField id="notice-title" label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Language</label>
            <select
              value={form.language}
              onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="mr">Marathi</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

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
