export function calculateBill({ roomFee, utilities, additionalServices }, discount = 0, lateFee = 0) {
  const totalBeforeDiscount = roomFee + utilities + additionalServices;
  const finalAmount = totalBeforeDiscount - discount + lateFee;
  return { totalBeforeDiscount, finalAmount };
}
