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
            }
        });

        const outputTicketContainer = document.createElement('div');
        outputTicketContainer.className = 'output-ticket-container';
        outputTicketContainer.innerHTML = '<input disabled class="output-number">';
        ticketsContainer.appendChild(outputTicketContainer);
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