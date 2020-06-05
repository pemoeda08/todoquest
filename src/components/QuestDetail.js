import React from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.css";
import "./QuestDetail.css"
import api from "./quest-api/QuestApi";
import { Link, Redirect } from "react-router-dom";
import { userAuthenticator as auther } from "./auth/UserAuthenticator";

function Comment({ commentator, comment_datetime, text }) {
    return (
        <div>
            <div className="title text-primary amber-text text-darken-4">
                {commentator.username}
            </div>
            <p style={{ marginBottom: "1%" }}>
                {text}
            </p>
            <p style={{
                textAlign: "end",
                color: "gray",
                fontSize: "13px"
            }}>
                {comment_datetime}
            </p>
        </div>
    );
}

function PartyMember({ username, date_joined }) {
    return (
        <div style={{
            border: "1px solid gray",
            boxSizing: "border-box",
            padding: "0px 5% 5% 5%"
        }}>
            <h6 className="text-primary amber-text text-darken-4">{username}</h6>
            <p>
                {"Registered since " + date_joined}
            </p>
        </div>
    );
}

function Button({ onClick, text, materialIcon }) {
    return (
        <button
            className="btn btn-small red white-text"
            onClick={(e) => {
                e.preventDefault();
                if (typeof onClick == 'function')
                    onClick(e);
            }}
        >
            {materialIcon ?
                <i className="material-icons left">{`${materialIcon}`}</i> : null}
            <span>
                {`${text}`}
            </span>
        </button>
    );
}

class QuestDetail extends React.Component {

    constructor(props) {
        super(props);
        const { match: { params: { id } } } = props
        this.state = {
            quest_info: null,
            comments: [],
            party: [],
            id: id,
            current_tab: "comments"
        };
    }

    componentDidMount() {
        this.tabs = M.Tabs.init(this.tabs);
        this.fetchQuestInfo();
    }

    async fetchComments() {
        const data = await api.fetchQuestComments(this.state.id);
        this.setState({
            comments: data || []
        });
    }

    async fetchQuestInfo() {
        const data = await api.fetchQuest(this.state.id);
        this.setState({
            quest_info: data
        });
    }

    async fetchParty() {
        const data = await api.fetchParty(this.state.id);
        console.log(data);
        this.setState({
            party: data || []
        });
    }

    async postNewComment(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        e.target.reset();
        const jsonBody = [...formData.keys()]
            .reduce((prev, curr) => {
                prev[curr] = formData.get(curr);
                return prev;
            }, {});
        await api.postNewComment(this.state.id, jsonBody);
        await this.fetchComments();
        this.commentList.scrollTo(0, this.commentList.scrollHeight);
    }

    componentWillUnmount() {
    }

    async deleteQuest() {
        const confirm = window.confirm("Are you sure?");
        if (!confirm) {
            return;
        }
        api.deleteQuest(this.state.id)
            .then((msg) => {
                alert(msg);
                this.setState({
                    id: null
                });
            })
            .catch(err => {
                console.error(err);
                alert("Oops, something is wrong");
            });
    }

    async leaveQuest() {
        const confirm = window.confirm("Are you sure?");
        if (!confirm) return;
        try {
            const result = await api.leaveQuest(this.state.id);
            alert(result);
            this.setState({
                id: null
            });
        } catch(e) {
            const message = e.message;
            alert(message);
        }
        
    }

    render() {
        if (!this.state.id) {
            return <Redirect to={"/"} />
        }
        let quest_info = !this.state.quest_info ? "Loading quest info" : (
            <div className="card" style={{ boxShadow: "none" }}>
                <div className="card-title amber-text text-darken-4">
                    {this.state.quest_info.title}
                </div>
                <p>{this.state.quest_info.description}</p>
            </div>
        );
        const buttonDeleteQuest = (() => {
            const quest_info = this.state.quest_info;
            if (!quest_info) return null;
            return (
                <div className="col push-s10">
                    {auther._user.userId === this.state.quest_info.client_id ?
                    <Button onClick={() => this.deleteQuest()} text={"DELETE QUEST"} materialIcon={"delete"}/> 
                    : <Button onClick={() => this.leaveQuest()} text={"LEAVE QUEST"} materialIcon={"meeting_room"}/>}
                </div>);
        })();

        const disabled = !this.state.quest_info;
        const comments = this.state.comments.length !== 0 ?
            <ul className="collection with-header" style={{
                maxHeight: "240px",
                overflowY: "scroll",
                scrollBehavior: "smooth"
            }} ref={(ul) => this.commentList = ul}>
                {this.state.comments.map(c => {
                    return (
                        <li className="collection-item" key={c.comment_id}>
                            <Comment
                                commentator={c.commentator}
                                comment_datetime={new Date(c.comment_datetime).toUTCString()}
                                text={c.text}
                            />
                        </li>)
                })}
            </ul> :
            <div className="center-align">{"Empty"}</div>;

        const party = this.state.party.length !== 0 ?
            <div className="row">
                {this.state.party.map((p, idx) => {
                    return (<div className="col s3" key={idx}>
                        <PartyMember
                            username={p.username}
                            date_joined={new Date(p.date_joined).toLocaleDateString()}
                        />
                    </div>)
                })}
            </div> :
            <div className="center-align">{"Empty"}</div>;

        return (
            <div style={{
                width: "80%",
                margin: "auto",
                display: "flex",
                padding: "3%",
                flexDirection: "column",
                justifyContent: "center",
                boxSizing: "border-box"
            }}>
                <div className="row" style={{
                    width: "100%"
                }}>
                    <div className="col s12">
                        <div className="card">
                            <div className="card-content">
                                <div className="row">
                                    <div className="col s12 row valign-wrapper">
                                        <div className="s1 col">
                                            <Link to={`/`}>
                                                <button type="button"
                                                    className="waves-effect waves-light btn btn-small center-align transparent black-text"
                                                    style={{ boxShadow: "none" }}
                                                >
                                                    <i className="material-icons">navigate_before</i>
                                                </button>
                                            </Link>
                                        </div>
                                        <div className="col s11">
                                            {quest_info}
                                        </div>
                                    </div>
                                    {buttonDeleteQuest}
                                </div>
                            </div>
                            <div className="card-tabs">
                                <ul className="tabs tabs-fixed-width" ref={(tabs) => this.tabs = tabs}>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-activity_log">Activity Log</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-tasks">Tasks</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-comments" onClick={() => this.fetchComments()}>Comments</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-party" onClick={() => this.fetchParty()}>Party</a></li>
                                </ul>
                            </div>
                            <div className="card-content grey lighten-4">
                                <div id="tab-activity_log">

                                </div>
                                <div id="tab-tasks">Tasks</div>
                                <div id="tab-comments">
                                    {comments}
                                    <div className="container row">
                                        <form className="col s12 offset-s3" onSubmit={(e) => this.postNewComment(e)}>
                                            <div className="row valign-wrapper">
                                                <div className="input-field col s11">
                                                    <i className="material-icons prefix">mode_edit</i>
                                                    <input type="text" name="text" id="input-comment" className="materialize-textarea" placeholder="Enter your comment..." />
                                                </div>
                                                <div className="col s1">
                                                    <button type="submit" className="waves-effect waves-light btn center-align amber darken-2">
                                                        <i className="material-icons">send</i>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div id="tab-party">
                                    {party}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default QuestDetail;