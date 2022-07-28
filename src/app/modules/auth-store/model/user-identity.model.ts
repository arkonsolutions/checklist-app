import { AuthProviderEnum } from "./auth-provider.enum";

export interface UserIdentity {
  provider: AuthProviderEnum;
  givenName: string;
  familyName: string;
  displayName: string;
  email: string;
  accessToken: string;
}