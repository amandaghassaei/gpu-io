'use strict';
{
	const {
		GLSL1,
		GLSL3,
		WEBGL1,
		WEBGL2,
		isWebGL2Supported,
	} = GPUIO;

	// https://github.com/amandaghassaei/canvas-capture
	const CanvasCapture = window.CanvasCapture.CanvasCapture;
	const RECORD_FPS = 60;

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
		webGLVersion: isWebGL2Supported() ? 'WebGL 2' : 'WebGL 1',
		GLSLVersion: isWebGL2Supported() ? 'GLSL 3' : 'GLSL 1',
	};
	const availableWebGLVersions = ['WebGL 1'];
	const availableGLSLVersions = ['GLSL 1'];
	if (isWebGL2Supported()) {
		availableWebGLVersions.unshift('WebGL 2');
		availableGLSLVersions.unshift('GLSL 3');
	}
	
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
		if (webGLSettings.webGLVersion === 'WebGL 1') webGLSettings.GLSLVersion = 'GLSL 1';
		if (dispose) dispose();
		({ loop, composer, dispose, canvas } = main({
			gui,
			contextID: webGLSettings.webGLVersion === 'WebGL 2' ? WEBGL2 : WEBGL1,
			glslVersion: webGLSettings.GLSLVersion === 'GLSL 3' ? GLSL3 : GLSL1,
		}));
		canvas.addEventListener('gesturestart', disableZoom);
		canvas.addEventListener('gesturechange', disableZoom); 
		canvas.addEventListener('gestureend', disableZoom);
		
		useGLSL3Toggle = settings.add(webGLSettings, 'GLSLVersion', webGLSettings.webGLVersion === 'WebGL 2' ? availableGLSLVersions : ['GLSL 1']).name('GLSL Version').onChange(reloadExampleWithNewParams);
		title = `${webGLSettings.webGLVersion}`;
		settings.name = title;

		CanvasCapture.dispose();
		CanvasCapture.init(canvas, { showRecDot: true, showDialogs: true, showAlerts: true, recDotCSS: { left: '0', right: 'auto' } });
		CanvasCapture.bindKeyToVideoRecord('v', {
			format: CanvasCapture.WEBM,
			name: 'screen_recording',
			fps: RECORD_FPS,
			quality: 1,
		});
	}

	// Add some settings to gui.
	const settings = gui.addFolder(title);
	settings.add(webGLSettings, 'webGLVersion', availableWebGLVersions).name('WebGL Version').onChange(reloadExampleWithNewParams);

	// Add info modal.
	const modalOptions = {
		showModal: () => {
			// Show/hide overlay, otherwise clicks are passing through due to fixed/abs positioning of modal.
			MicroModal.show('modal-1', { onClose: () => { setTimeout(() => { overlay.style.display = 'none'; }, 500); } });
			overlay.style.display = 'block';
		},
		sourceCode: () => {
			document.getElementById('sourceCode').click();
		},
	}
	gui.add(modalOptions, 'showModal').name('About');
	gui.add(modalOptions, 'sourceCode').name('View Code');

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

	let numFrames = 0;

	function outerLoop() {
		// Update fps counter.
		const { fps, numTicks } = composer.tick();
		if (numTicks % 10 === 0) {
			settings.name = `${title} (${fps.toFixed(1)} FPS)`;
		}
		window.requestAnimationFrame(outerLoop);
		// Run example loop.
		if (loop) loop();

		// Screen recording.
		CanvasCapture.checkHotkeys();
		if (CanvasCapture.isRecording()) {
			CanvasCapture.recordFrame();
			numFrames++;
			console.log(`Recording duration: ${(numFrames / RECORD_FPS).toFixed(2)} sec`);
		} else {
			numFrames = 0;
		}
	}
	// Start loop.
	outerLoop();
}