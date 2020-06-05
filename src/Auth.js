import React from "react";
import M from "materialize-css";
import { userAuthenticator } from "./components/auth/UserAuthenticator";
import "materialize-css/dist/css/materialize.css";

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: false,
            message: null,
            authenticated: false,
            active: true
        };
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
                .then((message) => {
                    M.toast({ html: message, displayLength: 1500 });
                    //Return to App.js
                    if (this.props.onAuthenticated)
                        this.props.onAuthenticated();
                })
                .catch(err => {
                    const message = err.message;
                    M.toast({ html: `${message}`, displayLength: 1500 });
                    this.setState({
                        status: false,
                        message: message,
                        active: true
                    });
                })
        if (authType === "register")
            userAuthenticator.register(identity)
                .then((message) => {
                    M.toast({ html: message, displayLength: 1500 });
                    this.setState({
                        status: true,
                        message: message,
                        active: true
                    });
                })
                .catch(err => {
                    const message = err.message;
                    M.toast({ html: message, displayLength: 1500 });
                    this.setState({
                        status: false,
                        message: message,
                        active: true
                    })
                })
    }

    render() {
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