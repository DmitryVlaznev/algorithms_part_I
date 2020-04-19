// Write a program to solve the 8-puzzle problem (and its natural
// generalizations) using the A* search algorithm.

// The problem. The 8-puzzle is a sliding puzzle that is played on a
// 3-by-3 grid with 8 square tiles labeled 1 through 8, plus a blank
// square. The goal is to rearrange the tiles so that they are in
// row-major order, using as few moves as possible. You are permitted to
// slide tiles either horizontally or vertically into the blank square.
// The following diagram shows a sequence of moves from an initial board
// (left) to the goal board (right).

// |  1 3|    |1   3|    |1 2 3|    |1 2 3|    |1 2 3|
// |4 2 5| => |4 2 5| => |4   5| => |4 5  | => |4 5 6|
// |7 8 6|    |7 8 6|    |7 8 6|    |7 8 6|    |7 8  |

// https://coursera.cs.princeton.edu/algs4/assignments/8puzzle/specification.php

const { IllegalArgumentException } = require("./custom-exceptions");
const { PriorityQueue } = require("./priority-queue");

class Board {
    /**
     * Generate a random size * size board.
     *
     * @param {number} size The board size [2..127).
     */
    static generateRandomBoard(size) {
        if (size < 2 || size > 127) {
            throw new IllegalArgumentException("The size must be in a range [2..127).");
        }
        const nums = Array.apply(null, new Array(size ** 2)).map((v, i) => i);
        for (let i = nums.length - 1; i > 0; i--) {
            const subst = parseInt(Math.random() * i, 10);
            [nums[i], nums[subst]] = [nums[subst], nums[i]];
        }

        const row = Array.apply(null, new Array(size)).map(() => 0);
        const board = Array.apply(null, new Array(size)).map(() => row.slice());
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                board[r][c] = nums.pop();
            }
        }
        return board;
    }

    /**
     * Create a board from an n-by-n array of tiles, where
     * tiles[row][col] = tile at (row, col).
     *
     * @param {number[][]} tiles
     */
    constructor(tiles) {
        // [row, col] coordinates of the board hole.
        this._hole = null;
        // A cached hamming distance.
        this._hamming = -1;
        // A cached manhattan distance.
        this._manhattan = -1;

        this.board = tiles.map((row) => row.slice());
        const size = this.board.length;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (!this.board[r][c]) {
                    this._hole = [r, c];
                }
            }
        }
    }

    /**
     * String representation of this board.
     *
     * @returns {string}
     */
    toString() {
        const size = this.dimension();
        const l = size < 4 ? 2 : size < 11 ? 3 : size < 31 ? 4 : 5;
        return (
            "" +
            size +
            "\n" +
            this.board
                .map(
                    (row) =>
                        "|" +
                        row.map((n) => n.toString().padStart(l, " ")).join(",") +
                        " |\n",
                )
                .join("")
        );
    }

    /**
     * Board dimension n.
     *
     * @returns {number}
     */
    dimension() {
        return this.board.length;
    }

    /**
     * Number of tiles out of place.
     *
     * @returns {number}
     */
    hamming() {
        if (this._hamming > -1) {
            return this._hamming;
        }
        const size = this.dimension();
        this._hamming = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (1 + r * size + c !== this.board[r][c]) {
                    this._hamming++;
                }
            }
        }
        return --this._hamming;
    }

    /**
     * Sum of Manhattan distances between tiles and goal.
     *
     * @returns {number}
     */
    manhattan() {
        if (this._manhattan > -1) {
            return this._manhattan;
        }
        const size = this.dimension();
        this._manhattan = 0;
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (this.board[r][c] !== 0) {
                    const [tr, tc] = position(this.board[r][c], size);
                    this._manhattan += Math.abs(tr - r) + Math.abs(tc - c);
                }
            }
        }
        return this._manhattan;

        /**
         * Get a target position for a number.
         *
         * @param {number} n A number to determine position of.
         * @param {number} size A board size.
         * @returns {[number, number]} A target [row, col] position for
         * the number.
         */
        function position(n, size) {
            return [Math.floor((n - 1) / size), (n - 1) % size];
        }
    }

    /**
     * Is this board the goal board?
     *
     * @returns {boolean}
     */
    isGoal() {
        return this.hamming() == 0;
    }

    /**
     * Does this board equal y?
     *
     * @param {Board} y
     * @returns {boolean}
     */
    equals(y) {
        return this.toString() == y.toString();
    }

    /**
     * All neighboring boards.
     *
     * @returns {Iterable<Board>}
     */
    *neighbors() {
        const size = this.dimension();
        const hole = this._hole;
        const holes = [];
        if (hole[0] > 0) {
            holes.push([hole[0] - 1, hole[1]]);
        }
        if (hole[0] < size - 1) {
            holes.push([hole[0] + 1, hole[1]]);
        }
        if (hole[1] > 0) {
            holes.push([hole[0], hole[1] - 1]);
        }
        if (hole[1] < size - 1) {
            holes.push([hole[0], hole[1] + 1]);
        }

        for (const item of holes) {
            const board = this.board.map((row) => row.slice());
            [board[item[0]][item[1]], board[hole[0]][hole[1]]] = [
                board[hole[0]][hole[1]],
                board[item[0]][item[1]],
            ];
            yield new Board(board);
        }
    }
}

class Solver {
    /**
     * Find a solution to the initial board (using the A* algorithm).
     *
     * @param {Board} initial
     */
    constructor(initial) {
        if (!(initial instanceof Board)) {
            throw new IllegalArgumentException("You must pass a Board as a param.");
        }
        this._moves = initial.manhattan();

        this._parents = new WeakMap();
        this._parents.set(initial, null);

        this._processed = new Set();
        this._processed.add(initial.toString());

        let pq = new PriorityQueue();
        pq.enqueue(initial, initial.manhattan());

        this._solution = [];
        let target = null;
        while (pq.size) {
            const { element: board } = pq.dequeue();
            if (board.isGoal()) {
                target = board;
                break;
            }
            for (const item of board.neighbors()) {
                if (this._processed.has(item.toString())) {
                    continue;
                }
                this._processed.add(item.toString());
                this._parents.set(item, board);
                pq.enqueue(item, item.manhattan());
            }
        }

        if (target) {
            // Fill the solution.
            while (target) {
                this._solution.push(target);
                target = this._parents.get(target);
            }
            this._solution.reverse();
            return;
        }
    }

    /**
     * Is the initial board solvable?
     *
     * @returns {boolean}
     */
    isSolvable() {
        return this._solution.length > 0;
    }

    /**
     * Min number of moves to solve initial board.
     *
     * @returns {number}
     */
    moves() {
        return this._moves;
    }

    /**
     * Sequence of boards in a shortest solution.
     *
     * @returns {Iterable<Board>}
     */
    *solution() {
        yield* this._solution;
    }
}

const t1 = [
    [0, 1, 3],
    [4, 2, 5],
    [7, 8, 6],
];
const s1 = new Solver(new Board(t1));
if (s1.isSolvable()) {
    for (const b of s1.solution()) {
        console.log(b.toString());
    }
} else {
    console.log("UNSOLVABLE!!!");
    console.log(new Board(t1).toString());
}

const t2 = [
    [1, 2, 3],
    [4, 5, 6],
    [8, 7, 0],
];
const s2 = new Solver(new Board(t2));
if (s2.isSolvable()) {
    for (const b of s2.solution()) {
        console.log(b.toString());
    }
} else {
    console.log("UNSOLVABLE!!!");
    console.log(new Board(t2).toString());
}
