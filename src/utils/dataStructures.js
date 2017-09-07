/**
 * Class representing Set &mdash; collection of unique elements, which should
 * be of any JS primitive type (no <tt>Object</tt>s).</br>
 * Use <tt>Set.elements()</tt> to get the <tt>Array</tt> of Set's elements.
 */
export class PrimitiveSet {
    constructor(...elements) {
        this._arr = [];
        this.add(elements);
    }

    /**
     * Get the Set's elements.
     * @returns {Array} - Elements in the Set.
     */
    get elements() {
        return this._arr;
    }

    /**
     * Adds elements to the Set. Already present elements are ignored.
     * @param {...*|Array} elements - Elements to be added (Array or plain enumeration).
     */
    add(...elements) {
        if (!elements.length) {
            return;
        }
        if (elements.length === 1 && (elements[0] instanceof Array)) {
            elements = elements[0];
        }
        for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];
            if (!this._arr.includes(elem)) {
                this._arr.push(elem);
            }
        }
    }

    /**
     * Removes elements from the Set. Not present elements are ignored.
     * @param {...*|Array} elements - Elements to be removed (Array or plain enumeration).
     */
    remove(...elements) {
        if (!elements.length) {
            return;
        }
        if (elements.length === 1 && (elements[0] instanceof Array)) {
            elements = elements[0];
        }
        for (let i = 0; i < elements.length; i++) {
            const elem = elements[i];
            const index = this._arr.indexOf(elem);

            if (index !== -1) {
                this._arr.splice(index, 1);
            }
        }
    }
}