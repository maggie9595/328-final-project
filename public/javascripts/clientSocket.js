var socket = io.connect();

// Display number of players
socket.on('players', function (data) {
	$("#numPlayers").text(data.number);
});