export function calculatePrice(date: Date, startTime: string, duration: number, priceRules: any[]) {
  const dayOfWeek = date.getDay(); // 0-6
  const dateStr = date.toISOString().split('T')[0];

  // Logic: 
  // 1. Look for specific date rule
  // 2. Look for day of week rule
  // 3. Fallback to a default if none found (will use first rule or 0)

  // Simplified: Find rule that matches dayOfWeek/specificDate and startTime
  const rule = priceRules.find(r => {
    const adjustedEndTime = r.endTime === '00:00' ? '24:00' : r.endTime;
    const timeMatch = r.startTime <= startTime && adjustedEndTime > startTime;
    const ruleDate = r.specificDate 
      ? (typeof r.specificDate === 'string' ? r.specificDate.split('T')[0] : r.specificDate.toISOString().split('T')[0])
      : null;
    const dateMatch = ruleDate ? ruleDate === dateStr : r.dayOfWeek === dayOfWeek;
    return timeMatch && dateMatch;
  });

  return rule ? Number(rule.price) * duration : (priceRules[0] ? Number(priceRules[0].price) * duration : 0);
}
