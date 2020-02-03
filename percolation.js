// Percolation. Given a composite systems comprised of randomly
// distributed insulating and metallic materials: what fraction of the
// materials need to be metallic so that the composite system is an
// electrical conductor? Given a porous landscape with water on the
// surface (or oil below), under what conditions will the water be able
// to drain through to the bottom (or the oil to gush through to the
// surface)? Scientists have defined an abstract process known as
// percolation to model such situations.

// https://coursera.cs.princeton.edu/algs4/assignments/percolation/specification.php

const { performance } = require("perf_hooks");

// *********************************************************************
// UnionFindCompressed
// *********************************************************************
class UnionFindCompressed {
    /**
     * Create a parents data array.
     * @param {number} n
     */
    constructor(n) {
        this.parents = new Array(n);
        for (let i = 0; i < n; i++) {
            this.parents[i] = i;
        }
    }

    /**
     * Find a node root.
     * @param {number} index
     */
    _root(index) {
        while (this.parents[index] !== index) {
            this.parents[index] = this.parents[this.parents[index]];
            index = this.parents[index];
        }
        return index;
    }

    /**
     * Are the nodes connected?
     *
     * @param {number} a
     * @param {number} b
     *
     * @returns {boolean} Check result.
     */
    connected(a, b) {
        return this._root(a) === this._root(b);
    }

    /**
     * Connect two nodes.
     *
     * @param {number} a
     * @param {number} b
     */
    union(a, b) {
        const ra = this._root(a);
        const rb = this._root(b);
        this.parents[ra] = rb;
    }
}

// *********************************************************************
// Percolation
// *********************************************************************
class Percolation {
    /**
     * Create n-by-n grid, with all sites initially blocked.
     * @param {number} n
     */
    constructor(n) {
        this.n = n;
        this.field = Array.apply(null, new Array(n)).map(row =>
            Array.apply(null, new Array(n)).map(() => 0),
        );

        this.openSitesCounter = 0;
        this.uf = new UnionFindCompressed(n * n + 2);
        this.upVirtualRootIndex = this.n * this.n;
        this.downVirtualRootIndex = this.upVirtualRootIndex + 1;
    }

    /**
     * Convert 2D field index to 1D union-find index.
     *
     * @param {number} row
     * @param {number} col
     */
    _toFlatIndex(row, col) {
        return row * this.n + col;
    }

    /**
     * Opens the site (row, col) if it is not open already.
     *
     * @param {number} row
     * @param {number} col
     */
    open(row, col) {
        if (this.isOpen(row, col)) {
            return;
        }
        this.field[row][col] = 1;
        this.openSitesCounter++;
        const currentIndex = this._toFlatIndex(row, col);

        // Check virtual nodes connectivity.
        if (row === 0) {
            this.uf.union(currentIndex, this.upVirtualRootIndex);
        } else if (row === this.n - 1) {
            this.uf.union(currentIndex, this.downVirtualRootIndex);
        }

        // Check vertical connectivity.
        if (row > 0 && this.isOpen(row - 1, col)) {
            this.uf.union(currentIndex, this._toFlatIndex(row - 1, col));
        }
        if (row < this.n - 1 && this.isOpen(row + 1, col)) {
            this.uf.union(currentIndex, this._toFlatIndex(row + 1, col));
        }

        // Check horizontal connectivity.
        if (col > 0 && this.isOpen(row, col - 1)) {
            this.uf.union(currentIndex, this._toFlatIndex(row, col - 1));
        }
        if (col < this.n - 1 && this.isOpen(row, col + 1)) {
            this.uf.union(currentIndex, this._toFlatIndex(row, col + 1));
        }
    }

    /**
     * Is the site (row, col) open?
     *
     * @param {number} row
     * @param {number} col
     *
     * @returns {boolean} Check result.
     */
    isOpen(row, col) {
        return !!this.field[row][col];
    }

