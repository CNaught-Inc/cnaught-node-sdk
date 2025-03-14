import { ApiRequestHandler } from '../../src/api-request-handler.js';

import { enableFetchMocks } from 'jest-fetch-mock';
import {
    CNaughtError,
    forbiddenProblemType,
    invalidParametersProblemType
} from '../../src/models/index.js';
enableFetchMocks();

import { version } from '../../src/version.js';

describe('api-client', () => {
    let sut: ApiRequestHandler;

    afterEach(() => fetchMock.resetMocks());

    beforeEach(() => {
        sut = new ApiRequestHandler('https://example.com', 'TESTKEY');
    });

    describe('makeApiGetRequest', () => {
        it('composes url and returns response', async () => {
            const fakeResponse = {
                data: 'XYZ'
            };
            fetchMock.mockOnce(JSON.stringify(fakeResponse));

            const res = await sut.makeApiGetRequest<typeof fakeResponse>(
                '/somepath'
            );

            expect(res).toEqual(fakeResponse);
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][0]).toEqual(
                'https://example.com/somepath'
            );
        });

        it('sets default headers and method', async () => {
            fetchMock.mockOnce(JSON.stringify({}));

            await sut.makeApiGetRequest('/somepath');

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][1]).toEqual({
                headers: {
                    Authorization: 'Bearer TESTKEY',
                    'User-Agent': `CNaught-NodeSDK/${version}`
                },
                method: 'GET',
                mode: 'cors'
            });
        });

        it('passes additional params when used', async () => {
            fetchMock.mockOnce(JSON.stringify({}));

            await sut.makeApiGetRequest('/somepath', {
                subaccountId: 'MY-SUBACCOUNT',
                extraRequestOptions: {
                    next: { revalidate: 1000 }
                }
            });

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][1]).toEqual({
                headers: {
                    Authorization: 'Bearer TESTKEY',
                    'User-Agent': `CNaught-NodeSDK/${version}`,
                    'X-Subaccount-Id': 'MY-SUBACCOUNT'
                },
                method: 'GET',
                mode: 'cors',
                next: {
                    revalidate: 1000
                }
            });
        });

        it('throws error responses with correct details for simple error', async () => {
            const forbiddenProblemDetails = {
                type: forbiddenProblemType,
                title: 'User is not allowed to use subaccounts. Contact support to request access.',
                status: 403
            };
            fetchMock.mockOnce(JSON.stringify(forbiddenProblemDetails), {
                status: 403
            });

            try {
                await sut.makeApiGetRequest('/somepath', {
                    subaccountId: 'MY-SUBACCOUNT',
                    extraRequestOptions: {
                        next: { revalidate: 1000 }
                    }
                });
                throw new Error('expected to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(CNaughtError);
                const cnaughtErr = err as CNaughtError;
                expect(cnaughtErr.status).toEqual(403);
                expect(cnaughtErr.problemDetails).toEqual(
                    forbiddenProblemDetails
                );
            }
        });

        it('throws error responses with correct details for validation error', async () => {
            const invalidParamsProblemDetails = {
                type: invalidParametersProblemType,
                title: 'Parameters failed to validate',
                status: 400,
                errors: {
                    someField: ['Some message']
                }
            };
            fetchMock.mockOnce(JSON.stringify(invalidParamsProblemDetails), {
                status: 400
            });

            try {
                await sut.makeApiGetRequest('/somepath', {
                    subaccountId: 'MY-SUBACCOUNT',
                    extraRequestOptions: {
                        next: { revalidate: 1000 }
                    }
                });
                throw new Error('expected to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(CNaughtError);
                const cnaughtErr = err as CNaughtError;
                expect(cnaughtErr.status).toEqual(400);
                expect(cnaughtErr.problemDetails).toEqual(
                    invalidParamsProblemDetails
                );
            }
        });
    });

    describe('makeApiPostRequest', () => {
        it('composes url, sends body and returns response', async () => {
            const fakeResponse = {
                data: 'XYZ'
            };
            fetchMock.mockOnce(JSON.stringify(fakeResponse));
            const fakeReq = {
                data: 'ABC'
            };

            const res = await sut.makeApiPostRequest<typeof fakeResponse>(
                '/postpath',
                fakeReq
            );

            expect(res).toEqual(fakeResponse);
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][0]).toEqual(
                'https://example.com/postpath'
            );
            expect(fetchMock.mock.calls[0][1]).toEqual({
                headers: {
                    Authorization: 'Bearer TESTKEY',
                    'User-Agent': `CNaught-NodeSDK/${version}`,
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(fakeReq),
                mode: 'cors'
            });
        });

        it('passes additional params when used', async () => {
            fetchMock.mockOnce(JSON.stringify({}));

            await sut.makeApiPostRequest('/postpath2', null, {
                subaccountId: 'MY-SUBACCOUNT',
                idempotencyKey: 'MY-IDEMPOTENCY-KEY',
                extraRequestOptions: {
                    next: { revalidate: 1000 }
                }
            });

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][1]).toEqual({
                headers: {
                    Authorization: 'Bearer TESTKEY',
                    'User-Agent': `CNaught-NodeSDK/${version}`,
                    'X-Subaccount-Id': 'MY-SUBACCOUNT',
                    'Idempotency-Key': 'MY-IDEMPOTENCY-KEY'
                },
                method: 'POST',
                mode: 'cors',
                next: {
                    revalidate: 1000
                }
            });
        });

        it('throws error responses with correct details for simple error', async () => {
            const forbiddenProblemDetails = {
                type: forbiddenProblemType,
                title: 'User is not allowed to use subaccounts. Contact support to request access.',
                status: 403
            };
            fetchMock.mockOnce(JSON.stringify(forbiddenProblemDetails), {
                status: 403
            });

            try {
                await sut.makeApiPostRequest('/somepath', null, {
                    subaccountId: 'MY-SUBACCOUNT',
                    extraRequestOptions: {
                        next: { revalidate: 1000 }
                    }
                });
                throw new Error('expected to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(CNaughtError);
                const cnaughtErr = err as CNaughtError;
                expect(cnaughtErr.status).toEqual(403);
                expect(cnaughtErr.problemDetails).toEqual(
                    forbiddenProblemDetails
                );
            }
        });

        it('throws error responses with correct details for validation error', async () => {
            const invalidParamsProblemDetails = {
                type: invalidParametersProblemType,
                title: 'Parameters failed to validate',
                status: 400,
                errors: {
                    someField: ['Some message']
                }
            };
            fetchMock.mockOnce(JSON.stringify(invalidParamsProblemDetails), {
                status: 400
            });

            try {
                await sut.makeApiPostRequest('/somepath', null, {
                    subaccountId: 'MY-SUBACCOUNT',
                    extraRequestOptions: {
                        next: { revalidate: 1000 }
                    }
                });
                throw new Error('expected to throw');
            } catch (err) {
                expect(err).toBeInstanceOf(CNaughtError);
                const cnaughtErr = err as CNaughtError;
                expect(cnaughtErr.status).toEqual(400);
                expect(cnaughtErr.problemDetails).toEqual(
                    invalidParamsProblemDetails
                );
            }
        });
    });

    describe('makeApiDeleteRequest', () => {
        it('composes url and returns JSON response', async () => {
            const fakeResponse = {
                data: 'XYZ'
            };
            fetchMock.mockOnce(JSON.stringify(fakeResponse));

            const res = await sut.makeApiDeleteRequest<typeof fakeResponse>(
                '/somepath'
            );

            expect(res).toEqual(fakeResponse);
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][0]).toEqual(
                'https://example.com/somepath'
            );
            expect(fetchMock.mock.calls[0][1]?.method).toEqual('DELETE');
        });

        it('handles 204 No Content response', async () => {
            // Create a mock Response object with status 204
            const mockResponse = new Response(null, { status: 204 });
            // Use mockImplementationOnce to return our custom response
            fetchMock.mockImplementationOnce(() =>
                Promise.resolve(mockResponse)
            );

            const res = await sut.makeApiDeleteRequest<any>('/somepath');

            expect(res).toBeUndefined();
            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][0]).toEqual(
                'https://example.com/somepath'
            );
            expect(fetchMock.mock.calls[0][1]?.method).toEqual('DELETE');
        });

        it('sets headers from request options', async () => {
            const fakeResponse = { success: true };
            fetchMock.mockOnce(JSON.stringify(fakeResponse));

            const requestOptions = {
                headers: { 'X-Custom-Header': 'test-value' }
            };

            await sut.makeApiDeleteRequest('/somepath', requestOptions);

            expect(fetchMock.mock.calls.length).toEqual(1);
            expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
                'X-Custom-Header': 'test-value',
                Authorization: 'Bearer TESTKEY',
                'User-Agent': `CNaught-NodeSDK/${version}`
            });
        });
    });
});
