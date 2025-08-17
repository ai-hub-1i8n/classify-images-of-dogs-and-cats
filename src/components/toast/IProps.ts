export type ToastType = "success" | "error" | "warning" | "info" | "default";

export type ToastVariant = "filled" | "outlined" | "soft" | "minimal";

export interface ToastOptions {
  title?: string;
  description?: string;
  type?: ToastType;
  variant?: ToastVariant;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
}
