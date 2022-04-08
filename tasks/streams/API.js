import save from "./js/storage/save";
import Store from "./js/Store";
import recover from "./js/storage/recover";
import analyze from "./js/analyzeGraph/analyze";
import CNV from "./js/CNV/library";

import "./css/style.scss"
import css from "./js/css";

import {shiftDownHandler} from "./js/shiftHandlers";

import store from "./js/Store";
import zHandlers from "./js/zHandlers";
import SETTINGS from "./js/SETTINGS";
import firstDraw from "./js/firstDraw";
import UIhandlers from "./js/UI";

class Streams {
    constructor(settings) {
        Store.API = this;

        if ('level' in settings) {
            let level = +settings.level;
            switch (level) {
                case 0:
                    settings.NUMERIC_POWER = true;
                    settings.START_POWER = 274;
                    settings.LOOPS = false;
                    settings.MERGES = true;
                    settings.ALLOW_COLLISIONS = true;
                    settings.SHOW_NUMBER_OF_COLLISION = true;
                    settings.TASK = ['' + 215, '' + (274 - 215)];
                    break;
                case 1:
                    settings.SHOW_NUMBER_OF_COLLISION = false;
                    settings.TASK = ["13/27", "14/27"];
                    break;
                case 2:
                    settings.SHOW_NUMBER_OF_COLLISION = false;
                    settings.TASK = ["19/53", "34/53"];
                    break;
            }
        }

        this.settings = settings;
    }
    id(){
        return "streams" + this.settings.level;
    }
    initialize(domNode, kioapi, preferred_width){
        this.kioapi = kioapi;
        this.domNode = domNode;
        SETTINGS.set(this.settings);
        // this.settings.level = 1;
        if(this.settings.level !== undefined){
            if(Number(this.settings.level) === 0){
                css.line = css.lineRoad;
                css.innerLine = css.innerLineRoad;
                SETTINGS.changeProperty("CIRCLE_RADIUS", SETTINGS.LINE_WIDTH / 2 + 1.5);
            } else if(Number(this.settings.level) === 0 || Number(this.settings.level) === 1){
                css.line = css.lineRiver;
                css.innerLine = css.innerLineRiver;

            } else {
                css.line = css.lineRiver;
                css.innerLine = css.innerLineRiver;
            }
        } else {
            css.line = css.lineRiver;
            css.innerLine = css.innerLineRiver;
        }

        //window.problem.hidden = true;
        // let power = prompt("Введите входную мощность");
        // let outer = prompt("Введите выходные выходные мощности через точку с запятой. Пример: 1/4;3/4");
        // window.problem.hidden = false;
        // console.log(power);
        // console.log(outer.split(";"));
        // SETTINGS.changeProperty("TASK", outer.split(";"));
        //SETTINGS.changeProperty("START_POWER", power);

        //---------------------------- copy from streams.js

        const { BRANCHES, LINE_WIDTH, STACK_LIMIT, SHOW_PATH,
            CONTROL_SUM_WARNING, STACK, SHOW_CYCLES, SHOW_PRIORITIES,
            START_POWER, NUMERIC_POWER, LINE_DIVISION, LINE_WIDTH_MIN,
            LOOPS, MERGES, FINISH_LIMITS  } = SETTINGS.getAll();

        domNode.innerHTML = `
                            <div class="streams-wrapper">
                                 <div class="dark hidden"></div>
    
                                <canvas id="canvas">
                                </canvas>
                                
    <!--                            <button id="btn_award" class="btn_reset">-->
    <!--                                <i class="fas fa-award"></i>-->
    <!--                            </button>-->
    <!--                            <button id="btn_info" class="btn_reset hidden">-->
    <!--                                <i class="fas fa-info"></i>-->
    <!--                            </button>-->
    <!--                            <button id="btn_save" class="btn_reset">-->
    <!--                                <i class="fas fa-save"></i>-->
    <!--                            </button>-->
                                <div class="buttonWrapper">
                                    <button id="btn_pen" class="btn_reset btn btn_active">
                                        <div class="innerBtn"></div>
                                    </button>
                                    <button id="btn_delete" class="btn_reset btn">
                                        <div class="innerBtn"></div>
                                    </button>
                                    <button id="btn_prev" class="btn_reset btn">
                                        <div class="innerBtn"></div>
                                    </button>
                                    <button id="btn_next" class="btn_reset btn">
                                        <div class="innerBtn"></div>
                                    </button>
                                </div>
                                
                                
                                <div class="warning hidden">
                                
                                </div>
                                
                                <div class="setting_warning hidden">
                                    <ul id="setting_list"></ul>
                                </div>
                         
                                <input class="saved_code">
                            </div>
                    `;


        const canvas = document.querySelector("#canvas");

        const saveBtn = document.querySelector("#save");
        const recoverInput = document.querySelector("#recover_input");
        const recoverBtn = document.querySelector("#recover_btn");
        const savedCodeField = document.querySelector(".saved_code");
        const KIOcontainer = document.querySelector(".kio-base-info-panels-container");
        const KIOsaves = document.querySelector(".kio-base-solutions-container");
        let context = canvas.getContext("2d");
        KIOsaves.id = "KIOsaves";

        window.addEventListener("load", e => {
            canvas.width = domNode.clientWidth;
            canvas.height = Math.max(domNode.clientHeight, 500);
            // console.log('resizing load', canvas.width, canvas.height, domNode.clientWidth, domNode.clientHeight);
            CNV.start();
        })

        window.addEventListener("resize", e => {
            canvas.width = domNode.clientWidth;
            canvas.height = Math.max(domNode.clientHeight, 500);
            // console.log('resizing load', canvas.width, canvas.height, domNode.clientWidth, domNode.clientHeight);
            CNV.render();
        })


        //Инициализация библиотеки CNV

        //Базовая настройка
        CNV.setContext(context);
        CNV.setCanvas(canvas);
        CNV.setCSS(css);
        CNV.settings.draggableCanvas = false;
        CNV.settings.draggableCanvasObserver = (x, y) => {
            canvas.style.backgroundPositionY = y + "px";
            canvas.style.backgroundPositionX = x + "px";
        };
        if(this.settings.level !== undefined){
            if(Number(this.settings.level) === 0){
                canvas.style.background = `url(${kioapi.basePath}streams-resources/road_bg_550.jpg)`;
            } else {
                canvas.style.background = `url(${kioapi.basePath}streams-resources/river_bg_550.jpg)`;
            }
        } else {
            canvas.style.background = `url(${kioapi.basePath}streams-resources/river_bg_550.jpg)`;
        }


        canvas.addEventListener("click", e => {
            if(window.pageYOffset !== 0) {
                $([document.documentElement, document.body]).animate({
                    scrollTop: $("#canvas").offset().top
                }, 300);
            }
        })



        //Инициализация store
        store.setCanvas(canvas);
        store.setContext(context);

        firstDraw(canvas);

        //TODO initialization was here

        UIhandlers();

        /*const saveBtn = document.querySelector("#save");
        const recoverInput = document.querySelector("#recover_input");
        const recoverBtn = document.querySelector("#recover_btn");
        const savedCodeField = document.querySelector(".saved_code");

        recoverBtn.onclick = e => {
            recover(recoverInput.value);
            analyze(store.state.lines);
            recoverInput.value = ""
        }

        saveBtn.onclick = e => {
            saveBtn.classList.remove("saveOk");
            const disk = save({dont_save: true});

            savedCodeField.value = disk;
            savedCodeField.select();

            document.execCommand("copy");
            saveBtn.classList.add("saveOk");
            setTimeout(()=> {
                saveBtn.classList.remove("saveOk");
            }, 1000)
        }
        */
        window.addEventListener("keydown", shiftDownHandler);


        zHandlers();

        "Object { number_of_branches: 0, number_of_plots: 0, number_of_mergers: 0, number_of_loops: 0 }"
        //-----------------------------end copy from streams.js
    }
    parameters() {
        let number_of_branches = {
            name: "number_of_branches", //название параметра
            title: "Количество делений потока: ", //отображение названия для пользователя
            ordering: 'minimize', // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
            view: "", // отображение значения параметра пользователю. Можно не указывать.
                      // Если задана строка, как в этом примере, она означает постфикс, т.е. если значение
                      // параметра равно, например, 42, пользователь увидит 42ш.
                      // Либо это может быть функция от одного аргумента, значения параметра, она
                      // должна возвращать строку для отображения пользователю,
        };
        let number_of_finish = {
            name: "number_of_finish",
            title: "Количество стоков: ",
            ordering: 'minimize',
        };
        let number_of_loops = {
            name: "number_of_loops",
            title: "Количество петель: ",
            ordering: 'minimize',
        };
        let number_of_merges = {
            name: "number_of_mergers",
            title: "Количество слияний: ",
            ordering: 'minimize',
        };
        let number_of_results = {
            name: "number_of_results",
            title: "Результат: ",
            ordering: 'maximize',
            view: v => {
                if (this.settings.NUMERIC_POWER)
                    return v + '%';
                else
                    return (v/10).toFixed(1) + '%';
            }
        };
        let number_of_collisions = {
            name: "number_of_collision",
            title: "Пересечений: ",
            ordering: 'minimize',
            view: ""
        };

        const params = [];

        params.push(number_of_results, number_of_branches, number_of_finish);
        let loops = true;
        //TODO неудобно доставать данные из settings, сначала их надо обработать. Сейчас есть обработка через глобальный SETTINGS, это не подходит для вызова через Java
        if ('LOOPS' in this.settings)
            loops = this.settings.LOOPS === 'true' || this.settings.LOOPS === true;
        if (loops)
            params.push(number_of_loops);
        params.push(number_of_merges);

        let show_number_of_collision = true;
        if ('SHOW_NUMBER_OF_COLLISION' in this.settings)
            show_number_of_collision = this.settings.SHOW_NUMBER_OF_COLLISION === 'true' || this.settings.SHOW_NUMBER_OF_COLLISION === true;
        if (show_number_of_collision)
            params.push(number_of_collisions);

        return params;
    };
    solution() {
        return save({dont_save: true});
    }
    loadSolution(solution) {
        //console.log("Store.API.emptySolution", Store.API.emptySolution);

        if(solution !== undefined){
            if(typeof solution === "string"){
                recover(solution);
                analyze(Store.state.lines)
                solution = JSON.parse(solution);
            }
            if(solution){
                this.kioapi.submitResult(solution);
            }
        }

    };
}

export default Streams;
