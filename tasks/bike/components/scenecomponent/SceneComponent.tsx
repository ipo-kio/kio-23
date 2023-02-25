import {Component, Suspense} from "react";
import "./SceneStyle.css";
import BicycleComponent from "../animation/BicycleComponent";
import ExerciseBikeComponent from "../animation/ExerciseBikeComponent";
import GearTable from "../geartable/GearTable";
import GraphicsComponent from "../graphics/GraphicsComponent";
import PhysicsCore from "../../physics/PhysicsCore";
import {Level} from "../../Level"
import SpeedometerComponent from "../speedometr/SpeedometerComponent";

type Props = {
    level: Level
}

type State = {
    Tlist: number[];
    wList: number[];
    bicycleFlist: number[];
    bicycleSpeed: number;
    exerciseFlist: number[];
    exerciseSpeed: number;

    tableData: number[][];
}

export default class SceneComponent extends Component {

    state: State;
    props: Props;

    bicyclePhysics: PhysicsCore | undefined;
    exerciseBikePhysics: PhysicsCore | undefined;
    graphicsBackground: string;
    yellowColor: string;
    cyanColor: string;
    greenColor: string;

    constructor(props: Props) {
        super(props);
        this.props = props;


        this.state = {
            Tlist: [],
            wList: [],
            bicycleFlist: [],
            bicycleSpeed: 0,
            exerciseFlist: [],
            exerciseSpeed: 0,
            tableData: [[]]
        }

        this.graphicsBackground = "#666666";
        this.yellowColor = "#F7F743";
        this.cyanColor = "#66FFCC";
        this.greenColor = "#8EED00";

    }

    componentDidMount = () => {
        this.loadLevel(this.props.level)
    }

    private loadLevel = (selectedLvl: Level) => {
        switch (selectedLvl) {
            case Level.high_9_11:
                this.setState({
                    tableData: [
                        [1,1,1,1,1,1],
                        [1,1,1,1,1,1],
                        [1,1,1,1,1,1],
                    ]
                })
                break

            case Level.middle_6_8:
                this.setState({
                    tableData: [
                        [1,1,1,1,1,1],
                        [1,1,1,1,1,1],
                        [1,1,1,1,1,1]
                    ]
                })
                break

            case Level.low_1_5:
                this.setState({
                    tableData: [
                        [1,1,1,1],
                        [1,1,1,1],
                        [1,1,1,1]
                    ]
                })
                break

            default:
                throw new Error("Unknown level")

        }
    }

    startSimulation = () => {
        let gears = [3.4, 3.14,  2.75, 2.83, 2.8, 2.42, 2.125, 1.88, 1.61, 1.57, 1.41, 1.21, 1.06, 1.0, 0.94, 0.80,  0.75, 0.68].reverse()

        if (this.bicyclePhysics){
            this.bicyclePhysics.stop()
        }
        if (this.exerciseBikePhysics){
            this.exerciseBikePhysics.stop()
        }

        this.bicyclePhysics = new PhysicsCore(gears);
        this.exerciseBikePhysics = new PhysicsCore(gears);

        this.setState({
            Tlist: [],
            wList: [],
            bicycleFlist: [],
            exerciseFlist: []
        })

        this.startBicycleSimulation();
        this.startExerciseSimulation();
    }

    startBicycleSimulation = () => {

        const subscriber = (W: number, V: number, F: number, t: number) => {

            //round t and W to 2 digits after comma
            t = Math.round(t * 100) / 100;
            W = Math.round(W * 100) / 100;
            F = Math.round(F * 100) / 100;

            this.setState({
                Tlist: [...this.state.Tlist, t],
                wList: [...this.state.wList, W],
                bicycleFlist: [...this.state.bicycleFlist, F],
                bicycleSpeed: V
            })
        }

        if (this.bicyclePhysics){
            this.bicyclePhysics.subscribe(subscriber);
            this.bicyclePhysics.run();
        }

    }

    startExerciseSimulation = () => {
        const subscriber = (W: number, V: number, F: number, t: number) => {

                t = Math.round(t * 100) / 100;
                W = Math.round(W * 100) / 100;
                F = Math.round(F * 100) / 100;

                this.setState({
                    exerciseFlist: [...this.state.exerciseFlist, F],
                    exerciseSpeed: V
                })
        }
        if (this.exerciseBikePhysics){
            this.exerciseBikePhysics.subscribe(subscriber);
            this.exerciseBikePhysics.run();
        }

    }

    tableChange = (arr: number[][]) => {
        this.setState({
            tableData: arr
        })

        this.updateExerciseBikeGears(arr)
    }

