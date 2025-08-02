export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric", 
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

export const formatRupiah = (price: string) => {
  const number = parseFloat(price);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
