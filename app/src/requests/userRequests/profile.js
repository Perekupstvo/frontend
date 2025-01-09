import { Request, GET, PATCH } from "..";

import { USER_BASE_URL } from ".";

export const USER_PROFILE_URL = USER_BASE_URL + 'profile/'
export const REFRESH_TOKENS_URL = USER_BASE_URL + 'token/refresh/'


/**
 * Запрос для получения данных профиля
 */
export const getProfileDataRequest = async () => {
	return await Request.send({method: GET, url: USER_PROFILE_URL,});
};


/**
 * Запрос для изменения данных профиля
 */
export const changeProfileDataRequest = (data) => {
	return Request.send({method: PATCH, url: USER_PROFILE_URL, data: data});
};
