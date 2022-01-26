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
        inputTicketContainer.innerHTML = '<input maxlength="6" class="input-number">';
        ticketsContainer.appendChild(inputTicketContainer);
        inputTicketContainer.addEventListener('input', (event: InputEvent) => {
            // Add input validation
            // Show error message for incorrect input
            // Pass input to algorithm
            // Specify max length as variable
            if (event?.data) {
                console.log('clicked ', event.data);
                this.storedInput += event.data;
                console.log(this.storedInput);
                if (this.storedInput?.length) {
                    const outputField = <HTMLInputElement>document.getElementById('output-field');
                    
                    if (outputField) {
                        outputField.value = this.storedInput;
                    }
                }
            }
        });

        const outputTicketContainer = document.createElement('div');
        outputTicketContainer.className = 'output-ticket-container';
        outputTicketContainer.innerHTML = '<input disabled class="output-number" id="output-field">';
        ticketsContainer.appendChild(outputTicketContainer);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        this.domNode.appendChild(buttonsContainer);

        const stepPlusButton = document.createElement('button');
        stepPlusButton.className = 'step-plus-button';
        stepPlusButton.innerText = 'ШАГ +';
        buttonsContainer.appendChild(stepPlusButton);

        const instantResultButton = document.createElement('button');
        instantResultButton.innerText = 'МГНОВЕННЫЙ РЕЗУЛЬТАТ';
        instantResultButton.className = 'instant-result-button';
        buttonsContainer.appendChild(instantResultButton);

        const stepMinusButton = document.createElement('button');
        stepMinusButton.innerText = 'ШАГ -';
        stepMinusButton.className = 'step-minus-button';
        buttonsContainer.appendChild(stepMinusButton);

        const demoButton = document.createElement('button');
        demoButton.innerText = 'РЕЖИМ ДЕМОНСТРАЦИИ';
        demoButton.className = 'demo-button';
        buttonsContainer.appendChild(demoButton);

        const animationButton = document.createElement('button');
        animationButton.innerText = 'АНИМАЦИЯ ПЕРЕБОРА';
        animationButton.className = 'animation-button';
        buttonsContainer.appendChild(animationButton);

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
