describe('VueJS bindings', function() {
	beforeEach(function () {
		const vueNode = document.getElementById('vue');
		vueNode.removeChild(document.getElementById('app'));
		vueNode.innerHTML = '<div id="app"></div>';
	});
	describe('#integration', function () {
		it('Should have "$ioc" property on global instance', function () {
			assert.isDefined(Vue.$ioc);
		});
		it('Should define "$ioc" property on Vue instances', function () {
			const instance = new Vue();
			assert.isDefined(instance.$ioc);
		});
		it('Should instance "$ioc" should equal global "$ioc"', function () {
			const instance = new Vue();
			assert.equal(Vue.$ioc, instance.$ioc)
		});
	});
	describe('#injections', function () {
		describe('Lifecycle injections', function () {
			it('Should inject into the created hook', function (done) {
				Vue.$ioc.register('integer', 12345);
				new Vue({
					el: '#app',
					created: function (integer) {
						assert.equal(integer, 12345);
						done();
					}
				});
			});
			it('Should inject into the beforeMount hook', function (done) {
				Vue.$ioc.register('integer', 12345);
				new Vue({
					el: '#app',
					beforeMount: function (integer) {
						assert.equal(integer, 12345);
						done();
					}
				});
			});
			it('Should inject into the mounted hook', function (done) {
				Vue.$ioc.register('integer', 12345);
				new Vue({
					el: '#app',
					mounted: function (integer) {
						assert.equal(integer, 12345);
						done();
					}
				});
			});
		});
		describe('Instance injections ($services)', function () {
			it('Should expose a \'$services\' property', function (done) {
				new Vue({
					el: '#app',
					mounted: function () {
						assert.isArray(this.$services);
						done();
					}
				});
			});
			it('Should be an empty array', function (done) {
				new Vue({
					el: '#app',
					mounted: function () {
						assert.lengthOf(this.$services, 0);
						done();
					}
				});
			});
			it('Should inject from services on instance', function (done) {
				Vue.$ioc.register('foo', 'bar');
				new Vue({
					el: '#app',
					services: ['foo'],
					mounted: function () {
						assert.equal(this.$services.foo, 'bar');
						done();
					}
				});
			});
			it('Should bind on the correct instances.', function (done) {
				var uuid = 0;
				const child = {
					template: '<div></div>',
					mounted: function () {
						uuid = this._uid;
					}
				};
				new Vue({
					el: '#app',
					template: '<div><child-element></child-element></div>',
					components: { 'child-element': child },
					mounted: function () {
						assert.notEqual(this._uid, uuid);
						assert.notEqual(this._uid, 0);
						done();
					}
				});
			});
		});
	});
});
