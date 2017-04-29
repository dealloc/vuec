describe('Container', function() {
	describe('#register()', function() {
		it('Should register integers', function() {
			const container = new vuec.Container();
			container.register('module', 12345);
			assert.equal(container.$cache.get('module'), 12345);
		});
		it('Should register strings', function() {
			const container = new vuec.Container();
			container.register('module', 'Hello world');
			assert.equal(container.$cache.get('module'), 'Hello world');
		});
		it('Should register objects', function() {
			const container = new vuec.Container();
			container.register('module', { hello: 'world' });
			assert.property(container.$cache.get('module'), 'hello');
		});
		it('Should register functions without resolving', function() {
			const container = new vuec.Container();
			container.register('module', function () { return 'Hello world'; });
			const resolved = container.$cache.get('module');
			assert.isFunction(resolved);
			assert.equal(resolved(), 'Hello world');
		});
	});
	describe('#resolve()', function() {
		it('Should resolve integers', function() {
			const container = new vuec.Container();
			container.register('integer', 12345);
			assert.equal(container.resolve('integer'), 12345);
		});
		it('Should resolve strings', function() {
			const container = new vuec.Container();
			container.register('string', 'Hello world');
			assert.equal(container.resolve('string'), 'Hello world');
		});
		it('Should resolve objects', function() {
			const container = new vuec.Container();
			const object = { hello: 'world' };
			container.register('object', object);
			assert.equal(container.resolve('object'), object);
		});
		it('Should resolve functions', function() {
			const container = new vuec.Container();
			const fnc = () => 12345;
			container.register('function', fnc);
			assert.equal(container.resolve('function'), fnc);
			assert.equal(container.resolve('function')(), 12345);
		});
		it('Should throw when target doesn\'t exist (development)', function() {
			const container = new vuec.Container();
			if (container.production === true) return;

			try {
				container.resolve('test');
				assert.fail('Resolve should\'ve thrown!');
			} catch (error) {
				assert(/Unknown dependency "test"/.test(error));
			}
		});
		it('Should return undefined when target doesn\'t exist (production)', function() {
			const container = new vuec.Container();
			if (container.production === false) return;

			assert.isUndefined(container.resolve('test'));
		});
	});
	describe('#has', function () {
		it('Should return false when a binding doesn\'t exist', function () {
			const container = new vuec.Container();
			assert.equal(container.has('foo'), false);
		});
		it('Should return true when a binding exists', function () {
			const container = new vuec.Container();
			container.register('foo', 'foobar');
			assert.equal(container.has('foo'), true);
		});
	});
	describe('#prepare', function () {
		it('Should return a function', function () {
			const container = new vuec.Container();
			container.register('foo', 'bar');
			const method = (foo) => assert.equal(foo, 'bar');

			assert.isFunction(container.prepare(method));
		});
		it('Should resolve all parameters', function () {
			const container = new vuec.Container();
			container.register('foo', 'bar');
			const method = (foo) => assert.equal(foo, 'bar');

			const resolved = container.prepare(method);
			resolved();
		});
		it('Should resolve only once', function () {
			const container = new vuec.Container();
			container.register('foo', 'bar');
			const method = (foo) => assert.equal(foo, 'bar');
			const resolved = container.prepare(method);
			container.register('foo', 'foobar');
			assert.equal(container.resolve('foo'), 'foobar');

			resolved();
		});
	});
	describe('#unregister', function () {
		it('Should remove a registered binding', function () {
			const container = new vuec.Container();
			container.register('foo', 'Hello world');
			assert.equal(container.has('foo'), true);
			container.unregister('foo');
			assert.equal(container.has('foo'), false);
		});
		it('Should ignore an unregistered binding', function () {
			const container = new vuec.Container();
			container.unregister('foo');
			assert.equal(container.has('foo'), false);
		});
	});
});
