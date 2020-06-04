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
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <QuestboardCarousel quest_list={this.state.quest_list}
                            onMounted={() => this.refreshQuestboard()} />
                        <div style={{ width: "100%" }}>
                            <div className="row" style={{
                                width: "100%"
                            }}>
                                <PostQuestModal onPosted={() => this.refreshQuestboard()} />
                                <JoinQuestModal />
                                <LogoutModal />
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