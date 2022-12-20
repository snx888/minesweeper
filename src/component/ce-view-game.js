import main from '../controller/main.js'
import { DEV } from '../settings.js'
import { TIME_STATE } from '../model/game.js'

const html = /*html*/`
<div class="root started">
    <div class="container">
        <div class="time">23</div>
        <div class="progress">
            <div class="picked"></div>
            <div class="marked"></div>
        </div>
        <div class='board'>
        </div>
        <div class="thumb thumb-up hidden">
            <span class="material-icons">thumb_up_alt</span>
        </div>
        <div class="thumb thumb-down hidden">
            <span class="material-icons">thumb_down_alt</span>
        </div>
    </div>
    <aside>
        <div class="success onSucceeded onLeaderboard">
            <span class="material-icons">emoji_emotions</span>
            Yeahhh, you made it! The buggy code can be fixed now..
        </div>
        <div class="success onSucceeded">
            Unfortunately you didn't beat the curretn highscore..
        </div>
        <div class="fail onFailed">
            <span class="material-icons">sentiment_dissatisfied</span>
            You executed buggy code and forced the system to crash..
        </div>
    </aside>
    <nav>
        <button class="abort onStarted">Abort</button>
        <button class="back onFailed onSucceeded">Back</button>
        <button class="restart onStarted onFailed onSucceeded">Restart</button>
        <button class="win onStarted">win</button>
        <button class="loose onStarted">loose</button>
        <div class="onLeaderboard">
            You'll also appear in the leaderboard, please type in your name:<br>
            <div>
                <input type="text" size="6" maxlength="6" placeholder="---"/>
                <button class="save onLeaderboard">save</button>
            </div>
        </div>
    </nav>
</div>
`
const css = (size) =>/*css*/`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    :host {
        height: 100%;
        width: 100%;
    }
    .root {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .container {
        position: relative;
    }
    .board {
        display: grid;
        grid-template-columns: repeat(${size}, 20px);
        grid-template-rows: repeat(${size}, 20px);
        gap: 1px;
        background: var(--background);
        position: relative;
    }
    .board:before { 
        font-family: 'Material Icons'; 
        content: '\\e322';
        font-size: calc(${size} * 3.25em);
        margin: -.3em 0 0 -.3em;
        position: absolute;
        z-index: -1;
        opacity: .1;
    }
    .cell {
        background: var(--surface);
        text-align: center;
        font-weight: bold;
    }
    /*.cell:before { 
        font-family: 'Material Icons'; 
        content: '\\ead3'; 
        content: '\\e322';
        font-size: 1.2em;
        color: var(--background);
    }*/
    .radar,
    .mine { 
        animation: pick .5s ease forwards;
    }
    @keyframes pick {
        50% {
            transform: scale(50%);
            background: none;
        }
        100% {
            transform: scale(100%);
            background: none;
        }
    }    
    /*.radar:before { 
        content: none;
    }*/
    .mine:before { 
        font-family: 'Material Icons'; 
        color: var(--error);
        content: '\\f0fa'; 
    }
    .flag {
        animation: mark .5s ease;
    }
    @keyframes mark {
        50% {
            transform: scale(50%);
        }
        100% {
            transform: scale(100%);
        }
    }    
    .flag:before {
        font-family: 'Material Icons'; 
        color: var(--ok);
        content: '\\f00e'; 
    }
    .radar-1 {
        color: orange;
    }
    .radar-2 {
        color: var(--warning);
    }
    .radar-3,
    .radar-4,
    .radar-5,
    .radar-6,
    .radar-7,
    .radar-8 {
        color: var(--error);
    }
    .time {
        position: absolute;
        top: calc(${size/8} * -1.2em - .4em);
        width: 40px;
        left: calc(50% - 20px);
        text-align: center;
        font-weight: bold;
        transition: color 2s;
        color: var(--error);
        background: var(--background);
    }
    .time.best {
        color: var(--ok);
    }
    .time.leaderboard {
        color: var(--warning);
    }    
    .progress {
        position: absolute;
        bottom: calc(${size/8} * -1.2em - .2em);
        height: calc(${size/8} * .5em);
        width: 100%; /*calc(${size} * 20px);*/
        background: var(--surface);
        border: 2px solid var(--background);
        transform: translateX(-2px);
    }
    .picked {
        background: var(--background);
        width: 0;
        height: 100%;
        position: absolute;
    }
    .marked {
        background: var(--ok);
        width: 0;
        height: 100%;
        position: absolute;
    }
    nav {
        bottom: 2em;
        position: absolute;
        display: flex;
        gap: 1em;
    }
    @media screen and (max-height: 600px) {
        nav {
            bottom: auto;
            left: 2em;
            flex-direction: column;
        }
    }    
    button {
        padding: .5em;
        border-radius: 5px;
        background: var(--primary);
        color: var(--onPrimary);
        border: none;
        font-size: 1em;
        display: none;
    }
    .root.started button.onStarted {
        display: inline-block;
    }
    .root.succeeded button.onSucceeded {
        display: inline-block;
    }
    .root.failed button.onFailed {
        display: inline-block;
    }
    .root.leaderboard button.onLeaderboard {
        display: inline-block;
    }
    nav div.onLeaderboard {
        margin: 1em;
        text-align: center;
        display: none;
        flex-direction: column;
        align-items: center;
        gap: .5em;
    }
    .root.leaderboard div.onLeaderboard {
        display: flex;
    }
    .hidden {
        display: none !important;
    }
    .thumb {
        position: absolute;
        top:0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: thumb 1s ease-in forwards;
    }
    @keyframes thumb {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        30%, 90% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    .thumb-up {
        color: var(--ok);
    }
    .thumb-down {
        color: var(--error);
    }
    .thumb span {
        transform: scale(4);
    }
    aside {
        position: absolute;
        top: 0;
        margin: 1em;
    }
    aside div {
        padding: 1em;
        display: none;
        justify-content: flex-start;
        align-items: center;
        gap: 1em;
        box-shadow: 0 0 5px black;
    }
    .success {
        background: var(--ok);
        color: snow;
    }
    .fail {
        background: var(--error);
        color: snow;
    }
    .root.leaderboard aside div.onLeaderboard,
    .root.succeeded aside div.onSucceeded,
    .root.failed aside div.onFailed {
        display: flex;
    }
    input {
        display: inline;
        background: var(--surface);
        color: var(--onSurface);
        outline: none;
        padding: .5em;
        border-radius: 5px;
        border: none;
        font-size: 1em;
        text-transform: lowercase;
    }
    ::placeholder {
        color: var(--onSurface);
        opacity: .5;
    }
`
export default class extends HTMLElement {

