import './luckytickets.scss'
import {KioApi, KioTask, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";

export class Luckytickets implements KioTask {
    private settings: KioTaskSettings;
    private kioapi: KioApi;
    private domNode: HTMLElement;
    private storedInput = '';

    constructor(settings: KioTaskSettings) {
        this.settings = settings;
    }

    id() {
        return "luckytickets" + this.settings.level;
    }

    initialize(domNode: HTMLElement, kioapi: KioApi, preferred_width: number) {
        console.log('preferred width in problem initialization', preferred_width);

        this.kioapi = kioapi;
        this.domNode = domNode;

        console.log('problem level is', this.settings.level);
        const ticketsContainer = document.createElement('div');
        ticketsContainer.className = 'tickets-container';
        this.domNode.appendChild(ticketsContainer);

        const inputTicketContainer = document.createElement('div');
        inputTicketContainer.className = 'input-ticket-container';

        const inputTicketTitle = document.createElement('div');
        inputTicketTitle.className = 'input-ticket-title';
        inputTicketTitle.innerText = 'Текущий номер билета';
        inputTicketContainer.appendChild(inputTicketTitle);

        const inputTicketImage = document.createElement('div');
        inputTicketImage.className = 'input-ticket-image';
        inputTicketImage.innerHTML = '<input maxlength="6" class="input-number">';
        inputTicketContainer.appendChild(inputTicketImage);
        inputTicketImage.addEventListener('input', (event: InputEvent) => {
            // Add input validation
            // Show error message for incorrect input
            // Pass input to algorithm
            // Specify max length as variable
            if (event?.data) {
                this.storedInput += event.data;
            }
        });

        ticketsContainer.appendChild(inputTicketContainer);

        const outputTicketContainer = document.createElement('div');
        outputTicketContainer.className = 'output-ticket-container';

        const outputTicketTitle = document.createElement('div');
        outputTicketTitle.className = 'output-ticket-title';
        outputTicketTitle.innerText = 'Следующий счастливый билет';
        outputTicketContainer.appendChild(outputTicketTitle);

        const outputTicketImage = document.createElement('div');
        outputTicketImage.className = 'output-ticket-image';
        outputTicketImage.innerHTML = '<input disabled class="output-number" id="output-field">';
        outputTicketContainer.appendChild(outputTicketImage);

        ticketsContainer.appendChild(outputTicketContainer);

        const codeEditor = document.createElement('div');
        codeEditor.className = 'code-editor';
        codeEditor.innerHTML = '<div class="code-editor-header" id="code-editor-header-id"></div><div class="code-lines" id="ruler"></div><textarea id="text-from-editor"></textarea>';

        this.domNode.appendChild(codeEditor);

        const infoIcon = document.createElement('div');
        infoIcon.className = 'info-icon';
        const editorHeader = document.getElementById('code-editor-header-id');
        editorHeader.appendChild(infoIcon);

        const editorElement = <HTMLTextAreaElement>document.getElementById('text-from-editor');
        let linesCount = 1;
        let linesArray = [1];
        if (editorElement) {
            const ruler = document.getElementById('ruler');
            ruler.innerHTML = `<div class="line-number" id="${linesArray[0].toString()}">${linesArray[0].toString()}</div>`;
        }
        editorElement.addEventListener('keydown', (event) => {
            if (editorElement?.value) {
                const ruler = document.getElementById('ruler');
                const lines = editorElement.value.split(/\r*\n/);
                linesCount = lines.length;

                if (linesArray[linesArray.length - 1] === linesCount) {
                    return;
                } else if (linesCount < linesArray[linesArray.length - 1]) {
                    ruler.removeChild(ruler.lastChild);
                    linesArray.pop();
                    return;
                }
                linesArray.push(linesCount);
                const elem = document.createElement("div");
                elem.setAttribute('id', linesCount.toString());
                elem.className = 'line-number';
                elem.innerText = linesCount.toString();
                ruler.appendChild(elem);
            }
        });


        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        this.domNode.appendChild(buttonsContainer);

        const stepPlusButton = document.createElement('button');
        stepPlusButton.className = 'step-plus-button';
        stepPlusButton.innerText = 'ШАГ +';
        buttonsContainer.appendChild(stepPlusButton);
        stepPlusButton.addEventListener('click', (event) => {
            console.log('clicked +');
        });

        const instantResultButton = document.createElement('button');
        instantResultButton.innerText = 'МГНОВЕННЫЙ РЕЗУЛЬТАТ';
        instantResultButton.className = 'instant-result-button';
        buttonsContainer.appendChild(instantResultButton);
        instantResultButton.addEventListener('click', (event) => {
            if (this.storedInput?.length) {
                const outputField = <HTMLInputElement>document.getElementById('output-field');
                if (outputField) {
                    outputField.value = this.storedInput;
                }
            }
        });

        const stepMinusButton = document.createElement('button');
        stepMinusButton.innerText = 'ШАГ -';
        stepMinusButton.className = 'step-minus-button';
        buttonsContainer.appendChild(stepMinusButton);
        stepMinusButton.addEventListener('click', (event) => {
            console.log('clicked -');
        });

        const demoButton = document.createElement('button');
        demoButton.innerText = 'РЕЖИМ ДЕМОНСТРАЦИИ';
        demoButton.className = 'demo-button';
        buttonsContainer.appendChild(demoButton);
        demoButton.addEventListener('click', (event) => {
            if (editorElement?.value) {
                if (editorElement.value.toUpperCase() === 'ПЕЧАТЬ' && this.storedInput?.length) {
                    alert(`Your Input IS ${this.storedInput}`);
                } else if (!this.storedInput.length && editorElement.value.toUpperCase() === 'ПЕЧАТЬ') {
                    alert('NO INPUT');
                 } else {
                    alert('UNKNOWN FUNCTION');
                }
            }
        });

        const animationButton = document.createElement('button');
        animationButton.innerText = 'АНИМАЦИЯ ПЕРЕБОРА';
        animationButton.className = 'animation-button';
        buttonsContainer.appendChild(animationButton);
        animationButton.addEventListener('click', (event) => {
            console.log('animation button clicked');
        });
    }

    parameters(): KioParameterDescription[] {
        return [
            {
                name: "steps",
                title: "Количество шагов",
                ordering: 'maximize',
                view: "ш"
            },
            {
                name: "max",
                title: "Максимальное число",
                ordering: 'minimize',
                view: function (val) {
                    return '[' + val + ']'
                }
            }
        ];
    }

    /*static preloadManifest(): KioResourceDescription[] {
        return [
            {id: "1", src: "collatz_es_next-resources/collatz_conjecture.png"}
        ];
    };*/

    solution(): Solution {
        return {};
    };

    loadSolution(solution: Solution): void {
    }
}

interface Solution {
}
