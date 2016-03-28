var Q = require("q");

var query = function(params, method, session) {
	var deferred = Q.defer();
	deferred.resolve('{"test":"test"}');
	return deferred.promise
}

module.exports = { query: query }