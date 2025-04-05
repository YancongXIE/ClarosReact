// filter the data by LGA name
export function filterDataByLGA(data, lgaName) {
  return data.filter((value) => value.lga_name === lgaName);
}
