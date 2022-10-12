const { setFloat16, getFloat16 } = float16;

const {
	HALF_FLOAT,
	FLOAT,
	UNSIGNED_BYTE,
	BYTE,
	UNSIGNED_SHORT,
	SHORT,
	UNSIGNED_INT,
	INT,
	GLSL3,
	WEBGL2,
	LINEAR,
	NEAREST,
	REPEAT,
	CLAMP_TO_EDGE,
	getVertexShaderMediumpPrecision,
	getFragmentShaderMediumpPrecision,
	isHighpSupportedInVertexShader,
	isHighpSupportedInFragmentShader
} = GPUIO;

MicroModal.init();

const browserReport = browserReportSync();
const browser = `${browserReport.browser.name} ${browserReport.browser.version ? `v${browserReport.browser.version}` : 'unknown version'}`;
const os = `${browserReport.os.name} ${browserReport.os.version ? `v${browserReport.os.version}` : 'unknown version'}`;

document.getElementById('info').innerHTML =  `
Browser: ${browser}<br/>
Operating System: ${os}<br/>
<br/>
WebGL2 Supported: ${isWebGL2Supported()}<br/>
Vertex shader mediump precision handled as: ${getVertexShaderMediumpPrecision()}<br/>
Fragment shader mediump precision handled as: ${getFragmentShaderMediumpPrecision()}<br/>
Vertex shader supports highp precision: ${isHighpSupportedInVertexShader()}<br/>
Fragment shader supports highp precision: ${isHighpSupportedInFragmentShader()}<br/>
<br/>
Click on the test to see more info.<br/>
<br/>
All tests are performed on non-power of 2 textures.<br/>
In cases where INT types are not available, FLOAT types are used instead, but may be limited in the range of int values they can represent.<br/>
"default" is NEAREST filtering with CLAMP_TO_EDGE wrapping.<br/>
* indicates that fragment shader polyfill was used.<br/>
Extrema (min, max, min magnitude, max magnitude) for each type are tested.<br/>
<br/>
<a href="#" id="saveImage">Save results as PNG</a>`;

document.getElementById('saveImage').addEventListener('click', (e) => {
	e.preventDefault();
	domtoimage.toPng(document.getElementById('output'))
		.then(function (dataUrl) {
			const link = document.createElement('a');
			link.download = `${document.getElementById('testTitle').innerHTML}_${browser}_${os}.png`.replace(/\s+/g, '_');
			link.href = dataUrl;
			link.click();
		});
});

function addModal() {
	const modalHTML = `<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
		<div class="modal__overlay" tabindex="-1" data-micromodal-close>
			<div id="modal-1-container" class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
				<header class="modal__header">
					<h2 class="modal__title" id="modal-1-title">
					</h2>
					<button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
				</header>
				<main class="modal__content" id="modal-1-content">
					<p id="modal-1-config"></p>
					<p id="modal-1-error"></p>
				</main>
			</div>
		</div>
	</div>`;
	const div = document.createElement('div');
	div.innerHTML = modalHTML;
	document.getElementsByTagName('body')[0].appendChild(div.children[0]);
}
addModal();

function showMoreInfo(e, result) {
	e.preventDefault();
	const modal = document.getElementById('modal-1-container');
	modal.className = `${result.status} modal__container`;
	document.getElementById('modal-1-title').innerHTML = result.status;
	document.getElementById('modal-1-error').innerHTML =
		`${(result.log ? result.log : []).concat((result.polyfill ? result.polyfill : []).concat(result.error)).join('<br/><br/>')}`;
	document.getElementById('modal-1-config').innerHTML = Object.keys(result.config).map(key => `${key}: ${result.config[key]}`).join('<br/>');
	MicroModal.show('modal-1');
}

function makeTitleColumn(titles, title) {
	const container = document.createElement('div');
	container.className = 'column-title';
	if (title) {
		const titleDiv = document.createElement('div');
		titleDiv.className = 'entry';
		titleDiv.innerHTML = title;
		container.appendChild(titleDiv);
	}
	titles.forEach(title => {
		const titleDiv = document.createElement('div');
		titleDiv.className = 'entry';
		titleDiv.innerHTML = title;
		container.appendChild(titleDiv);
	});
	return container;
}

function makeColumn(results, extremaResults, title) {
	const container = document.createElement('div');
	container.className = 'column';
	const titleDiv = document.createElement('div');
	titleDiv.className = 'entry header';
	titleDiv.innerHTML = title;
	container.appendChild(titleDiv);
	results.forEach((result, index) => {
		if (result.status !== NA) {
			// Merge in extrema result.
			const extremaResult = extremaResults[index];
			if (extremaResult.extremaError) result.error.push(...extremaResult.extremaError);
			if (extremaResult.extremaWarning) result.error.push(...extremaResult.extremaWarning);
			if (extremaResult.status === ERROR) {
				result.status = ERROR;
			} else if (extremaResult.status === WARNING && result.status !== ERROR) {
				result.status = WARNING;
			}
		}

		const element = document.createElement('div');
		element.className = `entry result ${result.status}`;
		if (result.status === SUCCESS) {
			element.innerHTML = `&#10003;${result.polyfill.length ? '*' : ''}`;
		} else if (result.status === NA) {
			element.innerHTML = 'NA';
		} else if (result.status === WARNING) {
			element.innerHTML = `!${result.polyfill.length ? '*' : ''}`;
		} else if (result.status === ERROR) {
			element.innerHTML = 'X';
		}
		const link = document.createElement('a');
		link.href = '#';
		link.onclick = (e) => showMoreInfo(e, result);
		link.appendChild(element);
		container.appendChild(link);
	});
	return container;
}

