import CNV from "./CNV/library";
import Store from "./Store";
import SETTINGS from "./SETTINGS"

import analyzeState from "./analyzeGraph/analyzeState"
function lineCollision(notThis = []){
    const {ALLOW_COLLISIONS, SHOW_COLLISION_LINES} = SETTINGS.getAll();
    let isCollision;
    let collisionCount = 0;
    if(notThis instanceof Array === false){
        notThis = [notThis];
    }
    CNV.querySelectorAll(".line").forEach(line => {
        if(notThis.filter(item => item === line).length === 0){
            CNV.querySelectorAll(".line").forEach(curLine => {
                let curLineData = Store.state.lines[curLine.id];
                let lineData = Store.state.lines[line.id];
                let res;
                if(lineData.sideIn.filter(sideInItem => sideInItem === curLineData).length !== 0 || curLineData.sideIn.filter(sideInItem => sideInItem === lineData).length !== 0){
                    res = CNV.lineCollision(curLine, line, "lite");
                } else {
                    res = CNV.lineCollision(curLine, line);
                }


                if(res.result) {
                    isCollision = true;
                    if(SHOW_COLLISION_LINES){
                        res.target.classList.add("lineWarning");
                        line.classList.add("lineWarning");
                    }
                    collisionCount += 1;
                }
            })
        }
    })

    analyzeState.analyzeInfo.number_of_collision = collisionCount / 2;
    return ALLOW_COLLISIONS === true ? false : isCollision;
}

export default lineCollision;