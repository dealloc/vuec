# Vuec
## Vue container - a simple IoC container for Vue 2

### Installation
Install using `yarn add vue-container` or `npm install --save vue-container`

**warning**: when building for production, make sure to read [this](#mangling)

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

### Why use dependency injection?
In the example above we showed you how you could eliminate your imports (mostly) by using dependency injection.
You might by now be thinking "hey that's pretty cool, but *why* would I do that?". There's a couple reasons why you might want to use dependency injection in VueJS
- testability (we'll cover this one in detail below)
- explicit dependencies: rather than having a bunch of imports thrown all over, you can now see what dependencies your component relies on (because other than dependencies you might import components, css files, ...)
- easier refactoring (rather than having to wrap those modules so you can swap them, just swap their binding in the container)

As mentioned above in the list, testability is improved by using dependency injection. Imagine you're writing an application that makes calls to an API, you're probably using a package for making those HTTP requests (like [vue-resource](https://github.com/pagekit/vue-resource) or [Axios](https://github.com/mzabriskie/axios) or even [fetch](https://github.com/github/fetch)). However, when you're running your unit tests you'd probably rather not have those tests run wild and create 200 users in your API.
Using dependency injection you could just swap out the binding for your HTTP service with a dummy service (that could for example assert the required calls are made), without having to change a single line of code.

Simply put, in your code you could have:
```javascript
Vue.$ioc.register('$http', Axios);
```
And for your unit tests you could overwrite the binding
```javascript
Vue.$ioc.register('$http', AxiosDummyModule);
```
Your components however remain entirely unchanged.

**in short** depenency injection allows you to abstract your code a step further and makes your components truly standalone and easier to test.

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

### Usage with VueJS
Vuec will automatically hook itself into the component lifecycle to resolve dependencies,
or if you prefer you can use the `services` property to define your dependencies, it's up to your preference.

To use method injection, you simply write your components like this:
```javascript
new Vue({
    // ... pass your component parameters here
    mounted($http) {
        // vuec will inject the '$http' service for you here
    }
});
```

Or if you prefer to define your services in an array on your component (which prevents [name mangling](#mangling))
```javascript
new Vue({
    // ... pass your component parameters here
    services: ['$http'],
    mounted() {
        // the $http service is available under this.$services.$http
    }
});
```

### Does this work with Vue 1.x?
It probably should, given that Vue manages it's hooks the same way, but it hasn't been tested yet, if you do feel free to make an issue and report any problems you run into.

### mangling
When building for production you'll most likely minify your code. Most minifiers employ a technique called "name mangling"
which poses a couple problems with this library if you use method injection. You can read more about this [here](https://github.com/dealloc/vuec/issues/3).

In short, you'll need to ensure your minifier won't mangle the parameter names of your services, for UglifyJS (default for webpack) this can be done like this:
```javascript
new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  },
  sourceMap: true,
  mangle: {
    except: ['Service'], // blacklist your services from being mangled
  }
})
```

### What's new?
- 21/04/2017
	- added `unregister` to remove bindings and `bindings` to get all registered services.
	- added `has` method to check if a container has a binding
- 28/04/2017
    - added instance binding
    - updated documentation with warning about name mangling
