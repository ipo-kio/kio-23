import CNV from "./CNV/library";
import store from "./Store";
import {resetAllEndCircleClick, setAllEndCircleClick} from "./eventHandlers";
import {removeEdge} from "./graphHandlers";
import save from "./storage/save";
import analyze from "./analyzeGraph/analyze";
import firstDraw from "./firstDraw";

function setDelMode(){
    CNV.settings.draggableCanvas = false;
    store.state.mode = "del";
    resetAllEndCircleClick();
    canvas.style.cursor = "crosshair";
    //modeField.innerHTML = "Режим: удаление";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => {
            CNV.querySelectorAll(".finishText").forEach(item => item.remove());
            CNV.querySelector("#" + e.target.id + "_text")?.remove();
            removeEdge(key);
            //охраняем изменения в стек
            store.addToStack(save({dont_save: true}));

            analyze(store.state.lines);
        }
    }

    canvas.onclick = undefined;
}

function setDrawingMode(){
    CNV.settings.draggableCanvas = true;
    if(Object.keys(store.state.lines).length === 0){
        firstDraw(canvas);
    }

    store.state.mode = "draw";
    setAllEndCircleClick();
    canvas.style.cursor = "default";
    //modeField.innerHTML = "Режим: рисование";

    for(let key in store.state.lines){
        store.state.lines[key].line.onclick = e => undefined;
    }
}



function UIhandlers(){
    const delLineBtn = document.querySelector("#btn_delete");
    const drawLineBtn = document.querySelector("#btn_pen");
    const awardBtn = document.querySelector("#btn_award");
    const infoBtn = document.querySelector("#btn_info");
    const saveBtn = document.querySelector("#btn_save");
    const infoPanel = document.querySelector(".kio-base-info-panel.kio-base-results-info-panel");
    const awardsPanel = document.querySelector(".kio-base-info-panel.kio-base-record-info-panel");
    const savesPanel = document.querySelector(".kio-base-solutions-container");
    const dark = document.querySelector(".dark");

    // awardsPanel.classList.add("hidden");
    // savesPanel.classList.add("hidden");

    delLineBtn.onclick = e => {
        setDelMode();
        delLineBtn.classList.add("btn_active");
        drawLineBtn.classList.remove("btn_active");
    }

    drawLineBtn.onclick = e => {
        setDrawingMode();
        delLineBtn.classList.remove("btn_active");
        drawLineBtn.classList.add("btn_active");
    }

    // awardBtn.onclick = e => {
    //     awardBtn.classList.add("hidden");
    //     infoBtn.classList.remove("hidden");
    //
    //     infoPanel.classList.add("hidden");
    //     awardsPanel.classList.remove("hidden");
    // }
    //
    // infoBtn.onclick = e => {
    //     infoBtn.classList.add("hidden");
    //     awardBtn.classList.remove("hidden");
    //
    //     awardsPanel.classList.add("hidden");
    //     infoPanel.classList.remove("hidden");
    // }
    //
    // saveBtn.onclick = e => {
    //     savesPanel.classList.toggle("hidden");
    //     dark.classList.toggle("hidden");
    //     drawLineBtn.classList.toggle("hidden");
    //     delLineBtn.classList.toggle("hidden");
    // }
    //
    // dark.onclick = e => {
    //     savesPanel.classList.toggle("hidden");
    //     dark.classList.toggle("hidden");
    //     drawLineBtn.classList.toggle("hidden");
    //     delLineBtn.classList.toggle("hidden");
    // }
    //
    // window.addEventListener("keydown", e => {
    //     if(e.key === "Escape"){
    //         savesPanel.classList.add("hidden");
    //         dark.classList.add("hidden");
    //         drawLineBtn.classList.remove("hidden");
    //         delLineBtn.classList.remove("hidden");
    //     }
    // })

}
export default UIhandlers;
