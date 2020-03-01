class MergeSort {
    constructor() {
        this._auxiliaryArray = null;
    }

    /**
     * Test whether an array is sorted.
     *
     * @param {number[]} arr
     * @param {number} start Zero-based index at which to begin.
     * @param {number} end Zero-based index at which to end.
     * @returns {boolean}
     */
    sorted(arr, start, end) {
        for (let i = start + 1; i <= end; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Init the auxiliary array.
     *
     * @param {number[]} arr Array of numbers
     */
    _init(arr) {
        this._auxiliaryArray = Array.apply(null, new Array(arr.length)).map(
            (n, i) => arr[i],
        );
    }

    /**
     * Merge sorted halves.
     *
     * @param {number[]} arr An array to sort.
     * @param {number} start Zero-based index at which the left part is
     * began.
     * @param {number} mid Zero-based index at which the right part is
     * began.
     * @param {number} end Zero-based index at which the right part is
     * end.
     */
    _merge(arr, start, mid, end) {
        if (!this.sorted(arr, start, mid - 1)) {
            throw Error("An array must be sorted before merge.");
        }
        if (!this.sorted(arr, mid, end)) {
            throw Error("An array must be sorted before merge.");
        }

        for (let i = start; i <= end; i++) {
            this._auxiliaryArray[i] = arr[i];
        }

        let l = start;
        let r = mid;
        for (let i = start; i <= end; i++) {
            if (l === mid) {
                arr[i] = this._auxiliaryArray[r++];
            } else if (r > end) {
                arr[i] = this._auxiliaryArray[l++];
            } else if (this._auxiliaryArray[r] < this._auxiliaryArray[l]) {
                arr[i] = this._auxiliaryArray[r++];
            } else {
                arr[i] = this._auxiliaryArray[l++];
            }
        }
    }

    /**
     * Do recursive sorting.
     *
     * @param {number[]} arr An array to sort.
     * @param {number} start Zero-based index at which to begin.
     * @param {number} end Zero-based index at which to end.
     */
    _recursive(arr, start, end) {
        if (end === start) {
            return;
        }

        if (end - start === 1) {
            if (arr[end] < arr[start]) {
                [arr[end], arr[start]] = [arr[start], arr[end]];
            }

            return;
        }

        const mid = start + parseInt((end - start) / 2);
        this._recursive(arr, start, mid);
        this._recursive(arr, mid + 1, end);
        this._merge(arr, start, mid + 1, end);
    }

    /**
     * Recursive merge sort. An array will be sorted in-place.
     *
     * @param {number[]} arr Array of numbers
     */
    recursive(arr) {
        const l = arr.length;
        if (l < 2) {
            return;
        }
        this._init(arr);
        this._recursive(arr, 0, l - 1);
        if (!this.sorted(arr, 0, l - 1)) {
            throw Error("Recursive sorting is failed.");
        }
    }

    /**
     * Bottom-up merge sort without recursion. An array will be sorted
     * in-place.
     *
     * @param {*} arr Array of numbers
     */
    bottomUp(arr) {}
}

const test = new MergeSort();

let arr = [1];
test.recursive(arr);
console.log(">>> ", arr);

arr = [1, 2];
test.recursive(arr);
console.log(">>> ", arr);

arr = [2, 1];
test.recursive(arr);
console.log(">>> ", arr);

arr = [2, 3, 1];
test.recursive(arr);
console.log(">>> ", arr);

arr = [2, 1, 3, 2];
test.recursive(arr);
console.log(">>> ", arr);

arr = [2, 1, 3, 2, 5];
test.recursive(arr);
console.log(">>> ", arr);

arr = [42, 2, 1, 3, 2, 5];
test.recursive(arr);
console.log(">>> ", arr);

arr = Array.apply(null, new Array(20)).map(x => Math.floor(Math.random() * 20));
test.recursive(arr);
console.log(">>> ", arr);

arr = Array.apply(null, new Array(19)).map(x => Math.floor(Math.random() * 100));
test.recursive(arr);
console.log(">>> ", arr);
