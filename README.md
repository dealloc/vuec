# Vuec
## Vue container - a simple IoC container for Vue 2

### Installation
Install using `yarn add vue-container` or `npm install --save vue-container`

### Dependencies
**NONE**! We don't even depend on VueJS (except in the devDependencies for unit testing).
You can even use this without Webpack or Browserify, the container is accessible from `window.vuec.Container` and the Vue bindings as `vuec.default` (the unit tests are actually written in plain ES5 so you can start there to get an idea!)

### Introduction

If you have worked with Vue before, you'll probably have done things like this:
```vue
<script>
import Axios from 'axios';

export default {
	name: 'SomeComponent',
	data: () => ({
		message: null,
	}),
	created() {
		Axios.get('/your/api').then((response) => {
			this.message = response.data;
		});
	},
};
</script>
```
You can use [plugins](https://vuejs.org/v2/guide/plugins.html) to inject dependencies into your Vue object, but that also means that every dependency you need somewhere would have to be injected on *every* instance of Vue you make.

With vuec you can write the same code as above like this:
```vue
<script>
export default {
	name: 'SomeComponent',
	data: () => ({
		message: null,
	}),
	created(Axios) {
		Axios.get('/your/api').then((response) => {
			this.message = response.data;
		});
	},
};
</script>
```
Note how we're no longer importing the Axios module. Vuec takes care of injecting your dependencies into your hooks. Except for `beforeCreate` all hooks can specify their dependencies and Vuec will inject them.

### Usage
registering Vuec in your application is as easy as
```javascript
import Vuec from 'vue-container';

Vue.use(Vuec);
```
Registering a dependency in the container (like Axios in the above example) is done using `register`
```javascript
Vue.$ioc.register('Axios', Axios);
// Or inside a Vue component:
this.$ioc.register('Axios', Axios);
```
You can also manually resolve from the container using the `resolve` function:
```javascript
Vue.$ioc.resolve('Axios');
// Or inside a Vue component:
this.$ioc.resolve('Axios');
```
So how do you call a function with all it's dependencies?
```javascript
function test(Axios) {
	console.info(Axios);
}

Vue.$ioc.prepare(test)();
// Or inside a Vue component:
this.$ioc.prepare(test)();
```
**But you didn't pass `Axios` as an argument!**

Indeed, the `prepare` method of Vuec returns a bound copy of the function with all it's parameters already bound, you can call this function as many times as you want and it will have it's dependencies every time. If you want a custom scope, you can always pass your this argument as the second parameter to the `prepare` method.
```javascript
function test(Axios) {
	console.info(Axios);
}

const prepared = Vue.$ioc.prepare(test);
prepared();
prepared();
prepared();
```
In the above example despite being called 3x the container will only have to resolve the dependencies once!

### Does this work with Vue 1.x?
It probably should, given that Vue manages it's hooks the same way, but it hasn't been tested yet, if you do feel free to make an issue and report any problems you run into.
