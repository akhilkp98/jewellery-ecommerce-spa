export function calculatePrice(
  weight: number, 
  currentMetalPrice: number, 
  makingCharges: number, 
  shippingCharges: number, 
  taxRateInput: string
): number {
  const basePrice = weight * currentMetalPrice;
  
  let taxPercent = 0;
  if (taxRateInput.includes('3%')) taxPercent = 3;
  if (taxRateInput.includes('5%')) taxPercent = 5;
  if (taxRateInput.includes('12%')) taxPercent = 12;
  
  const taxValue = basePrice * (taxPercent / 100);
  return basePrice + makingCharges + shippingCharges + taxValue;
}
