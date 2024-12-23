const player_border = document.createElement('template');

player_border.innerHTML =  /* html */ `
<style>

        :host{
            width: 36.4%;
            aspect-ratio: 0.9;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
        }
        .player{
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            position: relative;
            width: 100%;
            aspect-ratio: 1;
            overflow: hidden;
            z-index: 1;
            border-radius: 3.5%;
        }
        
        .playerborder{
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
</style>
    <div class="player">
        <img loading="lazy" class="playerborder" src="images/GreenCart/lobby-border.svg" alt="Border">
        <slot name="Player"></slot>
        <slot name="searching"></slot>
        
    </div>
    <slot name="Name" class="textName"></slot>
`

export class PlayerBorder extends HTMLElement{

    constructor()
    {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.appendChild(player_border.content.cloneNode(true));
    }
    get revers(){
        return this.getAttribute('revers')
    }
    update(){
        if(this.revers == 'true')
        {
            const revers = this.shadowRoot.querySelector('.playerborder')
            revers.style.transform = 'scaleX(-1) scaleY(-1)';
        }
    }
    connectedCallback(){
        this.update()
    }
}

