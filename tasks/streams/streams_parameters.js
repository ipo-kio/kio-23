export class Streams {
    constructor(settings) {
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
}
