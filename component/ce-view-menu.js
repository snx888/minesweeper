import main from '../controller/main.js'
import { DEV } from '../settings.js'

const html = /*html*/`
    <h1>
        <span class="material-icons memory">memory</span>
        <span class="code">{
            <span class="material-icons bug">bug_report</span>
        }</span>
    </h1>
    <h2>bug isolator<span>a vanilla js minesweeper fork</span></h2>
    <p>Select memory size to start isolation..</p>
    <div class="difficulty">
        <button class="small" size="8">64 kB</button>
        <button class="medium" size="12">144 kB</button>
        <button class="large" size="16">256 kB</button>
        <div class="board">
            <span class="name">snx</span>
            <span class="time">37s</span>
        </div>
        <div class="board">
            <span class="name">snx</span>
            <span class="time">37s</span>
        </div>
        <div class="board">
            <span class="name">snx</span>
            <span class="time">37s</span>
        </div>
    </div>
    <button class="clear">clear board</button>
`
const css = /*css*/`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
    :host {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    h1 {
        margin: 0;
        position: relative;
    }
    .memory {
        opacity: .1;
        font-size: 4em;
    }    
    .bug {
        color: var(--error);
        transform: rotate(-30deg);
        margin: -8px;
        position: relative;
        top: 2px;
    }
    .bug:before {
        content: '';
        display: block;
        position: absolute;
        top: 12px;
        left: 12px;
        height: 0;
        width: 0;
        border-radius: 50%;
        box-shadow: 0px 0px 20px 10px var(--error);
    }
    .code {
        position: absolute;
        right: 30px;
        bottom: 35px;
    }
    h2 {
        font-size: 1.7em;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
    }
    h2 span {
        display: block;
        font-size: .41em;
        opacity: .5;
        letter-spacing: 1px;
    }
    p {
        margin: 2em 0 1em 0;
        text-align: center;
        grid-column: 1 / span 3;
    }
    .difficulty {
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: .5em;
    }
    button {
        padding: .5em;
        border-radius: 5px;
        background: var(--primary);
        color: var(--onPrimary);
        border: none;
        font-size: 1em;
    }
    .board {
        display: flex;
        flex-direction: column;
        gap: .2em;
    }
    .board div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: .5em;
        text-transform: lowercase;
    }
    div:first-child {
        font-weight: bold;
    }
    /*div:first-child .name {
        color: var(--primary);
    }*/
    .time {
        font-size: .9em;
        color: var(--warning);
    }
    div:first-child .time {
        color: var(--ok);
    }
`
export default class extends HTMLElement {

    static {
        customElements.define('ce-view-menu', this)
    }

    constructor () {
        super()
        this.attachShadow({mode: 'open'})
        main.leaderboard.on('update', this.#drawBoard)
    }

    connectedCallback() {
        const template = document.createElement('template')
        template.innerHTML = `<style>${css}</style>${html}`
        this.shadowRoot.appendChild(template.content)
        if (!DEV) {
            this.shadowRoot.querySelector('.clear').style.display = 'none'
        }
        this.shadowRoot
            .querySelectorAll('button[size]')
            .forEach(el => el.addEventListener('click', e => {
                main.start(parseInt(e.target.getAttribute('size')))
            }))
        this.shadowRoot
            .querySelector('.clear')
            .addEventListener('click', e => {
                main.leaderboard.clear()
            })
        this.#drawBoard(main.leaderboard.board)
    }

    #drawBoard = board => {
        const elBoard = this.shadowRoot.querySelectorAll('.board')
        elBoard.forEach((el,i) => {
            el.textContent = ''
            board[i].forEach(item => {
                let m = parseInt(item.time / 60)
                let s = item.time % 60
                if (s < 10) s = `0${s}`
                //if (m < 10) m = `0${m}`
                const t = `${m}:${s}`
                const div = document.createElement('div')
                div.innerHTML = `
                    <span class="name">${item.name}</span>
                    <span class="time">${t}</span>`
                el.append(div)
            })
        })
    }

}