export type AdminUser = {
  id: string;
  email: string;
  username?: string;
  displayName: string;
  bio?: string;
  presenceVisibility: "everyone" | "contacts" | "nobody";
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
  lastSeenAt?: string;
};

export type AdminUserDetails = {
  user: AdminUser;
  stats: {
    activeSessions: number;
    totalSessions: number;
    conversations: number;
    messagesSent: number;
    reactions: number;
  };
  sessions: Array<{
    id: string;
    deviceName?: string;
    platform?: "android" | "ios" | "unknown";
    appVersion?: string;
    createdAt: string;
    lastUsedAt: string;
    expiresAt: string;
    revokedAt?: string;
  }>;
};
