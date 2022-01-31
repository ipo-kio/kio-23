import './luckytickets.scss'
import {KioApi, KioTask, KioParameterDescription, KioResourceDescription, KioTaskSettings} from "../KioApi";

enum OperatorsList {
    IF = 'ЕСЛИ',
    THEN = 'ТО',
    ELSE = 'ИНАЧЕ',
    AND = 'И',
    LT = '<',
    LTE = '<=',
    GT = '>',
    GTE = '>=',
    EQUALS = '=',
    PLUS = '+',
    MINUS = '-',
    MULT = '*',
    DIVISION = '/',
    POW = '^'
}
interface AllowedOperations {
    [key: string]: PrimitiveOperation;
}

interface PrimitiveOperation {
    operation: string;
    userOperator: string;
    jsOperator: string;
}

const MathOperations: AllowedOperations = {
    sum: {
        operation: 'SUM',
        userOperator: '+',
        jsOperator: '+'
    },
    subtr: {
        operation: 'SUBTR',
        userOperator: '-',
        jsOperator: '-'
    },
    mult: {
        operation: 'MULT',
        userOperator: '*',
        jsOperator: '*'
    },
    division: {
        operation: 'DIVISION',
        userOperator: '/',
        jsOperator: '/'
    },
    power: {
        operation: 'POWER',
        userOperator: '^',
        jsOperator: '**'
    }
}
interface MathOperator {
    operation: string;
    userOperator: string;
    jsOperator: string;
}

type Comparator = '===' | '<' | '<=' | '>' | '>=' | '=';
type Conditionals = 'IF' | 'THEN' | 'ELSE';

interface BaseToken {
    operation: string;
    operands: any[];
}

interface ConditionExpression {
    condition: Conditionals | string;
    expression: string;
}

interface CompareExpression {
    comparator: Comparator | string;
    left: string;
    right: string;
}
export class Luckytickets implements KioTask {
    private settings: KioTaskSettings;
    private kioapi: KioApi;
    private domNode: HTMLElement;
    private storedInput = '';
    private linesCount = 1;
    private linesArray = [1];
    
