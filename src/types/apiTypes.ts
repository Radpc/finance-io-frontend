export enum UserRole {
  Admin = "admin",
}

export enum PaymentStatus {
  Paid = "Paid",
}

export enum PaymentMethod {
  Credit = "Credit",
  Debit = "Debit",
  Cash = "Cash",
  Pix = "Pix",
}

export interface DatabaseDates {
  createdAt: string;
  updatedAt: string;
}

export interface User extends DatabaseDates {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface Payment extends DatabaseDates {
  id: number;
  description: string;
  value: number;
  observation?: string;
  status: PaymentStatus;
  paymentDate: string;
}
