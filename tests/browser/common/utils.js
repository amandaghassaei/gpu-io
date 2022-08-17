const gl1Canvas = document.createElement('canvas');
const gl2Canvas = document.createElement('canvas');

const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';
const NA = 'NA';

// Extrema values to test.
const MIN_UNSIGNED_INT = 0;
const MIN_BYTE = -(2 ** 7);
const MAX_BYTE = 2 ** 7 - 1;
const MAX_UNSIGNED_BYTE = 2 ** 8 - 1;
const MIN_SHORT = -(2 ** 15);
const MAX_SHORT = 2 ** 15 - 1;
const MAX_UNSIGNED_SHORT = 2 ** 16 - 1;
const MIN_INT = -(2 ** 31);
const MAX_INT = 2 ** 31 - 1;
const MAX_UNSIGNED_INT = 2 ** 32 - 1;
const MIN_FLOAT_INT = -16777216;
const MAX_FLOAT_INT = 16777216;
const MIN_HALF_FLOAT_INT = -2048;
const MAX_HALF_FLOAT_INT = 2048;

{
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
		LINEAR,
		NEAREST,
		REPEAT,
		CLAMP_TO_EDGE,
		getVertexShaderMediumpPrecision,
		getFragmentShaderMediumpPrecision,
		isHighpSupportedInVertexShader,
		isHighpSupportedInFragmentShader
	} = WebGLCompute;

	document.getElementById('info').innerHTML =  `
	WebGL2 Supported: ${isWebGL2Supported()}<br/>
	Vertex shader mediump precision handled as: ${getVertexShaderMediumpPrecision()}<br/>
	Fragment shader mediump precision handled as: ${getFragmentShaderMediumpPrecision()}<br/>
	Vertex shader supports highp precision: ${isHighpSupportedInVertexShader()}<br/>
	Fragment shader supports highp precision: ${isHighpSupportedInFragmentShader()}<br/>
	<br/>
	All tests are performed on non-power of 2 textures.<br/>
	In cases where INT types are not available, FLOAT types are used instead, but may be limited in the range of int values they can represent.<br/>
	Click on the test to see more info.<br/>
	"default" is NEAREST filtering with CLAMP_TO_EDGE wrapping.<br/>
	Extrema (min, max, min magnitude, max magnitude) for each type are tested.`;

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
		document.getElementById('modal-1-error').innerHTML = `${result.log && result.log.length ? result.log.join('<br/><br/>') + '<br/><br/>' : ''} ${result.error.join('<br/><br/>')}`;
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
				element.innerHTML = `&#10003;${result.error.length ? '*' : ''}`;
			} else if (result.status === NA) {
				element.innerHTML = 'NA'
			} else if (result.status === WARNING) {
				element.innerHTML = '!'
			} else if (result.status === ERROR) {
				element.innerHTML = 'X'
			}
			const link = document.createElement('a');
			link.href = '#';
			link.onclick = (e) => showMoreInfo(e, result);
			link.appendChild(element);
			container.appendChild(link);
		});
		return container;
	}

	function getBrowserVersion() {
		var ua = navigator.userAgent, tem, 
		M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE ' + (tem[1] || '');
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
			if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M = M[2] ? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
		return M.join(' v');
	}

	function isWebGL2Supported() {
		const gl = document.createElement('canvas').getContext('webgl2');
		if (!gl) {
			return false;
		}
		return true;
	}

	function makeTable(testFunction, tests) {
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
				outerTableTitle.innerHTML = `GLSL v${GLSL_VERSION === GLSL3 ? '3' : '1'}`;
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
				outerTable.appendChild(makeColumn(linearRepeatResults, extremaResults, '<br/>LINEAR / REPEAT'));
			});

			container.appendChild(document.createElement('br'));
		});
	}

	const version = document.getElementById('version');
	version.innerHTML = getBrowserVersion();
}

function calculateExpectedValue(dimX, dimY, numElements, input, type, filter, wrap, offset) {
	if (offset === 0) return input;

	const expected = input.slice();

	if (filter === NEAREST) offset = Math.round(offset);

	function wrapIndex(x, y, el) {
		if (wrap === REPEAT) {
			x = (x + dimX) % dimX;
			y = (y + dimY) % dimY;
		} else if (wrap === CLAMP_TO_EDGE) {
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x >= dimX) x = dimX - 1;
			if (y >= dimY) y = dimY - 1;
		}
		return (y * dimX + x) * numElements + el;
	}

	const uint16Array = new Uint16Array(1);
	const view = new DataView(uint16Array.buffer);
	function castPrecision(val) {
		if (type === HALF_FLOAT) {
			setFloat16(view, 0,  val, true);
			return getFloat16(view, 0, true);
		}
		return val;
	}

	function bilinearInterp(x, y, el) {
		// Bilinear interpolation.
		const minX = Math.floor(x);
		const minY = Math.floor(y);
		const maxX = Math.ceil(x);
		const maxY = Math.ceil(y);
		const indexMinMin = wrapIndex(minX, minY, el);
		const indexMinMax = wrapIndex(minX, maxY, el);
		const indexMaxMin = wrapIndex(maxX, minY, el);
		const indexMaxMax = wrapIndex(maxX, maxY, el);
		const valMinMin = castPrecision(input[indexMinMin]);
		const valMinMax = castPrecision(input[indexMinMax]);
		const valMaxMin = castPrecision(input[indexMaxMin]);
		const valMaxMax = castPrecision(input[indexMaxMax]);

		const t1 = x - minX;
		const t2 = y - minY;
		const valMin = t2 * valMinMax + (1 - t2) * valMinMin;
		const valMax = t2 * valMaxMax + (1 - t2) * valMaxMin;
		return castPrecision((t1 * valMax) + (1 - t1) * valMin);
	}

	for (let el = 0; el < numElements; el++) {
		for (let _y = 0; _y < dimY; _y++) {
			for (let _x = 0; _x < dimX; _x++) {
				const x = _x + offset;
				const y = _y + offset;
				expected[wrapIndex(_x, _y, el)] = bilinearInterp(x, y, el);
			}
		}
	}

	return expected;
}