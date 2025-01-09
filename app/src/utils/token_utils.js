import cookie from 'react-cookies';

import { TOKEN_NAME_REFRESH, TOKEN_NAME_ACCESS } from "../constants";
import { Request, POST } from '../requests';
import { REFRESH_TOKENS_URL } from '../requests/userRequests/profile';

export const checkTokenExist = () => {
	if (cookie.load(TOKEN_NAME_ACCESS)) {
		return true;
	} return false;
};

export const  writeTokens = async ({RefreshToken=null, AccessToken=null}) => {
	if (RefreshToken !== null && RefreshToken !== undefined) {
		cookie.save(TOKEN_NAME_REFRESH, RefreshToken, {path: '/'});
	}
	if (AccessToken !== null && AccessToken !== undefined) {
		cookie.save(TOKEN_NAME_ACCESS, AccessToken, {path: '/'});
	}
}

export const discardTokens = () => {
	cookie.remove(TOKEN_NAME_ACCESS);
	cookie.remove(TOKEN_NAME_REFRESH);
}

export const refreshTokens = async () => {
	let response = await Request.send({method: POST, url: REFRESH_TOKENS_URL, data: {"refresh": cookie.load(TOKEN_NAME_REFRESH)}})
	.then(
		response => {
			if (response.status === 200) {
				return response
			}
		}
	)
	let data = await response.json()
	console.log(data)
	if (data.access) {
		await writeTokens({AccessToken: data.access})
	} else {
		// discardTokens()
	}
	return response;
}
