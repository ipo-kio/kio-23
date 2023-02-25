import {Component} from "react";
import Plot from 'react-plotly.js';

type GraphicsProps = {
    x: Array<number>;
    x_label_name: string,
    y: Array<number>,
    y_label_name: string,
    result_label_name: string,
    min_x?: number,
    max_x?: number,
    min_y?: number,
    max_y?: number,
    color?: string
}

export default class GraphicsComponent extends Component<GraphicsProps> {

    props: GraphicsProps;

    constructor(props: GraphicsProps) {
        super(props);
        this.props = props;
    }

    render() {
        return (
            <Plot
                data={[
                    {
                        x: this.props.x,
                        y: this.props.y,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: this.props.color},
                        textfont: {
                            size: 14,
                            color: "#E6E6E6"
                        }
                    },
                ]}
                layout={{
                    xaxis: {
                        automargin: false,
                        tickangle: 0,
                        title: this.props.x_label_name,
                        titlefont: {
                            family: 'Rubik, sans serif',
                            size: 14,
                            color: this.props.color
                        },
                        range: [this.props.min_x || 0, this.props.max_x],
                        color: "#E6E6E6",

                    },
                    yaxis: {
                        automargin: false,
                        title: this.props.y_label_name,
                        titlefont: {
                            family: 'Rubik, sans serif',
                            size: 14,
                            color: this.props.color
                        },
                        range: [this.props.min_y || 0, this.props.max_y],
                        color: "#E6E6E6"
                    },
                    width: 520,
                    height: 395,
                    font: {
                        size: 12
                    },
                    plot_bgcolor:"#666666",
                    paper_bgcolor:"#666666",

                } }
            />
        );
    }
}