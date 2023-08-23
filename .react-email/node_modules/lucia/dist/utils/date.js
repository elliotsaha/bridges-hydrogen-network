export const getTimeAfterSeconds = (seconds) => {
    return new Date().getTime() + 1000 * seconds;
};
export const isWithinExpiration = (expiresInMs) => {
    const currentTime = Date.now();
    if (currentTime > expiresInMs)
        return false;
    return true;
};
