import { Request, GET, POST, DELETE, PATCH } from "..";

import { CARS_BASE_URL } from ".";

const VEHICLES = 'vehicles/'
const EXPENSES = 'expenses/'

export const OWN_CARS_LIST = CARS_BASE_URL + VEHICLES + 'list/'
export const OWN_CARS_RETRIEVE = CARS_BASE_URL + VEHICLES + 'retrieve/'
export const OWN_CARS_CREATE = CARS_BASE_URL + VEHICLES + 'create/'
export const OWN_CARS_UPDATE = CARS_BASE_URL + VEHICLES + 'update/'
export const OWN_CARS_DELETE = CARS_BASE_URL + VEHICLES + 'delete/'

export const OWN_EXPENSES_LIST = CARS_BASE_URL + EXPENSES + 'list/'
export const OWN_EXPENSES_CREATE = CARS_BASE_URL + EXPENSES + 'create/'
export const OWN_EXPENSES_DELETE = CARS_BASE_URL + EXPENSES + 'delete/'

export const USER_STATISTIC = CARS_BASE_URL + 'statistic/'


/**
 * Запрос для получения списка машин пользователя
 */
export const getOwnCarsListRequest = async (params) => {
	return await Request.send({method: GET, url: OWN_CARS_LIST, params: params});
};

/**
 * Запрос для получения данных машины
 */
export const getOwnCarsRetrieveRequest = async (car_id) => {
	return await Request.send({method: GET, url: OWN_CARS_RETRIEVE + `${car_id}/`});
};

/**
 * Запрос для создания машины
 */
export const createOwnCarRequest = async (data) => {
	return await Request.send({method: POST, url: OWN_CARS_CREATE, data: data});
};

/**
 * Запрос для обновления машины
 */
export const updateOwnCarRequest = async (car_id, data) => {
	return await Request.send({method: PATCH, url: OWN_CARS_UPDATE + `${car_id}/`, data: data});
};

/**
 * Запрос для удаления машины
 */
export const deleteOwnCarRequest = async (car_id) => {
	return await Request.send({method: DELETE, url: OWN_CARS_DELETE + `${car_id}/`});
};

/**
 * Запрос для получения списка затрат
 */
export const getExpensesListRequest = async (car_id) => {
	return await Request.send({method: GET, url: OWN_EXPENSES_LIST + `${car_id}/`});
};

/**
 * Запрос для создания затраты
 */
export const createExpensesRequest = async (data) => {
	return await Request.send({method: POST, url: OWN_EXPENSES_CREATE, data: data});
};

/**
 * Запрос для удаления затраты
 */
export const deleteExpensesRequest = async (car_id) => {
	return await Request.send({method: DELETE, url: OWN_EXPENSES_DELETE + `${car_id}/`});
};

/**
 * Запрос для получения статистики пользователя
 */
export const getUserStatisticRequest = async () => {
	return await Request.send({method: GET, url: USER_STATISTIC});
};
