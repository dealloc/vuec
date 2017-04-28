import Container from './Container';

const patchHook = ($vm, hook, container) => {
	const hooks = $vm.$options[hook];
	if (hooks && hooks.length > 0) {
		hooks[hooks.length - 1] = container.prepare(hooks[hooks.length - 1], $vm);
	}
};

const injectServices = ($vm, container) => {
	if ($vm.$options.services !== undefined) {
		$vm.$options.services.forEach(service => {
			$vm.$services[service] = container.resolve(service);
		});
	}
};

const container = new Container; // eslint-disable-line
export default {
	install(Vue) {
		Vue.prototype.$services = [];
		Vue.prototype.$ioc = container;
		Vue.$ioc = container;
		Vue.mixin({
			beforeCreate() {
				injectServices(this, container);
				patchHook(this, 'created', container);
				patchHook(this, 'beforeMount', container);
				patchHook(this, 'mounted', container);
				patchHook(this, 'beforeUpdate', container);
				patchHook(this, 'updated', container);
				patchHook(this, 'beforeDestroy', container);
				patchHook(this, 'destroyed', container);
			},
		});
	},
};
