const mongoose = require("mongoose")

var puzzleSchema = mongoose.Schema({
    name: String,
    fen: {
        type: String,
        required: true
    },
    difficulty: String,
    moves: Number
})

var Puzzle = mongoose.model("puzzle", puzzleSchema)

exports.create = function(puzzle){
    //creates a puzzle
    return new Promise(function (resolve, reject) {
        var p = new Puzzle(puzzle)

        p.save().then((newPuzzle) => {
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
    return new Promise(function (resolve, reject) {
        Puzzle.deleteOne({
            _id:id
        },function(err, doc){
            if(err) console.log(err)
            else resolve(doc)
        })
    })
}

exports.get = function(id){
    //gets by id
    return new Promise(function (resolve, reject) {
        Puzzle.findOne({ _id: id }).then((puzzle) => {
            resolve(puzzle)
        }, (err) => {
            reject(err)
        })
    })
}

exports.getAll = function(){
    return new Promise(function (resolve, reject){
        Puzzle.find({
            //all
        }).then((puzzles)=>{
            resolve(puzzles)
        }, (err)=>{
            reject(err)
        })
    })
}
exports.getByDifficulty = function(difficulty){
    //get all puzzles by difficulty
}