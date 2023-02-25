import {Component} from "react";
import "./SpeedometrStyle.css";

type SpeedometerProps = {
    speed?: number,
    color: string
}

export default class SpeedometerComponent extends Component {
    props: SpeedometerProps;

    constructor(props: SpeedometerProps) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <>
                <div className="speedometer-container" style={{outlineColor: this.props.color}}>
                    <div className="speed-box" style={{background: this.props.color}}>
                        <label
                            className="speed-text"
                            style={{fontSize: "1.5em", color: "black"}}>
                            {this.props.speed}
                        </label>
                    </div>
                    <label
                        className="speed-text"
                        style={{fontSize: "0.8em", color: this.props.color}}>
                        KM/H
                    </label>
                </div>
            </>
        );
    }
}