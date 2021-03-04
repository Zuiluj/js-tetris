const tetrisCanvas = document.getElementById('tetris_screen')
// fix blur images
tetrisCanvas.width = 600;
tetrisCanvas.height = 1200;
tetrisCanvas.style.width = "300px";
tetrisCanvas.style.height = "600px";

const tetrisContext = tetrisCanvas.getContext('2d');
tetrisContext.scale(2, 2); // Scale the displayed grid two times to get good display

// Constants 
const holdPieceCanvas = document.getElementById('hold_piece');
const holdPieceContext = holdPieceCanvas.getContext('2d');
holdPieceCanvas.width = holdPieceCanvas.height = 150;
holdPieceCanvas.style.width = holdPieceCanvas.style.height = '75px';

const nextPieceCanvas = document.getElementById('next_piece');
const nextPieceContext = nextPieceCanvas.getContext('2d');
nextPieceCanvas.width = nextPieceCanvas.height = 150;
nextPieceCanvas.style.width = nextPieceCanvas.style.height = '75px';


const SQUARE_SIZE = 20;
const CANVAS_WIDTH = (tetrisCanvas.width / 2) / SQUARE_SIZE;
const CANVAS_HEIGHT = (tetrisCanvas.height / 2) / SQUARE_SIZE;
const PIECES_NAME = ['z', 's', 'o', 'j', 'l', 'i', 't'];
const VACANT = '#111d5e';

// Game variables
let board = [];
let gameOver = false;

// Drop piece variables
let dropStart = Date.now();
let fallSpeed = 1000;
let currentSpeed = fallSpeed;

// Hold piece
let nextPiece = null;
let holdPiece = [];
let didChanged = false;

// Points
let currentPointsElement = document.getElementById('points');
let lastDifficultyCheckpoint = 3000;
let difficultyChange = 1;


function initBoard() {
    /*
        @desc - initialization of array of the game where the
            piece will be 'locked' in place
    */
    tetrisContext.clearRect(0, 0, tetrisCanvas.width, tetrisCanvas.height);
    for (let row = 0; row < CANVAS_HEIGHT; row++) {
        board[row] = []
        for (let col = 0; col < CANVAS_WIDTH; col++) {
            board[row][col] = VACANT;
        }
    }

    // Reinitialize the hold piece
    holdPiece = [];
    holdPieceContext.clearRect(
        0, 0, 
        (holdPieceCanvas.width), 
        (holdPieceCanvas.height));

    // Reinitalize points
    currentPointsElement.innerHTML = 0;

}

function checkRow() {
    /*
        @desc - check row if full, if full, clear the specific row
                in the virtual board, redraw it in canvas and add 
                the points
    */

    // Check if row is full
    let multiplier = 0;
    let newPoints = 0;
    board.forEach((valueSet, index) => {
        if (!valueSet.includes(VACANT)) {
            multiplier += 1;
            newPoints += 100;
            board.splice(index, 1);
            board.unshift(Array(CANVAS_WIDTH).fill(VACANT));
            
            // Redraw the new board
            board.forEach((colSet, col) => {
                colSet.forEach((color, row) => {
                    tetrisContext.fillStyle = color;
                    tetrisContext.fillRect(
                        row * SQUARE_SIZE,
                        col * SQUARE_SIZE,
                        SQUARE_SIZE,
                        SQUARE_SIZE
                    )
                })
            })
        }
    });

    currentPointsElement.innerHTML = parseInt(currentPointsElement.innerHTML) + (newPoints * multiplier);
    currentPointsElement = document.getElementById('points');

    if (currentPointsElement.innerHTML >= lastDifficultyCheckpoint * difficultyChange) {
        fallSpeed -= 75;
        difficultyChange += 1;
    }
}


function switchPiece(localPiece=undefined) {
    /*
        @desc - hold current piece and exchange if there is present
    */
    if (holdPiece[0]) {
        // Reset holdPiece coords
        holdPiece[0].offset.x = 6;
        holdPiece[0].offset.y = -1;
        holdPiece.push(localPiece);
        piece.clearMatrix();
        piece = holdPiece.shift();
    } else {
        holdPiece.push(localPiece);
        piece.clearMatrix();
        piece = nextPiece;
        nextPiece = new Tetromino(PIECES_NAME[Math.floor(Math.random() * PIECES_NAME.length)]);
    }

    holdPieceContext.clearRect(
        0, 0, 
        (holdPieceCanvas.width), 
        (holdPieceCanvas.height));

    holdPiece[0].currentPiece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                holdPieceContext.fillStyle = holdPiece[0].color;
                holdPieceContext.fillRect(
                    (x * 40),
                    (y * 40),
                    40,
                    40)
            };
        });
    });


    didChanged = true;
}

