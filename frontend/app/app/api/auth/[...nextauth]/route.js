import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import Cookies from "js-cookie";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // This is were you can put your own external API call to validate Email and Password
      authorize: async (credentials) => {
        // Add logic here to look up the user from the credentials supplied

        //const response = await fetch(process.env.API_URL + "token/", {
        const response = await fetch("http://13.211.204.121/token/", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });

        // const response = await axios.post(process.env.API_URL + "token/", {
        //   method: "POST",
        //   body: JSON.stringify(credentials),
        //   headers: { "Content-Type": "application/json" },
        // });

        const user = await response.json();
        // const cookies = new Cookies();
        // If no error and we have user data, return it
        if (response.ok && user) {
          // Cookies.set("access_token", user.access, {
          //   domain: "http://localhost:3000",
          //   httpOnly: true,
          //   path: "/",
          //   sameSite: "strict",
          // });
          // Cookies.set("refresh_token", user.refresh, {
          //   domain: "http://localhost:3000",
          //   httpOnly: true,
          //   path: "/",
          //   sameSite: "strict",
          // });

          const tokenParts = JSON.parse(atob(user.refresh.split(".")[1]));

          return {
            id: tokenParts.user_id.toString(),
            name: [tokenParts.name, tokenParts.user_id],
            email: tokenParts.email + ";" + user.access + ";" + user.refresh,
          };
        }
        // Return null if user data could not be retrieved
        return null;
      },
      session: {
        strategy: "jwt",
      },
      jwt: {
        secret: process.env.NEXTAUTH_SECRET,
      },
      callbacks: {
        async jwt({ token, user, trigger }) {
          console.log("jwt user", user);
          if (user) {
            token.uid = user.id;
          }
          return token;
        },
        async session({ session, token }) {
          console.log("session user", user);
          if (session?.user) {
            session.user.id = user.id;
          }
          return session;
        },
      },
    }),
    // ...add more providers here
  ],
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
