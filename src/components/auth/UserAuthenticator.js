import User from "./User";

const prefix = "http://localhost:5000/users";

export const ApiPaths = {
    Login: `${prefix}/authenticate`,
    Register: `${prefix}/register`,
    TestToken: `${prefix}/test`
}

export class UserAuthenticator {

    /** @type { User } */
    _user = null;

    /** @type { String } */
    _accessToken = null;

    constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const storedToken = localStorage.getItem("storedToken");
        this._user = !storedUser ? null : new User(storedUser);
        this._accessToken = storedToken;
    }

    saveUserToStorage() {
        if (!this._user || !this._accessToken) return;
        localStorage.setItem("user", JSON.stringify(this._user.json));
        localStorage.setItem("storedToken", this._accessToken);
    }

    async login({ username, password }) {
        const response = await fetch(ApiPaths.Login, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        const data = await response.json();
        if (!response.status) {
            throw new Error(data.message);
        }
        this._user = new User(data.result);
        this._accessToken = data["access_token"];
        this.saveUserToStorage();
        // this._subscriber.forEach(async fn => await fn());
    }

    logout() {
        this.clearUserCache();
        window.location.reload(true);
    }

    clearUserCache() {
        this._accessToken = null;
        this._user = null;
        localStorage.setItem("user", null);
        localStorage.setItem("storedToken", null);
    }

    async register({ username, password, email = null }) {
        const response = await fetch(ApiPaths.Register, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
    }

    async ensureTokenValidity() {
        const response = await fetch(`${prefix}`, {
            method: "GET",
            headers: !this._accessToken ? {} : { "Authorization": `Bearer ${this._accessToken}` }
        });
        const data = await response.json();
        if (!data.status) {
            this.clearUserCache();
        }
    }

    async checkAuthentication() {
        await this.ensureTokenValidity();
        return this._accessToken && this._user;
    }

}

export const userAuthenticator = new UserAuthenticator();