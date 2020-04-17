// Randomized queue. A randomized queue is similar to a stack or queue,
// except that the item removed is chosen uniformly at random among
// items in the data structure.

// Iterator.
// Each iterator must return the items in uniformly random order. The
// order of two or more iterators to the same randomized queue must be
// mutually independent; each iterator must maintain its own random
// order.

// Corner cases.
// Throw the specified exception for the following corner cases:
// * Throw an IllegalArgumentException if the client calls enqueue()
//   with a null argument.
// * Throw a NoSuchElementException if the client calls either sample()
//   or dequeue() when the randomized queue is empty.

// Performance requirements.
// Your randomized queue implementation must support each randomized
// queue operation (besides creating an iterator) in constant amortized
// time. That is, any intermixed sequence of m randomized queue
// operations (starting from an empty queue) must take at most cm steps
// in the worst case, for some constant c. A randomized queue containing
// n items must use at most 48n + 192 bytes of memory. Additionally,
// your iterator implementation must support operations next() and
// hasNext() in constant worst-case time; and construction in linear
// time; you may (and will need to) use a linear amount of extra memory
// per iterator.

const {
    IllegalArgumentException,
    NoSuchElementException,
} = require("./custom-exceptions");

// *********************************************************************
// Randomized queue
// *********************************************************************
class RandomizedQueue {
    /**
     * Construct an empty randomized queue
     */
    constructor() {
        this.data = [null];
        this._size = 0;
    }

    /**
     * Is the queue empty?
     *
     * @returns `true` if empty.
     */
    isEmpty() {
        return this._size === 0;
    }

    /**
     * Return the number of items on the queue.
     *
     * @returns the number of items on the queue.
     */
    size() {
        return this._size;
    }

    /**
     * Add the item.
     *
     * @param {*} item An item to add.
     */
    enqueue(item) {
        if (item === null || item === undefined) {
            throw new IllegalArgumentException(
                "You cannot pass a `null` value into `enqueue`",
            );
        }
        if (this.data.length === this._size) {
            this._expand();
        }
        this.data[this._size] = item;
        this._size++;
    }

    /**
     * Remove and return a random item.
     *
     * @returns the removed item.
     */
    dequeue() {
        if (!this._size) {
            throw new NoSuchElementException("The queue is empty");
        }
        const index = this._randomIndex();
        const item = this.data[index];
        this.data[index] = this.data[this._size - 1];
        this.data[this._size - 1] = null;
        this._size--;
        if (this._size <= Math.floor(this.data.length / 4)) {
            this._shrink();
        }
        return item;
    }

    /**
     * Return a random item (but do not remove it).
     *
     * @returns a random item.
     */
    sample() {
        if (!this._size) {
            throw new NoSuchElementException("The queue is empty");
        }

        return this.data[this._randomIndex()];
    }

    /**
     * Double the queue array.
     */
    _expand() {
        this.data = Array.apply(null, new Array(this.data.length * 2)).map((v, i) => {
            if (i < this._size) {
                return this.data[i];
            } else {
                return null;
            }
        });
    }

    /**
     * Halve the queue array.
     */
    _shrink() {
        this.data = Array.apply(null, new Array(Math.floor(this.data.length / 2))).map(
            (v, i) => {
                if (i < this._size) {
                    return this.data[i];
                } else {
                    return null;
                }
            },
        );
    }

    /**
     * Get a random index in a range [0..this._size).
     */
    _randomIndex() {
        return Math.floor(Math.random() * this._size);
    }

    /**
     * Return an independent iterator over items in random order.
     */
    [Symbol.iterator]() {
        const indices = Array.apply(null, new Array(this._size)).map((v, i) => i);

        // Randomize an array using Fisher–Yates shuffle
        // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for (let i = this._size - 1; i > 0; i--) {
            const r = Math.floor(Math.random() * Math.floor(i - 1));
            [indices[r], indices[i]] = [indices[i], indices[r]];
        }
        let pointer = 0;
        return {
            next: () => {
                if (pointer < this._size) {
                    return { value: this.data[indices[pointer++]], done: false };
                }
                return { done: true };
            },
        };
    }
}

