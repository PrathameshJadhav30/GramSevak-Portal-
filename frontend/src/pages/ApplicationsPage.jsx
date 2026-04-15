import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import InputField from "../components/InputField";
import StatusBadge from "../components/StatusBadge";
import { applicationApi, documentApi, resolveApiUrl, serviceApi } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/formatters";

export default function ApplicationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [services, setServices] = useState([]);
  const [applications, setApplications] = useState([]);
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
  const [form, setForm] = useState({ serviceId: "", type: "application_document" });
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, applicationsRes] = await Promise.all([
        serviceApi.getAll({ isActive: true, limit: 100 }),
        isAdmin ? applicationApi.getAll({ limit: 100 }) : applicationApi.getMine({ limit: 100 }),
      ]);

      setServices(servicesRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdmin]);

  const uploadOptionalFile = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", form.type);
    const res = await documentApi.upload(formData);
    return res.data?.data?.fileUrl;
  };

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!form.serviceId) return;

    const fileUrl = await uploadOptionalFile();
    await applicationApi.apply({
      serviceId: form.serviceId,
      documents: fileUrl ? [fileUrl] : [],
    });

    toast.success("Application submitted");
    setForm({ serviceId: "", type: "application_document" });
    setFile(null);
    fetchData();
  };

  const updateStatus = async (id, status) => {
    await applicationApi.updateStatus(id, { status });
    toast.success("Status updated");
    fetchData();
  };

  const deleteItem = async (id) => {
    await applicationApi.remove(id);
    toast.success("Application deleted");
    fetchData();
  };

  const openConfirm = ({ title, message, confirmText, confirmVariant, action }) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmVariant,
      action,
    });
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
    const label =
      status === "approved" ? "approve" : status === "rejected" ? "reject" : status === "done" ? "mark as done" : "update";
    openConfirm({
      title: "Confirm Status Update",
      message: `Are you sure you want to ${label} this application?`,
      confirmText: "Update",
      confirmVariant: "primary",
      action: () => updateStatus(id, status),
    });
  };

  const getDocumentUrls = (documents) => {
    if (!documents) return [];
    if (Array.isArray(documents)) {
      return documents.filter((doc) => typeof doc === "string" && doc.trim());
    }
    return [];
  };

  const requestDelete = (id) => {
    openConfirm({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this application?",
      confirmText: "Delete",
      confirmVariant: "danger",
      action: () => deleteItem(id),
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">{isAdmin ? "All Applications" : "My Applications"}</h2>

      {!isAdmin ? (
        <form onSubmit={submitApplication} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-800">Apply for Service</h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Service</label>
            <select
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              value={form.serviceId}
              onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <InputField id="docType" label="Document Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Upload Document (optional)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit">Submit Application</Button>
        </form>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Service</th>
              {isAdmin ? <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Documents</th> : null}
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={isAdmin ? 5 : 4}>Loading...</td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={isAdmin ? 5 : 4}>No applications found</td>
              </tr>
            ) : (
              applications.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-700">{item.service?.name || "-"}</td>
                  {isAdmin ? (
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {getDocumentUrls(item.documents).length ? (
                        <div className="flex flex-col gap-1">
                          {getDocumentUrls(item.documents).map((doc, index) => (
                            <a
                              key={`${item.id}-doc-${index}`}
                              href={resolveApiUrl(doc)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-emerald-700 underline underline-offset-2"
                            >
                              View Document {index + 1}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500">No document</span>
                      )}
                    </td>
                  ) : null}
                  <td className="px-4 py-3 text-sm text-slate-700">{formatDate(item.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {isAdmin ? (
                        <>
                          {item.status === "pending" ? (
                            <>
                              <Button className="px-2 py-1 text-xs" onClick={() => requestStatusUpdate(item.id, "approved")}>Approve</Button>
                              <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => requestStatusUpdate(item.id, "rejected")}>Reject</Button>
                            </>
                          ) : null}
                          {item.status === "approved" ? (
                            <Button className="px-2 py-1 text-xs" onClick={() => requestStatusUpdate(item.id, "done")}>Done</Button>
                          ) : null}
                        </>
                      ) : null}
                      <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => requestDelete(item.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
