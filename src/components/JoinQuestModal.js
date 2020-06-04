import React from "react";
import M from "materialize-css";
import { userAuthenticator as auther } from "./auth/UserAuthenticator";
import questApi from "./quest-api/QuestApi";

class JoinQuestModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDisabled: false
        };
    }

    componentDidMount() {
        this.modalInstance = M.Modal.init(this.modal, {

        });
        if (this.props.isOpen) {
            this.modalInstance.open();
        }
        else {
            this.modalInstance.close();
        }
    }

    joinQuest(form) {
        const formData = new FormData(form);
        const questKey = formData.get("quest_key");

        if (questKey.length == 0) {
            alert("Quest key cannot be empty");
            return;
        }

        const keys = [...formData.keys()]
        const body = keys
            .reduce((prev, curr) => {
                prev[curr] = formData.get(curr);
                return prev;
            }, {});
        this.setState({
            isDisabled: true
        });
        questApi.joinQuest(body)
            .then(res => {
                this.modalInstance.close();
                form.reset();
                this.setState({
                    isDisabled: false
                });
                alert(res);
            })
            .catch(err => {
                console.error(err);
                this.setState({
                    isDisabled: false
                })
            });
    }

    render() {
        return (
            <div className="col push-s3">
                <div className="modal" id="modal2" ref={(modal) => this.modal = modal}>
                    <div className="modal-content">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            this.joinQuest(e.target);
                        }}>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text" name="quest_key" id="txtQuestKey"
                                        ref={(txt) => { this.txtQuestKey = txt }}
                                    />
                                    <label htmlFor="txtQuestKey">Quest Key</label>
                                </div>
                            </div>
                            <div className="row center-align">
                                <button
                                    className={`waves-effect waves-light btn amber darken-4 ${this.state.isDisabled ? "disabled" : ""}`}
                                    type="submit">
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
                            onClick={() => { }}
                            href="#modal2">
                            <i className="material-icons">people</i>
                            <span>Join Quest</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default JoinQuestModal;