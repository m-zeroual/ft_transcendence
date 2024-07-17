
const game_page = document.createElement('template');






game_page.innerHTML = /*html*/ `
<link rel="stylesheet" href="/frontend/Game/GamePlay/GameOnline/GamePage.css">
<div class="c_game">
    <div class="GameShapes">
		<div class="shapes_LT_RT"></div>
		<div class="shapes_LB_RB"></div>
		<div class="shapes_DT"></div>
		<div class="shapes_LR_container">
			<div class="center_shapes_LT_RT"></div>
			<div class="center_shapes_LB_RB"></div>
			<div class="center_shapes_MLR"></div>
		</div>
		<div class="table_container">
            <canvas id="table" class="pingpongTable"></canvas>
		</div>
    </div>
</div>
`


let viewportWidth = window.innerWidth;
let remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
let viewportHeight = window.innerHeight - (14 * remInPixels);

let cGameWidth = 0.9 * viewportWidth;
let cGameHeight = viewportHeight;

let gameShapesWidth = 0.9 * cGameWidth;
let gameShapesHeight = gameShapesWidth / 2.1;

let tableContainerWidth = 0.84 * gameShapesWidth;
let tableContainerHeight = 0.83 * gameShapesHeight;

let CANVAS_WIDTH = tableContainerWidth;
let CANVAS_HEIGHT = tableContainerHeight;

export class GamePage extends HTMLElement{

    constructor()
    {
        super();
        this.appendChild(game_page.content.cloneNode(true))
        this.setCoordonates(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 5, 2);
        this.setCoordonatesP1(0, CANVAS_HEIGHT / 2);
        this.setCoordonatesP2(CANVAS_WIDTH - 10, CANVAS_HEIGHT / 2);
        this.setKeys(false, false, false, false);

    }
    setCoordonatesP1(x, y){
        this.concoordonateP1 = {
            x: x,
            y: y,
            color: 'white',
            width: 10,
            height: 100,
        };
    }
    getCoordonatesP1(){
        return this.concoordonateP1;
    }
    setCoordonatesP2(x, y){
        this.concoordonateP2 = {
            x: x,
            y: y,
            color: '#00b9be',
            width: 10,
            height: 100,
        };
    }
    getCoordonatesP2(){return this.concoordonateP2;}

    setCoordonates(x, y, dx, dy){
        this.concoordonate = {
            x: x,
            y: y,
            dx: dx,
            dy: dy,
        };
    }
    getCoordonates(){return this.concoordonate;}




    setKeys(keyS, keyW, keyArrowUp, keyArrowDown){
        this.conKeys = {
            keyS: keyS,
            keyW: keyW,
            keyArrowUp: keyArrowUp,
            keyArrowDown: keyArrowDown,
        }
    }
    getKeys(){return this.conKeys;}

    RanderRackit(ctx, coordonate){
        const {x, y, color, width, height} = coordonate;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, height);
    }
    renderBall(ctx){
        const coordonate = this.getCoordonates();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(coordonate.x, coordonate.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    gameLoop(ctx){
        const player1 = this.getCoordonatesP1();
        const player2 = this.getCoordonatesP2();
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        requestAnimationFrame(() => this.gameLoop(ctx));
        this.movePlayer(this.getKeys(), player1, player2);
        this.moveBall(player1, player2);
        this.renderBall(ctx);
        this.RanderRackit(ctx, this.getCoordonatesP1());
        this.RanderRackit(ctx, this.getCoordonatesP2());
    }
    connectedCallback(){
        addEventListener('keydown', (event) => {
            this.setMove(event, this.getKeys());
        })
        addEventListener('keyup', (event) => {
            this.resetMove(event, this.getKeys());
        })
        const container = document.querySelector('.table_container');
        const canvas = document.querySelector('#table');
        const ctx = canvas.getContext('2d');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        this.gameLoop(ctx);
    }

    moveBall(player1, player2){
        let {x, y, dx, dy} = this.getCoordonates();
        if(y + 10 + dy >= CANVAS_HEIGHT || y - 10 + dy <= 0)
            dy = -dy;
        if(x + 10 + dx >= CANVAS_WIDTH || x - 10 + dx <= 0)
        {
            x = CANVAS_WIDTH / 2;
            y = CANVAS_HEIGHT / 2;
            dx = 5;
            dy = 2;
        }
        if(x + 10 + dx >= player2.x && y >= player2.y && y <= player2.y + player2.height)
            dx = -dx;
        if(x - 10 + dx <= player1.x + player1.width && y >= player1.y && y <= player1.y + player1.height)
            dx = -dx;
        x += dx;
        y += dy;
        // dx = Math.abs(dx) + 0.1;
        // dy = Math.abs(dy) + 0.1;
        this.setCoordonates(x, y, dx, dy);
    }

    setMove = (event, keys) =>{
        let {keyW, keyS, keyArrowUp, keyArrowDown} = keys;

        if(event.key === 'w' || event.key === 'W') { keyW = true };
        if(event.key === 's' || event.key === 'S') { keyS = true };
        if(event.key === 'ArrowUp') { keyArrowUp = true };
        if(event.key === 'ArrowDown') { keyArrowDown = true };

        this.setKeys(keyS, keyW, keyArrowUp, keyArrowDown);
    }
    resetMove = (event, keys) =>{
        let {keyW, keyS, keyArrowUp, keyArrowDown} = keys;

        if(event.key === 'w' || event.key === 'W') { keyW = false };
        if(event.key === 's' || event.key === 'S') { keyS = false };
        if(event.key === 'ArrowUp') { keyArrowUp = false };
        if(event.key === 'ArrowDown') { keyArrowDown = false };

        this.setKeys(keyS, keyW, keyArrowUp, keyArrowDown);
    }

    movePlayer(keys, player1, player2){
        const {keyW, keyS, keyArrowUp, keyArrowDown} = keys;
        if(keyW === true) { this.moveUp(player1) };
        if(keyS === true) { this.moveDown(player1) };
        if(keyArrowUp === true) { this.moveUp(player2) };
        if(keyArrowDown === true) { this.moveDown(player2) };
        this.setCoordonatesP1(player1.x, player1.y);
        this.setCoordonatesP2(player2.x, player2.y);
    }
    moveDown(player){
        if(player.y + player.height + 10 <= CANVAS_HEIGHT)
            player.y += 10;
        else
            player.y = CANVAS_HEIGHT - player.height;
    }
    moveUp(player){
        if(player.y >= 0)
            player.y -= 10;
    }
}

customElements.define('game-page', GamePage)