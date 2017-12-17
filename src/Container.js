const isFunc = (val) => typeof val === 'function';
const isString = (val) => typeof val === 'string';
const isObject = (val) => typeof val === 'object';

export default class Container {

	/**
	 * Constructs dependency Container with dependencies map
	 * @param map {Object}
	 */
	constructor(map) {
		this.$cache = new Map(this.toEntries(map));
		this.production = Boolean(process.env.NODE_ENV === 'production');
	}

	/**
	 * Register dependency in container by given name or by function name
	 * @param name {Function|Object|String}
	 * @param dependency {*}
	 * @returns {Container}
	 */
	register(name, dependency) {
		const {key, value} = this.extractDep(name, dependency);

		this.$cache.set(key, value);

		return this;
	}

	/**
	 * Removes dependency from container by given name or by function name
	 * @param name {Function|String}
	 * @returns {Container}
	 */
	unregister(name) {
		const {key} = this.extractDep(name);

		if (this.$cache.has(key)) {
			this.$cache.delete(key);
		}

		return this;
	}

	/**
	 * Check if dependency exists in container
	 * @param name {String}
	 * @returns {boolean}
	 */
	has(name) {
		const {key} = this.extractDep(name);

		return this.$cache.has(key);
	}

	/**
	 * Returns iterator of values as [key, dependency]
	 * @returns {Iterator.<*>}
	 */
	bindings() {
		return this.$cache.entries();
	}

	/**
	 * Resolves dependency only by string name
	 * @param name {String}
	 * @returns {*}
	 */
	resolve(name) {
		if (isFunc(name) || isObject(name)) {
			const {key} = this.extractDep(name);
			console.warn(`Don't try to resolve dependency "${key}" by dependency itself`)
		}

		if (this.$cache.has(name)) {
			return this.$cache.get(name);
		}

		if (this.production) {
			return void 0;
		}

		throw new Error(`Unknown dependency "${name}"`);
	}

	/**
	 * Extract dependency name from key and return as {key, value} pair
	 * @param key {Function|Object|String|*}
	 * @param value {*}
	 * @returns {{key:string, value:*}}
	 * @protected
	 */
	extractDep(key, value = null) {
		if (isFunc(key) && isString(key.name)) {
			return {key: key.name, value: key}; // jus a function or class
		}

		if (isObject(key) && isFunc(key.constructor) && isString(key.constructor.name)) {
			return {key: key.constructor.name, value: key};// instance of class or function
		}

		return {key, value};
	}

	/**
	 * Converts object to [key, value] array
	 * @param map {Object}
	 * @returns {Array}
	 * @protected
	 */
	toEntries(map = {}) {
		return Object.keys(map).map((key) => {
			return [key, map[key]]
		});
	}

	/**
	 * Extracts all dependencies names from given function
	 * @param func {Function}
	 * @returns {Array}
	 * @protected
	 */
	parameters(func) {
		const extracted = func.toString().match(/^(function)?\s*[^(]*\(\s*([^)]*)\)?/m);

		if (extracted === null) {
			console.warn(`Extraction failed for ${func.name}`);
			return func.bind(self);
		}

		const es6Mode = extracted[1] === 'function' || extracted[1] === undefined;

		return (es6Mode ? extracted[2] : extracted[1])
			.replace(/ /g, '')
			.split(',')
			.filter(dep => dep !== '')
			.map(this.resolve.bind(this));
	}

	/**
	 * Injects dependencies into the function by arguments
	 * @param func
	 * @param self
	 */
	prepare(func, self = null) {
		const params = this.parameters(func);

		return func.bind(self, ...params);
	}
}
