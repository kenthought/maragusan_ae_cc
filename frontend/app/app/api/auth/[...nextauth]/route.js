import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Cookies from "js-cookie";
import { cookies } from "next/headers";

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
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
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
          const tokenParts = JSON.parse(atob(user.refresh.split(".")[1]));
          cookies().set({
            name: "refresh_token",
            value: user.refresh,
            httpOnly: false,
            path: "/",
            sameSite: "strict",
          });

          cookies().set({
            name: "access_token",
            value: user.refresh,
            httpOnly: false,
            path: "/",
            sameSite: "strict",
          });

          if (tokenParts.is_admin == true) {
            cookies().set({
              name: "permissions",
              value: JSON.stringify({ admin: true }),
              httpOnly: false,
              path: "/",
              sameSite: "strict",
            });
          } else {
            const permission = await fetch(
              "http://127.0.0.1:8000/api/user_permissions/" +
                tokenParts.user_id,
              {
                method: "GET",
                headers: {
                  Authorization: "JWT " + user.access,
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              }
            );

            const resp = await permission.json();
            if (resp.permissions) {
              cookies().set({
                name: "permissions",
                value: resp.permissions,
                httpOnly: false,
                path: "/",
                sameSite: "strict",
              });
            } else return null;
          }

          return {
            id: tokenParts.user_id.toString(),
            name: [tokenParts.name, tokenParts.user_id, tokenParts.is_admin],
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