    updateExerciseBikeGears = (arr: number[][]) => {
        if (this.bicyclePhysics){
            let gears: number[] = []
            arr.forEach((row) => {
                row.forEach((value) => {
                    // @ts-ignore
                    gears.push(this.bicyclePhysics.getNi()[value - 1])
                })
            })

            // @ts-ignore
            this.exerciseBikePhysics.setNi(gears)

        }

    };

    render() {

        let sum = 0
        this.state.tableData.forEach((row) => {
            row.forEach((value) => {
                sum += value
            })
        })

        return (
            <div className="page-container">
                <div className="bicycle-left">
                    <div className="b-container">
                        <BicycleComponent animationSpeed={this.state.wList[this.state.wList.length - 1]}/>
                    </div>
                    <div className="v-box">
                        <div className="f-graphic" style={{background: this.graphicsBackground}}>
                            <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={this.state.bicycleFlist}
                                               y_label_name={""} result_label_name={""}
                                               max_y={this.state.bicycleFlist[this.state.bicycleFlist.length - 1] > 10 ?
                                                   this.state.bicycleFlist[this.state.bicycleFlist.length - 1] + 5 : 10}
                                               max_x={1.5} color={this.cyanColor}/>
                            <div className="f-t-label" style={{color: this.cyanColor}}>
                                <label style={{fontSize:"1.5em"}}>t</label>
                                <label style={{fontSize: "1em"}}>сек</label>
                            </div>
                            <div className="f-f-label"  style={{color: this.cyanColor}}>
                                <label style={{fontSize:"1.5em"}}>F</label>
                                <label style={{fontSize:"1em"}}>сила</label>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="left-speedometer">
                    <SpeedometerComponent speed={Math.round(this.state.bicycleSpeed * 100) / 100} color={this.cyanColor}/>
                </div>

                <div className="center">
                    <div className="center-box center-box-text" style={{height: "20%"}}>
                        <label style={{fontSize: "1rem"}}>Задание</label>
                        <div className="task-description" style={{fontSize: "0.7rem"}}>
                            Здесь будет находится описание задачи. Сейчас 2 часа ночи. Мой мозг пишет этот текст из последних сил.
                            Надеюсь мы уже на финальной прямой, потому что есть некотореы переживания.
                            В целом, дизайн получается классным - мне нравится. Но сил уже почти нет :(
                            А еще нужно проверить работу скрола, поэтому ааааааааааааа аааааааа ааааааа ааааааааааааа 000000 аааааааа аааааа ааааааа ааааааа аааа
                            вот, так-то лучше
                        </div>
                    </div>

                    <div className="center-box"  style={{height: "35%"}}>
                        <GearTable key={sum} tableData={this.state.tableData} onChange={this.tableChange}/>
                        <button className="check-button" onClick={this.startSimulation}>ПРОВЕРИТЬ   РЕЗУЛЬТАТ</button>
                    </div>

                    <div className="v-box">
                        <div className="f-graphic" style={{background: this.graphicsBackground}}>
                            <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={this.state.wList}
                                               y_label_name={""} result_label_name={""}
                                               max_y={2}
                                               max_x={1.5} color={this.greenColor}/>
                            <div className="f-t-label" style={{color: this.greenColor}}>
                                <label style={{fontSize:"1.5em"}}>t</label>
                                <label style={{fontSize: "1em"}}>сек</label>
                            </div>
                            <div className="f-f-label" style={{color: this.greenColor}}>
                                <label style={{fontSize:"1.5em"}}>W</label>
                                <label style={{fontSize:"1em"}}>обороты/сек</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="exercise-right">
                    <div className="e-container">
                        <ExerciseBikeComponent animationSpeed={this.state.wList[this.state.wList.length - 1]}/>
                    </div>
                    <div className="v-box">
                        <div className="f-graphic" style={{background: this.graphicsBackground}}>
                            <GraphicsComponent x={this.state.Tlist} x_label_name={""} y={this.state.exerciseFlist}
                                               y_label_name={""} result_label_name={""}
                                               max_y={this.state.exerciseFlist[this.state.exerciseFlist.length - 1] > 10 ?
                                                   this.state.exerciseFlist[this.state.bicycleFlist.length - 1] + 5 : 10}
                                               max_x={1.5} color={this.yellowColor}/>
                            <div className="f-t-label" style={{color: this.yellowColor}}>
                                <label style={{fontSize:"1.5em"}}>t</label>
                                <label style={{fontSize: "1em"}}>сек</label>
                            </div>
                            <div className="f-f-label" style={{color: this.yellowColor}}>
                                <label style={{fontSize:"1.5em"}}>F</label>
                                <label style={{fontSize:"1em"}}>сила</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-speedometer">
                    <SpeedometerComponent speed={Math.round(this.state.exerciseSpeed * 100) / 100} color={this.yellowColor}/>
                </div>
            </div>
        );
    }

}