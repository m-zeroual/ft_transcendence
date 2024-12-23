import { getLeagueColor } from "/Utils/LeaguesData.js";

export class ChatItemComponent extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});

        this.shadowRoot.innerHTML = `
            <style>
                ${cssContent}
            </style>
            <a class="container">
                <div class="profileAndOnlineContainer">
                    <div class="profileAndOnline">
                        <c-hexagon class="profile" width="90px" height="87px" apply="true" bcolor="#d9d9d9">
                            <div slot="content" class="c-hexagon-content"></div>
                        </c-hexagon>
                        <c-hexagon class="online" width="20px" height="20px" apply="true" bcolor="#d9d9d9" >
                            <div style="width: 100%; height: 100%; background-color: #d9d9d9;" slot="content"></div>
                        </c-hexagon>
                    </div>
                </div>
                <div class="userNameAndLastMessageContainer">
                    <h2></h2>
                    <p></p>
                </div>
                <div class="numberOfMessageAndTimeContainer">
                    <p></p>
                </div>
            </a>
        `;
    }


    connectedCallback() {
        this.style.backgroundColor = this.backgroundColor || "transparent";
        this.shadowRoot.querySelector(".container").style.opacity = this.opacity || 0.6;
        this.shadowRoot.querySelector(".userNameAndLastMessageContainer p").textContent = this.lastMessage || "...";
        this.shadowRoot.querySelector(".numberOfMessageAndTimeContainer p").textContent = this.time || "00.00.00";
        this.shadowRoot.querySelector("h2").textContent = this.userName || "unknown";
        this.shadowRoot.querySelector(".profile").bcolor = getLeagueColor(this.league);

        this.shadowRoot.querySelector(".c-hexagon-content").style.background = "url(" + this.profileImage + ") center / cover no-repeat";

        const element = this.shadowRoot.querySelector(".online");
        element.bcolor = this.active === "true" ? "#00ffff" : "#d9d9d9";
        element.querySelector("div").style.background = this.active === "true" ? "#00ffff" : "#d9d9d9";
    }

    static observedAttributes = ["opacity", "background-color", "user-name", "last-message", "time", "number-of-message", "league", "profile-image", "active"];

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "background-color")
            this.style.backgroundColor = newValue;
        else if (name === "opacity")
            this.shadowRoot.querySelector(".container").style.opacity = newValue;
        else if (name === "user-name") {
            this.shadowRoot.querySelector(".container").href = "/Chat/" + newValue;
            this.shadowRoot.querySelector("h2").textContent = newValue;
        }
        else if (name === "last-message")
            this.shadowRoot.querySelector(".userNameAndLastMessageContainer p").textContent = newValue;
        else if (name === "time")
            this.shadowRoot.querySelector(".numberOfMessageAndTimeContainer p").textContent = newValue;
        else if (name === "active")
        {
            this.shadowRoot.querySelector(".online").bcolor = (newValue === "true" ? "#00ffff" : "#d9d9d9");
            this.shadowRoot.querySelector(".online div").style.background = (newValue === "true" ? "#00ffff" : "#d9d9d9");
        }
        else if (name === "league")
            this.shadowRoot.querySelector(".profile").bcolor = getLeagueColor(newValue);
        else if (name === "profile-image")
            this.shadowRoot.querySelector(".c-hexagon-content").style.background = "url(" + newValue + ") center / cover no-repeat";
    }



    set id(val) { this.setAttribute("id", val);}
    get id() { return this.getAttribute("id");}

    set opacity(val) { this.setAttribute("opacity", val);}
    get opacity() { return this.getAttribute("opacity");}
    set backgroundColor(val) { this.setAttribute("background-color", val);}
    get backgroundColor() { return this.getAttribute("background-color");}

    
    set lastMessage(val) { this.setAttribute("last-message", val);}
    get lastMessage() { return this.getAttribute("last-message");}
    
    set time(val) { this.setAttribute("time", val);}
    get time() { return this.getAttribute("time");}
    
    
    set numberOfMessage(val) { this.setAttribute("number-of-message", val);}
    get numberOfMessage() { return this.getAttribute("number-of-message");}
        
    set userName(val) { this.setAttribute("user-name", val);}
    get userName() { return this.getAttribute("user-name");}

    set league(val) { this.setAttribute("league", val);}
    get league() { return this.getAttribute("league");}
    
    set active(val) { this.setAttribute("active", val);}
    get active() { return this.getAttribute("active");}
    
    set profileImage(val) { this.setAttribute("profile-image", val);}
    get profileImage() { return this.getAttribute("profile-image");}

}

customElements.define("chat-item", ChatItemComponent);

const cssContent = /*css*/`
    :host {
        font-family: 'Sansation bold';
        padding: 12px 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 100px;
        background-color: "transparent";
    }

    .c-hexagon-content {
        width: 90px;
        height: 90px;
    }

    .container {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 100px;
        opacity: 0.6;
        text-decoration: none;
        
    }

    .profileAndOnlineContainer {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 10px;
        flex: 1;
    }

    .profileAndOnline {
        position: relative;
        height: min-content;
        padding-left: 20px;
    }

    .profileAndOnline .online {
        position: absolute;
        top: 7px;
        right: 15px;
    }

    .userNameAndLastMessageContainer {
        flex: 2.5;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        color: white;
    }

    .userNameAndLastMessageContainer h2 {
        font-size: 32px;
        margin: 0;
        font-family: 'Sansation Bold';
        
    }

    .userNameAndLastMessageContainer p {
        font-size: 12px;
        margin: 0;
        font-family: 'Sansation';
        color: #d9d9d9;

    }

    .numberOfMessageAndTimeContainer {
        display: flex;
        flex-direction: column;
        gap: 18px;
        align-items: center;
        justify-content: center;
        flex: 0.7;
        margin-right: 20px;
        font-family: 'Sansation bold';
    }

    .numberOfMessageAndTimeContainer p {
        margin: 0;
        font-size: 10px;
        color: #C5C4C490;
    }

    .numberOfMessage {
        color: white;
        font-size: 16px;
        background-color: #00FFFF90;
        padding: 5px 17px;
        border-radius: 30px;
    }
`;