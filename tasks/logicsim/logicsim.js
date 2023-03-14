import LogicSim from "./src/LogicSim";


export class Logicsim {

    constructor(settings) {
        this.settings = settings;
        this.logicSim = null;
    }

    id = function () {
        return "logicsim";
    };

    initialize = (domNode, kioapi, preferred_width) => {
        //сохраняем данные для будущего использования
        this.kioapi = kioapi;
        this.domNode = domNode;

        const container = document.createElement("div")
        container.style.height = "720px"
        container.style.width = "100%"
        this.domNode.appendChild(container)

        if (!this.settings.level) {
            console.error("Wrong level provided")
        }

        this.logicSim = new LogicSim(container, +this.settings.level, this.onSubmitResult, false)
    };

    parameters = function () {

        return [
            {
                name: "passedFraction",
                title: "Процент успешных тестов",
                ordering: "maximize",
                view: "%",
            },
            {
                name: "elementsUsed",
                title: "Использовано элементов",
                ordering: "minimize",
                view: "",
            }
        ];
    };

    onSubmitResult = (res) => {
        res.passedFraction *= 100
        this.kioapi.submitResult(res)
    }
//

//      * Ресурсы (изображения, звуки) должны находиться в каталоге с именем `[id-задачи]-resources`.
//      * Webpack настроен так, что он целиком копирует этот каталог в каталог dist с результатом.
//      *
//      * В общем случае, путь до ресурса считается от js-файла с задачей. Но т.к. все ресурсы находятся в каталоге
//      * `[id-задачи]-resources`, надо указывать этот каталог в пути.
//      * @returns [{id: String, src: String}]
//      */
//     static preloadManifest = function () {
//         return [];
//     };
//
//     /**
//      * Возвращает текущее решение в виде объекта,
//      * он будет сериализован с помощью JSON.stringify для хранения и передачи по сети, поэтому он должен содержать только
//      * строки, числа, массивы, внутренние объекты.
//      */
    solution = () => {
        if (!this.logicSim) return
        return this.logicSim.getCircuit()
    };
//
//     /**
//      * Загрузка решения в задачу. В качестве аргумента solution будет передан объект, который
//      * до этого был сформирован в методе solution. При загрузке решения нужно обновить данные через kioapi.submitResult
//      * @param solution решение для загрузки
//      */
    loadSolution = function (solution) {
        if (!solution) return
        this.logicSim.core.clear()
        this.logicSim.loadCircuit(solution)
    };
//
}
