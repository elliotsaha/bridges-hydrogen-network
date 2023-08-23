import { isWithinExpiration } from "../utils/date.js";
export const isValidDatabaseSession = (databaseSession) => {
    return isWithinExpiration(databaseSession.idle_expires);
};
