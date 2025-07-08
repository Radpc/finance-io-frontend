import { Payment } from "../../../types/apiTypes";

type ExtraCreatePaymentDTO = { tagIds?: number[]; categoryId: number };

type ICreatePaymentRemove = Pick<Payment, "category" | "tags">;

export type ICreatePaymentDTO = Omit<
  Payment,
  keyof ICreatePaymentRemove | "id" | "createdAt" | "updatedAt"
> &
  ExtraCreatePaymentDTO;
