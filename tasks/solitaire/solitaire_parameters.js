export class Solitaire {
  constructor(settings) {
  }

  parameters = function () {
    return [
      {
        name: "progress",
        title: "Беспорядки",
        ordering: "minimize",
        view: "",
      },
      {
        name: "length",
        title: "Длинна перемещений",
        ordering: "minimize",
        view: "",
      },
      {
        name: "steps", //название параметра
        title: "Шаги", //отображение названия для пользователя
        ordering: "minimize", // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
        view: "",
      },
      {
        name: "drops", //название параметра
        title: "Сбросы на пустые клетки", //отображение названия для пользователя
        ordering: "minimize", // 'maximize' - надо как можно больше, 'minimize' - как можно меньше
        view: "",
      },
    ];
  };

}