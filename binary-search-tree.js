const { NoSuchElementException } = require("./custom-exceptions");

class Node {
    /**
     * A BST node.
     *
     * @param {string | number} key
     * @param {*} value
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
        this.size = 1;
    }
}

class BST {
    /**
     * Init a BST root with a null.
     */
    constructor() {
        this.root = null;
    }

    /**
     * Update a node size property using left and right node sizes if any.
     *
     * @param {Node} node
     * @returns {Node}
     */
    _updateSize(node) {
        if (node) {
            node.size = 1;
            node.size = node.left ? node.size + node.left.size : node.size;
            node.size = node.right ? node.size + node.right.size : node.size;
        }
        return node;
    }

    /**
     * Recursively find a node to put a new node in, put a new node into
     * BST, update a parent or a root node.
     *
     * @param {Node | null} node
     * @param {string | number} key
     * @param {*} value
     */
    _put(node, key, value) {
        if (node === null) {
            return new Node(key, value);
        }

        if (key < node.key) {
            node.left = this._put(node.left, key, value);
        } else if (key > node.key) {
            node.right = this._put(node.right, key, value);
        } else {
            node.value = value;
        }
        return this._updateSize(node);
    }

    /**
     * Find a node in BST by a key.
     *
     * @param {string | number} key
     * @returns {Node | null}
     */
    _find(key) {
        let p = this.root;
        while (p !== null) {
            if (key < p.key) {
                p = p.left;
            } else if (key > p.key) {
                p = p.right;
            } else {
                return p;
            }
        }
        return null;
    }

    /**
     * Delete a min node from a subtree.
     *
     * @param {Node} node
     * @returns {Node}
     */
    _deleteMin(node) {
        if (!node.left) {
            return node.right;
        }
        return this._updateSize(this._deleteMin(node.left));
    }

    /**
     * Return a min key node.
     *
     * @param {Node} node
     * @returns {Node}
     */
    _min(node) {
        let p = node;
        while (p.left !== null) {
            p = p.left;
        }
        return p;
    }

    /**
     * Return a max key node.
     *
     * @param {Node} node
     * @returns {Node}
     */
    _max(node) {
        let p = node;
        while (p.right !== null) {
            p = p.right;
        }
        return p;
    }

    /**
     * Delete a node by a key in the subtree.
     *
     * @param {Node} node
     * @param {*} key
     * @returns {Node}
     */
    _delete(node, key) {
        if (!node) {
            return null;
        }
        if (key < node.key) {
            node.left = this._delete(node.left, key);
        } else if (key > node.key) {
            node.right = this._delete(node.right, key);
        } else {
            if (!node.right) {
                return node.left;
            }
            if (!node.left) {
                return node.right;
            }
            const tmp = node;
            node = this._min(tmp.right);
            node.right = this._deleteMin(tmp.right);
            node.left = tmp.left;
        }
        return this._updateSize(node);
    }

    /**
     * Put a new node into BST.
     *
     * @param {string | number} key
     * @param {*} value
     */
    put(key, value) {
        this.root = this._put(this.root, key, value);
    }

    /**
     * Get a node value from BST.
     *
     * @param {string | number} key
     * @returns {*}
     */
    get(key) {
        const p = this._find(key);
        return !!p ? p.value : null;
    }

    /**
     * Delete a node value from BST.
     *
     * @param {string | number} key
     * @returns {*}
     */
    delete(key) {
        if (!this.root) {
            throw new NoSuchElementException("The tree is empty");
        }

        this.root = this._delete(this.root, key);
    }

    /**
     * Return a value for a max key.
     *
     * @returns {*}
     */
    max() {
        if (!this.root) {
            throw new NoSuchElementException("The tree is empty");
        }
        return this._max(this.root).value;
    }

    /**
     * Return a value for a min key.
     *
     * @returns {*}
     */
    min() {
        if (!this.root) {
            throw new NoSuchElementException("The tree is empty");
        }
        return this._min(this.root).value;
    }

    /**
     * Return a value for a key which is less than or equal to the
     * passed one.
     *
     * @returns {*}
     */
    floor(key) {
        let p = this.root;
        let res;
        while (p) {
            if (p.key == key) {
                return p.value;
            }
            if (key < p.key) {
                p = p.left;
            } else {
                res = p;
                p = p.right;
            }
        }
        return !!res ? res.value : null;
    }

    /**
     * Return a value for a key which is greater than or equal to the
     * passed one.
     *
     * @returns {*}
     */
    ceiling(key) {
        let p = this.root;
        let res;
        while (p) {
            if (p.key == key) {
                return p.value;
            }
            if (key < p.key) {
                res = p;
                p = p.left;
            } else {
                p = p.right;
            }
        }
        return !!res ? res.value : null;
    }

    /**
     * Return a subtree size or a tree size if a key hasn't passed.
     *
     * @param {*} [key]
     */
    size(key) {
        let p = this.root;
        if (!p) {
            if (typeof key === "undefined") {
                return 0;
            }
            throw new NoSuchElementException("The tree is empty");
        }

        if (typeof key === "undefined") {
            return p.size;
        }

        const node = this._find(key);
        if (!node) {
            throw new NoSuchElementException(
                `There is no item  with a key ${key} in the tree`,
            );
        }
        return node.size;
    }

    /**
     * Return an iterator which iterates all nodes with an inorder
     * traversal.
     */
    *[Symbol.iterator]() {
        const queue = [];
        let p = this.root;
        while (p || queue.length) {
            if (p) {
                queue.push(p);
                p = p.left;
            } else {
                p = queue.pop();
                yield p.value;
                p = p.right;
            }
        }
    }
}

module.exports = { Node, BST };

const bst = new BST();
bst.put(5, 5);
bst.put(3, 3);
bst.put(12, 12);
bst.put(1, 1);
bst.put(4, 4);
bst.put(8, 8);
bst.put(10, 10);
bst.put(6, 6);
bst.put(6, 66);
bst.put(42, 42);

console.log("tree size (9) = ", bst.size());
console.log("3 subtree size (3) = ", bst.size(3));
console.log("12 subtree size (5) = ", bst.size(12));

console.log("8 = ", bst.get(8));
console.log("66 = ", bst.get(6));
console.log("null = ", bst.get(66));
console.log("max (42) = ", bst.max());
console.log("min (1) = ", bst.min());
console.log("floor (8) = ", bst.floor(9));
console.log("floor (1) = ", bst.floor(2));
console.log("floor (null) = ", bst.floor(0));
console.log("floor (4) = ", bst.floor(4));
console.log("ceiling (10) = ", bst.ceiling(9));
console.log("ceiling (3) = ", bst.ceiling(2));
console.log("ceiling (null) = ", bst.ceiling(142));
console.log("ceiling (4) = ", bst.ceiling(4));
console.log("sorted (by keys) >> ", [...bst]);


console.log("--------------- deletion");
console.log("42 subtree size (1) = ", bst.size(42));
bst.delete(12);
console.log("tree size (8) = ", bst.size());
console.log("42 subtree size (4) = ", bst.size(42));
console.log("sorted (by keys) >> ", [...bst]);
bst.delete(1);
bst.delete(3);
console.log("tree size (6) = ", bst.size());
console.log("min (4) = ", bst.min());
bst.delete(42);
console.log("max (10) = ", bst.max());
console.log("tree size (5) = ", bst.size());
console.log("sorted (by keys) >> ", [...bst]);
