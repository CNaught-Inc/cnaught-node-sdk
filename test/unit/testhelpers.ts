import { AxiosError } from 'axios';

export const fakeAxiosError = {
    name: 'error',
    message: 'message',
    config: {},
    response: { status: 404, config: {}, data: {}, statusText: 'text', headers: {} }
};

export const setupFakeApiError = (
    statusCode: number,
    title: string,
    type?: string,
    detail?: string
): AxiosError => ({
    config: null,
    code: statusCode.toString(),
    request: {},
    response: {
        data: {
            title: title,
            type: type,
            detail: detail
        },
        status: statusCode,
        statusText: 'Failed',
        headers: null,
        config: null
    },
    name: 'axiosError',
    message: 'fake error',
    isAxiosError: true
}) as AxiosError;

export const setupFakeInvalidStateError = (): AxiosError => {
    const err = setupFakeApiError(409,
        'Order is in invalid state',
        'https://api.cnaught.com/v1/errors/invalid-parameters',
        'Order is in invalid state to cancel'
    );
    err.response.data.allowed_values = ['transcribed'];
    err.response.data.current_value = 'failed';
    return err;
};

export const setupFakeInvalidParametersError = (): AxiosError => {
    const err = setupFakeApiError(400,
        'Your request parameters didn\'t validate',
        'https://api.cnaught.com/v1/errors/invalid-parameters'
    );
    err.response.data.parameters = {
        'media_url': [
            'The media_url field is required'
        ]
    };
    return err;
};
