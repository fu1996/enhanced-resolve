// eslint-disable-next-line node/no-unpublished-require
const { ResolverFactory, CachedInputFileSystem } = require("../../lib");
const fs = require("fs");
const path = require("path");

const myResolver = ResolverFactory.createResolver({
	fileSystem: new CachedInputFileSystem(fs, 4000),
	extensions: [".json", ".js", ".ts"]
});

const context = {
	fileDir: __dirname,
	fileName: "hook-log"
};
const resolveContext = {};
const lookupStartPath = path.resolve(__dirname);
const request =
	"/Users/fujunkui/Desktop/github-project/enhanced-resolve/demo/absolute-path/a.js";
myResolver.resolve(
	context,
	lookupStartPath,
	request,
	resolveContext,
	(err, path, result) => {
		if (err) {
			console.log("createResolve err: ", err);
		} else {
			console.log("找到路径: ", path);
		}
	}
);
