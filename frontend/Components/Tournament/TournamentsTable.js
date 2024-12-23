import { calculateTimeDifferents } from "/Utils/DateUtils.js";
import { createTournament, get_tournament_by_id, get_tournaments_by_player_id, player_leave_tournament } from "/Components/Tournament/configs/TournamentAPIConfigs.js";
import { CustomButton } from "/Components/Tournament/CustomButton.js";
import { JoinTournament } from "/Components/Tournament/JoinTournament.js";
import { CreateTournament } from "/Components/Tournament/CreateTournament.js";
import { GenerateRounds } from "/Components/Tournament/GenerateRounds.js";
import { closeWebSocket, initWebSocket } from "/Utils/TournamentWebSocketManager.js";
import { createTournamentTable } from "/Components/Tournament/configs/TournamentUtils.js";
import { router } from "/root/Router.js";
import { HOST, PROFILE_API_URL } from "/Utils/GlobalVariables.js";
import { createApiData } from "/Utils/APIManager.js";


export class TournamentsTable extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <style>
                ${cssContent}
            </style>
            <div class="sss">
                <div class="mainContainer"></div>

                <div class="tournament-actions">
                    <custom-button id="firstButton" width="300px">
                        <h3>JOIN TOURNAMENT</h3>
                    </custom-button>
                    <custom-button id="secondButton" width="300px" background-color="#0C9BA3" reverse>
                        <h3>CREATE TOURNAMENT</h3>
                    </custom-button>
                </div>
            </div>
        `;
    }
    interval;
    async connectedCallback() {
        let tournament_id = window.location.pathname.substring(11);
        if (tournament_id) {
            this.innerHTML = '';
            const rounds = document.createElement("generate-rounds");
            this.appendChild(rounds);
            return ;
        }

        const tournamentsAPIData = await get_tournaments_by_player_id();
        if (!tournamentsAPIData)
            return;
        const mainContainer = this.querySelector(".mainContainer");
        await createTournamentTable(this, mainContainer, tournamentsAPIData);
        const tournamentDeadLine = mainContainer.querySelectorAll(".deadLineTime");
        // console.log("tournamentDeadLine: ", tournamentDeadLine);
        this.interval = setInterval(() => {
            Array.from(tournamentDeadLine).forEach(tourn => {
                if (tourn.textContent != "finished")
                    tourn.textContent = calculateTimeDifferents(tourn.dataset.createdAt);
            });
        }, 1000);

        const firstButton = this.querySelector("#firstButton");
        firstButton.addEventListener("click", async () => {
            const buttonValue = firstButton.querySelector("h3");
            if (buttonValue.textContent == "CANCEL") {
                await createTournamentTable(this, mainContainer, tournamentsAPIData);
                buttonValue.textContent = "JOIN TOURNAMENT";
                secondButton.querySelector("h3").textContent = "CREATE TOURNAMENT";
            } else {
                let joinTournament = document.createElement("join-tournament");
                joinTournament.id = "joinTournament";
                this.appendChild(joinTournament);
            }
        });

        const secondButton = this.querySelector("#secondButton");
        secondButton.addEventListener("click", async () => {
            const buttonValue = secondButton.querySelector("h3");
            if (buttonValue.textContent == "GENERATE") {
                const data = this.querySelector("create-tournament").data;
                if (data) {
                    try {
                        const response = await createTournament(data);
                        if (!response)
                            throw new Error(`${response.status}  ${response.statusText}`);
                        const tournamentResponse = await response.tournament;
                        await createApiData(PROFILE_API_URL + "setNickname/", JSON.stringify({nickname: data.nickname, tournament_id: tournamentResponse.tournament_id}));
                        /**
                         * 
                         * @author rida
                         */
                        await initWebSocket(tournamentResponse);
                        const url = new URL(HOST + "/Tournament/" + tournamentResponse.tournament_id);
                        router.handleRoute(url.pathname);
                    } catch (error) {
                        console.log(error);
                    }
                } else
                    console.log("Please fill all inputs field!!");
            } else {
                mainContainer.innerHTML = '';
                mainContainer.appendChild(document.createElement("create-tournament"));
                buttonValue.textContent = "GENERATE";
                firstButton.querySelector("h3").textContent = "CANCEL";
            }
        });
    }


    disconnectedCallback() {
        clearInterval(this.interval);
    }

}

customElements.define('tournaments-table', TournamentsTable);


const cssContent = /*css*/`
:host {
    width: 100%;
    height: 100%;
    position: relative;
}
.mainContainer {
    display: flex;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

h2 {
    margin: 0;
}

.mainContainer::-webkit-scrollbar {
    opacity: 0.7;
    background-color: transparent;
    width: 2px;
}

.mainContainer::-webkit-scrollbar-track {
    opacity: 0.7;
    border-radius: 100px;
}

.mainContainer::-webkit-scrollbar-thumb {
    opacity: 0.7;
    background-color: aqua;
    border-radius: 100px;
}


table {
    width: 100%;
    height: min-content;
    font-size: 26px;
    color: white;
}


thead > tr {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 2;
    background-image: linear-gradient(to right, #24606e, #214251, #224655);
    width: 100%;
    height: 56px;
    font-size: 24px;
}

tbody {
    width: 100%;
}

tbody > tr {
    height: 64px;
    font-size: 22px;
    text-align: center;
    opacity: 0.6;
    background-color: #00fffc10;
}

td {
    height: 64px;
    border-top: 0.1px solid #051d31;
}

.actions * {
    cursor: pointer;
}

.actions {
    display: flex;
    gap: 40px;
    align-items: center;
    justify-content: center;
}




.tournament-actions {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 5px;
}

.settingsContainer {
    width: 100%;
    height: 100%;
    background: green;
    display: flex;
}
.settings-section {
    flex: 2;
    height: 100%;
    background: #cccc4040;
}

.c-hexagon-content {
    width: 100%;
    height: 100%;
}

h4 {
    max-width: 90px;
    overflow-x: scroll;
}

h4::-webkit-scrollbar {
    display: none;
}

.sss {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

`;
