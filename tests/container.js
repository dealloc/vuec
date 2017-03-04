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
	});
});
