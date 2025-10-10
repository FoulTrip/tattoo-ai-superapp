import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  basePath: "/api/auth",
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log("Authorize called with credentials:", {
          email: credentials?.email,
          passwordLength: credentials?.password?.length,
          password: credentials?.password,
        });

        try {

          const apiUrl = `${process.env.NEXT_PUBLIC_URL_GATEWAY}/auth/login`;

          console.log("Calling API:", apiUrl);

          const response = await axios.post(apiUrl, {
            email: credentials?.email,
            password: credentials?.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'user-agent': 'TattooAI-Web-Client'
            }
          });

          console.log("API response status:", response.status);

          const data = response.data;

          console.log("API response data:", data);

          if (data.user) {
            console.log("User found, returning user object");

            return {
              id: data.user.id,
              email: data.user.email,
              accessToken: data.accessToken,
            };

          } else {
            console.log("No user in response data");
          }

          return null;

        } catch (error) {
          console.error("Auth error details:", error);

          if (axios.isAxiosError(error)) {
            console.error("Axios error response:", error.response?.data);
            console.error("Axios error status:", error.response?.status);
          }

          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Redirect callback - URL:', url, 'BaseURL:', baseUrl);

      // Después de login exitoso, siempre ir a overview
      if (url.includes('/api/auth/callback/credentials') ||
          url.includes('/api/auth/signin') ||
          url === baseUrl + '/login' ||
          url === '/login') {
        const overviewUrl = `${baseUrl}/overview`;
        console.log('Redirecting to overview:', overviewUrl);
        return overviewUrl;
      }

      // Permitir URLs relativas
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Permitir URLs del mismo origen
      if (url.startsWith(baseUrl)) return url;
      
      // Por defecto, ir a overview
      return `${baseUrl}/overview`;
    },
    async session({ session, token }) {
      console.log("Session callback called with token:", !!token);
      if (token) {
        (session as any).email = token.email as string;
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      console.log("JWT callback - trigger:", trigger);
      if (user) {
        token.email = (user as any).email;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    }
  }
});