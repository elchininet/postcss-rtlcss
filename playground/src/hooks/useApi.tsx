import { useState, useEffect, useCallback, useMemo } from 'react';
import { FetchOptions } from '@types';

interface UseApiProps {
    token: string;
    fetchCode: string;
    fetchOptions: FetchOptions;
    ready: boolean;
    canShare: boolean;
    share: (code: string, options: string) => void;
}

interface FetchApiOptions {
    method: 'POST' | 'GET';
    headers: Record<string, string>;
    body?: string;
}

interface FetchResponse {
    token?: string;
    success?: boolean;
    done?: boolean;
    id?: string;
    code?: string;
    options?: string;
}

const endpoint = 'https://xprimiendo.com/snippet';

const fetchApi = (data?: Record<string, string>): Promise<FetchResponse> => {

    const options: FetchApiOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    if (data) {
        const body = Object.entries(data)
            .map(([key, value]): string => `${key}=${encodeURIComponent(value)}`)
            .join('&');
        options.body = body;
    }

    return new Promise((resolve, reject) => {
        fetch(endpoint, options)
            .then(result => {
                if (result.ok) {
                    result
                        .json()
                        .then(data => resolve(data));
                } else {
                    result
                        .text()
                        .then(data => reject(data));
                }
            })
            .catch(() => {
                reject(null);
            });
    });
};

const getToken = () => new Promise((resolve, reject) => {
    fetchApi()
        .then((data: FetchResponse) => {
            if (data.success && data.token) {
                resolve(data.token);
            } else {
                reject();
            }
        })
        .catch(() => reject());
});

const getCode = (
    code: string,
    options: string,
    token: string
) => new Promise((resolve, reject) => {
    fetchApi({code, options, token})
        .then((data: FetchResponse) => {
            if (data.success && data.id) {
                resolve(data.id);
            } else {
                reject();
            }
        })
        .catch(() => {
            console.log('Error sharing code');
        });
});

export const useApi = (): UseApiProps => {

    const [ id, setId ] = useState<string>(null);
    const [ token, setToken ] = useState<string>(null);
    const [ fetchCode, setFetchCode ] = useState<string>(null);
    const [ fetchOptions, setFetchOptions ] = useState<FetchOptions>(null);
    const [ ready, setReady ] = useState(false);

    const canShare = useMemo(() => {
        const UNDEFINED_TYPE = 'undefined';
        const FUNCTION_TYPE = 'function';
        if (process.env.NODE_ENV === 'development') return true;
        return (
            typeof window !== UNDEFINED_TYPE &&
            typeof window.fetch === FUNCTION_TYPE &&
            typeof window.location !== UNDEFINED_TYPE &&
            typeof window.history !== UNDEFINED_TYPE &&
            typeof navigator !== UNDEFINED_TYPE &&
            typeof navigator.clipboard !== UNDEFINED_TYPE &&
            typeof navigator.clipboard.writeText === FUNCTION_TYPE
        );
    }, []);

    const share = useCallback((code: string, options: string): void => {
        if (token) {
            getCode(code, options, token)
                .then((id: string) => {
                    history.replaceState('', '', `#${id}`);
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                    }                    
                })
                .catch(() => {
                    setToken(null);
                });
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            if (
                typeof window !== 'undefined' &&
                window.location &&
                window.location.hash
            ) {
                setId(window.location.hash.slice(1));
            } else {
                setReady(true);
            }
        } else {
            getToken()
                .then((newToken: string) => {
                    setToken(newToken);
                })
                .catch(() => setReady(true));
        }        
    }, [token]);

    useEffect(() => {
        if (id && token) {
            fetchApi({id, token})
                .then((data: FetchResponse) => {
                    if (
                        data.success &&
                        data.code
                    ) {
                        setFetchCode(data.code);
                        if (data.options) {
                            try {
                                const jsonOptions = JSON.parse(data.options) as FetchOptions;
                                setFetchOptions(jsonOptions);
                            } catch {
                                console.error('Wrong options retrieved');
                            }
                        }
                    }
                    setReady(true);
                })
                .catch(() => setReady(true));
        }
    }, [id, token]);
    
    return {
        canShare,
        token,
        fetchCode,
        fetchOptions,
        ready,
        share
    };

};