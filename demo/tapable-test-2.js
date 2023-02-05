// eslint-disable-next-line node/no-unpublished-require
const { AsyncSeriesBailHook } = require("tapable");

const h = new AsyncSeriesBailHook(["request", "resolveContext"]);
h.tapAsync("a", (a, b, c) => {
	console.log("aa", a, b, c);
});
h.tapAsync("a", (a, b, c) => {
	console.log("bb", a, b, c);
});
console.log(h.callAsync("a", "b"));
