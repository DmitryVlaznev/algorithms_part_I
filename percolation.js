// Percolation. Given a composite systems comprised of randomly
// distributed insulating and metallic materials: what fraction of the
// materials need to be metallic so that the composite system is an
// electrical conductor? Given a porous landscape with water on the
// surface (or oil below), under what conditions will the water be able
// to drain through to the bottom (or the oil to gush through to the
// surface)? Scientists have defined an abstract process known as
// percolation to model such situations.

// https://coursera.cs.princeton.edu/algs4/assignments/percolation/specification.php

/*jshint esversion: 6 */

// *********************************************************************
// UnionFindCompressed
// *********************************************************************
class UnionFindCompressed {
    /**
     * Create a parents data array.
     * @param {number} n
     */
    constructor(n) {
        this.parents = Array.apply(null, new Array(n)).map((v, i) => i);
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
        this.field = Array.apply(null, new Array(n)).map(row => {
            Array.apply(null, new Array(n)).map(() => -1);
        });
        this.openSitesCounter = 0;
    }

    /**
     * Opens the site (row, col) if it is not open already.
     *
     * @param {number} row
     * @param {number} col
     */
    open(row, col) {}

    /**
     * Is the site (row, col) open?
     *
     * @param {number} row
     * @param {number} col
     *
     * @returns {boolean} Check result.
     */
    isOpen(row, col) {}

    /**
     * Is the site (row, col) full?
     *
     * @param {number} row
     * @param {number} col
     *
     * @returns {boolean} Check result.
     */
    isFull(row, col) {}

    /**
     * Returns the number of open sites.
     *
     * @returns {boolean} Tne requested number.
     */
    numberOfOpenSites() {}

    /**
     * Does the system percolate?
     *
     * @returns {boolean} Tne requested info.
     */
    percolates() {}
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
    constructor(n, trials) {}

    /**
     * Sample mean of percolation threshold.
     *
     * @returns {number}
     */
    mean() {}

    /**
     * Sample standard deviation of percolation threshold.
     *
     * @returns {number}
     */
    stdDev() {}

    /**
     * Low endpoint of 95% confidence interval.
     *
     * @returns {number}
     */
    confidenceLo() {}

    /**
     * High endpoint of 95% confidence interval.
     *
     * @returns {number}
     */
    confidenceHi() {}
}

const u = new UnionFindCompressed(16);
u.union(0, 1);
u.union(1, 2);
u.union(1, 5);
u.union(6, 5);
u.union(6, 10);

u.union(3, 7);

u.union(4, 9);
u.union(12, 9);
u.union(14, 9);
u.union(14, 15);

console.log("--------");
console.log("connected = ", u.connected(0, 6));
console.log("connected = ", u.connected(5, 2));
console.log("connected = ", u.connected(9, 14));
console.log("connected = ", u.connected(12, 15));

console.log("--------");
console.log("disconnected = ", u.connected(0, 11));
console.log("disconnected = ", u.connected(8, 13));
console.log("disconnected = ", u.connected(12, 10));

console.log("--------");
console.log(
    Array.apply(null, new Array(16))
        .map((v, i) => (i < 10 ? "0" + i : "" + i))
        .join(" "),
);

console.log(u.parents.map(v => (v < 10 ? "0" + v : "" + v)).join(" "));
