export default class Container {
	constructor() {
		this.$cache = new Map();
	}

	register(name, value) {
		this.$cache.set(name, value);
	}

	unregister(name) {
		if (this.$cache.has(name)) {
			this.$cache.delete(name);
		}
	}

	has(name) {
		return this.$cache.has(name);
	}

	bindings() {
		return this.$cache.entries();
	}

	resolve(name) {
		if (this.$cache.has(name)) {
			return this.$cache.get(name);
		}

		return undefined;
	}

	prepare(func, self = null) {
		const extracted = func.toString().match(/^function\s*[^(]*\(\s*([^)]*)\)/m);
		if (extracted === null) {
			if (func.toString().indexOf('function') === -1) {
				console.warn(`Parsing ${func.name} failed:`,
					'ES6 method notation is not supported yet (see https://goo.gl/YKfg9R).',
					'Use a transpiler or ES5 notation.');
			} else {
				console.warn(`Extraction failed for ${func.name}`);
			}
			return func.bind(self);
		}

		const params = extracted[1]
			.replace(/ /g, '')
			.split(',')
			.map(this.resolve.bind(this));

		return func.bind(self, ...params);
	}
}