//**********************************************************************
// Tests
//**********************************************************************
const general = () => {
    console.log("---------------------------------");
    console.log("Iterator queue test...............");
    console.log("---------------------------------");
    console.log(">>> Create an empty queue");
    let rq = new RandomizedQueue();
    console.log("isEmpty [true] =>", rq.isEmpty());
    console.log("size [0] =>", rq.size());
    console.log(">>> Add one item");
    rq.enqueue(1);
    console.log("isEmpty [false] =>", rq.isEmpty());
    console.log("size [1] =>", rq.size());
    console.log(">>> Add one item");
    rq.enqueue(2);
    console.log("size [2] =>", rq.size());
    console.log(">>> Get one item");
    console.log("item [1..2] =>", rq.sample());
    console.log(">>> Remove one item");
    let res = rq.dequeue();
    console.log("removed [1..2] =>", res);
    console.log("size [1] =>", rq.size());
    console.log(">>> Remove one item");
    res = rq.dequeue();
    console.log("removed [1..2] =>", res);
    console.log("size [0] =>", rq.size());
    console.log("isEmpty [true] =>", rq.isEmpty());
    try {
        console.log(">>> Remove one item");
        rq.dequeue();
    } catch (err) {
        console.log("Exception [NoSuchElementException] =>", err.name);
    }
    try {
        console.log(">>> Add a 'null' item");
        rq.enqueue(null);
    } catch (err) {
        console.log("Exception [IllegalArgumentException] =>", err.name);
    }
    console.log(".........................complete");
    console.log("");
    console.log("");
};

const arrayProcessing = () => {
    console.log("---------------------------------");
    console.log("Test of increasing and reducing an internal array");
    console.log("---------------------------------");
    console.log(">>> Create an empty queue");
    let rq = new RandomizedQueue();
    console.log("isEmpty [true] =>", rq.isEmpty());
    console.log("size [0] =>", rq.size());
    console.log(">>> Add 3 items");
    rq.enqueue(1);
    rq.enqueue(2);
    rq.enqueue(3);
    console.log("size [3] =>", rq.size());
    console.log("length [4] =>", rq.data.length);
    console.log(">>> Add 6 extra items");
    rq.enqueue(4);
    rq.enqueue(5);
    rq.enqueue(6);
    rq.enqueue(7);
    rq.enqueue(8);
    rq.enqueue(9);
    console.log("size [9] =>", rq.size());
    console.log("length [16] =>", rq.data.length);
    console.log(">>> Remove 4 items");
    rq.dequeue();
    rq.dequeue();
    rq.dequeue();
    rq.dequeue();
    console.log("size [5] =>", rq.size());
    console.log("length [16] =>", rq.data.length);
    console.log(">>> Remove 1 extra item");
    rq.dequeue();
    console.log("size [4] =>", rq.size());
    console.log("length [8] =>", rq.data.length);
    console.log(".........................complete");
    console.log("");
    console.log("");
};

const iterator = () => {
    console.log("---------------------------------");
    console.log("Iterator queue test...............");
    console.log("---------------------------------");
    console.log(">>> Create an empty queue");
    let rq = new RandomizedQueue();
    console.log("isEmpty [true] =>", rq.isEmpty());
    console.log("size [0] =>", rq.size());
    console.log(">>> Add 9 items");
    rq.enqueue(1);
    rq.enqueue(2);
    rq.enqueue(3);
    rq.enqueue(4);
    rq.enqueue(5);
    rq.enqueue(6);
    rq.enqueue(7);
    rq.enqueue(8);
    rq.enqueue(9);
    console.log(
        ">>> Check the iterable protocol and a spread operator applied to a queue",
    );
    console.log("randomized [1..9] =>", [...rq]);
    console.log("randomized [1..9] =>", [...rq]);
    console.log(".........................complete");
    console.log("");
    console.log("");
};

general();
arrayProcessing();
iterator();
