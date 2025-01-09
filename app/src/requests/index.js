import cookie from 'react-cookies'

import { ShowAlert } from '../utils/alerts_utils';
import { refreshTokens, discardTokens } from '../utils/token_utils';

import { BACKEND_BASE_URL_API, TOKEN_TYPE, TOKEN_NAME_ACCESS } from "../constants"

export const _BASE_URL = BACKEND_BASE_URL_API;

export const POST = 'POST';
export const GET = 'GET';
export const DELETE = 'DELETE';
export const PATCH = 'PATCH';

export class _Request {
    async send({method, url, params = {}, data = {}}) {
        try {
            url = this.getFullUrl(url, params);
            let token = cookie.load(TOKEN_NAME_ACCESS);
            
            let headers = {
                'Authorization': token ? `${TOKEN_TYPE} ${token}` : '',
            };

            if (!(data instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
                data = JSON.stringify(data);
            }

            let response = await fetch(url, {
                method: method,
                body: method === GET ? undefined : data,
                headers: headers
            });

            if (response.status === 401) {
                const refreshResponse = await refreshTokens();
                if (refreshResponse.status === 200) {
                    token = cookie.load(TOKEN_NAME_ACCESS);
                    headers['Authorization'] = token ? `${TOKEN_TYPE} ${token}` : '';

                    response = await fetch(url, {
                        method: method,
                        body: method === GET ? undefined : data,
                        headers: headers
                    });
                } else {
                    discardTokens();
                }
            }

            return response;
        } catch (error) {
            ShowAlert.error({message: `Произошла неизвестная ошибка: \n ${error}`});
        }
    };

    paramsToString(params) {
        return new URLSearchParams(params).toString();
    };

    getFullUrl(url, params) {
        params = this.paramsToString(params);
        return url + (params ? `?${params}` : '');
    };
}

export const Request = new _Request();
