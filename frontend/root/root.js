import {GameSelection} from '../Game/GameSelection.js'

customElements.define("game-selection", GameSelection)

const sideBar = document.querySelector('side-bar')
const header = document.querySelector('header-bar')


const rootContent = ['home-page',
     'game-selection',
     'chat-page',
     'freinds-page',
     'tournament-page',
     'settings-page'
]

class Root extends HTMLElement{

    constructor()
    {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    ${cssContent}
                </style>
                <div class="rootContainer">
                </div>
            `;
    }

    set ChangeRootContent(component){
        const content = document.createElement(component)
        const rootContent = this.shadowRoot.querySelector(".rootContainer");
        rootContent.innerHTML = '';
        rootContent.appendChild(content);
    }
    clickEvent() {
        const buttons = sideBar.shadowRoot.querySelectorAll('sb-button')
        buttons.forEach((button, index) => {
            button.addEventListener('click', () => {
                if(button.classList.length === 0)
                {
                    this.ChangeRootContent = rootContent[index]
                    sideBar.clickEvent = index;
                    sideBar.activeButton = button;

                }
            });
        })
        const profile = header.querySelector('c-profile')
        profile.addEventListener('click', () => {

            if(this.shadowRoot.querySelector(".rootContainer").firstChild.nodeName !== 'PROFILE-COMPONENT')
                this.ChangeRootContent = 'profile-component'
            if(sideBar.activeButton.classList.length)
            {
                sideBar.activeButton.classList.toggle('on')
                sideBar.activeButton.querySelector('h1').classList.toggle('on')
                sideBar.activeButton.querySelector('img').classList.toggle('on')
            }
        })
    }
    connectedCallback()
    {
        this.clickEvent()
    }
}


const cssContent = /*css*/`
    :host {
        grid-area: content;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 2%;
        padding-top: 3%;
    }
    .rootContainer {
        position: relative;
        width: 96%;
        height: 96%;
    }
`;

customElements.define("root-content", Root)
