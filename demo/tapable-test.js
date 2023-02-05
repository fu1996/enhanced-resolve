// eslint-disable-next-line node/no-unpublished-require
const { AsyncSeriesBailHook } = require("tapable");

function toCamelCase(str) {
	return str.replace(/-([a-z])/g, str => str.substr(1).toUpperCase());
}

class Demo {
	constructor() {
		this.hooks = {};
	}
	ensureHook(name) {
		if (typeof name !== "string") {
			return name;
		}
		name = toCamelCase(name);
		if (/^before/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.ensureHook(
				name[6].toLowerCase() + name.substr(7)
			).withOptions({
				stage: -10
			}));
		}
		if (/^after/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.ensureHook(
				name[5].toLowerCase() + name.substr(6)
			).withOptions({
				stage: 10
			}));
		}
		const hook = this.hooks[name];
		if (!hook) {
			return (this.hooks[name] = new AsyncSeriesBailHook(
				["request", "resolveContext"],
				name
			));
		}
		return hook;
	}

	getHook(name) {
		if (typeof name !== "string") {
			return name;
		}
		name = toCamelCase(name);
		if (/^before/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.getHook(
				name[6].toLowerCase() + name.substr(7)
			).withOptions({
				stage: -10
			}));
		}
		if (/^after/.test(name)) {
			return /** @type {ResolveStepHook} */ (this.getHook(
				name[5].toLowerCase() + name.substr(6)
			).withOptions({
				stage: 10
			}));
		}
		const hook = this.hooks[name];
		if (!hook) {
			throw new Error(`Hook ${name} doesn't exist`);
		}
		return hook;
	}
}

const d = new Demo();
d.ensureHook("before-a").tapAsync("before-a", (a, b, callBack) => {
	console.log("before-aa", a, b, callBack);
	// 如果执行了 callBack 就会跳转到下一个 a
	callBack();
});
d.ensureHook("a").tapAsync("a", (a, b, c) => {
	console.log("aa", a, b, c);
	c();
});
d.ensureHook("after-a").tapAsync("after-a", (a, b, c) => {
	console.log("after-aa", a, b, c);
});
const a = d.getHook("a");
// const ba = d.getHook("before-a");
// const aa = d.getHook("after-a");

console.log(a.callAsync("a", "b"));
