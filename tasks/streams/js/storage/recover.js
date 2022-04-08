import CNV from "../CNV/library";
import {
    endCircleClick,
    endCircleMouseEnter,
    endCircleMouseLeave,
    lineMouseEnter,
    lineMouseLeave
} from "../eventHandlers";
import store from "../Store";
import innerLine from "../innerLine";
import firstDraw from "../firstDraw";
import save from "./save";


function recover(data){
    console.log("recover, data", data);

    const disk = JSON.parse(data || localStorage.getItem("__saved"));
    CNV.recover(disk.CNV);
    let script = JSON.parse(disk.SCRIPT);
    for(let key in script.lines){
        let item = script.lines[key];
        item.line = CNV.getElementByUniqueId(item.line);
        item.endCircle = CNV.getElementByUniqueId(item.endCircle);
        item.startCircle = CNV.getElementByUniqueId(item.startCircle);
        innerLine(item.line);

        item.children = item.children.map(id => {
            return script.lines[id];
        })
        item.parents = item.parents.map(id => {
            return script.lines[id];
        })
        item.sideIn = item.sideIn.map(id => {
            return script.lines[id];
        })

        item.line.onmouseenter = e => lineMouseEnter(item, e);
        item.line.onmouseleave = e => lineMouseLeave(item, e);
        item.endCircle.onmouseenter = e => endCircleMouseEnter(e);
        item.endCircle.onmouseleave = e => endCircleMouseLeave(e);
        item.endCircle.onclick = e => endCircleClick(item, e);
    }
    if(Object.keys(script.lines).length > 0){
        store.canvas.onclick = undefined;
    } else {
        firstDraw(store.canvas);
    }
    store.state = script;
    CNV.settings.draggableCanvas = true;
    //store.addToStack(save({dont_save: true}))
    CNV.render();
}

export default recover;