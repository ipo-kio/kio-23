export class Stool {

    constructor(settings) {
    }

    parameters = function () {
        return [
            {
                name: "distance", //название параметра
                title: "Расстояние до поверхности", //отображение названия для пользователя
                ordering: 'minimize', // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
                view: ""
            },
            {
                name: "tiltAngle",
                title: "Угол наклона",
                ordering: 'minimize',
                view: "°"
            }
        ];
    };
}

