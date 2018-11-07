angular.module('Filters', [])
	.filter('to_trusted', ['$sce', function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter('findId', function() {
		return function(input, id) {
			var i=0, len=input.length;
			for (; i<len; i++) {
			  if (+input[i].id == +id) {
				return input[i];
			  }
			}
			return null;
		 };
	}).filter('getIndex', function() {
		return function(input, id, attr) {
			var len=input.length;
			attr = (typeof attr !== 'undefined') ? attr : 'id';
			for (i=0; i<len; i++) {
			  if(input[i][attr] === id) {
				return i;
			  }
			}
			return null;
		 };
	}).filter('exclude', function() {
		return function(input, exclude, prop) {
			if (!angular.isArray(input))
				return input;

			if (!angular.isArray(exclude))
				exclude = [];

			if (prop) {
				exclude = exclude.map(function byProp(item) {
					return item[prop];
				});
			}

			return input.filter(function byExclude(item) {
				return exclude.indexOf(prop ? item[prop] : item) === -1;
			});
		};
	}).filter('category', function() {
		return function(input, category, prop) {
			//console.log(input, category, prop);
			if (!angular.isArray(input)) return input;
			if(!category) return input;
			return input.filter(function(item){
				return item[prop] == category;
			});
			//return input[prop] == category;
		};
	}).filter('toArray', function () {
		return function (obj, addKey) {
			if (!angular.isObject(obj)) return obj;
			if ( addKey === false ) {
			return Object.keys(obj).map(function(key) {
				return obj[key];
			});
			} else {
			return Object.keys(obj).map(function (key) {
				var value = obj[key];
				return angular.isObject(value) ?
				Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
				{ $key: key, $value: value };
			});
			}
		};
	}).filter('pluck', function() {
		return function(array, key, unique) {
			var res = new Array();
			angular.forEach(array, function(v) {
				if(unique && res.indexOf(v[key]) !== -1) return false;
				res.push(v[key]);
			});
			return res;
		};
	}).filter('search', function() {
		return function(input, search) {
			if (!input) return input;
			if (!search) return input;
			var expected = ('' + search).toLowerCase();
			var result = {};
			angular.forEach(input, function(value, key) {
				var actual = ('' + value).toLowerCase();
				if (actual.indexOf(expected) !== -1) {
					result[key] = value;
				}
			});
			return result;
		}
	}).filter('numbersep', function() {
		return function(n) {
			if(typeof n !== 'number') return n;
			return n.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1,');
		}
	}).filter('datediff', function() {
		return function(d,period) {
			if(!d) return 0;
			return moment().diff(moment(d), period, false);
		}
	}).filter('dateformat', function() {
		return function(d,format) {
			if(!d) return d;
			return moment(d).format(format);
		}
	});


