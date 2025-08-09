export default class MathProblem {
    constructor(difficulty, operation = 'plus') {
        this.difficulty = difficulty;
        this.operation = operation;
        this.generate();
    }

    generate() {

        let operation;

        switch (this.operation) {
            case 'plus':
                operation = '+';
                break;
            case 'minus':
                operation = '-';
                break;
            case 'multiply':
                operation = '*';
                break;
            default:
                operation = '+';
        }

        let a, b;

        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * this.difficulty.max) + 1;
                b = Math.floor(Math.random() * this.difficulty.max) + 1;
                this.answer = a + b;
                this.problem = `${a} + ${b} = ?`;
                break;

            case '-':
                a = Math.floor(Math.random() * this.difficulty.max) + 1;
                b = Math.floor(Math.random() * a) + 1; // b не больше a, чтобы не было отрицательных чисел
                this.answer = a - b;
                this.problem = `${a} - ${b} = ?`;
                break;

            case '*':
                a = Math.floor(Math.random() * Math.min(this.difficulty.max / 2, 10)) + 1;
                b = Math.floor(Math.random() * Math.min(this.difficulty.max / 2, 10)) + 1;
                this.answer = a * b;
                this.problem = `${a} × ${b} = ?`;
                break;
        }
    }

    check(number) {
        return number === this.answer;
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.generate();
    }
}