export declare const parseCookie: (str: string) => Record<string, string>;
export type CookieAttributes = Partial<{
    domain: string;
    encode: (value: string) => string;
    expires: Date;
    httpOnly: boolean;
    maxAge: number;
    path: string;
    priority: "low" | "medium" | "high";
    sameSite: true | false | "lax" | "strict" | "none";
    secure: boolean;
}>;
type CookieSerializeOptions = CookieAttributes;
export declare const serializeCookie: (name: string, val: string, options?: CookieSerializeOptions) => string;
export {};
