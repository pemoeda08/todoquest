import React from "react";
import { Route, Redirect } from "react-router-dom";
import QuestboardCarousel from "./components/QuestboardCarousel";
import PostQuestModal from "./components/PostQuestModal";
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
            okToRender: false
        };
    }

    componentDidMount() {
        userAuthenticator.ensureTokenValidity()
            .then(() => {
                this.setState({
                    okToRender: true
                });
            })
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
        if (!this.state.okToRender) {
            return null;
        }
        const shouldRedirectToAuth = !userAuthenticator.isAuthenticated()

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
                            onMounted={() => this.refreshQuestboard() }/>
                        <PostQuestModal onPosted={() => this.refreshQuestboard() } />

                    </div>
                </Route>
                <Route path="/quest/:id" component={QuestDetail} />
                <Route path="/auth" component={Auth} />
                {shouldRedirectToAuth ? <Redirect to="/auth" /> : null}
            </div>
        );
    }
}

export default App;