import React from "react";
import QuestCard from "./QuestCard";
import M from "materialize-css";

class QuestboardCarousel extends React.Component {

    componentDidMount() {
        if (typeof this.props.onMounted == 'function')
            this.props.onMounted();
    }

    componentDidUpdate() {
        this.carouselInstance = M.Carousel.init(this.carousel, {
            padding: 100,
            numVisible: 10,
            shift: 10
        });
        this.carouselInstance.next(this.props.quest_list.length - 1);
    }

    render() {
        let quest_list = this.props.quest_list.map(quest =>
            <div className="carousel-item" key={quest.quest_id}>
                <QuestCard title={quest.title}
                    description={quest.description}
                    quest_id={quest.quest_id} 
                    />
            </div>
        );

        if (quest_list.length === 0)
            quest_list = 
                <div className="carousel-item">
                    <div className="row">
                        <div className="card">
                            <div className="div card-content">
                                <p className="center-align">
                                    {"Empty"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        return (
            <div className="carousel" ref={(car) => { this.carousel = car }} style={{
                cursor: "grab"
            }}>
                {quest_list}
            </div>
        );
    }
}

export default QuestboardCarousel;