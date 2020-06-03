import React from "react";
import { Redirect } from "react-router-dom";
import M from "materialize-css";
import { userAuthenticator } from "./components/auth/UserAuthenticator";
import "materialize-css/dist/css/materialize.css";

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: false,
            message: null,
            shouldRedirect: false,
            active: true
        };
        this.redirectDelay = 1200;
        console.log(userAuthenticator._user);
    }

    componentDidMount() {
        M.Tabs.init(this.tabs);
    }

    /**
     * @param {FormData} form 
     * @param {string} authType 
     */
    auth(form, authType) {
        if (!["login", "register"].includes(authType))
            throw new RangeError(`invalid argument ${authType}. Must be either 'login' or 'register'`);
        const identity = [...form.keys()].reduce((prev, curr) => {
            prev[curr] = form.get(curr);
            return prev;
        }, {});
        if (authType === "login")
            userAuthenticator.login(identity)
                .then((status) => {
                    this.setState({
                        status: true,
                        message: "Authentication success",
                        active: false
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        status: false,
                        message: "Failed to login",
                        active: true
                    });
                })
        if (authType === "register")
            userAuthenticator.register(identity)
                .then((status) => {
                    this.setState({
                        status: true,
                        message: "Registration success",
                        active: false
                    });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        status: false,
                        message: "Registration failed",
                        active: true
                    })
                })
    }

    render() {
        if (userAuthenticator.isAuthenticated()) {
            return <Redirect to="/"/>
        }
        const message = this.state.message || "";
        const messageColor = this.state.status ? "green-text" : "red-text";
        if (this.state.shouldRedirect) {
            return <Redirect to="/" />
        }
        return (
            <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }} >
                <div className="row">
                    <div className="col s12" style={{ width: "100%" }}>
                        <div className="card center">
                            <div className="card-content">
                                <div className="card-title amber-text text-darken-4 center">
                                    To-Do Quest
                                </div>
                            </div>
                            <div className="card-tabs">
                                <ul className="tabs tabs-fixed-width" ref={(tabs) => { this.tabs = tabs }}>
                                    <li className="tab"><a className="active" href="#form__login">Login</a></li>
                                    <li className="tab"><a href="#form__register">Register</a></li>
                                </ul>
                            </div>
                            <div className="card-content grey lighten-4">
                                <div id="form__login">
                                    <div className="row">
                                        <div className="col s12">
                                            <p className={`${messageColor} center-align`}>
                                                {message}
                                            </p>
                                        </div>
                                    </div>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        this.auth(new FormData(e.target), "login");
                                    }}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input type="text"
                                                    id="txtLoginUsername" name="username" data-length="100"
                                                    ref={(txt) => { this.txtUsername = txt }} />
                                                <label htmlFor="txtLoginUsername">Username</label>
                                            </div>
                                            <div className="input-field col s12">
                                                <input type="password"
                                                    id="txtLoginPassword" name="password" data-length="250"
                                                    ref={(txt) => { this.txtPassword = txt }} />
                                                <label htmlFor="txtLoginPassword">Password</label>
                                            </div>
                                            <div className="input-field col s12 center">
                                                <button className={`btn waves-effect waves-light amber darken-4 
                                                    ${ !this.state.active ? "disabled":""}`}
                                                    type="submit"
                                                >
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div id="form__register">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        this.auth(new FormData(e.target), "register");
                                    }}>
                                        <div className="row">
                                            <div className="col s12">
                                                <p className={`${messageColor} center-align`}>
                                                    {message}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input type="text"
                                                    id="txtRegisterUsername" name="username" data-length="100"
                                                    ref={(txt) => { this.txtUsername = txt }} />
                                                <label htmlFor="txtRegisterUsername">Username</label>
                                            </div>
                                            <div className="input-field col s12">
                                                <input type="password"
                                                    id="txtRegisterPassword" name="password" data-length="250"
                                                    ref={(txt) => { this.txtPassword = txt }} />
                                                <label htmlFor="txtRegisterPassword">Password</label>
                                            </div>
                                            <div className="input-field col s12 center">
                                                <button
                                                    type="submit"
                                                    className={`btn waves-effect waves-light amber darken-4 
                                                        ${ !this.state.active ? "disabled" : ""}`}
                                                >
                                                    Register
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

}

export default Auth;