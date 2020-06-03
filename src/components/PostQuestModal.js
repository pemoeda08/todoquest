import React from "react";
import "materialize-css/dist/css/materialize.css";
import M from "materialize-css";
import questApi from "./quest-api/QuestApi";

class PostQuestModal extends React.Component {

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

    postNewQuest(form) {
        const formData = new FormData(form);
        const questTitle = formData.get("title");
        const questDescription = formData.get("description");

        if (questTitle.length > 100) {
            alert("Title cannot be longer than 100");
            return;
        }
        if (questDescription.length > 200) {
            alert("Description cannot be longer than 200");
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
        questApi.postNewQuest(body)
            .then(res => {
                this.modalInstance.close();
                if (typeof this.props.onPosted == 'function')
                    this.props.onPosted(res);
                form.reset();
                this.setState({
                    isDisabled: false
                });
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
            <div>
                <div className="modal" id="modal1" ref={(modal) => this.modal = modal}>
                    <div className="modal-content">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            this.postNewQuest.bind(this)(e.target);
                        }}>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text"
                                        id="txtQuestTitle" name="title" data-length="100"
                                        ref={(txt) => { this.txtQuestTitle = txt }} />
                                    <label htmlFor="txtQuestTitle">Quest Title</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input type="text" id="txtQuestDescription" name="description"
                                        ref={(txt) => { this.txtQuestDescription = txt }}
                                    />
                                    <label htmlFor="txtQuestDescription">Quest Description</label>
                                </div>
                            </div>
                            <div className="row center-align">
                                <button
                                    className={`waves-effect waves-light btn amber darken-4 ${this.state.isDisabled ? "disabled" : ""}`}
                                    type="submit">
                                    Post
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "320px",
                    height: "80%",
                }}>
                    <div className="card-content amber-text text-darken-4 modal-trigger" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer"
                    }} onClick={() => { this.setState({ openPostQuestDialog: true }) }} href="#modal1">
                        <i className="material-icons">add</i>
                        <span>Post New Quest</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default PostQuestModal;