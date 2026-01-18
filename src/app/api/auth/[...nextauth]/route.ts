// filepath: src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize(credentials, req) {
        // Tu dodaj logikę autoryzacji
        if (credentials?.username === "admin" && credentials?.password === "admin") {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ]
});

export { handler as GET, handler as POST };