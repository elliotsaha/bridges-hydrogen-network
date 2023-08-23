import { LuciaError } from "./error.js";
export const createAdapter = (adapter) => {
    if (!("user" in adapter))
        return adapter(LuciaError);
    let userAdapter = adapter.user(LuciaError);
    let sessionAdapter = adapter.session(LuciaError);
    if ("getSessionAndUser" in userAdapter) {
        const { getSessionAndUser: _, ...extractedUserAdapter } = userAdapter;
        userAdapter = extractedUserAdapter;
    }
    if ("getSessionAndUser" in sessionAdapter) {
        const { getSessionAndUser: _, ...extractedSessionAdapter } = sessionAdapter;
        sessionAdapter = extractedSessionAdapter;
    }
    return {
        ...userAdapter,
        ...sessionAdapter
    };
};
