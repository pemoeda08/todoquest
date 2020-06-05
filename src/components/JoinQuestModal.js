import React from "react";
import M from "materialize-css";
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

    async joinQuest(form) {
        const formData = new FormData(form);
        const questKey = formData.get("quest_key");

        if (questKey.length === 0) {
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

        try {
            await questApi.joinQuest(body);
            this.modalInstance.close();
            if (this.props.onQuestJoined) {
                this.props.onQuestJoined();
            }
        } catch (err) {
            this.setState({
                isDisabled: false,
                errorMessage: err.message
            });
        }

    }

    render() {
        return (
            <div>
                <div className="modal" id="modalJoinQuest" ref={(modal) => this.modal = modal}>
                    <div className="modal-content">
                        <div className="row">
                            <div className="col s12 red-text center-align">
                                <span>{`${this.state.errorMessage || ""}`}</span>
                            </div>
                        </div>
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
                            href="#modalJoinQuest">
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