import recover from "./storage/recover";
import Store from "./Store";
import analyze from "./analyzeGraph/analyze";

function ctrlZHandler(){
    const nextBtn = document.querySelector("#btn_next");
    const prevBtn = document.querySelector("#btn_prev");

    nextBtn.onclick = e => {
        recover(Store.getStackNext());
        analyze(Store.state.lines);
    }

    prevBtn.onclick = e => {
        Store.showStack();
        recover(Store.getStackPrev());
        analyze(Store.state.lines);
    }


    window.addEventListener("keydown", e => {
        if((e.key === "Z" || e.key === "Я") && e.ctrlKey && e.shiftKey){
            recover(Store.getStackNext());
            analyze(Store.state.lines);
        }  else if((e.key === "z" || e.key === "я") && e.ctrlKey){
            recover(Store.getStackPrev());
            analyze(Store.state.lines);
        }
    })
}

export default ctrlZHandler;