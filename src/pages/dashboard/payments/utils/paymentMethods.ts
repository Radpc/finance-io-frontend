import { Option } from "@/components/Select";
import { PaymentMethod } from "@/types/apiTypes";

export const paymentMethodsOptions: Option<PaymentMethod>[] = [
  { label: "Dinheiro", value: PaymentMethod.Cash },
  { label: "Crédito", value: PaymentMethod.Credit },
  { label: "Débito", value: PaymentMethod.Debit },
  { label: "Pix", value: PaymentMethod.Pix },
];