    static {
        customElements.define('ce-view-game', this)
    }

    #el = {}

    constructor () {
        super()
        this.attachShadow({mode: 'open'})
        main.on('start', this.#draw)
    }

    connectedCallback() {}

    #draw = (game) => {
        const template = document.createElement('template')
        template.innerHTML = `<style>${css(game.size)}</style>${html}`
        this.shadowRoot.textContent = ''
        this.shadowRoot.appendChild(template.content)
        if (!DEV) {
            this.shadowRoot.querySelector('.win').style.display = 'none'
            this.shadowRoot.querySelector('.loose').style.display = 'none'
        }
        this.shadowRoot
            .querySelectorAll('.abort, .back')
            .forEach(el => el.addEventListener('click', e => main.abort()))
        this.shadowRoot
            .querySelector('.restart')
            .addEventListener('click', e => main.restart())
        this.shadowRoot
            .querySelector('.save')
            .addEventListener('click', e => main.save(game, this.shadowRoot.querySelector('input').value))
        this.shadowRoot
            .querySelector('.win')
            .addEventListener('click', e => game.win())
        this.shadowRoot
            .querySelector('.loose')
            .addEventListener('click', e => game.loose())
        this.shadowRoot
            .querySelector('input')
            .addEventListener('keypress', e => e.key  === 'Enter' && main.save(game, this.shadowRoot.querySelector('input').value))
        this.#el = {
            picked: this.shadowRoot.querySelector('.picked'),
            marked: this.shadowRoot.querySelector('.marked'),
            time: this.shadowRoot.querySelector('.time')
        }
        game.on('update', this.#drawCell)
        game.on('time', this.#drawTime)
        game.on('end', this.#drawEnd)
        this.#drawBoard(game)
    }

    #drawEnd = succeeded => {
        if (succeeded) {
            const lb = main.leaderboard.check(main.game.size, main.game.time)
            if (lb) {
                this.shadowRoot.querySelector('.root').classList.replace('started', 'leaderboard')
                this.shadowRoot.querySelector('input').focus()
            } else {
                this.shadowRoot.querySelector('.root').classList.replace('started', 'succeeded')
            }
            this.shadowRoot.querySelector('.thumb-up').classList.remove('hidden')
        } else {
            this.shadowRoot.querySelector('.root').classList.replace('started', 'failed')
            this.shadowRoot.querySelector('.thumb-down').classList.remove('hidden')
        }
    }

    #drawBoard = (game) => {
        const grid = this.shadowRoot.querySelector('.board')
        //console.log(this.#board.map(y => y.map(x => x.mine ? 'X' : x.radar).join(' ')))
        game.board.forEach((line, y) => line.forEach((field, x) => {
            const cell = document.createElement('div')
            cell.className = "cell"
            cell.setAttribute('cell', `x${x}y${y}`)
            cell.addEventListener('click', e => {
                e.preventDefault()
                e.stopPropagation()
                e.cancelBubble = true
                /*const x = e.target.getAttribute('x')
                const y = e.target.getAttribute('y')*/
                game.pick(x, y)
                return false
            })
            cell.addEventListener('contextmenu', e => {
                e.preventDefault()
                e.stopPropagation()
                e.cancelBubble = true
                /*const x = e.target.getAttribute('x')
                const y = e.target.getAttribute('y')*/
                game.mark(x, y)
                return false
            })
            this.#setCell(cell, field)
            grid.prepend(cell)
        }))
        this.#drawStats(game)
        this.#drawTime(game.time)
    }

    #drawCell = (x, y, field) => {
        const cell = this.shadowRoot.querySelector(`[cell="x${x}y${y}"]`)
        this.#setCell(cell, field)
        this.#drawStats(main.game)
    }

    #setCell (cell, field) {
        if (field.picked) {
            if (field.mine) cell.classList.add('mine')
            else {
                cell.classList.add('radar')
                if (field.radar) {
                    cell.textContent = field.radar
                    cell.classList.add(`radar-${field.radar}`)
                }
            }
        }
        else if (field.marked) cell.classList.add('flag')
        else cell.classList.remove('flag')
    }

    #drawStats (game) {
        this.#el.picked
            .style = `width: ${game.picked}%`
        this.#el.marked
            .style = `width: ${game.marked}%`
    }

    #drawTime = (time, timeState) => {
        if (timeState === TIME_STATE.BEST) this.#el.time.className = 'time best'
        else if (timeState === TIME_STATE.LEADERBOARD) this.#el.time.className = 'time leaderboard'
        else this.#el.time.className = 'time'
        const m = parseInt(time / 60)
        let s = time % 60
        if (m && s < 10) s = `0${s}`
        const t = m > 0 ? `${m}:${s}` : s
        this.#el.time.textContent = t
    }

}
