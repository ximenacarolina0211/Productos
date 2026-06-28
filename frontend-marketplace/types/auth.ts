export type UserRole = "ADMIN" | "CUSTOMER";

export type AuthenticatedUser = {
  id: number;
  nombre: string;
  email: string;
  role: UserRole;
};

