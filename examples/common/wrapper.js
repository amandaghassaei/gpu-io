'use strict';
{
	const {
		GLSL1,
		GLSL3,
		WEBGL1,
		WEBGL2,
		isWebGL2Supported,
	} = GPUIO;

	// Init a simple gui.
	const gui = new dat.GUI();

	// Init info dialog.
	MicroModal.init();

	// Init an overlay to prevent click events from bubbling through
	// modal to dat.gui or canvas.
	// Show/hide overlay when modal is opened/closed.
	const overlay = document.createElement('div');
	overlay.id = 'touchOverlay';
	overlay.style.width = '100%';
	overlay.style.height = '100%'
	overlay.style.opacity = 0;
	overlay.style.position = 'absolute';
	overlay.style['z-index'] = 1;
	overlay.style.display = 'none';
	document.body.append(overlay);

	const webGLSettings = {
		webGL2: isWebGL2Supported(),
		useGLSL3: isWebGL2Supported(),
	};

	// Global variables to get from example app.
	let loop, dispose, composer, canvas;
	// Other global ui variables.
	let title;
	let useGLSL3Toggle;

	function reloadExampleWithNewParams() {
		if (useGLSL3Toggle) {
			settings.remove(useGLSL3Toggle);
			useGLSL3Toggle = undefined;
			if (canvas) {
				canvas.addEventListener('gesturestart', disableZoom);
				canvas.addEventListener('gesturechange', disableZoom); 
				canvas.addEventListener('gestureend', disableZoom);
			}
		}
		if (dispose) dispose();
		({ loop, composer, dispose, canvas } = main({
			gui,
			contextID: webGLSettings.webGL2 ? WEBGL2 : WEBGL1,
			glslVersion: webGLSettings.useGLSL3 ? GLSL3 : GLSL1,
		}));
		canvas.addEventListener('gesturestart', disableZoom);
		canvas.addEventListener('gesturechange', disableZoom); 
		canvas.addEventListener('gestureend', disableZoom);
		if (webGLSettings.webGL2) {
			useGLSL3Toggle = settings.add(webGLSettings, 'useGLSL3').name('Use GLSL 300').onChange(reloadExampleWithNewParams);
		}
		title = `WebGL ${webGLSettings.webGL2 ? '2' : '1'}`;
		settings.name = title;
	}

	// Add some settings to gui.
	const settings = gui.addFolder(title);
	if (isWebGL2Supported()) settings.add(webGLSettings, 'webGL2').name('Use WebGL 2').onChange(reloadExampleWithNewParams);
	else {
		// If webGL2 is not supported, hide open folder icon.
		settings.domElement.children[0].children[0].style.backgroundImage = "none";
	}

	// Add info modal.
	const modalOptions = { showModal: () => {
		// Show/hide overlay, otherwise clicks are passing through due to fixed/abs positioning of modal.
		MicroModal.show('modal-1', { onClose: () => { setTimeout(() => { overlay.style.display = 'none'; }, 500); } });
		overlay.style.display = 'block';
	}}
	gui.add(modalOptions, 'showModal').name('About');

	// Load example app.
	reloadExampleWithNewParams();

	// Disable gestures.
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
			settings.name = `${title} (${fps.toFixed(1)} FPS)`;
		}
		window.requestAnimationFrame(outerLoop);
		// Run example loop.
		if (loop) loop();
	}
	// Start loop.
	outerLoop();
}