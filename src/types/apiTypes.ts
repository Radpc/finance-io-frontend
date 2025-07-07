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
  category?: Category;
  tags?: Tag[];
}

export interface Category extends DatabaseDates {
  id: number;
  label: string;
}

export interface Tag extends DatabaseDates {
  id: number;
}
