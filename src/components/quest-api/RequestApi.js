import { userAuthenticator as auther } from "../auth/UserAuthenticator";

export default class RequestApi {

    /**
     * @param { string } url 
     * @param {*} param1 
     */
    async makeRequest(url, { method = "GET", body = {} }) {
        if (typeof body == 'object') {
            body = JSON.stringify(body);
        }
        return fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${auther._accessToken}`
            },
            method: method,
            body: ["GET", "HEAD"].some(x => x === method) ? null : body
        });
    }
}