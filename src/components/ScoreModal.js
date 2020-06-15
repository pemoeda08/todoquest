import craneApi from "./quest-api/CraneApi";
import React from "react";
import M from "materialize-css";

class ScoreModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            scores: []
        };
    }

    componentDidMount() {
        this.modalInstance = M.Modal.init(this.modal);
    }

    async fetchScore() {
        const scores = await craneApi.fetchScore()
        console.log(scores);
        this.setState({
            scores: scores || []
        });
    }

    onDialogOpen() {
        this.fetchScore();
    }

    render() {
        const scoreList = this.state.scores.map((x, idx) => {
        return <div style={{
            fontSize: "24px"
        }}>{`${idx + 1}. ${x}`}</div>
        });

        return (
            <div>
                <div className="modal" id="modalScore" ref={(modal) => this.modal = modal}>
                    <div className="modal-content">
                        <h6 style={{
                            textDecoration: "underline"
                        }}>My Score</h6>
                        {scoreList}
                    </div>
                </div>
                <div className="col push-s4">
                    <div className="card">
                        <div className="card-content amber-text text-darken-4 modal-trigger" style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer"
                        }} onClick={() => { 
                            if (typeof this.onDialogOpen == 'function')
                                this.onDialogOpen()
                            }} href="#modalScore">
                            <i className="material-icons">assessment</i>
                            <span>View Score</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ScoreModal;