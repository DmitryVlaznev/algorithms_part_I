class IllegalArgumentException extends Error {
    constructor(message) {
        super(message);
        this.name = "IllegalArgumentException";
    }
}

class NoSuchElementException extends Error {
    constructor(message) {
        super(message);
        this.name = "NoSuchElementException";
    }
}

module.exports = {IllegalArgumentException, NoSuchElementException}