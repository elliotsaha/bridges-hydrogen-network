export const createKeyId = (providerId, providerUserId) => {
    if (providerId.includes(":")) {
        throw new TypeError("Provider id must not include any colons (:)");
    }
    return `${providerId}:${providerUserId}`;
};
