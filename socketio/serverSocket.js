exports.init = function(io) {
	// Keep track of the number of players 
	var currentPlayers = 0;
	var currentWord;

  	// When a new connection is initiated
	io.sockets.on('connection', function(socket) {
		var username;
		var score = 0;
		var color = getRandomColor();

		++currentPlayers;

		// Get high scores
		socket.emit('getHighScores');

		// Emit the number of current players
		socket.emit('players', {number: currentPlayers});

		// Emit the current score
		socket.emit('currentScore', {score: score});
		
		// Start the game and save the username of the current player
		socket.on('startGame', function(data) {
			username = data.username;
			socket.emit('welcomePlayer', {username: username, color: color});
		});

		// A new word has been submitted
		socket.on('newWord', function(data) {
			++score;
			socket.emit('currentScore', {score: score});
			io.emit('updateStory', {newWord: data.word, username: username, color: color});
		});

		// End the game and save the score for the current player
		socket.on('endGame', function() {
			socket.emit('saveScore', {username: username, score: score});
			// Refresh high scores
			socket.emit('getHighScores');
		});

		// Decrement the number of players on disconnection
		socket.on('disconnect', function() {
			--currentPlayers;
			socket.broadcast.emit('players', {number: currentPlayers});
		});
	});
}

// Get a random color code
// Source: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}