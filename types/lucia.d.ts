/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("../src/lib/auth").Auth;
  type DatabaseUserAttributes = {
    first_name: string;
    last_name: string;
    email_address: string;
  };
  type DatabaseSessionAttributes = {};
}
