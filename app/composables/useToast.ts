/**
 * Toast Composable
 * Provides consistent toast notifications throughout the app
 */
import { toast } from "vue-sonner";

export const useToast = () => {
  /**
   * Show success toast
   * @param title - Toast title
   * @param description - Optional description
   */
  const success = (title: string, description?: string) => {
    toast.success(title, {
      description,
      duration: 3000,
    });
  };

  /**
   * Show error toast
   * @param title - Toast title
   * @param description - Optional description
   */
  const error = (title: string, description?: string) => {
    toast.error(title, {
      description,
      duration: 4000,
    });
  };

  /**
   * Show info toast
   * @param title - Toast title
   * @param description - Optional description
   */
  const info = (title: string, description?: string) => {
    toast.info(title, {
      description,
      duration: 3000,
    });
  };

  /**
   * Show warning toast
   * @param title - Toast title
   * @param description - Optional description
   */
  const warning = (title: string, description?: string) => {
    toast.warning(title, {
      description,
      duration: 3000,
    });
  };

  /**
   * Show loading toast
   * @param title - Toast title
   * @returns Toast ID for dismissal
   */
  const loading = (title: string) => {
    return toast.loading(title);
  };

  /**
   * Dismiss a specific toast
   * @param toastId - Toast ID to dismiss
   */
  const dismiss = (toastId: string | number) => {
    toast.dismiss(toastId);
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  };
};
