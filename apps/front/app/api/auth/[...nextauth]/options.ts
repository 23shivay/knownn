// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import db from "@repo/db/client"
// import { v4 as uuidv4 } from 'uuid';


// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: 'credentials',
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: any): Promise<any> {
//         try {
//           const user = await db.user.findUnique({
//             where: {
//               email: credentials.identifier,
//             },
//           });
//           if (!user) {
//             throw new Error('No user found with this email');
//           }
//           if (!user.isVerified) {
//             throw new Error('Please verify your account before logging in');
//           }
//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error('Incorrect password');
//           }
//         } catch (err: any) {
//           throw new Error(err);
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.sessionId = uuidv4();
//         token.email = user.email;
//         token.isVerified = user.isVerified;
//         token.organizationName = user.organizationName;
//         token.gender = user.gender;

    
//       }
//       return token;
//     },
    
//     async session({ session, token }) {
//       if (token) {
//         session.user.sessionId = token.sessionId;
//         session.user.email = token.email;
//         session.user.isVerified = token.isVerified;
//         session.user.organizationName = token.organizationName;
//         session.user.gender = token.gender;
//       }
//       return session;
//     },
//   },

//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/sign-in',
//   },
// };




import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '@repo/db/client';
import { v4 as uuidv4 } from 'uuid';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.identifier,
            },
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sessionId = uuidv4();
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.organizationName = user.organizationName;
        token.gender = user.gender;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        sessionId: token.sessionId,
        email: token.email,
        isVerified: token.isVerified,
        organizationName: token.organizationName,
        gender: token.gender,
      };
      return session;
    },

    // This callback is responsible for redirection after sign-in
    async redirect({ url, baseUrl }) {
      // If the user is successfully authenticated, redirect to the home page
      if (url === '/sign-in') {
        return baseUrl; // Redirect to the home page ("/")
      }
      return url;
    },
  },

  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in', // Specify your custom sign-in page
  },
};
