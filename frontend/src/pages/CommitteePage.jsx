import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import { committeeApi, resolveApiUrl } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const FALLBACK_PHOTO = "https://placehold.co/300x200?text=Member";

export default function CommitteePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [members, setMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, member: null });
  const [editing, setEditing] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [form, setForm] = useState({
    name: "",
    position: "",
    contact: "",
  });

  const resetForm = () => {
    setEditing(null);
    setPhotoFile(null);
    setPhotoPreview("");
    setForm({ name: "", position: "", contact: "" });
  };

  const openAddMember = () => {
    resetForm();
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    resetForm();
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: null, member: null });
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("position", form.position);
    payload.append("contact", form.contact);
    if (photoFile) {
      payload.append("photo", photoFile);
    }
    return payload;
  };

  const getImageSrc = (member) => {
    const normalized = resolveApiUrl(member.photoUrl);
    if (!normalized) {
      return FALLBACK_PHOTO;
    }

    const updatedAt = member.updatedAt ? new Date(member.updatedAt).getTime() : Date.now();
    return `${normalized}${normalized.includes("?") ? "&" : "?"}v=${updatedAt}`;
  };

  const fetchData = async () => {
    const { data } = await committeeApi.getAll({ limit: 100 });
    setMembers(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const save = async (e) => {
    e.preventDefault();

    if (!editing && !photoFile) {
      toast.error("Photo is required");
      return;
    }

    if (editing) {
      setConfirmModal({ isOpen: true, type: "update", member: editing });
    } else {
      const payload = buildPayload();
      await committeeApi.create(payload);
      toast.success("Member added");
      closeModal();
      fetchData();
    }
  };

  const remove = (member) => {
    setConfirmModal({ isOpen: true, type: "delete", member });
  };

  const confirmAction = async () => {
    if (confirmModal.type === "update" && editing) {
      const payload = buildPayload();
      await committeeApi.update(editing.id, payload);
      toast.success("Member updated");
      closeConfirmModal();
      closeModal();
      fetchData();
      return;
    }

    if (confirmModal.type === "delete" && confirmModal.member) {
      await committeeApi.remove(confirmModal.member.id);
      toast.success("Member removed");
      closeConfirmModal();
      fetchData();
      return;
    }

    closeConfirmModal();
  };

  const edit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      position: member.position,
      contact: member.contact,
    });
    setPhotoFile(null);
    setPhotoPreview(resolveApiUrl(member.photoUrl) || FALLBACK_PHOTO);
    setOpenModal(true);
  };

  const confirmTitle = confirmModal.type === "delete" ? "Confirm Delete" : "Confirm Update";
  const confirmText =
    confirmModal.type === "delete"
      ? `Are you sure you want to delete ${confirmModal.member?.name || "this member"}?`
      : "Are you sure you want to update this member details?";
  const confirmButtonText = confirmModal.type === "delete" ? "Delete" : "Update";
  const confirmButtonVariant = confirmModal.type === "delete" ? "danger" : "primary";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Committee</h2>
        {isAdmin ? <Button onClick={openAddMember}>Add Member</Button> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden p-0 hover:scale-[1.03]">
            <img
              src={getImageSrc(member)}
              alt={member.name}
              loading="lazy"
              className="h-44 w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_PHOTO;
              }}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-slate-800">{member.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{member.position}</p>
              <p className="mt-2 text-sm text-slate-500">{member.contact}</p>

              {isAdmin ? (
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" onClick={() => edit(member)}>Edit</Button>
                  <Button variant="danger" onClick={() => remove(member)}>Delete</Button>
                </div>
              ) : null}
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={openModal} title={editing ? "Edit Member" : "Add Member"} onClose={closeModal}>
        <form onSubmit={save} className="space-y-3">
          <InputField id="member-name" label="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <InputField id="member-position" label="Position" value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} />
          <div className="space-y-2">
            <InputField
              id="member-photo"
              label="Photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setPhotoFile(file);
                if (file) {
                  setPhotoPreview(URL.createObjectURL(file));
                } else {
                  setPhotoPreview(resolveApiUrl(editing?.photoUrl) || FALLBACK_PHOTO);
                }
              }}
            />
            <p className="text-xs text-slate-500">Upload a JPG or PNG image.</p>
            <img
              src={photoPreview || FALLBACK_PHOTO}
              alt="Member photo preview"
              className="h-32 w-full rounded-lg border border-slate-200 object-cover"
            />
          </div>
          <InputField id="member-contact" label="Contact" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit">{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={confirmModal.isOpen} title={confirmTitle} onClose={closeConfirmModal}>
        <div className="space-y-4">
          <p className="text-sm text-slate-700">{confirmText}</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeConfirmModal}>Cancel</Button>
            <Button variant={confirmButtonVariant} onClick={confirmAction}>{confirmButtonText}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
