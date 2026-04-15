import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmationModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="space-y-4">
        <p className="text-sm text-slate-700">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
