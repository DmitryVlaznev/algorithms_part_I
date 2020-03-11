class QuickSelect {
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
     *  Return Kth smallest item.
     *
     * @param {*} arr An array to find
     * @param {*} k An index
     */
    select(arr, k) {
        const l = arr.length;
        if (k > l || k < 1) {
            return -1;
        }
        this.randomize(arr);

        const ki = k - 1;
        let start = 0;
        let end = l - 1;
        let i = this._partition(arr, start, end);
        while (i != ki) {
            if (i < ki) {
                start = i + 1;
            } else {
                end = i - 1;
            }
            i = this._partition(arr, start, end);
        }
        return arr[i];
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
     *
     * @param {*} arr
     * @param {*} start
     * @param {*} end
     */
    _partition(arr, start, end) {
        let [lt, p] = [start, start];
        let k = arr[start];
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
        return lt;
    }
}

/**
 *
 * @param {*} arr
 */
function sortAndSelect(arr, k) {
    const l = arr.length;
    if (k > l || k < 1) {
        return -1;
    }
    arr.sort((a, b) => {
        return a < b ? -1 : a > b ? 1 : 0;
    });

    return arr[k - 1];
}

const test = new QuickSelect();

let arr = [2, 1, 3, 8, 5]
console.log(sortAndSelect(arr.slice(), 4), ">>>", test.select(arr, 4));

arr = [2, 1, 3, 8, 5]
console.log(sortAndSelect(arr.slice(), 1), ">>>", test.select(arr, 1));

arr = [2, 1, 3, 8, 5]
console.log(sortAndSelect(arr.slice(), 15), ">>>", test.select(arr, 15));

arr = [4, 4, 2, 1, 5, 3, 7]
console.log(sortAndSelect(arr.slice(), 3), ">>>", test.select(arr, 3));

arr = Array.apply(null, new Array(20)).map(x => Math.floor(Math.random() * 20));
console.log(sortAndSelect(arr.slice(), 12), ">>>", test.select(arr, 12));

arr = Array.apply(null, new Array(100)).map(x => Math.floor(Math.random() * 1000));
console.log(sortAndSelect(arr.slice(), 73), ">>>", test.select(arr, 73));