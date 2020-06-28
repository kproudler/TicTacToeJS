const Board = require("./board");
const MoveError = require("./moveError");

class Game {
    constructor() {
        this.board = new Board();
        this.currentPlayer = Board.marks[0];
    }

    isOver() {
        return this.board.isOver();
    }

    playMove(pos) {
        this.board.placeMark(pos, this.currentPlayer);
        this.swapTurn();
    }

    swapTurn() {
        if (this.currentPlayer === Board.marks[0]) {
            this.currentPlayer = Board.marks[1];
        } else {
            this.currentPlayer = Board.marks[0];
        }
    }

    promptMove(reader, callback) {
        this.board.print();

        reader.question("Enter your chosen row: ", rowIdxString => {
            const rowIdx = parseInt(rowIdxString);
            reader.question("Enter your chosen column: ", colIdxString => {
                const colIdx = parseInt(colIdxString);
                callback([rowIdx, colIdx]);
            })
        })
    }

    run(reader, completionCallback) {
        this.promptMove(reader, move => {
            try {
                this.playMove(move);
            } catch (e) {
                if (e instanceof MoveError) {
                    console.log(e.msg);
                } else {
                    throw e;
                }
            }

            if (this.isOver()) {
                this.board.print();
                if (this.winner()) {
                    console.log(`${this.winner()} has won!`);
                } else {
                    console.log('NO ONE WINS!');
                }
                completionCallback();
            } else {
                // continue loop
                this.run(reader, completionCallback);
            }
        });
    }

    winner() {
        return this.board.winner();
    }

}


module.exports = Game;