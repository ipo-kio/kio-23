import {createEdge} from "./graphHandlers";
import drawingLine from "./drawingLine";
import CNV from "./CNV/library";


function firstDraw(canvas) {
    CNV.settings.draggableCanvas = false;
    canvas.onclick = e => {
        const data = createEdge(e);
        canvas.onclick = undefined;
        drawingLine(data, () => {
            canvas.onclick = undefined;
            CNV.settings.draggableCanvas = true;
        })
    }
}

export default firstDraw;