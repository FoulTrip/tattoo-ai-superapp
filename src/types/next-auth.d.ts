import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";
import { UserType } from "./auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      userType: UserType;
    } & DefaultSession["user"];
    accessToken: string;
    userType: string;
  }

  interface User extends DefaultUser {
    userType: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userType: string;
    accessToken: string;
  }
}
