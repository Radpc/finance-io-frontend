import { DateTime } from "luxon";

export const numberToCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
    .format(value)
    .replace("R$", "")
    .trim();

export const formatDate = (isoDate: string) => {
  return DateTime.fromISO(isoDate).toFormat("dd/MM/yyyy");
};
