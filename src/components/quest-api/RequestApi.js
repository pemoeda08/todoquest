import { userAuthenticator as auther } from "../auth/UserAuthenticator";

export default class RequestApi {

    constructor() {
        if (!auther._user || !auther._accessToken)
            throw new Error("User has ne been authenticated");
        this._token = auther._accessToken;
    }

    /**
     * 
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
                "Authorization": `Bearer ${this._token}`
            },
            method: method,
            body: ["GET", "HEAD"].some(x => x === method) ? null : body
        });
    }
}