export interface AuthUser {
  id: string;
  email?: string | null;
  emailConfirmed?: boolean;
  securityStamp?: string | null;
  phoneNumber?: string | null;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEndDateUtc?: string | null;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  userName?: string | null;
  roles?: string | null;
  isStreamer?: boolean;
  isChatEnabled?: boolean;
  avatar?: string | null;
  password?: string | null;
}

export interface AdminUser {
  id: number | string;
  documentId?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  role?: 'admin' | 'super_admin' | 'moderator' | null;
  permissions?: string[] | null;
  department?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: number | null;
  lastLogin?: string | null; // ISO date string
}

// This top-level User type matches the payload expected by the auth store: { user, admin }
export interface User {
  user: AuthUser;
  admin?: AdminUser | null;
}
