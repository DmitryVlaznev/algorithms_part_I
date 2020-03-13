class MaxBinaryHeap {
    /**
     * Init heap with passed data or with an empty heap;
     *
     * @param {number[]?} initialData An optional param. Initial data
     * for heap.
     */
    constructor(initialData = false) {
        if (initialData) {
            this.fromArray(initialData);
        } else {
            this.heap = [null];
            this.size = 0;
        }
    }

    /**
     * Promote a node to its an appropriate place in the heap.
     *
     * @param {number} index
     */
    swim(index) {
        let parent = parseInt(index / 2);
        while (index > 1 && this.heap[parent] < this.heap[parseInt(index)]) {
            [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
            index = parent;
            parent = parseInt(index / 2);
        }
    }

    /**
     * Sink a node to its an appropriate place in the heap.
     *
     * @param {number} index
     */
    sink(index) {
        while (index * 2 <= this.size) {
            let child = index * 2;
            if (child + 1 <= this.size && this.heap[child + 1] > this.heap[child]) {
                child++;
            }
            if (this.heap[index] >= this.heap[child]) {
                break;
            }
            [this.heap[index], this.heap[child]] = [this.heap[child], this.heap[index]];
            index = child;
        }
    }

    /**
     * Add node at the end, then swim it up.
     *
     * @param {number} value
     */
    insert(value) {
        this.heap.push(value);
        this.swim(++this.size)
    }

    /**
     * Exchange the root node with the node at the end, then sink it
     * down.
     *
     * @returns {number} A deleted node.
     */
    delMax() {
        if (this.size == 0) {
            throw new Error("Cannot delete a value from an empty heap");
        }
        [this.heap[this.size], this.heap[1]] = [this.heap[1], this.heap[this.size]];
        this.size--;
        this.sink(1);
        return this.heap.pop();
    }

    /**
     * Create heap with passed data and return it.
     *
     * @param {number[]} data Initial data for heap.
     * @returns {number[]} A max binary heap.
     */
    fromArray(data) {
        this.size = data.length;
        this.heap = [null].concat(data);
        for (let i = parseInt(this.size / 2); i > 0; i--) {
            this.sink(i);
        }
    }

    /**
     * Sort a heap array.
     *
     * @param {boolean} inPlace If true, make a cope of a current heap and
     * restore it after sorting.
     */
    sort(inPlace = true) {

    }

    /**
     * Print the heap array as a string.
     */
    toString() {
        return `[${this.heap.slice(1).join(", ")}]`
    }
}
let h = new MaxBinaryHeap([1, 2, 3, 4]);
console.log(h.toString());
h = new MaxBinaryHeap([1, 2, 3, 4, 5]);
console.log(h.toString());
h = new MaxBinaryHeap([1, 2, 3, 4, 5, 6]);
console.log(h.toString());
h = new MaxBinaryHeap([1, 2, 3, 4, 5, 6, 7]);
console.log(h.toString());
h = new MaxBinaryHeap([1, 2, 3, 4, 5, 6, 7, 8]);
console.log(h.toString());
