import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
      tenantId: process.env.MICROSOFT_TENANT_ID,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Azure AD sometimes doesn't return user.email directly, so we check profile fields too
      const email = (user.email || (profile as any)?.email || (profile as any)?.preferred_username || (profile as any)?.upn)?.toLowerCase();
      
      console.log('Login attempt with email:', email, 'Raw profile:', profile);
      
      // Restrict access to a specific Microsoft account
      if (email === "purvesh.h@smalsus.com") {
        return true;
      } else {
        // Return false to display a default error message
        console.log('Access Denied for:', email);
        return false;
      }
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
