/**
 * This code was modified and based on the example code in the Github repository:
 * https://github.com/op12no2/lozza-ui
 * 
 * Which is licensed under the GNU General Public License v3.0.
 * Changes:
 * - adding grey square functionality in methods removeGreySquares() and greySquare
 * - commented out pieces of the original code
 */

var board = null
var game = new Chess()
var engine = null
var args = lozGetURLArgs()
var startFrom = "startpos"
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function lozUpdateBestMove() {
    // var possibleMoves = game.moves()

    // game over
    // if (possibleMoves.length === 0) return

    // var randomIdx = Math.floor(Math.random() * possibleMoves.length)
    // game.move(possibleMoves[randomIdx])
    // board.position(game.fen())

    var move = {};

    move.from = lozData.bmFr;
    move.to   = lozData.bmTo;
  
    if (lozData.bmPr) {
      move.promotion = lozData.bmPr;
    }
  
    game.move(move);
    board.position(game.fen());
    // $('#moves').html(game.pgn({newline_char: '<br>'}));
  
    if (!game.game_over())
      drag = true;
    else
      showEnd();
}

function lozUpdatePV () {

  if (args.h != "y" && lozData.units == 'cp')
    $(lozData.idInfo).prepend('depth ' + lozData.depth + ' (' + lozData.score + ') ' + lozData.pv + '<br>');
  else if (lozData.score > 0 && lozData.units != 'cp')
    $(lozData.idInfo).prepend('depth ' + lozData.depth + ' (<b>mate in ' + lozData.score + '</b>) ' + lozData.pv + '<br>');
  else if (lozData.units != 'cp')
    $(lozData.idInfo).prepend('depth ' + lozData.depth + ' (<b>checkmate</b>) ' + lozData.pv + '<br>');

}

function removeGreySquares() {
    $('#botchessboard .square-55d63').css('background', '')
}

function greySquare(square) {
    var $square = $('#botchessboard .square-' + square)

    var background = whiteSquareGrey
    if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    $square.css('background', background)
}

function onDragStart(source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
    }
}

function onDrop(source, target) {
    removeGreySquares()

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    console.log(board.position('fen'))
    console.log(game.history())
    // window.setTimeout(lozUpdateBestMove, 250)

    if (!game.game_over()) {
      // $(lozData.idInfo).html('');
      var movetime = getMoveTime() * 1000;
      engine.postMessage('position ' + startFrom + ' moves ' + strMoves());
      if (args.m)
        engine.postMessage(args.m);
      else
        engine.postMessage('go movetime ' + movetime);
    }
    else
      setTimeout(showEnd, 500);
}



function onMouseoverSquare(square, piece) {
    // get list of possible moves for this square
  if(game.turn() == 'w'){
      var moves = game.moves({
          square: square,
          verbose: true
      })

      // exit if there are no moves available for this square
      if (moves.length === 0) return

      // highlight the square they moused over
      greySquare(square)

      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
          greySquare(moves[i].to)
      }
  }
}

function strMoves() {

  var movesStr = '';
  var moves    = game.history({verbose: true});

  for (var i=0; i < moves.length; i++) {
    if (i)
      movesStr += ' ';
    var move = moves[i];
    movesStr += move.from + move.to;
    if (move.promotion)
      movesStr += move.promotion;
  }

  return movesStr;
}

function getMoveTime () {

  var t = 1;
  if (t <= 0 || !t) {
    t = 1;
    $('#permove').val(1);
  }
  return t;
}

function onMouseoutSquare(square, piece) {
    removeGreySquares()
}

function onSnapEnd() {
    board.position(game.fen())
}

function showEnd(){
  alert("Game has ended!")
}


$(function() {

  //{{{  init DOM
  
  // if (args.t) {
  //   $('#permove').val(args.t);
  //   getMoveTime();
  // }
  
  // $('input').tooltip({delay: {"show": 1000, "hide": 100}});
  
  // //}}}
  // //{{{  handlers
  
  // $('#playw').click(function() {
  
  //   window.location = lozMakeURL ({
  //     t : getMoveTime()
  //   });
  
  //   return true;
  // });
  
  // $('#playb').click(function() {
  
  //   window.location = lozMakeURL ({
  //     t : getMoveTime(),
  //     c : 'b'
  //   });
  
  //   return true;
  // });
  
  // $('#analyse').click(function() {
  
  //   window.open("fen.htm?fen=" + game.fen(),"_blank");
  
  //   return false;
  // });
  
  
  //}}}

  engine           = new Worker(lozData.source);
  engine.onmessage = lozStandardRx;


  // if (args.fen) {
  //   startFrom   = 'fen ' + args.fen;
  //   startFromUI = args.fen;
  //   chess = new Chess(args.fen);
  //   $("#playw").hide();
  //   $("#playb").hide();
  // }
  // else
  game = new Chess();

    
  var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
  }

  board = Chessboard('botchessboard', config)

  engine.postMessage('uci')
  engine.postMessage('ucinewgame')
  engine.postMessage('debug off')

  if (!args.fen && args.c == 'b' || args.fen && args.fen.search(' w') !== -1 && args.c == 'b') {
    board.orientation('black');
    engine.postMessage('position ' + startFrom);
    engine.postMessage('go movetime ' + getMoveTime() * 1000);
    $(lozData.idInfo).prepend('You are black' + '<br>');
  }
  else if (!args.fen && args.c != 'b' || args.fen && args.fen.search(' w') !== -1 && args.c != 'b') {
    board.orientation('white');
    $(lozData.idInfo).prepend('Your move with white pieces' + '<br>');
  }
  else if (args.fen && args.fen.search(' b') !== -1 && args.c == 'b') {
    board.orientation('black');
    $(lozData.idInfo).prepend('Your move with black pieces' + '<br>');
  }
  else if (args.fen && args.fen.search(' b') !== -1 && args.c != 'b') {
    board.orientation('white');
    engine.postMessage('position ' + startFrom);
    engine.postMessage('go movetime ' + getMoveTime() * 1000);
    $(lozData.idInfo).prepend('You are white' + '<br>');
  }
  else {
    $(lozData.idInfo).prepend('INCONSISTENT ARGS' + '<br>');
  }

  //console.log(args);

});