class Tetromino {
    /*
        @desc - Tetromino class that represents a tetromino piece.
    */
    TETROMINOES_MATRICES = {
        z: [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0]
            ]
    
        ],
        s: [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ],
        j: [
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ]
        ],
        t: [
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ]
        ],
        l: [
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]
        ],
        i: [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        o: [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ]
    }

    TETROMINOES_COLOR = {
        z: '#f9d5bb',
        s: '#ffb091',
        o: '#fa9a87',
        j: '#f57c5d',
        l: '#f66767',
        i: '#d35656',
        t: '#d4322d'
    }

    // Notifiers
    locked = false;
    isOnHold = false;
    // The current place of the piece
    offset = {
        x: 6,
        y: -1
    }

    constructor(piece, place=0) {
        /*
            @desc - Create a tetromino instance using the piece name and its initial state
            @param string - piece name => name of the piece in TETRIMINOES_MATRICES
            @param int - piece rotation => default place is 0 for initial state
        */
        this.piece = piece;
        this.place = place;
        this.currentPiece = this.TETROMINOES_MATRICES[this.piece][this.place];
        this.color = this.TETROMINOES_COLOR[this.piece];
    }

    // PIECE DRAW
    drawMatrix() {
        /*
            @desc - draw the current tetrimino matrix in place using $offset
        */
        this.currentPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    tetrisContext.fillStyle = this.color;
                    tetrisContext.fillRect(
                        (x * SQUARE_SIZE) + this.offset.x * SQUARE_SIZE,
                        (y * SQUARE_SIZE) + this.offset.y * SQUARE_SIZE,
                        SQUARE_SIZE, 
                        SQUARE_SIZE);
                };
            });
        });
    };
    
    clearMatrix() {
        /*
            @desc - clear the current tetrimino matrix in place using $offset
        */
        this.currentPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    tetrisContext.clearRect(
                        (x * SQUARE_SIZE) + this.offset.x * SQUARE_SIZE,
                        (y * SQUARE_SIZE) + this.offset.y * SQUARE_SIZE,
                        SQUARE_SIZE, 
                        SQUARE_SIZE);
                };
            });
        });
    }

    // PIECE MOVEMENTS
    moveLeft() {
        /*
            @desc - Move the piece one square to left if no collision is detected
        */
        if (!this.collision(-1, 0)) {
            this.clearMatrix();
            this.offset.x -= 1
            this.drawMatrix();
        } 
    }

    moveRight() {
        /*
            @desc - Move the piece one square to right if no collision is detected
        */
        if (!this.collision(1, 0)) {
            this.clearMatrix();
            this.offset.x += 1;
            this.drawMatrix();
        }
    }

    invertMatrixClockwise() {
        /*
            @desc - invert matrix clockwise 
        */

        if (!this.piece.locked) {
            let kick = 0;
            let kickBottom = 0;
            this.clearMatrix();
            if (this.place >= this.TETROMINOES_MATRICES[this.piece].length - 1) {
                this.place = 0;
            } else {
                this.place += 1;
            }
            this.currentPiece = this.TETROMINOES_MATRICES[this.piece][this.place];
            // Right and Left Wall collision
            if (this.collision(0, 0)) {
                if (this.offset.x <= 0) {
                    kick = 1;
                    // Condition for the 'i' piece
                    if (this.collision(kick, 0)) {
                        kick += 1;
                    }
                } else {
                    kick = -1;
                    // Condition for the 'i' piece
                    if (this.collision(kick, 0)) {
                        kick -= 1;
                    }
                }
            }

            if (this.collision(0, 1)) {
                kickBottom += 1;
                
            }
            
            this.offset.x += kick;
            this.offset.y -= kickBottom;
            

            this.drawMatrix();
        } 
    }
        

    invertMatrixCounter() {
        /*
            @desc - invert matrix counter clockwise 
        */
        if (!this.piece.locked) {
            let kick = 0;
            let kickBottom = 0;
            this.clearMatrix();
            if (this.place >= this.TETROMINOES_MATRICES[this.piece].length - 1) {
                this.place = 0;
            } else {
                this.place += 1;
            }
            this.currentPiece = this.TETROMINOES_MATRICES[this.piece][this.place];
            // Right and Left Wall collision
            if (this.collision(0, 0)) {
                if (this.offset.x <= 0) {
                    kick = 1;
                    // Condition for the 'i' piece
                    if (this.collision(kick, 0)) {
                        kick += 1;
                    }
                } else {
                    kick = -1;
                    // Condition for the 'i' piece
                    if (this.collision(kick, 0)) {
                        kick -= 1;
                    }
                }
            }

            if (this.collision(0, 1)) {
                kickBottom += 1;
                
            }
            
            this.offset.x += kick;
            this.offset.y -= kickBottom;

            this.drawMatrix();
        } 
    }

    fallDown() {
        /*
            @desc - makes the piece fall down using delta (time intervals)
        */
        this.drawMatrix();
        if (this.collision(0, 1)) {
            // lock the piece in place when collision returned true
            // lock the piece in the abstract board
            this.locked = true;
            for (let i = 0; i < this.currentPiece.length; i++) {
                for (let j = 0; j < this.currentPiece[i].length; j++) {
                    if (!this.currentPiece[i][j]) {
                        continue;
                    }

                    try {
                        board[this.offset.y + i][this.offset.x + j] = this.color;
                    } catch (exc) {
                        // TODO: fix this, make it say game over when a
                        // piece was locked at the outside top
                        gameOver = true;
                    }
                }
            }
        } else {
            let now = Date.now();
            let delta = now - dropStart;
            if (delta > currentSpeed) {
                this.clearMatrix();
                this.offset.y += 1;
                this.drawMatrix();
                dropStart = Date.now();
            }
        }

    }

    // PIECE COLLISION
    collision(x, y) {
        /*
            @desc boolean - see if the new planned coordinates collides with something
            @param int - x => planned next x offset
            @param int - y => planned next y offset
        */
        for (let i = 0; i < this.currentPiece.length; i++) {
            for (let j = 0; j < this.currentPiece[i].length; j++) {
                if (!this.currentPiece[i][j]) {
                    continue;
                }
                
                let newX = this.offset.x + j + x;
                let newY = this.offset.y + i + y;

                if (newX < 0 || newX >= CANVAS_WIDTH || newY >= CANVAS_HEIGHT 
                    || board[newY][newX] != VACANT) {
                    
                    return true;
                }
                
            }
        }
    }



}


