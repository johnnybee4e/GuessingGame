function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(array) {
    let m = array.length, t, i;

    while(m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array [i];
        array[i] = t;
    }
    
    return array;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

function newGame() {
    return new Game();
}

Game.prototype.difference = function(){
    if(this.playersGuess < this.winningNumber) {
        return this.winningNumber - this.playersGuess;
    }
    return this.playersGuess - this.winningNumber;
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(number) {
    if(number < 1 || number > 100 || typeof number !== 'number'){
        $('#subtitle').text('That is an invalid guess');
        throw 'That is an invalid guess.';
    }
    this.playersGuess = number;
    return this.checkGuess();
}

Game.prototype.checkGuess = function() {
    if(this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop('disabled',true);
        $("#subtitle").text("Good Job! Care to play again?");
        return "You Win!";
    } else if(this.pastGuesses.includes(this.playersGuess)){
        $("#subtitle").text("Try another number.");
        return "You have already guessed that number.";
    } else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child(' + this.pastGuesses.length +')').text(this.playersGuess);
        
        if(this.pastGuesses.length === 5){
            $('#hint, #submit').prop('disabled',true); 
            $("#subtitle").text("Nice try! Dare to play again?");
            return "You Lose.";
        }
    }

    if(this.isLower()) {
        $('#subtitle').text('Guess Higher!');
    } else {
        $('#subtitle').text('Guess Lower!');
    }

    if(this.difference() < 10) {
        return "You're burning up!";
    } else if(this.difference() < 25) {
        return "You're lukewarm.";
    } else if(this.difference() < 50) {
        return "You're a bit chilly.";
     } else { 
        return "You're ice cold!";}
}

Game.prototype.provideHint = function() {
    let hints = [this.winningNumber];
    while(hints.length < 5) {
        hints.push(generateWinningNumber());
    }
    return shuffle(hints).join(', ')
}



// the jQuery to connect the js to the html and events that happen on the webpage.

function makeAGuess(game) {
    let guess = $('#player-input').val();
    $('#player-input').val('');
    
    let output = game.playersGuessSubmission(parseInt(guess));
    $('#title').text(output);
}

$(document).ready(function() {
    let game = new Game();
    $('#submit').click(function(e) {
        makeAGuess(game);
    })

    $('#player-input').keypress(function(e) {
        if(e.which === 13){
            makeAGuess(game);
        }
    })
    $('#reset').click(function(e) {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100');
        $('.guess-entry').text('-');
        $('#hint, #submit').prop('disabled', false)
    })

    $('#hint').click(function(e) {
        let hints = game.provideHint();
        $('#title').text('Need some help? Here: '+hints+'');
    })
})