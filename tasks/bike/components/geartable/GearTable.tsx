import React, {Component} from "react";

import "./GearTable.css";

type Props = {
    tableData: number[][]
    onChange: (arr: number[][]) => void
}

enum HighlightType {
    NONE,
    COLORED,
    SEMI_COLORED
}

type CellData = {
    x: number,
    y: number,
    value: number
    highlighted: HighlightType
}

type State = {
    cells: CellData[][]
}

export default class GearTable extends Component {

    public props: Props;

    public state: State;

    constructor(props: Props) {
        super(props);
        this.props = props;

        this.state = {
            cells: [[]]
        }

    }

    componentDidMount() {

        let cells: CellData[][] = []

        for (let x in this.props.tableData) {
            cells.push([])
            for (let y in this.props.tableData[x]) {
                cells[x].push({x: +x, y: +y, value: +this.props.tableData[x][y], highlighted: HighlightType.NONE})
            }
        }

        this.setState({
            cells: cells
        })

        // this.props.onChange(this.get2dArray())

    }

    private get2dArray = () => {
        let array2 = this.state.cells.map((row) => {
            return row.map((cell) => {
                return cell.value
            })
        })
        return array2;
    }

    forall = (apply: (cell: CellData) => void) => {
        for (let x in this.state.cells) {
            for (let y in this.state.cells[x]) {
                apply(this.state.cells[x][y])
            }
        }
    }

    highlightCell = (x: number, y: number) => {

        this.forall((cell) => {
            cell.highlighted = HighlightType.NONE
        })

        let cells = this.state.cells;

        for (let x_i in cells) {
            cells[x_i][y].highlighted = HighlightType.SEMI_COLORED
        }
        for (let y_i in cells[x]) {
            cells[x][y_i].highlighted = HighlightType.SEMI_COLORED
        }

        cells[x][y].highlighted = HighlightType.COLORED

        this.setState({
            cells: cells
        })
    }

    private getHighlightedStyle(highlighted: HighlightType) {
        if (highlighted === HighlightType.COLORED) {
            return "highlighted-colored"
        }
        if (highlighted === HighlightType.SEMI_COLORED) {
            return "highlighted-semi-colored"
        }
        return ""
    }

    render() {

        let cells = [];

        for (let row in this.state.cells) {
            for (let cellData in this.state.cells[row]) {

                cells.push(
                    <input
                        onChange={(e) => {
                            let tableData = this.state.cells
                            tableData[row][cellData].value = +e.target.value
                            this.setState({
                                cells: tableData
                            })

                        }}
                        onFocus={(e) => {
                            this.highlightCell(+row, +cellData)
                        }}

                        onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    this.props.onChange(this.get2dArray())
                                }
                            }
                        }

                        onBlur={(e) => {
                                this.props.onChange(this.get2dArray())
                            }
                        }

                        value={this.state.cells[row][cellData].value}
                        className={this.getHighlightedStyle(this.state.cells[row][cellData].highlighted) + " cell"}
                    />)
            }
        }

        let topPanel = [];
        for (let cell in this.state.cells) {
            topPanel.push(<div className="top-panel-cell">{+cell + 1}</div>)
        }

        let leftPanel = [];
        for (let cell in this.state.cells[0]) {
            leftPanel.push(<div className="left-panel-cell">{+cell + 1}</div>)
        }

        // for (let x in this.state.cells) {
        //     for (let y in this.state.cells[x]) {
        //         if (this.state.cells[x][y].highlighted == HighlightType.COLORED) {
        //             leftPanel[y] = <div className="left-panel-cell highlighted-colored">{+y + 1}</div>
        //             topPanel[x] = <div className="top-panel-cell highlighted-colored">{+x + 1}</div>
        //         }
        //     }
        // }

        return (
            <div style={{position: "relative", transform: "translateX(-24px)"}}>
                <div className="outer">
                    <div className="top">
                        {topPanel}
                    </div>
                    <div className="left">
                        {leftPanel}
                    </div>
                </div>

                <div style={{gridTemplateColumns: `repeat(${this.props.tableData[0].length}, 45px)`}} className="table">
                    {cells}
                </div>
            </div>

        )
    }

}
