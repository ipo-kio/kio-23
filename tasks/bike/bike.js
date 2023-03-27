import ReactDOM from "react-dom/client";
import React from "react";
import SceneComponent from "./components/scenecomponent/SceneComponent";
import {Level} from "./Level";

export class Bike {
    // Разработка задачи начинается с выбора идентификатора. Он должен состоять из маленьких букв, возможно, с подчеркиваниями.
    // В этой задаче идентификатор будет `collatz_js`. Каталог с задачей должен называться как id задачи. Основной файл с
    // исходным кодом должен называться как id задачи. Каталог с ресурсами должен называться как id-resources.
    // Класс с задачей должен называться как id задачи с большой буквы (Collatz_js).


//
//     /**
//      * создаем класс Collatz, конструктор может быть пустым, инициализация происходит позже.
//      * Конструктор может быть вызван не в браузере, поэтому из него нельзя обращаться к DOM.
//      * Это необходимо для автоматической проверки решений на сервере.
//      *
//      * @param settings произвольный объект настроек "лаборатории".
//      * Обычно settings содержит только информацию об уровне, например settings = {level : 2}
//      * @constructor
//      */
    constructor(settings) {
        this.settings = settings;
        this.sceneRef = React.createRef()
    }
//
// // Далее перечисляются функции, которые нужно реализовать
//
//     /**
//      * Возвращается ключ для хранения данных о процессе решения в localstorage, формируется на основе id и данных из
//      * настроек. В будущем этот метод будет удалён, ключ будет формироваться автоматически.
//      */
    id = function () {
        return "bike";
    };
//
//     /**
//      * Функция инициализации, в этой функции можно создавать интерфейс задачи и уже можно пользоваться KioApi
//      * @param domNode dom-узел, который нужно наполнять содержимым задачи
//      * @param kioapi ссылка на api для совершения всех действий с задачей
//      * @param preferred_width ширина div, в котором нужно создать условие задачи. Рекомендуется не использовать это
//      * значение, ширина окна браузера может меняться в процессе работы с лабораторией.
//      */
    initialize = (domNode, kioapi, preferred_width) => {
        //сохраняем данные для будущего использования
        this.kioapi = kioapi;
        this.domNode = domNode;

        domNode.style.width = "1500px"
        domNode.style.height = "760px"
        domNode.style.overflowX = "auto"
        domNode.style.overflowY = "hidden"

        //    width: 1500px;
        //     height: 760px;
        //     overflow-x: auto;

        //settings могут иметь произвольные данные для инициализации, например, уровень
        // console.log('problem level is', this.settings.level);

        //инициализируем интерфейс
        //инициализируем содержимое задачи в элементе domNode,
        //initInterface - это наш собственный приватный метод
        //В коде, по историческим причинам, используется jquery. Сейчас рекомендуется разрабатывать без него.

        const root = ReactDOM.createRoot(this.domNode);

        //{
        // "level" : "1"
        // }

        root.render(
            <>
                <SceneComponent ref = {this.sceneRef} kioApi={kioapi} level={+this.settings.level === 1 ? Level.middle_6_8 : Level.high_9_11}/>
            </>
        )
    };

    parameters = function () {
        return [
            {
                name: "res",
                title: "Результат вычислен",
                ordering: "maximize",
                view: function (v) {
                    if (v > 0) return "Да"; else return "-"
                },
            },
            {
                name: "diffF",
                title: "Среднее отклонение скорости",
                ordering: "minimize",
                view: "",
            },
            {
                name: "maxSpeedDeviation",
                title: "Максимальное отклонение скорости",
                ordering: "minimize",
                view: "",
            }
        ];
    };
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
    solution = function () {
        if (!this.sceneRef.current){
            return {tableData: [[]]}
        }
        return {...this.sceneRef.current.getTableData(), res: this.sceneRef.current.getResult()};
    };
//
//     /**
//      * Загрузка решения в задачу. В качестве аргумента solution будет передан объект, который
//      * до этого был сформирован в методе solution. При загрузке решения нужно обновить данные через kioapi.submitResult
//      * @param solution решение для загрузки
//      */
    loadSolution = function (solution) {

        setTimeout(() => {
            if (!solution) {
                this.sceneRef.current.loadSolution(null)
            }

            this.sceneRef.current.loadSolution(solution)
        }, 300)
    };
//
}
