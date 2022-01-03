import type { DefaultSession } from "next-auth";

export interface EarlyAccess extends DefaultSession {
  early_access?: boolean | null;
}
