export class CreateTournament extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
            <style> ${cssContent} </style>
            <div class="settings-section">

                <div class="itemContainer">
                    <div class="item">
                        <h1>Tournament Name</h1>
                        <div class="settingsform">
                            <input type="text" placeholder="Tournament Name...">
                        </div>
                    </div>
                </div>

                <players-and-stages></players-and-stages>

                <visibillity-settings></visibillity-settings>
                
            </div>
            <qrcode-component value="hello world" title="Pong Cup"></qrcode-component>
        `;
    }



    connectedCallback() {

    }

    disconnectedCallback() {

    }

    static observedAttributes = [];

    attributeChangedCallback(attrName, oldVdalue, newValue) {

    }
}

const cssContent = /*css*/`

::-webkit-calendar-picker-indicator {
    filter: invert(1);
}

:host {
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 20px;
    flex-wrap: wrap;
    gap: 20px;
}

.settings-section {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-top: 50px;
    margin-left: 50px;
}

.itemContainer {

    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.subitems {
    display: flex;
    flex-direction: column;
    width: 90%;
    font-size: 16px;
    height: calc(100% - 10px);
    margin: 10px 5%;

}

.subitems .item h1 {
    margin: 15px;
    font-size: 24px;

}
.subitems .item .settingsform input {
    font-family: 'Sansation';
    max-width: 200px;
    min-width: 100px;
    width: auto;
    height: 40px;
    font-size: 16px;
    padding-right: 10px;
}

.item h1 {
    flex: 1;
}

.item h2 {
    font-family: 'Sansation';
    flex: 1;
}


.settingsform {
    flex: 1;
    width: 300px;
    height: 40px;
    display: flex;
    gap: 20px;
}
.settingsform input {
    height: 100%;
    border-radius: 10px;
    border: 1.5px solid aqua;
    width: 50%;
    background-color: transparent;
    font-family: 'Sansation Bold';
    color: #ffffff;
    margin-left: 10px;
    padding-left: 20px;
    outline: none;
}

.chooseContainer {
    display: flex;
    gap: 10px;
    height: 26px;
    font-size: 16px;
    align-items: center;
    
}


.checkbox {
    width: 26px;
    height: 26px;
    border: 2px solid #cccccc60;
    border-radius: 5px;
}


.aqua-border {
    border: 2px solid aqua;
    display: flex;
    border-radius: 7px;
    align-items: center;
    justify-content: center;
    background: url("/frontend/assets/icons/checked-icon.svg");
    background-repeat: no-repeat;
    background-size: cover;
}


`;