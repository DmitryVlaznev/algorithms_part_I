const { NoSuchElementException } = require("./custom-exceptions");

// PriorityQueue element class.
class QElement {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class.
class PriorityQueue {
    /**
     * Create an array-based heap to implement a priority queue.
     *
     * @param {*} min Either it will be a min priority queue or a max
     * one.
     */
    constructor(min = true) {
        this.min = min;
        this.heap = [null];
    }

    /**
     * Add an element with a priority to the queue.
     *
     * @param {*} element
     * @param {number} priority
     */
    enqueue(element, priority) {
        const item = new QElement(element, priority);
        this.heap.push(item);

        let index = this.size();
        let parent = parseInt(index / 2);
        while (index > 1 && this.higher(this.heap[index], this.heap[parent])) {
            [this.heap[index], this.heap[parent]] = [
                this.heap[parent],
                this.heap[index],
            ];
            index = parent;
            parent = parseInt(index / 2);
        }
    }

    /**
     * Remove an element with the highest priority from the queue and
     * return it.
     *
     * @returns {QElement}
     */
    dequeue() {
        if (this.isEmpty()) {
            throw new NoSuchElementException("The queue is empty.");
        }

        [this.heap[1], this.heap[this.size()]] = [this.heap[this.size()], this.heap[1]];

        const item = this.heap.pop();
        let index = 1;
        while (index * 2 <= this.size()) {
            let child = index * 2;
            if (
                child + 1 <= this.size() &&
                this.higher(this.heap[child + 1], this.heap[child])
            ) {
                child++;
            }

            if (!this.higher(this.heap[child], this.heap[index])) {
                break;
            }
            [this.heap[index], this.heap[child]] = [
                this.heap[child],
                this.heap[index],
            ];
            index = child;
        }
        return item;
    }

    /**
     * Is the `a` priority is bigger than the `b` priority.
     *
     * @param {QElement} a
     * @param {QElement} b
     * @returns {boolean}
     */
    higher(a, b) {
        if (this.min) {
            return a.priority < b.priority;
        }
        return a.priority > b.priority;
    }

    /**
     * Return the size of the queue.
     *
     * @returns {number}
     */
    size() {
        return this.heap.length - 1;
    }

    /**
     * Return an element with the highest priority.
     * Do not remove it from the queue.
     *
     * @returns {QElement}
     */
    front() {
        if (this.isEmpty()) {
            throw new NoSuchElementException("The queue is empty.");
        }
        return this.heap[1];
    }

    /**
     * Return an element with the lowest priority.
     * Do not remove it from the queue.
     *
     * @returns {QElement}
     */
    rear() {
        if (this.isEmpty()) {
            throw new NoSuchElementException("The queue is empty.");
        }
        return this.heap[this.size()];
    }

    /**
     * Return whether the queue is empty or not.
     *
     * @returns {boolean}
     */
    isEmpty() {
        return this.size() == 0;
    }

    /**
     * Return a string representation of queue elements.
     *
     * @returns {string}
     */
    toString() {
        return `[${this.heap.slice(1).map(i => i.element.toString()).join(", ")}]`
    }
}

module.exports = { PriorityQueue, QElement };
