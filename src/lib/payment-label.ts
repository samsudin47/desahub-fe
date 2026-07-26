const PAYMENT_TYPE_LABELS: Record<string, string> = {
  bank_transfer: "Transfer Bank",
  echannel: "Mandiri Bill",
  bca_va: "BCA VA",
  bni_va: "BNI VA",
  bri_va: "BRI VA",
  permata_va: "Permata VA",
  other_va: "Virtual Account",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  qris: "QRIS",
  credit_card: "Kartu Kredit",
  cstore: "Convenience Store",
  akulaku: "Akulaku",
};

export function formatPaymentType(type: string | null | undefined): string {
  if (!type?.trim()) return "—";
  const key = type.trim().toLowerCase();
  return (
    PAYMENT_TYPE_LABELS[key] ??
    type
      .trim()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}
