import { Badge } from "../ui/badge";

export const statusOptionsDropdown = [
  { value: "ALL", label: "Semua Status" },
  { value: "exbatal", label: "Kecuali Batal dan Kesalahan" },
  { value: "pending", label: "Pending" },
  { value: "penjemputan", label: "Penjemputan" },
  { value: "pencucian", label: "Pencucian" },
  { value: "selesai", label: "Selesai" },
  { value: "batal", label: "Batal" },
  { value: "kesalahan", label: "Kesalahan" },
];

export const statusOptions = ["pending", "penjemputan", "pencucian", "selesai", "batal", "kesalahan"];

export const getStatusBadge = (status: (typeof statusOptions)[number]) => {
  const statusMap: Record<typeof statusOptions[number], string> = {
    penjemputan: "bg-[#60A5FA]",
    pengantaran: "bg-[#60A5FA]",
    pencucian: "bg-[#578FCA]", 
    selesai: "bg-[#40A578]",
    pending: "bg-[#FC8621]",
    kesalahan: "bg-[#D9D9D9]",
    batal: "bg-[#E52020]",

  };

  return (
    <Badge className={`text-white ${statusMap[status] || 'bg-gray-400'}`}>
      {status}
    </Badge>
  );
};

export const paymentOptions = ["belum bayar", "sudah bayar"];

export const getPaymentBadge = (status: (typeof paymentOptions)[number]) => {
  const paymentMap: Record<typeof paymentOptions[number], string> = {
    "belum bayar": "bg-rose-500",
    "sudah bayar": "bg-emerald-500",
  };

  return (
    <Badge className={`text-white ${paymentMap[status] || 'bg-gray-400'}`}>
      {status}
    </Badge>
  );
};