    private complexExpressionTree: BaseToken = {
        operation: '',
        operands: []
    };

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
        inputTicketImage.innerHTML = '<input maxlength="6" class="input-number" placeholder="abcdef">';
        inputTicketContainer.appendChild(inputTicketImage);
        inputTicketImage.addEventListener('input', (event: InputEvent) => {
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
        outputTicketImage.innerHTML = '<input disabled class="output-number" id="output-field" placeholder="xyzuvw">';
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
        
        if (editorElement) {
            const ruler = document.getElementById('ruler');
            ruler.innerHTML = `<div class="line-number" id="${this.linesArray[0].toString()}">${this.linesArray[0].toString()}</div>`;
        }
        editorElement.addEventListener('keydown', (event) => {
            if (editorElement?.value) {
                this.updateRuler(editorElement.value);
            }
        });

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        this.domNode.appendChild(buttonsContainer);

        const stepPlusButton = document.createElement('button');
        stepPlusButton.className = 'step-plus-button';
        stepPlusButton.innerText = 'СЛЕДУЮЩАЯ ОШИБКА';
        buttonsContainer.appendChild(stepPlusButton);
        stepPlusButton.addEventListener('click', (event) => {
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
        stepMinusButton.innerText = 'ПРЕДЫДУЩАЯ ОШИБКА';
        stepMinusButton.className = 'step-minus-button';
        buttonsContainer.appendChild(stepMinusButton);
        stepMinusButton.addEventListener('click', (event) => {
        });

        const demoButton = document.createElement('button');
        demoButton.innerText = 'ЗАПУСК';
        demoButton.className = 'demo-button';
        buttonsContainer.appendChild(demoButton);
        demoButton.addEventListener('click', (event) => {
            if (editorElement?.value) {
                const rawDataArray = this.splitLines(editorElement.value);
                const jsFunctionString = this.constructJSFunction(rawDataArray);
                console.log('PROCESSED DATA', jsFunctionString);
                // this.callJSFunction(jsFunctionString);
            }
        });

        const animationButton = document.createElement('button');
        animationButton.innerText = 'АНИМАЦИЯ ПЕРЕБОРА';
        animationButton.className = 'animation-button';
        buttonsContainer.appendChild(animationButton);
        animationButton.addEventListener('click', (event) => {
        });
    }

    private updateRuler(value: string): void {
        const ruler = document.getElementById('ruler');
        const lines = value.split(/\r*\n/);
        this.linesCount = lines.length;

        if (this.linesArray[this.linesArray.length - 1] === this.linesCount) {
            return;
        } else if (this.linesCount < this.linesArray[this.linesArray.length - 1]) {
            ruler.removeChild(ruler.lastChild);
            this.linesArray.pop();
            return;
        }
        this.linesArray.push(this.linesCount);
        const elem = document.createElement("div");
        elem.setAttribute('id', this.linesCount.toString());
        elem.className = 'line-number';
        elem.innerText = this.linesCount.toString();
        ruler.appendChild(elem);
    }

    private splitLines(editorValue: string): string[] {
        return editorValue.split(/\r*\n/);
    }

    private constructJSFunction(rawDataArray: string[]): string {
        return this.processRawData(rawDataArray).join('');
    }

    private processRawData(rawDataArray: string[]): string[] {
        const processedData: string[] = [];
        rawDataArray.forEach((rawLine) => {
            const conditionExpression: ConditionExpression = this.buildCondition(rawLine);
            const compareExpression: CompareExpression = this.buildCompare(conditionExpression);

            let decomposedLeft: any;
            if (this.codeContainsOperator(compareExpression.left)) {
                this.initTree();
                this.keepDecomposing(compareExpression.left);
                decomposedLeft = Object.assign({}, this.complexExpressionTree);
            } else {
                decomposedLeft = compareExpression.left;
            }

            let decomposedRight: any;
            if (this.codeContainsOperator(compareExpression.right)) {
                this.initTree();
                this.keepDecomposing(compareExpression.right);
                decomposedRight = this.complexExpressionTree;
            } else {
                decomposedRight = Object.assign({}, compareExpression.right);
            }

            const jsLine = this.constructJSLine(conditionExpression, compareExpression, decomposedLeft, decomposedRight);
            processedData.push(jsLine);
        });
        return processedData;
    }

    private initTree() {
        this.complexExpressionTree.operation = '';
        this.complexExpressionTree.operands = [];
    }

    private keepDecomposing(rawExpression: string, currentIndex?: number, parentIndex?: number) {
        const lineWithoutSpaces = rawExpression.split(' ').join('');
        if (lineWithoutSpaces.includes(OperatorsList.PLUS)) {
            this.buildTree(lineWithoutSpaces, MathOperations.sum, parentIndex, currentIndex);
        } else if (lineWithoutSpaces.includes(OperatorsList.MINUS)) {
            this.buildTree(lineWithoutSpaces, MathOperations.subtr, parentIndex, currentIndex);
        } else if (lineWithoutSpaces.includes(OperatorsList.MULT)) {
            this.buildTree(lineWithoutSpaces, MathOperations.mult, parentIndex, currentIndex);
        } else if (lineWithoutSpaces.includes(OperatorsList.DIVISION)) {
            this.buildTree(lineWithoutSpaces, MathOperations.division, parentIndex, currentIndex);
        } else if (lineWithoutSpaces.includes(OperatorsList.POW)) {
            this.buildTree(lineWithoutSpaces, MathOperations.power, parentIndex, currentIndex);
        }
    }

    private buildTree(lineWithoutSpaces: string, mathOperator: MathOperator, parentIndex: number, currentIndex: number) {
        const operands = this.findOperands(lineWithoutSpaces, mathOperator.userOperator);
        if (parentIndex === undefined && currentIndex === undefined) {
            this.complexExpressionTree = {
                operation: mathOperator.operation,
                operands
            }
            operands.forEach((operand, index) => {
                if (this.codeContainsOperator(operand)) {
                    this.keepDecomposing(operand, index);
                }
            });
        } else if (currentIndex !== undefined && parentIndex === undefined) {
            this.complexExpressionTree.operands[currentIndex] = {
                operation: mathOperator.operation,
                operands
            }
            operands.forEach((operand, index) => {
                if (this.codeContainsOperator(operand)) {
                    this.keepDecomposing(operand, index, currentIndex);
                }
            });
        } else if (parentIndex !== undefined && currentIndex !== undefined) {
            this.complexExpressionTree.operands[parentIndex].operands[currentIndex] = {
                operation: mathOperator.operation,
                operands
            }
            operands.forEach((operand, index) => {
                if (this.codeContainsOperator(operand)) {
                    this.keepDecomposing(operand, index, parentIndex);
                }
            });
        }
    }

    private constructJSLine(conditionExpression: ConditionExpression, compareExpression: CompareExpression, decomposedLeft: BaseToken, decomposedRight: BaseToken): string {
        const leftExpression = this.constructExpression(decomposedLeft);
        const rightExpression = this.constructExpression(decomposedRight);
        const comparator = '';
        let constructedLine = '';
        if (conditionExpression.condition === 'IF') {
            constructedLine = `${conditionExpression.condition}(${leftExpression}${compareExpression.comparator}${rightExpression})`;
        } else if (conditionExpression.condition === 'THEN') {
            constructedLine = `{${leftExpression}${compareExpression.comparator}${rightExpression}}`;
        } else if (conditionExpression.condition === 'ELSE') {
            constructedLine = `${conditionExpression.condition}{${leftExpression}${compareExpression.comparator}${rightExpression}}`;
        }
        return constructedLine;
    }

    private constructExpression(exprTree: any): string {
        let expr = '';
        if (typeof exprTree === 'string') {
            return expr = exprTree;
        } else if (exprTree?.operands && exprTree.operands.every((operand: any) => {
            return typeof operand === 'string';
        })) {
            return expr = `(${exprTree.operands.join(this.getJSOperator(exprTree.operation))})`;
        } else if (exprTree?.operands) {
            exprTree.operands.forEach((entry: any) => {
                const operatorNeeded = expr.length > 0 ? this.getJSOperator(exprTree.operation) : '';
                expr += operatorNeeded + this.constructExpression(entry);
            });
            return `(${expr})`;
        }
    }

    private getJSOperator(operation: string): string {
        return MathOperations[operation.toLowerCase()].jsOperator;
    }

    private codeContainsOperator(codeLine: string): boolean {
        const hasOperand = codeLine.includes(OperatorsList.PLUS) ||
            codeLine.includes(OperatorsList.MINUS) ||
            codeLine.includes(OperatorsList.MULT) ||
            codeLine.includes(OperatorsList.DIVISION) ||
            codeLine.includes(OperatorsList.POW);
        return hasOperand;
    }

    private buildCondition(codeLine: string): ConditionExpression {
        const conditionExpression = {
            condition: '',
            expression: ''
        }
        if (codeLine.includes(OperatorsList.IF)) {
            conditionExpression.condition = 'IF';
            conditionExpression.expression = codeLine.substring(OperatorsList.IF.length); 
        } else if (codeLine.includes(OperatorsList.ELSE)) {
            conditionExpression.condition = 'ELSE';
            conditionExpression.expression = codeLine.substring(OperatorsList.ELSE.length); 
        } else if (codeLine.includes(OperatorsList.THEN)) {
            conditionExpression.condition = 'THEN';
            conditionExpression.expression = codeLine.substring(OperatorsList.THEN.length); 
        }
        return conditionExpression;
    }

    private buildCompare(codeLine: ConditionExpression): CompareExpression {
        const decomposedLine = {
            comparator: '',
            left: '',
            right: ''
        }

        if (codeLine.expression.includes(OperatorsList.EQUALS)) {
            if (codeLine.condition === 'IF') {
                decomposedLine.comparator = '===';
            } else if (codeLine.condition === 'ELSE' || codeLine.condition === 'THEN') {
                decomposedLine.comparator = '=';
            }
            decomposedLine.left = codeLine.expression.split(OperatorsList.EQUALS)[0]; 
            decomposedLine.right = codeLine.expression.split(OperatorsList.EQUALS)[1]; 
        } else if (codeLine.expression.includes(OperatorsList.LT)) {
            decomposedLine.comparator = '<';
            decomposedLine.left = codeLine.expression.split(OperatorsList.LT)[0]; 
            decomposedLine.right = codeLine.expression.split(OperatorsList.LT)[1]; 
        } else if (codeLine.expression.includes(OperatorsList.LTE)) {
            decomposedLine.comparator = '<=';
            decomposedLine.left = codeLine.expression.split(OperatorsList.LTE)[0]; 
            decomposedLine.right = codeLine.expression.split(OperatorsList.LTE)[1]; 
        } else if (codeLine.expression.includes(OperatorsList.GT)) {
            decomposedLine.comparator = '>';
            decomposedLine.left = codeLine.expression.split(OperatorsList.GT)[0]; 
            decomposedLine.right = codeLine.expression.split(OperatorsList.GT)[1]; 
        } else if (codeLine.expression.includes(OperatorsList.GTE)) {
            decomposedLine.comparator = '>=';
            decomposedLine.left = codeLine.expression.split(OperatorsList.GTE)[0]; 
            decomposedLine.right = codeLine.expression.split(OperatorsList.GTE)[1]; 
        }
        return decomposedLine;
    }

    private findOperands(lineWithoutSpaces: string, operator: string): string[] {
        const tokens: string[] = [];
        const arrayWithoutOperand = lineWithoutSpaces.split(operator);
        arrayWithoutOperand.forEach((operand) => {
            tokens.push(operand);
        });
        return tokens;
    }

    private callJSFunction(jsString: string): void {
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
