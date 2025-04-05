// 删除所有与 LGA 相关的过滤函数
export function filterDataByDate(data, startDate, endDate) {
  return data.filter((value) => {
    const date = new Date(value.date);
    return date >= startDate && date <= endDate;
  });
}

export function filterDataByCategory(data, category) {
  return data.filter((value) => value.category === category);
}

export function filterDataByAmount(data, minAmount, maxAmount) {
  return data.filter((value) => {
    const amount = parseFloat(value.amount);
    return amount >= minAmount && amount <= maxAmount;
  });
}
