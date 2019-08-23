// NOTE: this example uses the chess.js library:
// https://github.com/jhlywa/chess.js

var board = null
console.log(fen)
const game = new Chess(fen)
console.log(game.validate_fen(fen))
var counter = 0;

function onDragStart (source, piece, position, orientation) {
  console.log(game.fen())
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for White
  if (piece.search(/^b/) !== -1) return false
}

function makeRandomMove () {
  var possibleMoves = game.moves()

  // game over
  if (possibleMoves.length === 0) return

  var randomIdx = Math.floor(Math.random() * possibleMoves.length)
  game.move(possibleMoves[randomIdx])
  board.position(game.fen())
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  counter++

  
  if(counter == moves){
    if(game.game_over()){
      alert("Solved!")
    }else{
      alert("Wrong! Try again")
    }
  }
  
  // make random legal move for black
  window.setTimeout(makeRandomMove, 250)
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

var config = {
  draggable: true,
  position: fen,
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

board = Chessboard('puzzlechessboard', config)
