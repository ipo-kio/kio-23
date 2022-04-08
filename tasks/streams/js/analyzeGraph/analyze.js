import CNV from "../CNV/library";
import Fraction from "../Fraction";
import state from "./analyzeState";
import { collecting_statistics } from "./priority";
import SETTINGS from "../SETTINGS";
import Iteration from "../gause";
import text from "./text";
import save from "../storage/save";
import Store from "../Store";
import showCycles from "./showCycles";
import step from "./step";
import allCollision from "../allCollision";



function double(int){
    let count = 0;
    while (int / 2 >= 1){
        int /= 2;
        count += 1;
    }
    return count;
}

function show_warning(text, duration = false){
    const warning = document.querySelector(".warning");
    warning.innerHTML = text;
    warning.classList.remove("hidden");
    if(duration !== false){
        if(duration === 0){
            warning.classList.add("hidden");
        } else {
            setTimeout(() => {
                warning.classList.add("hidden");
            }, duration);
        }
    }
}


const fakeLine = {
    // line: CNV.createLine({
    //     x0: -100,
    //     y0: -100,
    //     x1: -100,
    //     y1: -100,
    // }),
    // startCircle: CNV.createCircle({
    //     x0: -100,
    //     y0: -100,
    // }),
    // endCircle: CNV.createCircle({
    //     x0: -100,
    //     y0: -100,
    // }),
    sideIn: [],
    parents: [],
    children: [],
}

function setFakeLine(allLies, startLine){
    if(startLine){
        //Добавляем фейковую линию;
        allLies.push(fakeLine);
        startLine.parents.push(fakeLine);
        fakeLine.children.push(startLine);
    }

}

function removeFakeLine(allLies, startLine){
    if(startLine){
        allLies.pop();
        startLine.parents.pop();
        fakeLine.children.pop();
    }
}

