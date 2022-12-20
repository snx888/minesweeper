import Handler from '../mixin/handler.js'
import Game, { STATE } from '../model/game.js'
import Leaderboard from '../model/leaderboard.js'

export default new class extends Handler() {

    #game
    #leaderboard = new Leaderboard()

    get game () { return this.#game }
    get leaderboard () { return this.#leaderboard }

    start (size=8) {
        this.#game = new Game(size, this.#leaderboard.timeToBeat(size))
        this._emit('start', this.#game)
        document.querySelector('ce-views').switchTo('game')
    }

    restart () {
        const size = this.#game.size
        this.#game.abort()
        this.#game = new Game(size, this.#leaderboard.timeToBeat(size))
        this._emit('start', this.#game)
        document.querySelector('ce-views').switchTo('game')
    }

    abort () {
        this.#game.abort()
        this.#game = undefined
        document.querySelector('ce-views').switchBack()
    }

    save (game, name) {
        if (game.state === STATE.SUCCEEDED) this.#leaderboard.add(game, name)
        this.#game = undefined
        document.querySelector('ce-views').switchBack()
    }

}