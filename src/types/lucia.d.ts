/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('../lib/auth').Auth;
  type DatabaseUserAttributes = {
    first_name: string;
    last_name: string;
    email_address: string;
    email_verified: boolean;
  };
  type DatabaseSessionAttributes = {};
}
