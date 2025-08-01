import Swal, { SweetAlertResult } from "sweetalert2";

export const AlertUtils = {
  showSuccess: (message: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      customClass: {
        popup: 'rounded-lg shadow-lg bg-white dark:bg-slate-800',
        title: 'text-slate-900 dark:text-white',
        htmlContainer: 'text-slate-600 dark:text-slate-300',
        confirmButton: 'px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors',
      },
      buttonsStyling: false, 
    });
  },

  showError: (message: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: "error",
      title: "Gagal",
      text: message,
      customClass: {
        popup: 'rounded-lg shadow-lg bg-white dark:bg-slate-800',
        title: 'text-slate-900 dark:text-white',
        htmlContainer: 'text-slate-600 dark:text-slate-300',
        confirmButton: 'px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors',
      },
      buttonsStyling: false,
    });
  },

  showConfirmation: async (message: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        popup: 'rounded-lg shadow-lg bg-white dark:bg-slate-800',
        title: 'text-slate-900 dark:text-white',
        htmlContainer: 'text-slate-600 dark:text-slate-300',
        confirmButton: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors ml-2',
        cancelButton: 'px-4 py-2 bg-gray-200 text-slate-800 rounded-md hover:bg-gray-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors',
      },
      buttonsStyling: false, 
    });

    return result.isConfirmed;
  },
};