function analyze(lines) {

    const {
        CONTROL_SUM_WARNING, FINISH_LIMITS,
        LINE_DIVISION,
        LINE_WIDTH,
        LINE_WIDTH_MIN, LOOPS, MERGES,
        NUMERIC_POWER,
        SHOW_CYCLES,
        START_POWER,
        TASK, REDUCING_LINES
    } = SETTINGS.getAll();

    CNV.combineRender(() => {
        CNV.querySelectorAll(".finishLine").forEach(item => item.classList.remove("finishLine"));
        CNV.querySelectorAll(".finishText").forEach(item => item.remove());
        CNV.querySelectorAll(".red").forEach(item => item.classList.remove("red"));
    })

    state.results = {};
    let newLines = Object.keys(lines).map(key => {
        return lines[key];
    });

    let startLines = [];
    let finishLines = [];
    let controlSum = new Fraction(0);


    for (let key in lines) { //Считаем количество точек входа
        if (lines[key].parents.length === 0) {
            startLines.push(lines[key])
        }
        if (lines[key].children.length === 0) {
            finishLines.push(lines[key]);
        }
    }
    state.startLines = startLines;
    if (startLines.length > 1) {
        show_warning("Путь имеет разрывы. Анализ невозможен");
        startLines.forEach(item => {
            item.line.classList.add("red");
        })
        return;
    } else {
        show_warning("", 0);
        //warning.classList.add("hidden");
    }

    //setFakeLine(newLines, startLines[0]);



    let m = [];

    newLines.forEach((item, index) => {
        let arr = [];
        for (let i = 0; i <= newLines.length; i++) {
            arr.push(new Fraction(0));
        }
        item.parents.forEach(parent => {
            arr[newLines.indexOf(parent)] = new Fraction(1, -parent.children.length);
        })
        arr[newLines.indexOf(item)] = new Fraction(1);
        if (item === startLines[0]) {
            arr[arr.length - 1] = new Fraction(1);
        }
        m.push(arr);
    })


    //АНАЛИЗ
    if(newLines.length > 0){
        state.analyzeInfo = collecting_statistics(lines, startLines[0], finishLines.length);
        //state.analyzeInfo = collecting_statistics(lines, fakeLine, finishLines.length);
    }

    if(allCollision()){
        show_warning("Потоки пересекаются");

        //removeFakeLine(newLines, startLines[0]);
        return;
    }

    if(LOOPS === false){
        if(state.analyzeInfo.number_of_loops > 0){
            show_warning("Присутвует недопустимый элемент: петля. Анализ невозможен");

            //removeFakeLine(newLines, startLines[0]);
            return;
        }
    }
    if(MERGES === false){
        if(state.analyzeInfo.number_of_mergers > 0){
            show_warning("Присутвует недопустимый элемент: слияние. Анализ невозможен");

            //removeFakeLine(newLines, startLines[0]);
            return;
        }
    }

    if(FINISH_LIMITS){
        if(FINISH_LIMITS instanceof Array){
            if(!(finishLines.length >= FINISH_LIMITS[0] && finishLines.length <= FINISH_LIMITS[1])){
                show_warning(
                    `Недопустимое количество стоков: ${finishLines.length}.
                          Требуется от ${FINISH_LIMITS[0] } до ${FINISH_LIMITS[1]}
                `);
            }
        }else if (Number.isInteger(FINISH_LIMITS)){
            if(finishLines.length !== FINISH_LIMITS){
                show_warning(
                    `Недопустимое количество стоков: ${finishLines.length}.
                          Требуется ${FINISH_LIMITS}
                `);
            }
        }
    }

    let answers;

    try{
        answers = Iteration(m);
    } catch (e) {
        if(newLines.length > 0){
            show_warning("Ошибка построения пути. Анализ невозможен");
        }
        //removeFakeLine(newLines, startLines[0]);
        return;
    }

    //removeFakeLine(newLines, startLines[0]);

    if(!NUMERIC_POWER){
        CNV.combineRender(() => {
            newLines.forEach((line, index) => {
                line.power = answers[index];
                if(REDUCING_LINES){
                    let newWidth = LINE_WIDTH / (LINE_DIVISION ** (double(line.power.getDet() / line.power.getNum())));
                    if(newWidth >= LINE_WIDTH_MIN){
                        line.line.style.lineWidth = newWidth;
                        //line.endCircle.style.radius = newWidth / 2;
                    } else {
                        line.line.style.lineWidth = LINE_WIDTH_MIN;
                    }
                }

            });
        })
    } else {
        step(startLines[0], new Fraction(START_POWER));
        if(REDUCING_LINES){
            CNV.combineRender(() => {
                newLines.forEach((line, index) => {
                    let power = answers[index];
                    let newWidth = LINE_WIDTH / (LINE_DIVISION ** (double(power.getDet() / power.getNum())));
                    if(newWidth >= LINE_WIDTH_MIN){
                        line.line.style.lineWidth = newWidth;
                        //line.endCircle.style.radius = newWidth / 2;
                    } else {
                        line.line.style.lineWidth = LINE_WIDTH_MIN;
                    }
                });
            })
        }
    }




    //console.log(collecting_statistics(lines, startLines[0]));



    finishLines.forEach(line => {
        //line.line.classList.add("finishLine");
        text({target: line, output: state.results});
    })


    CNV.render(); //Отрисовываем изменения, проишедшие во время анализа графа
    for (let key in state.results) { //Отрисовываем значения у выходов графа
        if (!state.results[key].auxiliary) {
            controlSum.plus(state.results[key].data.num, state.results[key].data.det);
        }
        CNV.createText({
            ...state.results[key],
            className: "finishText",
            id: key + "_finishText",
        })
        CNV.render();
        //CNV.text(state.results[key])

    }

    //removeFakeLine(newLines, startLines[0]);

    if ((NUMERIC_POWER && controlSum.getStr() !== String(START_POWER)) || (!NUMERIC_POWER && controlSum.getStr() !== "1")) {
        if (CONTROL_SUM_WARNING) {
            warning.innerHTML = "Критическая ошибка анализа пути: сумма выходов равна: " + controlSum.getStr();
            warning.classList.remove("hidden");
        } else {
            warning.classList.add("hidden");
        }
    }
    let task = [...TASK];
    task = TASK.map(item => {
        if(!(item instanceof Fraction)){
            return new Fraction(item.split("/")[0], item.split("/")[1])
        } else {
            return item;
        }
    })
    let minimalError = +Infinity;
    finishLines.forEach(line => {
        let user_power = line.power.as_float();
        let need_power = task[0].as_float();
        let error = Math.abs(user_power - need_power) / need_power;
        if (error < minimalError)
            minimalError = error;
    })
    let multiplier = task[0].det === 1 ? 100 : 1000;
    state.analyzeInfo.number_of_results = Math.floor((1 - minimalError) * multiplier);

    Store.API.loadSolution(save({dont_save: true, dont_stringify: true}));
    if(SHOW_CYCLES){
        showCycles(startLines[0]);
    }
    // console.log(CNV.querySelectorAll("line"));
}
export default analyze;
