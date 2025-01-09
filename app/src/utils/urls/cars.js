const _my_car_id = ':my_car_id'

export const MYCARS = '/mycars'
export const MYCARS_CREATE = MYCARS + '/create'
export const MYCARS_VIEW = MYCARS + `/${_my_car_id}/`
export const STATISTIC = '/statistic'

export const getMyCarViewUrl = (my_car_id) => {
    return MYCARS_VIEW.replace(_my_car_id, my_car_id)
}
