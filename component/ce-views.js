const html = /*html*/`
    <slot></slot>
`
const css = /*css*/`
    :host {
        display: block;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    ::slotted(.hidden) {
        display: none !important;
    }
`

export default class extends HTMLElement {

    #views = []
    #stack = []

    static {
        customElements.define('ce-views', this)
    }

    constructor () {
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
        const template = document.createElement('template')
        template.innerHTML = `<style>${css}</style>${html}`
        this.shadowRoot.appendChild(template.content)
        this.#views = [...this.shadowRoot.querySelector('slot').assignedElements()]
        this.#switch(0)
    }

    switchTo (next) {
        if (typeof next === 'number') {
            if (next < 0) this.switchBack()
            else this.#switchToIndex(next)
        } else {
            this.#switchToIndex(this.#views.findIndex(view => view.getAttribute('name') === next))
        }
    }

    switchBack () {
        // get previous view..
        const previous = this.#stack.pop()
        // switch view..
        if (previous !== undefined) this.#switchToIndex(previous)
    }

    #switchToIndex (index) {
        if (index < 0) return
        // get current view..
        const current = this.#views.findIndex(view => !view.classList.contains('hidden'))
        // return if the requested is already up..
        if (current === index) return
        // add current to back-stack..
        if (current >= 0) this.#stack.push(current)
        // switch visibility..
        this.#switch(index)
    }

    #switch (index) {
        if (index < 0) return
        // update ui - switch visibility..
        this.#views.forEach((view, i) => i === index
            ? view.classList.remove('hidden')
            : view.classList.add('hidden'))
    }

}