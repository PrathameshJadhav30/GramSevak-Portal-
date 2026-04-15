import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import ConfirmationModal from "../components/ConfirmationModal";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import Skeleton from "../components/Skeleton";
import { serviceApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import useDebounce from "../hooks/useDebounce";

export default function ServicesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
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
  const [form, setForm] = useState({ name: "", description: "", isActive: true });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await serviceApi.getAll({ search: debouncedSearch, limit: 50 });
      setServices(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [debouncedSearch]);

  const resetForm = () => {
    setForm({ name: "", description: "", isActive: true });
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({ name: service.name, description: service.description, isActive: service.isActive });
    setOpenModal(true);
  };

  const saveService = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    if (editing) {
      openConfirm({
        title: "Confirm Service Update",
        message: "Are you sure you want to update this service?",
        confirmText: "Update",
        confirmVariant: "primary",
        action: async () => {
          await serviceApi.update(editing.id, form);
          toast.success("Service updated");
          setOpenModal(false);
          resetForm();
          fetchServices();
        },
      });
    } else {
      await serviceApi.create(form);
      toast.success("Service created");
      setOpenModal(false);
      resetForm();
      fetchServices();
    }
  };

  const deleteService = async (id) => {
    await serviceApi.remove(id);
    toast.success("Service deleted");
    fetchServices();
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
      message: "Are you sure you want to delete this service?",
      confirmText: "Delete",
      confirmVariant: "danger",
      action: () => deleteService(id),
    });
  };

  const serviceList = useMemo(() => services, [services]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Services</h2>
        {isAdmin ? <Button onClick={openCreate}>Add Service</Button> : null}
      </div>

      <InputField id="service-search" label="Search Services" placeholder="Search by name or description" value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {serviceList.map((service) => (
            <Card key={service.id} className="hover:scale-[1.03]">
              <h3 className="text-lg font-semibold text-slate-800">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              <p className="mt-2 text-xs text-slate-500">Status: {service.isActive ? "Active" : "Inactive"}</p>

              <div className="mt-4 flex gap-2">
                {isAdmin ? (
                  <>
                    <Button variant="secondary" onClick={() => openEdit(service)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => requestDelete(service.id)}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => toast("Use the Applications page to apply.")}>Apply</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={openModal} title={editing ? "Edit Service" : "Add Service"} onClose={() => setOpenModal(false)}>
        <form onSubmit={saveService} className="space-y-3">
          <InputField id="name" label="Service Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Active
          </label>

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
