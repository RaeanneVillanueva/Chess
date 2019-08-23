const mongoose = require("mongoose")

var puzzleSchema = mongoose.Schema({
    name: String,
    fen: {
        type: String,
        required: true
    },
    difficulty: String
})

var Puzzle = mongoose.model("puzzle", puzzleSchema)

exports.create = function(puzzle){
    //creates a puzzle
    return new Promise(function (resolve, reject) {
        var p = new Puzzle(puzzle)

        u.save().then((newPuzzle) => {
            resolve(newPuzzle)
        }, (err) => {
            reject(err)
        })
    })
}

exports.edit = function(puzzle){
    //edits a puzzle
}

exports.delete = function(id){
    //deletes a puzzle (not sure if needed)
}

exports.get = function(id){
    //gets by id
}

exports.getByDifficulty = function(difficulty){
    //get all puzzles by difficulty
}