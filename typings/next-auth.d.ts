import 'next-auth';
import 'next-auth/jwt';

/**
 * Module augmentation for `next-auth` types.
 * Allows us to add custom properties to the `session` object and keep type
 * safety.
 *
 * @see https://authjs.dev/getting-started/typescript#module-augmentation
 * */
declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    orgId: string;
  }

  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: User;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** User ID */
    id: string;
    name: string;
    email: string;
    orgId: string;
  }
}

declare module '@auth/core/adapters' {
  interface AdapterUser {
    orgId: string;
    avatarUrl: string;
  }
}
