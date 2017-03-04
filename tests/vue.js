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
});
