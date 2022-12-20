export default (superclass=class{}) => class extends superclass {

    #listener = {}

    on (event, func) {
        if (!this.#listener[event]) this.#listener[event] = []
        this.#listener[event].push(func)
    }

    _emit (event, ...params) {
        if (this.#listener[event]) {
            this.#listener[event].forEach(func => {
                func(...params)
            })
        }
        if (!this.#listener['*']) return
        this.#listener['*'].forEach(func => {
            func(...params)
        })
    }

}