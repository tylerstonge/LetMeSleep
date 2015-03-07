requirejs.config({
	baseUrl: 'src/',
	paths: {
		lib: "../lib/"
	}
});
require(["game"], function(game) {
	game.init();
	game.animate();
});
