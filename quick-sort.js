class QuickSort {
    /**
     * Test whether an array is sorted.
     *
     * @param {number[]} arr
     * @returns {boolean}
     */
    sorted(arr) {
        for (let i = 0; i <= arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }

    /**
     * Randomize an array to avoid O(n**2) complexity.
     *
     * @param {*} arr
     */
    randomize(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            this._exchange(arr, Math.floor(Math.random() * i), i);
        }
    }

    /**
     * Randomize and sort a whole array.
     *
     * @param {*} arr
     */
    sort(arr) {
        this.randomize(arr);
        this._sort(arr, 0, arr.length - 1);

        if (!this.sorted) {
            console.error("Sorting failed!!!");
            console.error(arr);
        }
    }

    /**
     * Swap two array items
     *
     * @param {*} arr
     * @param {*} a
     * @param {*} b
     */
    _exchange(arr, a, b) {
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }

    /**
     * Sort a part of an array.
     *
     * @param {*} start Zero-based index at which to begin.
     * @param {*} end Zero-based index at which to end.
     */
    _sort(arr, start, end) {
        if (start >= end) {
            return;
        }
        let p = start;
        let k = arr[start];
        let lt = start;
        let gt = end;

        while(p <= gt) {
            if (arr[p] < k) {
                this._exchange(arr, p++, lt++);
            } else if (arr[p] > k) {
                this._exchange(arr, p, gt--);
            } else {
                p++;
            }
        }

        this._sort(arr, start, lt - 1);
        this._sort(arr, gt + 1, end);
    }
}

const test = new QuickSort();

let arr = [5, 3]
test.sort(arr)
console.log(">>> ", arr);

arr = [2, 1, 3, 2, 5]
test.sort(arr)
console.log(">>> ", arr);

arr = [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 3, 2, 5]
test.sort(arr)
console.log(">>> ", arr);

arr = Array.apply(null, new Array(20)).map(x => Math.floor(Math.random() * 20));
test.sort(arr);
console.log(">>> ", arr);

arr = Array.apply(null, new Array(19)).map(x => Math.floor(Math.random() * 100));
test.sort(arr);
console.log(">>> ", arr);