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

function Task({ detail, options }) {
    const opts = options || {};
    const hasDeleteButton = Boolean(opts.hasDeleteButton);
    const onDelete = opts.onDelete;
    const onCheck = opts.onCheck;
    const onUncheck = opts.onUncheck;
    const deleteButton = hasDeleteButton ?
        <div className="col s1">
            <button
                onClick={() => {
                    if (typeof onDelete === 'function')
                        onDelete(detail);
                }}
                className="btn black waves-effect waves-light white" style={{ boxShadow: "none" }}>
                <i className="material-icons red-text">delete</i>
            </button>
        </div> :
        null;
    const checkButton = Boolean(detail.is_done) ?
        <div className="col s1">
            <button
                onClick={() => {
                    detail.is_done = false;
                    if (typeof onCheck === 'function')
                        onUncheck(detail);
                }}
                className="btn black waves-effect waves-light white done" style={{ boxShadow: "none" }}>
                <i className="material-icons black-text">check_circle</i>
            </button>
        </div> :
        <div className="col s1">
            <button
                onClick={() => {
                    detail.is_done = true;
                    if (typeof onCheck === 'function')
                        onCheck(detail);
                }}
                className="btn black waves-effect waves-light white" style={{ boxShadow: "none" }}>
                <i className="material-icons black-text">check_circle_outline</i>
            </button>
        </div>

    return (
        <div className="valign-wrapper" style={{ marginBottom: "0", padding: "1% 0", width: "100%" }}>
            <div className="col s11" style={{
                textDecoration: Boolean(detail.is_done) ? "line-through" : "none",
                opacity: Boolean(detail.is_done) ? "0.7" : "1",
                pointerEvents: Boolean(detail.is_done) ? "none" : "initial"
            }}>
                <p>{`${detail.text}`}</p>
            </div>
            {deleteButton}
            {checkButton}
        </div>
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
            tasks: [],
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
        console.log(data);
        this.setState({
            quest_info: data
        });
    }

    async fetchTasks() {
        const data = await api.fetchTasks(this.state.id);
        this.setState({
            tasks: data || []
        });
    }

    async fetchParty() {
        const data = await api.fetchParty(this.state.id);
        this.fetchTasks();
        this.setState({
            party: data || []
        });
    }

    async markTaskDone(task) {
        const data = await api.markTaskDone(this.state.id, task.task_id);
        this.fetchTasks();
        M.toast({ html: data, displayLength: 800 });
    }

    async markTaskUndone(task) {
        const data = await api.markTaskUndone(this.state.id, task.task_id);
        this.fetchTasks();
        M.toast({ html: data, displayLength: 800 });
    }

    async deleteTask(task) {
        const data = await api.deleteTask(this.state.id, task.task_id);
        this.fetchTasks();
        M.toast({ html: data, displayLength: 800 });
    }

    async postNewComment(e) {
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            e.target.reset();
            const jsonBody = [...formData.keys()]
                .reduce((prev, curr) => {
                    prev[curr] = formData.get(curr);
                    return prev;
                }, {});
            if (!jsonBody.text || !jsonBody.text.trim()) throw new Error("Text should not be empty");
            const message = await api.postNewComment(this.state.id, jsonBody);
            await this.fetchComments();
            M.toast({ html: message, displayLength: 800 });
            this.commentList.scrollTo(0, this.commentList.scrollHeight);
        } catch (e) {
            M.toast({ html: e.message, displayLength: 1000 });
        }
    }

    async postNewTask(e) {
        try {
            e.preventDefault();
            const formData = new FormData(e.target);
            e.target.reset();
            const jsonBody = [...formData.keys()]
                .reduce((prev, curr) => {
                    prev[curr] = formData.get(curr);
                    return prev;
                }, {});
            if (!jsonBody.text || !jsonBody.text.trim()) throw new Error("Text should not be empty");
            const message = await api.postNewTask(this.state.id, jsonBody);
            await this.fetchTasks();
            M.toast({ html: message, displayLenght: 800 });
            this.taskList.scrollTo(0, this.taskList.scrollHeight);
        } catch (e) {
            M.toast({ html: e.message, displayLength: 1000 });
        }
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
        } catch (e) {
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
                <div className="col push-s9">
                    {auther._user.userId === this.state.quest_info.client_id ?
                        <Button onClick={() => this.deleteQuest()} text={"DELETE QUEST"} materialIcon={"delete"} />
                        : <Button onClick={() => this.leaveQuest()} text={"LEAVE QUEST"} materialIcon={"meeting_room"} />}
                </div>
            );
        })();
        const disabled = !this.state.quest_info;
        const tasks = this.state.tasks.length !== 0 ?
            <ul className="collection with-header" style={{
                maxHeight: "240px",
                overflowY: "scroll",
                scrollBehaviour: "smooth"
            }} ref={(ul) => this.taskList = ul}>
                {this.state.tasks.map((t, idx) => {
                    return (
                        <li className="collection-item" key={idx}>
                            <Task detail={t} options={{
                                hasDeleteButton: (this.state.quest_info.client_id === auther._user.userId),
                                onDelete: (task) => { this.deleteTask(task) },
                                onCheck: (task) => { this.markTaskDone(task) },
                                onUncheck: (task) => { this.markTaskUndone(task) }
                            }} />
                        </li>
                    );
                })}
            </ul> :
            <div className="center-align">{"Empty"}</div>

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
        const inputTask = !this.state.quest_info ? null : 
            this.state.quest_info.client_id !== auther._user.userId ?
            null :
            <div className="container row">
                <form className="col s12 offset-s3" onSubmit={(e) => this.postNewTask(e)}>
                    <div className="row valign-wrapper">
                        <div className="input-field col s11">
                            <i className="material-icons prefix">mode_edit</i>
                            <input type="text" name="text" id="input-comment" className="materialize-textarea" placeholder="Enter new task..." />
                        </div>
                        <div className="col s1">
                            <button type="submit" className="waves-effect waves-light btn center-align amber darken-2">
                                <i className="material-icons">send</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>;
        return (
            <div style={{
                width: "70%",
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
                                <div className="row" style={{ marginBottom: "0px" }}>
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
                                    <div className="col s12">
                                        {buttonDeleteQuest}
                                    </div>
                                </div>
                            </div>
                            <div className="card-tabs">
                                <ul className="tabs tabs-fixed-width" ref={(tabs) => this.tabs = tabs}>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-activity_log">Activity Log</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-tasks" onClick={() => this.fetchTasks()}>Tasks</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-comments" onClick={() => this.fetchComments()}>Comments</a></li>
                                    <li className={`tab ${disabled ? "disabled" : ""}`}><a href="#tab-party" onClick={() => this.fetchParty()}>Party</a></li>
                                </ul>
                            </div>
                            <div className="card-content grey lighten-4">
                                <div id="tab-activity_log">

                                </div>
                                <div id="tab-tasks">
                                    {tasks}
                                    {inputTask}
                                </div>
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