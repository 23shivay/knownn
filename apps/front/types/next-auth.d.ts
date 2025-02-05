import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      sessionId:string
      isVerified?: boolean;
      organizationName?:string
      email:string
      gender?:string
    } & DefaultSession['user'];
  }

  interface User {
    sessionId:string
    isVerified?: boolean;
    organizationName?:string
    email?:string
    gender?:string
}

declare module 'next-auth/jwt' {
  interface JWT {
    sessionId:string
    isVerified?: boolean;
    organizationName?:string
    gender?:string
    email?:string
  }
}
}