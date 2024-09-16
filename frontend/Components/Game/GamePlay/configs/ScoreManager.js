import { initTournamentWebSocket } from "/Utils/TournamentManager.js";
import { closeAndRemovePlayerFromTournament, closeWebSocket } from "/Utils/TournamentWebSocketManager.js";
import { get_tournament_by_id } from "/Components/Tournament/configs/TournamentAPIConfigs.js";
import { leaveTournamentAndStoreScore, getAbi } from "/blockchain/blockchain.js";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function handleTournament(tournament_id) {
    return new Promise(async (resolve, reject) => {
        try {
            await sleep(5000);  // Sleep for 5 seconds (5000 milliseconds)
            // Log the tournament ID
            console.log("you have won: ", tournament_id);

            // Fetch the tournament data
            const newTournamentData = await get_tournament_by_id(tournament_id);
            console.log("newTournamentData: ", newTournamentData);

            // Check the number of players
            if (newTournamentData.players.length === 1) {
                // Close and remove the player from the tournament
                await closeAndRemovePlayerFromTournament(tournament_id);
                alert("you win !!");
                resolve(); // Resolve the promise since the operation is complete
                return;
            }

            // Close the WebSocket connection
            closeWebSocket(tournament_id);
            
            // Initialize a new WebSocket connection or re-establish if necessary
            initTournamentWebSocket(newTournamentData);
            
            resolve(); // Resolve the promise after initializing WebSocket

        } catch (error) {
            reject(error); // Reject the promise if any error occurs
        }
    });
}


export async function goNextStage(playerState, tournament_id, user_id, opponent_id, user_score, opponent_score) {
    try {
        if (playerState === 'lose') {
            console.log("you have lost: ", tournament_id);
            await closeAndRemovePlayerFromTournament(tournament_id);  // Close WebSocket and remove the player
            // leaveTournamentAndStoreScore(tournamentId, winnerId, winnerIdScore, loserId, loserIdScore, abi)
            // closeWebSocket(tournament_id);
            // console.log('trow 1')
            // const abi = await getAbi();
            // await leaveTournamentAndStoreScore(tournament_id, opponent_id, opponent_score, user_id, user_score, abi);
            console.log('trow 2')

        } else {
            // handleTournament(tournament_id)
            // .then(() => {
            //     console.log("Tournament handling complete.");
            // })
            // .catch(error => {
            //     console.error("An error occurred during tournament handling:", error);
            // });

            await sleep(5000);

            // setTimeout(async () => {
                // clearInterval(interval);
                console.log("you have won: ", tournament_id);
                const newTournamentData = await get_tournament_by_id(tournament_id);
                console.log("newTournamentData: ", newTournamentData);
    
                if(newTournamentData.players.length == 1)
                {
                    await closeAndRemovePlayerFromTournament(tournament_id);
                    alert("you win !!");
                    return;
                }
                closeWebSocket(tournament_id);
                // Initialize a new WebSocket connection or re-establish if necessary
                initTournamentWebSocket(newTournamentData);
                
            // }, 5000);

        }
    } catch (error) {
        console.error('Error in goNextStage:', error);  // Catch and log any errors during the process
    }
}


// export async function goNextStage(playerState, tournament_id) {
//     if (playerState == 'lose')
//     {
//         // call endpoint of erase player
//         // closeAndRemovePlayerFromTournament(data);
//         console.log("you are lose !!!!: ", tournament_id);
//         // alert("you are lose !!!!: " + tournament_id);
//         await closeAndRemovePlayerFromTournament(tournament_id);
//     }
//     else {
//         // const tournamentWebSocket = getWebSocketByTournamentId(tournament_id);
//         await sleep(5000);  // Sleep for 5 seconds (5000 milliseconds)

//         console.log("you are win !!!!: ", tournament_id);
//         const newTournamentData = await get_tournament_by_id(tournament_id)
//         console.log("newTournamentData: ", newTournamentData);
//         // if (tournamentWebSocket)
//         initTournamentWebSocket(newTournamentData);
//         // console.log("you are win !!!!: ", tournament_id);
//         // // alert("you are win !!!!: " + tournament_id);
//         // const newTournamentData = await get_tournament_by_id(tournament_id)
//         // // CheckTournamentStages(data)
//         // if(newTournamentData.number_of_players % newTournamentData.players.length == 0)
//         // {
//         //     const tournamentWebSocket = getWebSocketByTournamentId(tournament_id);
//         //     console.log("tournamentWebSocket: ", tournamentWebSocket);
//             // if (tournamentWebSocket)
//             //     CheckTournamentStages(newTournamentData, tournamentWebSocket);
//         // }
//     }
// }

