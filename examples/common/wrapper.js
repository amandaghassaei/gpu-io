'use strict';
{
	const {
		GLSL1,
		GLSL3,
		WEBGL1,
		WEBGL2,
		isWebGL2Supported,
	} = GPUIO;

	// Init info dialog.
	MicroModal.init();

	// Init a simple gui.
	const gui = new dat.GUI();

	const webGLSettings = {
		webGL2: isWebGL2Supported(),
		useGLSL3: isWebGL2Supported(),
	};

	// Global variables to get from example app.
	let loop, dispose, composer;
	// Other global ui variables.
	let title;
	let useGLSL3Toggle;

	function reloadExampleWithNewParams() {
		if (useGLSL3Toggle) {
			settings.remove(useGLSL3Toggle);
			useGLSL3Toggle = undefined;
		}
		if (dispose) dispose();
		({ loop, composer, dispose } = main({
			gui,
			contextID: webGLSettings.webGL2 ? WEBGL2 : WEBGL1,
			glslVersion: webGLSettings.useGLSL3 ? GLSL3 : GLSL1,
		}));
		if (webGLSettings.webGL2) {
			useGLSL3Toggle = settings.add(webGLSettings, 'useGLSL3').name('Use GLSL 300').onChange(reloadExampleWithNewParams);
		}
		title = `WebGL ${webGLSettings.webGL2 ? '2' : '1'}`;
		settings.name = title;
	}

	// Add some settings to gui.
	const settings = gui.addFolder(title);
	if (isWebGL2Supported()) settings.add(webGLSettings, 'webGL2').name('Use WebGL 2').onChange(reloadExampleWithNewParams);
	
	// Add info modal.
	const modalOptions = { showModal: () => {
		MicroModal.show('modal-1');
	}}
	gui.add(modalOptions, 'showModal').name('About');

	// Load example app.
	reloadExampleWithNewParams();

	// Disable gestures.
	document.addEventListener('gesturestart', disableZoom);
	document.addEventListener('gesturechange', disableZoom); 
	document.addEventListener('gestureend', disableZoom);
	function disableZoom(e) {
		e.preventDefault();
		const scale = 'scale(1)';
		// @ts-ignore
		document.body.style.webkitTransform =  scale;    // Chrome, Opera, Safari
		// @ts-ignore
		document.body.style.msTransform =   scale;       // IE 9
		document.body.style.transform = scale;
	}

	function outerLoop() {
		// Update fps counter.
		const { fps, numTicks } = composer.tick();
		if (numTicks % 10 === 0) {
			settings.name = `${title} (${fps.toFixed(1)} FPS)`
		}
		window.requestAnimationFrame(outerLoop);
		// Run example loop.
		loop();
	}
	// Start loop.
	outerLoop();
}