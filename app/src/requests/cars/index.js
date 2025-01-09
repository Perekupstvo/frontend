import { Request, _BASE_URL, GET } from "..";

export const CARS_BASE_URL = _BASE_URL + '/cars/';
export const BRANDS_LIST_URL = CARS_BASE_URL + 'brands/list/';
export const MODELS_LIST_URL = CARS_BASE_URL + 'models/list/';


/**
 * Запрос для списка марок машин
 */
export const getBrandsListRequest = async (params) => {
	return await Request.send({method: GET, url: BRANDS_LIST_URL, params: params});
};


/**
 * Запрос для списка моделей машин
 */
export const getModelsListRequest = async (params) => {
	return await Request.send({method: GET, url: MODELS_LIST_URL, params: params});
};