// START ANIMATION

window.addEventListener('load', start);

function start() {
    initBoard();
    gameOverDialog.style.display = 'none';
    window.requestAnimationFrame(loop);
}

function loop() { 
    if (typeof(piece) == 'undefined') {
        // Create first tetromino
        nextPiece = new Tetromino(PIECES_NAME[Math.floor(Math.random() * PIECES_NAME.length)]);
        piece = new Tetromino(PIECES_NAME[Math.floor(Math.random() * PIECES_NAME.length)]);
        
    }       


    if (!gameOver) {
        if (piece.locked) {

            checkRow();
            piece = nextPiece;

            nextPiece = new Tetromino(PIECES_NAME[Math.floor(Math.random() * PIECES_NAME.length)]);
            didChanged = false;
        } else {
            piece.fallDown();
        }

        
        // Show next piece
        nextPieceContext.clearRect(
            0, 0, 
            (nextPieceCanvas.width), 
            (nextPieceCanvas.height));
    
        nextPiece.currentPiece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    nextPieceContext.fillStyle = nextPiece.color;
                    nextPieceContext.fillRect(
                        (x * 40),
                        (y * 40),
                        40,
                        40)
                };
            });
        });

        window.requestAnimationFrame(loop);
    } else {
        // TODO: Implement better game over
        window.requestAnimationFrame(over);
    }
}

function over() {
    gameOverDialog.style.display = 'flex';
}


// Game controls
window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        // arrow right
        case 39:
            document.getElementById('moveRight_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            piece.moveRight();
            break;
        // arrow left
        case 37:
            document.getElementById('moveLeft_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            piece.moveLeft();
            break;
        // arrow up
        case 38:
            document.getElementById('rotateC_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            piece.invertMatrixClockwise();
            break;
        // arrow down
        case 40:
            document.getElementById('fall_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            currentSpeed = 10;
            break;
        // character 'C'
        case 67:
            document.getElementById('rotateCC_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            piece.invertMatrixCounter();
            break;
        // character 'V'
        case 86:
            document.getElementById('hold_key').style.cssText = 'background: white; color: black';
            event.preventDefault();
            if (!didChanged) {
                switchPiece(piece);
            }
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        // arrow right
        case 39:
            document.getElementById('moveRight_key').style.cssText = 'background: transparent; color: white';
            break;
        // arrow left
        case 37:
            document.getElementById('moveLeft_key').style.cssText = 'background: transparent; color: white';
            break;
        // arrow up
        case 38:
            document.getElementById('rotateC_key').style.cssText = 'background: transparent; color: white';
            break;
        // arrow down
        case 40:
            document.getElementById('fall_key').style.cssText = 'background: transparent; color: white';
            currentSpeed = fallSpeed;
            break;
        // character 'C'
        case 67:
            document.getElementById('rotateCC_key').style.cssText = 'background: transparent; color: white';
            break;
        // character 'V'
        case 86:
            document.getElementById('hold_key').style.cssText = 'background: transparent; color: white';
            break;
    }
})

//----- WEBPAGE ELEMENTS

let gameOverDialog = document.getElementById('game_over_box');
let dialogBtn = document.querySelector('.game_over_btn');

dialogBtn.addEventListener('click', (event) => {
    gameOver = false;
    window.requestAnimationFrame(start);
})
