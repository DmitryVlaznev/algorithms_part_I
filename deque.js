// Write a generic data type for a deque and a randomized queue. The
// goal of this assignment is to implement elementary data structures
// using arrays and linked lists, and to introduce you to generics and
// iterators.

// Dequeue. A double-ended queue or deque (pronounced “deck”) is a
// generalization of a stack and a queue that supports adding and
// removing items from either the front or the back of the data
// structure.

// Corner cases.  Throw the specified exception for the following corner
// cases:
// * Throw an IllegalArgumentException if the client calls either
//   addFirst() or addLast() with a null argument.
// * Throw a NoSuchElementException if the client calls either
//   removeFirst() or removeLast when the deque is empty.
// * Throw a NoSuchElementException if the client calls the next()
//   method in the iterator when there are no more items to return.

// Performance requirements.
// Your deque implementation must support each deque operation
// (including construction) in constant worst-case time. A deque
// containing n items must use at most 48n + 192 bytes of memory.
// Additionally, your iterator implementation must support each
// operation (including construction) in constant worst-case time.

const {
    IllegalArgumentException,
    NoSuchElementException,
} = require("./custom-exceptions");

// *********************************************************************
// Deque list node class
// *********************************************************************
class Node {
    /**
     * Create a node.
     *
     * @param {*} value
     */
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

// *********************************************************************
// Deque
// *********************************************************************
class Deque {
    /**
     * Create an empty deque.
     */
    constructor() {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    /**
     * Is the deque empty?
     *
     * @returns `true` if empty.
     */
    isEmpty() {
        return this.head === null;
    }

    /**
     * Return the number of items on the deque.
     *
     * @returns the number of items on the deque.
     */
    size() {
        return this._size;
    }

    /**
     * Add the item to the front.
     *
     * @param {*} item An item to add.
     */
    addFirst(item) {
        if (item === null || item === undefined) {
            throw new IllegalArgumentException(
                "You cannot pass a `null` value into `addFirst`",
            );
        }
        const node = new Node(item);
        if (!!this.head) {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        } else {
            // The deque is empty
            this.tail = this.head = node;
        }
        this._size++;
    }

    /**
     * Add the item to the back.
     *
     * @param {*} item An item to add.
     */
    addLast(item) {
        if (item === null || item === undefined) {
            throw new IllegalArgumentException(
                "You cannot pass a `null` value into `addLast`",
            );
        }
        const node = new Node(item);
        if (!!this.tail) {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        } else {
            // The deque is empty
            this.tail = this.head = node;
        }
        this._size++;
    }

    /**
     * Remove and return the item from the front.
     *
     * @returns the removed item.
     */
    removeFirst() {
        if (!this.head) {
            throw new NoSuchElementException("The deque is empty");
        }

        const node = this.head;
        this.head = this.head.next;
        if (!!this.head) {
            this.head.prev = null;
        } else {
            this.tail = null;
        }
        this._size--;
        return node;
    }

    /**
     * Remove and return the item from the back.
     *
     * @returns the removed item.
     */
    removeLast() {
        if (!this.tail) {
            throw new NoSuchElementException("The deque is empty");
        }
        const node = this.tail;
        this.tail = this.tail.prev;
        if (!!this.tail) {
            this.tail.next = null;
        } else {
            this.head = null;
        }
        this._size--;
        return node;
    }

    /**
     * Return an iterator over items in order from front to back.
     */
    [Symbol.iterator]() {
        let pointer = this.head;
        return {
            next: () => {
                if (pointer) {
                    const value = { value: pointer.value, done: false };
                    pointer = pointer.next;
                    return value;
                }
                return { done: true };
            },
        };
    }
}

module.exports = { Deque, Node };

//**********************************************************************
// Tests
//**********************************************************************
const general = () => {
    console.log("---------------------------------");
    console.log("General deque test...............");
    console.log("---------------------------------");
    console.log(">>> Create an empty deque");
    let d = new Deque();
    console.log("isEmpty [true] =>", d.isEmpty());
    console.log("size [0] =>", d.size());
    console.log(">>> Add one item");
    d.addFirst(5);
    console.log("isEmpty [false] =>", d.isEmpty());
    console.log("size [1] =>", d.size());
    console.log(">>> Add one item");
    d.addLast(6);
    console.log("size [2] =>", d.size());
    console.log(">>> Remove one item");
    d.removeFirst();
    console.log("size [1] =>", d.size());
    console.log(">>> Remove one item");
    d.removeLast();
    console.log("size [0] =>", d.size());
    console.log("isEmpty [true] =>", d.isEmpty());
    try {
        console.log(">>> Remove one item");
        d.removeLast();
    } catch (err) {
        console.log("Exception [NoSuchElementException] =>", err.name);
    }
    try {
        console.log(">>> Add a 'null' item");
        d.addFirst(null);
    } catch (err) {
        console.log("Exception [IllegalArgumentException] =>", err.name);
    }
    console.log(".........................complete");
    console.log("");
    console.log("");
};

const iterator = () => {
    console.log("---------------------------------");
    console.log("Iterator test....................");
    console.log("---------------------------------");
    console.log(">>> Create an empty deque");
    d = new Deque();
    const iter = d[Symbol.iterator]();
    let item = iter.next();
    console.log("done [true] =>", item.done);
    console.log(">>> Add 9 items");
    d.addFirst(5);
    d.addLast(6);
    d.addLast(7);
    d.addLast(8);
    d.addLast(9);
    d.addFirst(4);
    d.addFirst(3);
    d.addFirst(2);
    d.addFirst(1);
    console.log("size [9] =>", d.size());
    console.log(
        ">>> Check the iterable protocol and a spread operator applied to a deque",
    );
    console.log("iterate [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ] =>", [...d]);

    console.log(">>> Check two iterators simultaneously");
    console.log(">>> Create the first and do one step");
    const i1 = d[Symbol.iterator]();
    i1.next();
    console.log(">>> Create the second and do two steps");
    const i2 = d[Symbol.iterator]();
    i2.next();
    i2.next();
    console.log(">>> Get the second next");
    item = i2.next();
    console.log("[3] =>", item.value);
    console.log(">>> Get the first next");
    item = i1.next();
    console.log("[2] =>", item.value);
    console.log(".........................complete");
    console.log("");
    console.log("");
};

general();
iterator();
