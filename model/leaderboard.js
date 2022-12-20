import Handler from '../mixin/handler.js'
import { STATE } from '../model/game.js'

export default class extends Handler() {

    #board

    constructor () {
        super()
        this.#load()
    }

    get board () { return [...this.#board] }
    
    add (game, name) {
        if (game.state != STATE.SUCCEEDED) return
        if (!this.check(game.size, game.time)) return
        if (!name) name = '---'
        const sizedBoard = this.#board[this.#indexBySize(game.size)]
        sizedBoard.push({
            name,
            time: game.time
        })
        sizedBoard.sort((a,b) => a.time>b.time ? 1 : b.time>a.time ? -1 : 0)
        if (sizedBoard.length > 5) sizedBoard.pop()
        this.#save()
        this._emit('update', [...this.#board])
    }

    clear () {
        this.#board = [[],[],[]]
        this.#save()
        this._emit('update', [...this.#board])
    }

    check (size, time) {
        const sizedBoard = this.#board[this.#indexBySize(size)]
        if (sizedBoard.length < 5) return true
        const worst = [...sizedBoard].pop()
        return worst.time > time
    }

    timeToBeat(size) {
        const sizedBoard = this.#board[this.#indexBySize(size)]
        const ttb = { best:0, worst:0 }
        if (sizedBoard.length > 0) ttb.best = sizedBoard[0].time
        if (sizedBoard.length > 4) ttb.worst = sizedBoard[sizedBoard.length-1].time
        return ttb
    }

    #load () {
        try {
            this.#board = JSON.parse(localStorage.getItem('minesweeper_leaderboard'))
        } catch {}
        if (!this.#board) this.#board = [[],[],[]]
    }

    #save () {
        localStorage.setItem('minesweeper_leaderboard', JSON.stringify(this.#board))
    }

    #indexBySize (size) {
        if (size === 8) return 0
        if (size === 12) return 1
        return 2
    }

}