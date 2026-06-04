module.exports = {
    PORT: Number(process.env.PORT) || 3000,

    PING_TIMEOUT: Number(process.env.PING_TIMEOUT) || 60000,

    PING_INTERVAL: Number(process.env.PING_INTERVAL) || 25000,

    DISCONNECT_TIMEOUT: Number(process.env.DISCONNECT_TIMEOUT) || 30000,

    DISCONNECT_CHECK_INTERVAL:
        Number(process.env.DISCONNECT_CHECK_INTERVAL) || 5000,
};
