import { useState } from "react";
import toast from "react-hot-toast";

import InputField from "../components/InputField";
import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../services/api";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const executeUpdate = async (payload) => {
    setSaving(true);
    try {
      const { data } = await authApi.updateProfile(payload);
      setUser(data.data);
      localStorage.setItem("gp_user", JSON.stringify(data.data));
      setForm((prev) => ({ ...prev, password: "" }));
      toast.success("Profile updated successfully");
    } finally {
      setSaving(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      mobile: form.mobile,
      address: form.address,
      ...(form.password ? { password: form.password } : {}),
    };

    setPendingPayload(payload);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (saving) return;
    setConfirmOpen(false);
    setPendingPayload(null);
  };

  const confirmUpdate = async () => {
    if (!pendingPayload) {
      closeConfirm();
      return;
    }

    await executeUpdate(pendingPayload);
    closeConfirm();
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-800">Profile</h2>

      <form onSubmit={submit} className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <InputField id="name" label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <InputField id="email" label="Email" value={user?.email || ""} disabled className="cursor-not-allowed bg-slate-100" />
        <InputField id="mobile" label="Mobile" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} />
        <InputField id="address" label="Address" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
        <div className="sm:col-span-2">
          <InputField
            id="password"
            type="password"
            label="New Password (optional)"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <ConfirmationModal
        isOpen={confirmOpen}
        title="Confirm Profile Update"
        message="Are you sure you want to update your profile details?"
        confirmText="Update"
        confirmVariant="primary"
        onConfirm={confirmUpdate}
        onCancel={closeConfirm}
        loading={saving}
      />
    </div>
  );
}
