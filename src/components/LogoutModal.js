import React from "react";
import { userAuthenticator } from "./auth/UserAuthenticator";

class LogoutModal extends React.Component {

    logout() {
        const confirm = window.confirm("Are you sure?");
        if (!confirm) return;
        userAuthenticator.logout();
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-content valign-wrapper amber-text text-darken-4 modal-trigger"
                        style={{ height: "60px", cursor: "pointer"}}
                        onClick={() => { this.logout() }}
                        href="#modal2">
                        <i className="material-icons">meeting_room</i>
                        <span>Log out</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogoutModal;