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
    userType: UserType;
  }

  interface User extends DefaultUser {
    userType: UserType;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userType: UserType;
    accessToken: string;
  }
}
