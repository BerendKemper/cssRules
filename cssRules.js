"use strict";

const cssRules = function loadCssRules() {
	const style = document.createElement("style");
	document.head.appendChild(style);
	const sheet = style.sheet;

	const cssRulesProto = Object.create(null);
	const cssRules = Object.setPrototypeOf({}, cssRulesProto);

	const cssStylesDeclarations = function loadCSSStyleDeclarations() {
		sheet.insertRule("null {}");
		const nullRule = sheet.cssRules[sheet.cssRules.length - 1];
		const cssStyleDeclarations = {};
		for (const cssStyleDeclaration of Object.keys(nullRule.style)) {
			let correctDeclaration = "";
			let start = 0;
			let ix = 0;
			for (; ix < cssStyleDeclaration.length; ix++) {
				const charCode = cssStyleDeclaration[ix].charCodeAt();
				if (charCode >= 65 && charCode <= 90) {
					correctDeclaration += cssStyleDeclaration.slice(start, ix).toLocaleLowerCase() + "-";
					start = ix;
				}
			}
			correctDeclaration += cssStyleDeclaration.slice(start, ix).toLocaleLowerCase()
			Object.defineProperty(cssStyleDeclarations, correctDeclaration, { value: true, enumerable: true });
		}
		sheet.deleteRule(sheet.cssRules.length - 1);
		return cssStyleDeclarations;
	}();

	const setStyleDeclaration = (selector_proto, styleDeclaration, style) => {
		Object.defineProperty(selector_proto, styleDeclaration, {
			get() {
				return style.getPropertyValue(styleDeclaration);
			},
			set(value) {
				style.setProperty(styleDeclaration, value);
			}, enumerable: true, configurable: true
		});
	};

	const _sheet = new WeakMap();
	const _index = new WeakMap();

	const selectorProto = Object.defineProperties({}, {
		'removeProperty': {
			value(property) {
				if (cssStylesDeclarations[property]) {
					const rule = _sheet.get(this).cssRules[_index.get(this)];
					const style = rule.style;
					const selector = cssRules[rule.selectorText];
					const selector_proto = Object.getPrototypeOf(selector);
					delete (selector_proto[property]);
					style.removeProperty(property);
				}
			}, enumerable: true
		},
		'setProperty': {
			value(property, value) {
				if (cssStylesDeclarations[property]) {
					const rule = _sheet.get(this).cssRules[_index.get(this)];
					const style = rule.style;
					const selector = cssRules[rule.selectorText];
					const selector_proto = Object.getPrototypeOf(selector);
					setStyleDeclaration(selector_proto, property, style);
					style.setProperty(property, value);
				}
			}, enumerable: true
		},
	});

	const insertRule = (rule, index, sheet) => {
		const style = rule.style;
		const selector_proto = Object.assign(Object.create(null), selectorProto);
		const selector = Object.setPrototypeOf({}, selector_proto);
		_index.set(selector, index);
		_sheet.set(selector, sheet);
		cssRules[rule.selectorText] = selector;
		for (let ix = 0; ix < rule.styleMap.size; ix++) {
			const styleDeclaration = style[ix];
			setStyleDeclaration(selector_proto, styleDeclaration, style);
		}
	};

	Object.defineProperties(cssRulesProto, {
		'insertRule': {
			value(rule) {
				const index = sheet.cssRules.length;
				sheet.insertRule(rule, index);
				const cssRule = sheet.cssRules[index];
				insertRule(cssRule, index, sheet);
			}, enumerable: true
		},
		'deleteRule': {
			value(selector) {
				const cssRule = cssRules[selector];
				_sheet.get(cssRule).deleteRule(_index.get(cssRule));
				delete (cssRules[selector]);
			}, enumerable: true
		}
	});

	for (const styleSheet of document.styleSheets) {
		if (styleSheet.href !== null && !styleSheet.href.includes("bootstrap")) {
			const cssRulesList = styleSheet.cssRules;
			for (let index = 0; index < cssRulesList.length; index++) {
				const cssRule = cssRulesList[index];
				insertRule(cssRule, index, styleSheet);
			}
		}
	}
	return cssRules;
}();

const CssRules = function loadCssRules() {
	const accessKey = Symbol("Access Key CSS Rules");
	const accessError = () => new Error("ಠ_ಠ");
	class CssRule {
		#index;
		#sheet;
	};
	class CssSheet {
		#style;
		#styleSheet;
		constructor(key, styleSheet) {
			if (key === accessKey)
				throw accessError();
			if (styleSheet)
				return this.#styleSheet = styleSheet;
			this.#style = document.createElement("style");
			document.head.appendChild(this.#style);
			this.#styleSheet = this.#style.sheet;
		};
	};
	return class CssRules {
		constructor() {
			throw accessError();
		};
		insertRule(selector) {

		};
		deleteRule() {

		}
	};
}();
