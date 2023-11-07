import 'dotenv/config';

export const getApiKey = () => {
    return process.env.API_KEY ?? '';
};

export const getApiHostname = () => {
    return process.env.API_HOSTNAME ?? 'api.cnaught.com';
};
