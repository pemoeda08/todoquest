export default class User {

    constructor(json) {
        this.json = json;
    }

    get userId() {
        return !this.json["user_id"] ? null : Number(this.json["user_id"]);
    }

    get username() {
        const username = this.json["username"];
        return username;
    }

    get dateJoined() {
        return !this.json["date_joined"] ? null : Date(this.json["date_joined"]);
    }

    get lastLogin() {
        return !this.json["last_login"] ? null : Date(this.json["last_login"]);
    }

    get email() {
        /** @type { string } */
        const email = this.json["email"];
        return email;
    }

    set email(val) {
        this.json["email"] = val;
    }
}