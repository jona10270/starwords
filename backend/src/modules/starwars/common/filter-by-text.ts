// Quito tildes y mayusculas para comparar sin que importen
const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// Me quedo con los elementos cuyo texto contiene lo buscado
export const filterByText = <T>(
  items: T[],
  search: string | undefined,
  getText: (item: T) => string,
): T[] => {
  if (!search) return items;

  const wanted = normalize(search);

  return items.filter((item) => normalize(getText(item)).includes(wanted));
};