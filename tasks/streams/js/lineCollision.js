import CNV from "./CNV/library";

function lineCollision(target, notThis = []){
    let isCollision;
    if(notThis instanceof Array === false){
        notThis = [notThis];
    }
    CNV.querySelectorAll(".line").forEach(line => {
        if(target !== line && notThis.filter(item => item === line).length === 0){
            let res = CNV.lineCollision(target, line);
            if(res.result) {
                isCollision = true;
                let warning = setInterval(() => {
                    res.target.classList.toggle("lineWarning");
                }, 100)
                setTimeout(() => {
                    clearInterval(warning);
                    res.target.classList.remove("lineWarning");
                }, 1000)
            }
        }
    })
    return isCollision;
}

export default lineCollision;