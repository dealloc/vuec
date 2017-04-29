export default class Container {
	constructor() {
		this.$cache = new Map();
		this.production = Boolean(process.env.NODE_ENV === 'production');
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

		if (this.production) {
			return undefined;
		}

		throw new Error(`Unknown dependency "${name}"`);
	}

	prepare(func, self = null) {
		const extracted = func.toString().match(/^(function)?\s*[^(]*\(\s*([^)]*)\)?/m);
		if (extracted === null) {
			console.warn(`Extraction failed for ${func.name}`);
			return func.bind(self);
		}

		const es6Mode = extracted[1] === 'function' || extracted[1] === undefined;
		const params = (es6Mode ? extracted[2] : extracted[1])
			.replace(/ /g, '')
			.split(',')
			.filter(dep => dep !== '')
			.map(this.resolve.bind(this));

		return func.bind(self, ...params);
	}
}
