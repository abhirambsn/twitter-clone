import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.tag = session.user.name
        .split(" ")
        .join("")
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLocaleLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },
  secret: process.env.JWT_SECRET
});
