import React from "react";
import { userAuthenticator } from "./auth/UserAuthenticator";

class LogoutModal extends React.Component {

    render() {
        return (
            <div className="col push-s3">
                <div className="col s12 push-s4">
                    <div className="card" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer"
                    }}>
                        <div className="card-content amber-text text-darken-4 modal-trigger"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "80%",
                            }}
                            onClick={() => { userAuthenticator.logout(); }}
                            href="#modal2">
                            <i className="material-icons">meeting_room</i>
                            <span>Log out</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LogoutModal;