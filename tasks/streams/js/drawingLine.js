import CNV from "./CNV/library";
import {endCircleClick, resetStickToTailHandler, setStickToTailHandler} from "./eventHandlers";
import store from "./Store";
import save from "./storage/save";
import SETTINGS from "./SETTINGS";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";
import innerLine from "./innerLine";
import lineCollision from "./lineCollision";
import recover from "./storage/recover";
import mousePosition from "./mousePosition";


function drawingLine(data, finishCallback = () => {}){
    const {STACK} = SETTINGS.getAll();

    function stopDrawing(e){

        // if(lineCollision(data.line, Store.collisionIgnore)) {
        //     Store.isCollision = true;
        // }

        e.preventDefault();

        //убирает событие рисования
        store.canvas.removeEventListener("mousemove", drawing);
        //самоуничножается
        store.canvas.removeEventListener("click", stopDrawing);


        data.endCircle.onclick = e => endCircleClick(data, e);
        finishCallback();
        resetStickToTailHandler();
        if(STACK){
            //Сохраняем изменения в стек
            store.addToStack(save({dont_save: true}));
        }

        innerLine(data.line);

        analyze(Store.state.lines);
        // CNV.querySelectorAll(".black").forEach(item => {
        //     item.classList.remove("black");
        //     item.classList.remove("lineHover");
        // })
        CNV.querySelectorAll(".lineHover").forEach(item => {
            item.classList.remove("lineHover");
        })

    }

    function drawing(e){
        let [clientX, clientY] = mousePosition(e);
        data.line.update.endPosition.x = clientX - CNV.state.shift.x;
        data.line.update.endPosition.y = clientY - CNV.state.shift.y;
        data.endCircle.update.startPosition.x = clientX - CNV.state.shift.x;
        data.endCircle.update.startPosition.y = clientY - CNV.state.shift.y;
    }
    store.canvas.addEventListener("mousemove", drawing);
    store.canvas.addEventListener("click", stopDrawing);
    setStickToTailHandler(data);
}

export default drawingLine;
