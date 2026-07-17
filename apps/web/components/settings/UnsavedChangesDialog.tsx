import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: Props) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Unsaved Changes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You have unsaved changes in the current form. If you leave now, your changes will be lost.
          Are you sure you want to discard these changes?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary" variant="outlined">
          Keep Editing
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Discard Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
