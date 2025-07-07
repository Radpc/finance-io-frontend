import { Payment } from "../../../types/apiTypes";

type ExtraCreatePaymentDTO = { tagIds?: number[]; categoryId: number };

export type ICreatePaymentDTO = Omit<
  Payment,
  "id" | "createdAt" | "updatedAt"
> &
  ExtraCreatePaymentDTO;
