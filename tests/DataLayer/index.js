requirejs([
	'../../dist/index',
], ({ GLCompute }) => {

	const canvas = document.getElementById('glcanvas');
	const glcompute = new GLCompute(null, canvas, {antialias: true}, (message) => {
		// Show error alert.
		window.alert(
			`This device/browser does not support some GPU functions required by this app.
			Please try again on desktop running Chrome/Firefox.
			ERROR: ${message}`
		)
	});

	console.log('here');

});
