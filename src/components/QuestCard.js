import React from "react";
import { Link } from "react-router-dom";
import "materialize-css/dist/css/materialize.css";

function QuestCard({ title, description, quest_id, onClick }) {
    return (
        <div className="card" style={{ width: "360px", minHeight: "80%" }}>
            <div className="card-content">
                <span className="card-title amber-text text-darken-4 text" style={{
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    whiteSpace: "nowrap"
                }}>{title}</span>
                <p>{description}</p>
            </div>
            <div className="card-action right-align">
                <Link to={`/quest/${quest_id}`}>
                    <span href="#" className="amber-text text-darken-4">Details
                    </span>
                </Link>
            </div>
        </div>
    )
}

export default QuestCard;