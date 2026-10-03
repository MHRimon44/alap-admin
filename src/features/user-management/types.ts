export type AdminUser = {
  id: string;
  email: string;
  username?: string;
  displayName: string;
  status: "active" | "disabled";
  createdAt: string;
  lastSeenAt?: string;
};
