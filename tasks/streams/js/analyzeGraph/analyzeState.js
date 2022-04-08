const state = {
    mode: "analyze", // analyze | follow,
    count: 0, //Для выделения линии пути ,
    path: undefined,
    results: {},
    analyzeInfo: {
        number_of_branches: 0,
        number_of_loops: 0,
        number_of_mergers: 0,
        number_of_finish: 0,
        number_of_results: 0,
        number_of_collision: 0,
    }
}

export default state;
