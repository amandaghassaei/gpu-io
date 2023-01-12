(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TweakpaneImagePlugin = {}));
}(this, (function (exports) { 'use strict';

    function forceCast(v) {
        return v;
    }

    const PREFIX = 'tp';
    function ClassName(viewName) {
        const fn = (opt_elementName, opt_modifier) => {
            return [
                PREFIX,
                '-',
                viewName,
                'v',
                opt_elementName ? `_${opt_elementName}` : '',
                opt_modifier ? `-${opt_modifier}` : '',
            ].join('');
        };
        return fn;
    }

    function parseObject(value, keyToParserMap) {
        const keys = Object.keys(keyToParserMap);
        const result = keys.reduce((tmp, key) => {
            if (tmp === undefined) {
                return undefined;
            }
            const parser = keyToParserMap[key];
            const result = parser(value[key]);
            return result.succeeded
                ? Object.assign(Object.assign({}, tmp), { [key]: result.value }) : undefined;
        }, {});
        return forceCast(result);
    }
    function parseArray(value, parseItem) {
        return value.reduce((tmp, item) => {
            if (tmp === undefined) {
                return undefined;
            }
            const result = parseItem(item);
            if (!result.succeeded || result.value === undefined) {
                return undefined;
            }
            return [...tmp, result.value];
        }, []);
    }
    function isObject(value) {
        if (value === null) {
            return false;
        }
        return typeof value === 'object';
    }
    function createParamsParserBuilder(parse) {
        return (optional) => (v) => {
            if (!optional && v === undefined) {
                return {
                    succeeded: false,
                    value: undefined,
                };
            }
            if (optional && v === undefined) {
                return {
                    succeeded: true,
                    value: undefined,
                };
            }
            const result = parse(v);
            return result !== undefined
                ? {
                    succeeded: true,
                    value: result,
                }
                : {
                    succeeded: false,
                    value: undefined,
                };
        };
    }
    function createParamsParserBuilders(optional) {
        return {
            custom: (parse) => createParamsParserBuilder(parse)(optional),
            boolean: createParamsParserBuilder((v) => typeof v === 'boolean' ? v : undefined)(optional),
            number: createParamsParserBuilder((v) => typeof v === 'number' ? v : undefined)(optional),
            string: createParamsParserBuilder((v) => typeof v === 'string' ? v : undefined)(optional),
            function: createParamsParserBuilder((v) =>
            typeof v === 'function' ? v : undefined)(optional),
            constant: (value) => createParamsParserBuilder((v) => (v === value ? value : undefined))(optional),
            raw: createParamsParserBuilder((v) => v)(optional),
            object: (keyToParserMap) => createParamsParserBuilder((v) => {
                if (!isObject(v)) {
                    return undefined;
                }
                return parseObject(v, keyToParserMap);
            })(optional),
            array: (itemParser) => createParamsParserBuilder((v) => {
                if (!Array.isArray(v)) {
                    return undefined;
                }
                return parseArray(v, itemParser);
            })(optional),
        };
    }
    const ParamsParsers = {
        optional: createParamsParserBuilders(true),
        required: createParamsParserBuilders(false),
    };
    function parseParams(value, keyToParserMap) {
        const result = ParamsParsers.required.object(keyToParserMap)(value);
        return result.succeeded ? result.value : undefined;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function createPlaceholderImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 64;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ddd';
        ctx.font = 'monospaced';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No image', canvas.width * 0.5, canvas.height * 0.5);
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const image = new Image();
                image.src = URL.createObjectURL(blob);
                image.onload = () => {
                    resolve(image);
                };
            });
        });
    }
    function loadImage(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            return new Promise((resolve) => {
                image.src = src;
                image.onload = () => {
                    resolve(image);
                };
            });
        });
    }
    function cloneImage(source) {
        const canvas = document.createElement('canvas');
        canvas.width = source.width;
        canvas.height = source.height;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        const image = new Image();
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                image.src = URL.createObjectURL(blob);
                image.onload = () => {
                    resolve(image);
                };
            });
        });
    }

    const className = ClassName('img');
    class PluginView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className());
            config.viewProps.bindClassModifiers(this.element);
            this.input = doc.createElement('input');
            this.input.classList.add(className('input'));
            this.input.setAttribute('type', 'file');
            this.input.setAttribute('accept', config.extensions.join(','));
            this.element.appendChild(this.input);
            this.image_ = doc.createElement('img');
            this.image_.classList.add(className('image'));
            this.image_.classList.add(className(`image_${config.imageFit}`));
            this.element.classList.add(className('area_root'));
            this.element.appendChild(this.image_);
        }
        changeImage(src) {
            this.image_.src = src;
        }
        changeDraggingState(state) {
            const el = this.element;
            if (state) {
                el === null || el === void 0 ? void 0 : el.classList.add(className('area_dragging'));
            }
            else {
                el === null || el === void 0 ? void 0 : el.classList.remove(className('area_dragging'));
            }
        }
    }

    class PluginController {
        constructor(doc, config) {
            this.placeholderImage = null;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new PluginView(doc, {
                viewProps: this.viewProps,
                extensions: config.extensions,
                imageFit: config.imageFit,
            });
            this.onFile = this.onFile.bind(this);
            this.onDrop = this.onDrop.bind(this);
            this.onDragOver = this.onDragOver.bind(this);
            this.onDragLeave = this.onDragLeave.bind(this);
            this.view.input.addEventListener('change', this.onFile);
            this.view.element.addEventListener('drop', this.onDrop);
            this.view.element.addEventListener('dragover', this.onDragOver);
            this.view.element.addEventListener('dragleave', this.onDragLeave);
            this.viewProps.handleDispose(() => {
                this.view.input.removeEventListener('change', this.onFile);
                this.view.input.removeEventListener('drop', this.onDrop);
                this.view.input.removeEventListener('dragover', this.onDragOver);
                this.view.input.removeEventListener('dragleave', this.onDragLeave);
            });
            this.value.emitter.on('change', this.handleValueChange.bind(this));
            this.handleValueChange();
        }
        onFile(event) {
            const files = (event === null || event === void 0 ? void 0 : event.target).files;
            if (!files || !files.length)
                return;
            const file = files[0];
            const url = URL.createObjectURL(file);
            this.setValue(url);
            this.updateImage(url);
        }
        onDrop(event) {
            return __awaiter(this, void 0, void 0, function* () {
                event.preventDefault();
                try {
                    const { dataTransfer } = event;
                    const file = dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.files[0];
                    if (file) {
                        const url = URL.createObjectURL(file);
                        this.updateImage(url);
                        this.setValue(url);
                    }
                    else {
                        const url = dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.getData('url');
                        if (!url)
                            throw new Error('No url');
                        loadImage(url).then((image) => __awaiter(this, void 0, void 0, function* () {
                            const clone = yield cloneImage(image);
                            this.updateImage(clone.src);
                            this.setValue(clone);
                        }));
                    }
                }
                catch (e) {
                    console.error('Could not parse the dropped image', e);
                }
                finally {
                    this.view.changeDraggingState(false);
                }
            });
        }
        onDragOver(event) {
            event.preventDefault();
            this.view.changeDraggingState(true);
        }
        onDragLeave() {
            this.view.changeDraggingState(false);
        }
        handleImage(image) {
            return __awaiter(this, void 0, void 0, function* () {
                if (image instanceof HTMLImageElement) {
                    cloneImage(image).then((clone) => {
                        this.updateImage(clone.src);
                    });
                }
                else if (typeof image === 'string') {
                    let finalUrl = '';
                    try {
                        if (image === 'placeholder')
                            throw new Error('placeholder');
                        new URL(image);
                        const loadedImage = yield loadImage(image);
                        finalUrl = loadedImage.src;
                    }
                    catch (_) {
                        finalUrl = (yield this.handlePlaceholderImage()).src;
                    }
                    finally {
                        this.updateImage(finalUrl);
                        this.setValue(finalUrl);
                    }
                }
            });
        }
        updateImage(src) {
            this.view.changeImage(src);
        }
        setValue(src) {
            return __awaiter(this, void 0, void 0, function* () {
                if (src instanceof HTMLImageElement) {
                    this.value.setRawValue(src);
                }
                else if (src) {
                    this.value.setRawValue(yield loadImage(src));
                }
                else {
                    this.value.setRawValue(yield this.handlePlaceholderImage());
                }
            });
        }
        handleValueChange() {
            this.handleImage(this.value.rawValue);
        }
        handlePlaceholderImage() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this.placeholderImage) {
                    this.placeholderImage = yield createPlaceholderImage();
                }
                return this.placeholderImage;
            });
        }
    }

    const DEFAULT_EXTENSIONS = ['.jpg', '.png', '.gif'];
    const TweakpaneImagePlugin = {
        id: 'input-image',
        type: 'input',
        css: '.tp-imgv{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:transparent;border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-imgv{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-imgv:hover{background-color:var(--in-bg-h)}.tp-imgv:focus{background-color:var(--in-bg-f)}.tp-imgv:active{background-color:var(--in-bg-a)}.tp-imgv:disabled{opacity:0.5}:root{--tp-plugin-image-dragging-color: hsla(230, 100%, 66%, 1.00)}.tp-imgv{cursor:pointer;display:grid;height:calc(var(--bld-us) * 3);overflow:hidden;position:relative}.tp-imgv.tp-v-disabled{opacity:0.5}.tp-imgv_input{width:100%;height:100%;opacity:0}.tp-imgv_image{width:100%;height:100%;position:absolute;pointer-events:none;border:0}.tp-imgv_image_contain{-o-object-fit:contain;object-fit:contain}.tp-imgv_image_cover{-o-object-fit:cover;object-fit:cover}.tp-imgv_area_root{transition:opacity 0.16s ease-in-out}.tp-imgv_area_dragging{border:2px dashed var(--tp-plugin-image-dragging-color);border-radius:6px;opacity:0.6}',
        accept(exValue, params) {
            if (!(exValue instanceof HTMLImageElement || typeof exValue === 'string')) {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                view: p.required.constant('input-image'),
                acceptUrl: p.optional.boolean,
                imageFit: p.optional.custom((v) => v === 'contain' || v === 'cover' ? v : undefined),
                extensions: p.optional.array(p.required.string),
            });
            if (!result) {
                return null;
            }
            return {
                initialValue: exValue,
                params: result,
            };
        },
        binding: {
            reader(_args) {
                return (exValue) => {
                    if (exValue instanceof HTMLImageElement) {
                        return exValue.src === '' ? 'placeholder' : exValue.src;
                    }
                    else {
                        return typeof exValue === 'string' ? exValue : 'placeholder';
                    }
                };
            },
            writer(_args) {
                return (target, inValue) => {
                    target.write(inValue);
                };
            },
        },
        controller(args) {
            var _a, _b;
            return new PluginController(args.document, {
                value: args.value,
                imageFit: (_a = args.params.imageFit) !== null && _a !== void 0 ? _a : 'cover',
                viewProps: args.viewProps,
                extensions: (_b = args.params.extensions) !== null && _b !== void 0 ? _b : DEFAULT_EXTENSIONS,
            });
        },
    };

    const plugin = TweakpaneImagePlugin;

    exports.plugin = plugin;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
