import { Dialog } from "./Dialog";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Excluir",
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={title}>
      <p className="mb-6 text-sm text-gray-600">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
