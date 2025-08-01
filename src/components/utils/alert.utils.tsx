import Swal, { SweetAlertResult } from "sweetalert2";


export const AlertUtils = {
  showSuccess: (message: string): Promise<SweetAlertResult> => {
    return Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      customClass: {
        container: 'bg-white ',
        popup: 'rounded-xl shadow-lg bg-white',
        title: 'text-slate-900 ',
        validationMessage: 'text-slate-900',
        htmlContainer: 'text-slate-600 dark:text-slate-400',
        confirmButton: 'px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors',
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
        popup: 'rounded-xl shadow-lg bg-white dark:bg-slate-800',
        title: 'text-slate-900 dark:text-slate-100',
        htmlContainer: 'text-slate-600 dark:text-slate-400',
        confirmButton: 'px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors',
      },
      buttonsStyling: false,
    });
  },

  showConfirmation: async (message: string): Promise<boolean> => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      customClass: {
        actions: 'gap-x-3',
        popup: 'rounded-xl shadow-lg bg-white dark:bg-slate-800',
        title: 'text-slate-900 dark:text-slate-100',
        htmlContainer: 'text-slate-600 dark:text-slate-400',
        confirmButton: 'px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-colors',
        cancelButton: 'px-4 py-2 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors',
      },
      buttonsStyling: false,
    });

    return result.isConfirmed;
  },
};
