import React from "react";
import { Route } from "react-router-dom";
import QuestboardCarousel from "./components/QuestboardCarousel";
import PostQuestModal from "./components/PostQuestModal";
import JoinQuestModal from "./components/JoinQuestModal";
import LogoutModal from "./components/LogoutModal";
import QuestDetail from "./components/QuestDetail";
import Auth from "./Auth";
import questApi from "./components/quest-api/QuestApi";
import { userAuthenticator } from "./components/auth/UserAuthenticator";
import "./App.css";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quest_list: [],
            authenticated: 0
        };
    }

    componentDidMount() {
        userAuthenticator.checkAuthentication()
            .then(isAuthenticated => {
                if (!isAuthenticated)
                    this.setState({
                        authenticated: -1
                    });
                else this.setState({
                    authenticated: 1,
                    authenticationMessage: "Authenticated"
                });
            })
            .catch(err => {
                this.setState({
                    authenticated: -1
                });
            });
    }

    onAuthenticated() {
        this.setState({
            authenticated: 1
        });
    }

    refreshQuestboard() {
        questApi.fetchQuests()
            .then(data => {
                this.setState({
                    quest_list: data
                });
            })
            .catch(err => {
                console.error(err);
            });
    }

    render() {
        if (this.state.authenticated === 0) {
            return (
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div className="card">
                        <div className="card-content">
                            {"Please wait a moment..."}
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.authenticated === -1) {
            return (<Auth onAuthenticated={this.onAuthenticated.bind(this)} />);
        }
        return (
            <div style={{
                height: "100%",
                width: "100%"
            }}>
                <Route exact path="/">
                    <div style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly",
                        alignItems: "stretch"
                    }}>
                        <div className="row valign-wrapper" style={{ width: "100%" }}>
                            <div className="col push-s9">
                                <div className="card">
                                    <div className="card-content valign-wrapper" style={{ height: "60px" }}>
                                        <p>
                                            {`Logged in as `}
                                            <span className="amber-text text-darken-4 bold"
                                                style={{ fontWeight: "bolder" }}>
                                                {`${userAuthenticator._user.username}`}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col push-s9">
                                <LogoutModal />
                            </div>
                        </div>
                        <QuestboardCarousel quest_list={this.state.quest_list}
                            onMounted={() => this.refreshQuestboard()} />
                        <div style={{ width: "100%" }}>
                            <div className="row valign-wrapper" style={{ width: "100%" }}>
                                <div className="col push-s4">
                                    <PostQuestModal onPosted={() => this.refreshQuestboard()} />
                                </div>
                                <div className="col push-s4">
                                    <JoinQuestModal onQuestJoined={() => this.refreshQuestboard()} />
                                </div>
                            </div>
                        </div>

                    </div>
                </Route>
                <Route path="/quest/:id" component={QuestDetail} />
            </div >
        );
    }
}

export default App;