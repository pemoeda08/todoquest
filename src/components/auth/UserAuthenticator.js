import User from "./User";

const prefix = "http://localhost:5000/users";

export const ApiPaths = {
    Login: `${prefix}/authenticate`,
    Register: `${prefix}/register`
}

export class UserAuthenticator {

    /** @type { User } */
    _user = null;

    /** @type { String } */
    _accessToken = null;

    constructor() {
        const storedUser = JSON.parse(localStorage.getItem("user"));
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
        try {
            const response = await fetch(prefix, {
                headers: !this._accessToken ? {} : { "Authorization": `Bearer ${this._accessToken}` }
            });
            if (response.status === 401) {
                this._accessToken = null;
                this._user = null;
                localStorage.setItem("user", null);
                localStorage.setItem("storedToken", null);
            }
        } catch (e) {
            this._accessToken = null;
            this._user = null;
            localStorage.setItem("user", null);
            localStorage.setItem("storedToken", null);
        }
    }

    async isAuthenticated() {
        return this._user && this._accessToken;
    }

}

export const userAuthenticator = new UserAuthenticator();