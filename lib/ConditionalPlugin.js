/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

/** @typedef {import("./Resolver")} Resolver */
/** @typedef {import("./Resolver").ResolveRequest} ResolveRequest */
/** @typedef {import("./Resolver").ResolveStepHook} ResolveStepHook */

module.exports = class ConditionalPlugin {
	constructor(source, test, message, allowAlternatives, target) {
		this.source = source;
		this.test = test;
		this.message = message;
		this.allowAlternatives = allowAlternatives;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		const { test, message, allowAlternatives } = this;
		const keys = Object.keys(test);
		resolver
			.getHook(this.source)
			.tapAsync("ConditionalPlugin", (request, resolveContext, callback) => {
				for (const prop of keys) {
					if (request[prop] !== test[prop]) return callback();
				}
				resolver.doResolve(
					target,
					request,
					message,
					resolveContext,
					allowAlternatives
						? callback
						: (err, result) => {
								if (err) return callback(err);

								// Don't allow other alternatives
								if (result === undefined) return callback(null, null);
								callback(null, result);
						  }
				);
			});
	}
};