function isWebGL2Supported() {
	const gl = document.createElement('canvas').getContext(WEBGL2);
	if (!gl) {
		return false;
	}
	return true;
}

function makeTable(testFunction) {

	let tests;
    if (GPUIO.isWebGL2Supported()) {
      tests = [
        { WEBGL_VERSION: GPUIO.WEBGL2, GLSL_VERSION: GPUIO.GLSL3 },
        { WEBGL_VERSION: GPUIO.WEBGL2, GLSL_VERSION: GPUIO.GLSL1 },
        { WEBGL_VERSION: GPUIO.WEBGL1, GLSL_VERSION: GPUIO.GLSL1 },
      ];
    } else {
      tests = [
        { WEBGL_VERSION: GPUIO.WEBGL1, GLSL_VERSION: GPUIO.GLSL1 },
      ];
    }

	// To make things simpler, keep DIM_X * DIMY < 256.
	const DIM_X = 30;
	const DIM_Y = 30;

	const output = document.getElementById('output');

	const types = [
		HALF_FLOAT,
		FLOAT,
		UNSIGNED_BYTE,
		BYTE,
		UNSIGNED_SHORT,
		SHORT,
		UNSIGNED_INT,
		INT,
	];
	types.forEach((TYPE) => {
		// Create place to show results.
		const div = document.createElement('div');
		output.appendChild(div);

		// Make vertical label displaying type.
		const label = document.createElement('div');
		label.className = 'label';
		const labelInner = document.createElement('div');
		labelInner.className = 'rotate bold';
		labelInner.innerHTML = TYPE;
		label.appendChild(labelInner);
		div.appendChild(label);

		// Container for table.
		const container = document.createElement('div');
		container.className = 'container';
		div.appendChild(container);

		const rowTitles = ['R', 'RG', 'RGB', 'RGBA'];
		container.appendChild(makeTitleColumn(rowTitles));

		// Loop through each glsl version.
		tests.forEach(({ GLSL_VERSION, WEBGL_VERSION }) => {
			const outerTable = document.createElement('div');
			outerTable.className="outerTable"
			container.appendChild(outerTable);
			const outerTableTitle = document.createElement('div');
			outerTableTitle.className="outerTable-title entry"
			outerTableTitle.innerHTML = `WebGL ${WEBGL_VERSION === WEBGL2 ? '2' : '1'} + GLSL v${GLSL_VERSION === GLSL3 ? '3' : '1'}`;
			outerTable.appendChild(outerTableTitle);

			// Loop through various settings.
			const extremaResults = [];
			for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
				// Test array writes for type.
				extremaResults.push(testFunction({
					TYPE,
					DIM_X,
					DIM_Y,
					NUM_ELEMENTS,
					WEBGL_VERSION,
					GLSL_VERSION,
					WRAP: CLAMP_TO_EDGE,
					FILTER: NEAREST,
					TEST_EXTREMA: true,
				}));
			}

			const defaultResults = [];
			for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
				// Test array writes for type.
				defaultResults.push(testFunction({
					TYPE,
					DIM_X,
					DIM_Y,
					NUM_ELEMENTS,
					WEBGL_VERSION,
					GLSL_VERSION,
					WRAP: CLAMP_TO_EDGE,
					FILTER: NEAREST,
				}));
			}
			outerTable.appendChild(makeColumn(defaultResults, extremaResults, '<br/>default'));

			const linearResults = [];
			for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
				// Test array writes for type.
				linearResults.push(testFunction({
					TYPE,
					DIM_X,
					DIM_Y,
					NUM_ELEMENTS,
					WEBGL_VERSION,
					GLSL_VERSION,
					WRAP: CLAMP_TO_EDGE,
					FILTER: LINEAR,
				}));
			}
			outerTable.appendChild(makeColumn(linearResults, extremaResults, 'filter<br/>LINEAR'));

			const repeatResults = [];
			for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
				// Test array writes for type.
				repeatResults.push(testFunction({
					TYPE,
					DIM_X,
					DIM_Y,
					NUM_ELEMENTS,
					WEBGL_VERSION,
					GLSL_VERSION,
					WRAP: REPEAT,
					FILTER: NEAREST,
				}));
			}
			outerTable.appendChild(makeColumn(repeatResults, extremaResults, 'wrap<br/>REPEAT'));

			const linearRepeatResults = [];
			for (let NUM_ELEMENTS = 1; NUM_ELEMENTS <= 4; NUM_ELEMENTS++) {
				// Test array writes for type.
				linearRepeatResults.push(testFunction({
					TYPE,
					DIM_X,
					DIM_Y,
					NUM_ELEMENTS,
					WEBGL_VERSION,
					GLSL_VERSION,
					WRAP: REPEAT,
					FILTER: LINEAR,
				}));
			}
			outerTable.appendChild(makeColumn(linearRepeatResults, extremaResults, 'LINEAR<br/>REPEAT'));
		});

		container.appendChild(document.createElement('br'));
	});
}

const pending = document.getElementsByClassName('pending');

for (const el of pending) {
	el.innerHTML = '';
}
