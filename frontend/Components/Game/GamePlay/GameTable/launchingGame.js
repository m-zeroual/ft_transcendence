
export class LaunchingGame extends HTMLElement{
    constructor(Time, RoundNumber)
    {
        super();
        const launching_game = document.createElement('template')
        launching_game.innerHTML = /*html*/`
            <style>
                p{
                    font-size: 4rem;
                    color: white;
                    text-shadow: 0 0 5px #00b9be;
                }
            </style>
            <p id="round">Round ${RoundNumber}</p>
            <p id="time">${Time}</p>
        `
        this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(launching_game.content.cloneNode(true))
    }
    updateTimer(time, RoundNumber){
        this.shadowRoot.getElementById('round').textContent = `Round ${RoundNumber}`
        this.shadowRoot.getElementById('time').textContent = `${time}`
    }
}