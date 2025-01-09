import { Request, _BASE_URL, POST } from "..";

export const USER_BASE_URL = _BASE_URL + '/users/';
export const USER_REGISTRATION_URL = USER_BASE_URL + 'auth/register/'
export const USER_LOGIN_URL = USER_BASE_URL + 'auth/token/'


/**
 * Запрос для регистрации
 *
 * @param {map} data - {username: string, password: string}
 */
export const userRegistrationRequest = (data) => {
	return Request.send({method: POST, url: USER_REGISTRATION_URL, data: data});
};

/**
 * Запрос для логина
 *
 * @param {map} data - {email: string, password: string}
 */
export const userLoginRequest = (data) => {
	return Request.send({method: POST, url: USER_LOGIN_URL, data: data});
};