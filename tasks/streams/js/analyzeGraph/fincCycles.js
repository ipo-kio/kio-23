import uniqueId from "../CNV/uniqueId";

function findCycles(start){
    const cycles = []; //[[line, line, line], [line, line, line], [line, line, line]];
    const curPath = [];
    function check(target, lastTarget){
        curPath.push(target);
        if(target.__CHECKED){
            lastTarget.__CYCLEEND = true;
            const index = curPath.indexOf(target);
            cycles.push(curPath.slice(index, curPath.length));
            let id = uniqueId();

            //Обрабатыаем цикл
            cycles[cycles.length - 1].forEach((line, index)=> {
                if(line.__CYCLEPATH_IDS){
                    line.__CYCLEPATH_IDS.push(id);
                } else {
                    line.__CYCLEPATH_IDS = [id];
                }
                line.__CYCLEPATH = true;

                if(line.parents.length > 1 && index !== 0 && index !== cycles[cycles.length - 1].length - 1){
                    line.sideIn.forEach(parent => {
                        if(parent !== cycles[cycles.length - 1][index - 1]) {
                            parent.__CYCLEIN = true;
                        }
                    })
                }
            })

            //Не убираем checked, потому что у нас a1, a2, ...., a1 - мы на a1 и в конце, уберём, когда дойдём до начала
            curPath.pop();
            return;
        }
        target.__CHECKED = true;
        target.children.forEach(item => {
            check(item, target);
        })

        //После завершения вызова детей убираем из пути элемент
        curPath.pop();
        target.__CHECKED = false;
    }

    if(start){
        check(start);
    }
    //Проверка на одинаковые циклы
    for(let i = 0; i < cycles.length; i++){
        let mainCycle = cycles[i];
        for (let j = i + 1; j < cycles.length; j++) {
            let curCycle = cycles[j];
            let flag = true;
            for (let k = 0; k < mainCycle.length; k++) {
                if(mainCycle[k] !== curCycle[k]){
                    flag = false;
                    break;
                }
            }
            if(mainCycle.length !== curCycle.length){
                flag = false;
            }

            if(flag === true){
                cycles.splice(j, 1);
                //console.log("before splice", cycles);
                j--;
            }
        }
    }

    return cycles;
}

export default findCycles;