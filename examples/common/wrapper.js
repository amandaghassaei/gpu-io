{
	const {
		GLSL1,
		GLSL3,
		WEBGL1,
		WEBGL2,
		isWebgL2Supported,
	} = WebGLCompute;

	// Init info dialog.
	MicroModal.init();

	// Init a simple gui.
	const gui = new dat.GUI();

	const webGLSettings = {
		webGL2: true,
		useGLSL3: true,
	};

	// Global variables to get from example app.
	let loop, dispose, composer;

	function reloadExampleWithNewParams() {
		// TODO: remove everything from gui other than settings folder.
		if (dispose) dispose();
		({ loop, composer, dispose } = main({
			gui,
			contextID: webGLSettings.webGL2 ? WEBGL2 : WEBGL1,
			glslVersion: webGLSettings.useGLSL3 ? GLSL3 : GLSL1,
		}));
	}

	// Add some settings to gui.
	const WEBGL_TITLE = 'WebGL Settings';
	const settings = gui.addFolder(WEBGL_TITLE);
	settings.add(webGLSettings, 'webGL2').name('Use WebGL 2').onChange(reloadExampleWithNewParams);
	settings.add(webGLSettings, 'useGLSL3').name('Use GLSL 300').onChange(reloadExampleWithNewParams);
	// Add info modal.
	const modalOptions = { showModal: () => {
		MicroModal.show('modal-1');
	}}
	gui.add(modalOptions, 'showModal').name('About');

	// Load example app.
	reloadExampleWithNewParams();

	function outerLoop() {
		// Update fps counter.
		const { fps, numTicks } = composer.tick();
		if (numTicks % 10 === 0) {
			settings.name = `${WEBGL_TITLE} (${fps.toFixed(1)} FPS)`
		}
		window.requestAnimationFrame(outerLoop);
		// Run example loop.
		loop();
	}
	// Start loop.
	outerLoop();
}