import React, {Component} from "react";
import "./ExerciseBikeStyle.css";

type ExerciseBikeProps = {
    animationSpeed: number
}

export default class ExerciseBikeComponent extends Component {

    props: ExerciseBikeProps

    constructor(props: ExerciseBikeProps, context: any) {
        super(props, context);
        this.props = props
    }


    render() {
        return (
            <div >


                <div className="ex_bicycle-container">
                    <div className="gear" style={{animation: `rt ${1/this.props.animationSpeed}s linear infinite`}}>
                        <div className="gear-red"></div>
                        <div className="tube pedal-tube"></div>
                        <div className="pedal"></div>
                    </div>

                    <div className="tube seat-tube-front"></div>
                    <div className="tube seat-tube-post"></div>
                    <div className="tube top-handlebar-tube"></div>
                    <div className="tube top-handlebar-tube2"></div>
                    <div className="tube down-tube"></div>
                    <div className="saddle"></div>
                    <div className="handlebars"></div>
                    <div className="bike-body"></div>

                </div>
            </div>
        );
    }
}