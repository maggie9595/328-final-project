$(document).ready(function() {
	// Hide the game section when the index page first loads
	$("#game-section").hide();

	// Use local storage to autofill the username field
	$("#username").val(localStorage.username);

	var socket = io.connect("http://nodejs-maggie9595.rhcloud.com:8000");

	// Display number of players
	socket.on('players', function(data) {
		$("#numPlayers").text(data.number);
	});

	// Display current score
	socket.on('currentScore', function(data) {
		$("#current-score").text(data.score);
	});

	// Display welcome message with username
	socket.on('welcomePlayer', function(data) {
		$("#welcome-username").html("<span style='color:" + data.color + ";'>" + data.username + "</span>");
	});

	// Update story with new word
	socket.on('updateStory', function(data) {
		$("#story").append(" " + "<span style='color:" + data.color + ";'>" + data.newWord + "</span>");
		Materialize.toast(data.username + " has submitted a new word to the story!", 3000);
	});

	// Save score to mongo
	socket.on('saveScore', function(data) {
		$.ajax({
			url: 'players',
			data: 'username=' + data.username + '&score=' + data.score,
			type: 'PUT',
		});
	});

	// Get high scores from mongo
	socket.on('getHighScores', function() {
		$.ajax({
			url: 'players',
			type: 'GET',
			success: function(result) {
	            $("#scoreboard").html(result);
			}
		});
	})

	// Submit word button
	$("#submit-word").click(function() {
		var word = $("#word-input").val();
		$("#word-input").val("");
		socket.emit('newWord', {word: word});
	});

	// Start game button
	$("#play-now").click(function() {
		var username = $('#username').val();
		// Save username to local storage
		localStorage.setItem('username', username);

		socket.emit('startGame', {username: username});
		// Hide welcome section and display game section
		$("#welcome-section").hide();
		$("#game-section").show();
	});

	// Exit game button
	$("#exit").click(function() {
		socket.emit('endGame');
		// Show welcome section again and hide game section
		$("#welcome-section").show();
		$("#game-section").hide();
	});
});