    /**
     * Is the site (row, col) full?
     *
     * @param {number} row
     * @param {number} col
     *
     * @returns {boolean} Check result.
     */
    isFull(row, col) {
        return !this.field[row][col];
    }

    /**
     * Returns the number of open sites.
     *
     * @returns {boolean} Tne requested number.
     */
    numberOfOpenSites() {
        return this.openSitesCounter;
    }

    /**
     * Does the system percolate?
     *
     * @returns {boolean} Tne requested info.
     */
    percolates() {
        return this.uf.connected(this.upVirtualRootIndex, this.downVirtualRootIndex);
    }
}

// *********************************************************************
// PercolationStats
// *********************************************************************
class PercolationStats {
    /**
     * Perform independent trials on an n-by-n grid.
     *
     * @param {number} n
     * @param {number} trials
     */
    constructor(n, trials) {
        this.n = n;
        this.trials = trials;

        this.results = null;
        this.meanValue = null;
        this.deviation = null;
        this.low = null;
        this.hi = null;
    }

    /**
     * Do a Monte-Carlo simulation and print results.
     */
    calculate() {
        this.results = new Array(this.trials);
        this.meanValue = null;
        this.deviation = null;
        this.low = null;
        this.hi = null;

        console.log("------------------------------------------------");
        console.log(`Start ${this.trials} experiments for ${this.n}*${this.n} filed`);
        console.log("------------------------------------------------");

        const start = performance.now();
        for (let i = 0; i < this.trials; i++) {
            this.results[i] = this.percolate();
        }
        const stop = performance.now();
        const nSquared = this.n ** 2;
        const time = stop - start;
        console.log(`Execution time is      ${(time / 1000).toPrecision(4)} seconds`);
        console.log(`Spent                  ${(time / nSquared).toPrecision(4)} ms on an item`);
        console.log(`Mean value is          ${this.mean() / nSquared}`);
        console.log(`Standard deviation is  ${this.stdDev() / nSquared}`);
        console.log("------------------------------------------------");
    }

    /**
     * Generate a random cell. Every cell will be touched once only.
     */
    *getRandomCell() {
        const l = this.n * this.n;
        let i, row, col;
        const indices = new Array(l);
        for (let i = 0; i < l; i++) {
            indices[i] = i;
        }
        // Randomize an array using Fisher–Yates shuffle
        // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for (i = l - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * Math.floor(i - 1));
            [indices[r], indices[i]] = [indices[i], indices[r]];
        }
        i = 0;
        while (i < l) {
            row = Math.floor(indices[i] / this.n);
            col = indices[i] % this.n;
            yield { row, col };
            i++;
        }
    }

    /**
     * Do one simulation.
     */
    percolate() {
        const infeasibleThreshold = this.n * (this.n - 1) + 2;
        const gen = this.getRandomCell();
        const p = new Percolation(this.n);
        while (!p.percolates()) {
            const cell = gen.next();
            if (cell.done) {
                throw new Error("All cells are opened!");
            }
            if (p.numberOfOpenSites() >= infeasibleThreshold) {
                throw new Error("Must percolate!");
            }
            p.open(cell.value.row, cell.value.col);
        }
        return p.numberOfOpenSites();
    }

    /**
     * Sample mean of percolation threshold.
     *
     * @returns {number}
     */
    mean() {
        if (!this.meanValue) {
            this.meanValue =
                this.results.reduce((acc, v) => (acc = acc + v), 0) / this.trials;
        }

        return this.meanValue;
    }

    /**
     * Sample standard deviation of percolation threshold.
     *
     * @returns {number}
     */
    stdDev() {
        if (!this.deviation) {
            const mean = this.mean();
            this.deviation = Math.sqrt(
                this.results.reduce((acc, v) => (acc = acc + (v - mean) ** 2), 0) /
                    (this.trials - 1),
            );
        }
        return this.deviation;
    }
}

new PercolationStats(10, 100).calculate();
new PercolationStats(100, 100).calculate();
new PercolationStats(1000, 100).calculate();
