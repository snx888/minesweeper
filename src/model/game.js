import Handler from '../mixin/handler.js'

export const STATE = {
    STARTED: 0,
    SUCCEEDED: 1,
    FAILED: 2,
    ABORTED: 3
}
export const TIME_STATE = {
    TRY: 0,
    LEADERBOARD: 1,
    BEST: 2,
}

export default class extends Handler() {

    #size
    #board
    #time
    #interval
    #state
    #timeState
    #marked
    #picked
    #timeToBeat

    constructor (size, timeToBeat) {
        super()
        this.#size = size
        this.#timeToBeat = timeToBeat
        // build empty board..
        this.#board = new Array(size).fill().map(line => 
            new Array(size).fill().map(field => { return {
                mine: false,
                radar: 0,
                picked: false,
                marked: false
            }})
        )
        // place mines..
        let mines = 0
        while (mines < size) {
            // get random field..
            const x = Math.floor(Math.random() * size)
            const y = Math.floor(Math.random() * size)
            //console.log('set mine:', x,y)
            const field = this.#board[y][x]
            if (!field.mine) {
                // set mine and update count..
                mines++
                field.mine = true
                // update radar of adjacent fields..
                this.#forAdjacentFields(x, y, (x,y,f) => f.radar++)
            }
        }
        //console.log(this.#board.map(x => x.map(y => y.mine ? 'X' : y.radar).join(' ')))
        // set state..
        this.#state = STATE.STARTED
        this.#picked = 0
        this.#marked = 0
        // set start time..
        this.#time = 0
        this.#interval = setInterval(() => {
            this.#time++
            if (this.#timeToBeat.best === 0 || this.#time < this.#timeToBeat.best) this.#timeState = TIME_STATE.BEST
            else if (this.#timeToBeat.worst === 0 || this.#time < this.#timeToBeat.worst) this.#timeState = TIME_STATE.LEADERBOARD
            else this.#timeState = TIME_STATE.TRY
            this._emit('time', this.#time, this.#timeState)
        }, 1000)
        this._emit('start', this.#board)
    }

    abort () {
        this.#state = STATE.ABORTED
        this.#stop()
    }

    get board () { return this.#board }
    get size () { return this.#size }
    get state () { return this.#state }
    get marked () { return this.#marked }
    get picked () { return this.#picked }
    get time () { return this.#time }

    pick (x, y) {
        if (this.#state !== STATE.STARTED) return
        const field = this.#board[y][x]
        if (!field) return
        if (field.marked || field.picked) return
        if (field.mine) this.#booom(x, y, field)
        else this.#puhhh(x, y)
    }

    mark (x, y) {
        if (this.#state !== STATE.STARTED) return
        const field = this.#board[y][x]
        if (!field) return
        if (field.picked) return
        field.marked = !field.marked
        this.#updateStats()
        this._emit('update', x, y, field)
    }

    win () {
        this.#yeahhh()
    }
    loose () {
        this.#booom(0, 0, this.#board[0][0])
    }


    #stop () {
        clearInterval(this.#interval)
    }

    #puhhh (x, y) {
        // pick field and auto-pick adjacent fields if radar is empty..
        this.#pick(x, y)
        // check success (only the mined fields are hidden)
        const hidden = this.#board.reduce((acc, line) => acc += line.reduce((acc, field) => acc += !field.picked ? 1 : 0, 0), 0)
        if (hidden === this.#size) this.#yeahhh()
    }

    #booom (x, y, field) {
        field.picked = true
        this._emit('update', x, y, field)
        this.#state = STATE.FAILED
        this.#stop()
        this._emit('end', false)
    }

    #yeahhh () {
        this.#state = STATE.SUCCEEDED
        this.#stop()
        this._emit('end', true)
    }

    #pick = (x, y) => {
        const field = this.#board[y][x]
        if (!field) return
        if (field.picked) return
        field.picked = true
        this.#updateStats()
        this._emit('update', x, y, field)
        if (field.radar > 0) return
        // pick adjacent fields..
        this.#forAdjacentFields(x, y, this.#pick)
    }
    
    #forAdjacentFields(x, y, func) {
        this.#board.forEach((line, l) => {
            if (l < y-1 || l > y+1) return
            line.forEach((field, f) => {
                if (f < x-1 || f > x+1) return
                func(f, l, field)
            })
        })
    }

    #updateStats () {
        [this.#picked, this.#marked] = this.#board.reduce((acc, line) => {
            const lin = line.reduce((acc, field) => {
                return [
                    acc[0] + (field.picked ? 1 : 0),
                    acc[1] + (field.marked ? 1 : 0)
                ]
            }, [0,0])
            return [
                acc[0] + lin[0],
                acc[1] + lin[1]
            ]
        }, [0,0])
        this.#picked = parseInt(this.#picked / (this.#size * (this.#size-1)) * 100)
        this.#marked = parseInt(this.#marked / this.#size * 100)
    } 

}