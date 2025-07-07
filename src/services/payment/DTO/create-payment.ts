import { Payment } from "../../../types/apiTypes";

export type ICreatePaymentDTO = Omit<Payment, "id" | "createdAt" | "updatedAt">;
