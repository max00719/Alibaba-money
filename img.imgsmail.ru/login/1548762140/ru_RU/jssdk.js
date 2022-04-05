(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(105), __webpack_require__(27)], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, Promise) {
	'use strict';

	var setTimeout = window.setTimeout,
		setImmediate = window.setImmediate || setTimeout;

	/**
	 * @typedef  {Function} DebouncedFunction
	 * @property {number} pid
	 * @property {Function} cancel
	 */


	/**
	 * Базовые утилиты
	 * @module util
	 */
	var util = {

		/**
		 * Объединяет содержимое двух или более объектов.
		 * @memberOf util
		 * @param  {...Object} args
		 * @returns {Object}
		 */
		extend: function (args) {
			return $.extend.apply($, arguments);
		},


		/**
		 * Клонирование через JSON
		 * @param   {*} src
		 * @returns {*}
		 */
		cloneJSON: function (src) {
			return typeof src === 'object' ? JSON.parse(JSON.stringify(src)) : src;
		},


		/**
		 * Быстрое клонирование объекта
		 * @memberOf util
		 * @param   {Object}  obj
		 * @returns {Object}
		 */
		cloneObject: function (obj) {
			var ret = {}, key;

			if (obj && obj instanceof Object) {
				for (key in obj) {
					ret[key] = obj[key];
				}
			}

			return ret;
		},


		/**
		 * Метод для приведения строк к camelCase нотации
		 * @memberOf util
		 * @param  {string} str          Строка в snake нотации
		 * @param  {string} [delimiter]  Разделитель, по умолчанию '_'
		 * @return {string}              Строка в camelCase
		 */
		toCamelCase: function (str, delimiter) {
			delimiter = delimiter || '_';

			var regexp = new RegExp('(\\' + delimiter + '\\w)', 'g');

			return str.replace(regexp, function (match) {
				return match[1].toUpperCase();
			});
		},


		/**
		 * Выполнить функцию в следующем «тике«
		 * @param   {Function} fn
		 * @param   {boolean}  [returnFunc]
		 * @returns {undefined|Function}
		 */
		nextTick: function (fn, returnFunc) {
			if (returnFunc) {
				return function () {
					var args = arguments,
						_this = this;

					setImmediate(function () {
						fn.apply(_this, args);
					});
				};
			}
			else {
				setImmediate(fn);
			}
		},


		/**
		 * Отложить выполнение метода
		 * @param  {Function} fn
		 * @param  {number} [ms] минимальная задаржка перед выполнением
		 * @param  {Object} [thisArg]
		 * @return {DebouncedFunction}
		 */
		debounce: function (fn, ms, thisArg) {
			var debounced = function () {
				var args = arguments,
					length = args.length,
					ctx = thisArg || this;

				clearTimeout(debounced.pid);
				debounced.pid = setTimeout(function () {
					if (length === 0) {
						fn.call(ctx);
					}
					else if (length === 1) {
						fn.call(ctx, args[0]);
					}
					else if (length === 2) {
						fn.call(ctx, args[0], args[1]);
					}
					else if (length === 3) {
						fn.call(ctx, args[0], args[1], args[2]);
					}
					else {
						fn.apply(ctx, args);
					}
				}, ms);
			};

			debounced.cancel = _cancelDebounce;

			return debounced;
		},


		/**
		 * Быстрый `bind`
		 * @param  {*}         thisArg
		 * @param  {Function}  fn
		 * @param  {Array|null}     [args]
		 * @param  {Array}     [limit]
		 */
		bind: function (thisArg, fn, args, limit) {
			/* jshint eqnull:true */
			if (args == null) {
				args = [];
			}
			else if (!Array.isArray(args)) {
				throw 'util.bind: `args` must be array or null';
			}

			return function () {
				var _args = args;
				var _limit = limit;

				/* jshint eqnull:true */
				if (_limit == null) {
					_limit = arguments.length;
				}

				/* istanbul ignore else */
				if (_limit > 0) {
					_args = args.slice();

					for (var i = 0; i < _limit; i++) {
						_args.push(arguments[i]);
					}
				}

				return fn.apply(thisArg || this, _args);
			};
		},

		/**
		 * Тот же `bind`, но не учутываются аргументы при вызове
		 * @param  {Function}  fn
		 * @param  {Array}     [args]
		 * @param  {*}         [thisArg]
		 */
		bindWithoutArgs: function (fn, args, thisArg) {
			return Array.isArray(args)
				? function () { return fn.apply(thisArg || this, args); }
				: function () { return fn.call(thisArg || this); }
			;
		},


		/**
		 * Создать массив элементов
		 * @param {number} length
		 * @returns {number[]}
		 */
		range: function (length) {
			var array = [],
				i = 0;

			for (; i < length; i++) {
				array.push(i);
			}

			return array;
		},

		/**
		 * Получить свойства объектов в коллекции
		 * @param {Array}  collection
		 * @param {string} property 
		 * @returns {Array}
		 */
		pluck: function (collection, property) {
			if (!Array.isArray(collection)) {
				return [];
			}

			return collection.map(function (obj) {
				return obj[property];
			});
		},

		/**
		 * Создать объект
		 * @param {Array|Array[]} keys
		 * @param {Array}         [values]
		 * @returns {Object}
		 */
		object: function (keys, values) {

			keys = (keys === void(0) || keys === null) ? [] : [].concat(keys);
			values = values === void(0) ? [] : [].concat(values);

			return keys.reduce(function (obj, key, index) {
				if (Array.isArray(key)) {
					obj[key[0]] = key[1];

					return obj;
				}

				obj[key] = values[index];

				return obj;
			}, {});
		},

		/**
		 * Промифицировать асинхронную функцию, которая возвращает значения через callback (err, res)
		 * @param {Function} fn - функция, которую нужно промифицировать
		 * @param {*} [context] - контекст вызова функции
		 * @returns {Function} - промфицированя функция
		 */
		promisify: function (fn, context) {
			return function promisifyWrapper() {
				var args = Array.prototype.slice.call(arguments);

				if (!context) {
					context = this;
				}

				return new Promise(function promisifyWrapperCallback(resolve, reject) {

					args.push(function (err, res) {
						if (err) {
							reject(err);
						} else {
							resolve(res);
						}
					});

					fn.apply(context, args);
				});
			};
		}
	};


	function _cancelDebounce() {
		/* jshint validthis:true */
		clearTimeout(this.pid);
	}


	// Export
	util.version = '0.7.0';
	return util;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(514).setImmediate))

/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(243),
	__webpack_require__(41),
	__webpack_require__(244),
	__webpack_require__(245),
	__webpack_require__(27),
	__webpack_require__(89),
	__webpack_require__(104),
	__webpack_require__(105),
	__webpack_require__(521)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** function */uuid,
	/** logger */logger,
	/** performance */performance,
	/** config */config,
	/** Promise */Promise,
	/** Emitter */Emitter,
	/** util */util,
	/** function */$
) {
	"use strict";


	/**
	 * «Пачка»
	 * @type {Array|null}
	 * @private
	 */
	var _batch = null;


	/**
	 * Очередь запросов
	 * @type {Array}
	 * @private
	 */
	var _queue = [];
	_queue.active = 0; // активных запросов


	/**
	 * Массив активных запросов
	 * @type {request.Request[]}
	 * @private
	 */
	var _active = [];


	/**
	 * Название события «потеря WiFi авторизации»
	 * @const
	 */
	var LOSS_WIFI_AUTH = 'losswifiauth';


	/**
	 * Кеш активных GET-запросов
	 * @type {Object}
	 * @private
	 */
	var _activeCache = {};


	var _stringify = JSON.stringify;


	/**
	 * Получить данные для логирования
	 * @param   {Object}  req
	 * @param   {string}  [uuid]
	 * @returns {Object}
	 * @private
	 */
	function _getLog(req, uuid) {
		return {
			//id: uuid || req.uuid,
			url: req.url,
			data: util.cloneJSON(req.data),
			type: req.type,
			headers: req.options && req.options.headers || req.headers,
			startTime: req.startTime,
			duration: req.duration,
			status: req.httpStatus || req.status,
			statusText: req.statusText,
			readyState: req.readyState,
			responseText: req.status != 200 ? req.responseText : void 0
		};
	}


	function _removeActive(xhr) {
		var idx = _active.indexOf(xhr);
		(idx > -1) && _active.splice(idx, 1);
	}



	/**
	 * Low-level интерфейс для работы с ajax/json/и т.п. запросами
	 * @class   request
	 * @mixes	Emitter
	 * @param   {string}         url        куда отправить запрос
	 * @param   {string|Object}  [data]     данные запроса
	 * @param   {Object}         [options]  дополнительные опции
	 * @returns {request.Request}
	 */
	function request(url, data, options) {
		options = util.extend(
			{
				type: 'POST',
				logger: 'request',
				loggerMeta: options && options.loggerMeta || logger.meta(-1),
				headers: {},
				retries: request.setup('retries'),
				Request: Request,
				withoutRequestId: false
			},
			options,
			{
				url: url,
				data: data
			}
		);


		var req,
			cacheKey,
			OptRequest = options.Request;

		options.type = options.type.toUpperCase();

		if (options.type == 'GET') {
			cacheKey = url + '|' + _stringify(data) + '|' + _stringify(options && options.headers);
			req = _activeCache[cacheKey];

			/**
			 * Запрет кеширования GET запросов
			 */
			if (options.cache === void 0) {
				options.cache = false;
			}

			if (!req) {
				req = new OptRequest(options);
				_activeCache[cacheKey] = req;

				req.always(function () {
					logger.add('_activeCache.remove', cacheKey);
					delete _activeCache[cacheKey];
				});
			}
		}
		else {
			req = new OptRequest(options);
		}

		return req;
	}


	/**
	 * Отправить запрос
	 * @name request.call
	 * @alias request
	 * @static
	 * @method
	 * @memberof request
	 */
	request.call;


	/**
	 * Отправить GET-запрос
	 * @alias request
	 * @static
	 * @method
	 * @memberof request
	 */
	request.get;


	/**
	 * Отправить POST-запрос
	 * @alias request
	 * @static
	 * @method
	 * @memberof request
	 */
	request.post;


	// Short-методы "get" и "post"
	['call', 'get', 'post'].forEach(function (name) {
		request[name] = function (url, data, options) {
			var meta = logger.meta(-1);

			meta.fn = 'request.' + name;

			options = util.cloneObject(options);
			options.type = options.type || (name == 'call' ? 'post' : name);
			options.loggerMeta = options.loggerMeta || meta;

			return request(url, data, options);
		};
	});


	/**
	 * Глобальные настройки для запросов, [$.ajaxSetup](http://api.jquery.com/jQuery.ajaxSetup/)
	 * @name     request.setup
	 * @static
	 * @method
	 * @param   {Object|string} opts     нзвание, либо объект опций (см. [jQuery.ajax](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings))
	 * @param   {*}             [value]  значение
	 * @returns {*}
	 */
	request.setup = function (opts, value) {
		var settings = $.ajaxSettings;

		if (typeof opts === 'string') {
			if (value !== void 0) {
				settings[opts] = value;
			} else {
				return settings[opts];
			}
		}
		else if (opts === void 0) {
			return settings;
		}
		else {
			$.ajaxSetup(opts);
		}
	};


	// «Наши» настройки
	request.setup({
		retries: 1, // максимум попыток `xhr.retry()`
		batchUrl: '/batch', // url по умолчанию для отравки «пачки»
		safeMode: false, // При включенном режиме, все запросы выстраиваются в очередь, что позволяет избежать гонки.

		locationReload: function () {
			(window.mockWindow || /* istanbul ignore next */ window).location.reload();
		},

		lossWiFiAuthDetect: function (xhr, err) {
			var responseText = xhr.responseText;
			return (err == 'parsererror') && /<meta[^>]+refresh/i.test(responseText);
		}
	});


	function _add2Queue(/** request.Request */req, /** Object */options, /** Array */queue) {
		var promise = new Promise(function (resolve, reject) {
			queue.push({
				req: req,
				opts: options,
				resolve: resolve,
				reject: reject
			});
		});

		return promise.then(
			function (body) { return req.end(false, body); },
			function (err) { return req.end(err); }
		);
	}

	function _queueProcessing() {
		if (_queue.length) {
			var item = _queue.shift();
			var options = item.opts;

			_queue.active++;
			item.req.send(options).then(_queueProcessingResolver(item), _queueProcessingResolver(item));

			if (options.type === 'GET' && _queue[0] && _queue[0].opts.type === 'GET') {
				_queueProcessing();
			}
		}
	}

	function _queueProcessingResolver(item) {
		return function _queueProcessingCallback(result) {
			_queue.active--;

			item[result.isOK() ? 'resolve' : 'reject'](result);
			!_queue.active && _queueProcessing();
		};
	}


	/**
	 * Объект запроса
	 * @class request.Request
	 * @constructs request.Request
	 * @mixes   Promise
	 * @param   {Object}   options
	 */
	function Request(options) {
		var _this = this,
			_promise;


		/**
		 * Уникальный идентификатор запроса
		 * @member {string} request.Request#uuid
		 */
		_this.uuid = uuid();

		if (options.withoutRequestId === false) {
			options.headers['X-Request-Id'] = _this.uuid;
		}


		if (options.batch !== false && _batch) {
			_this.batched = true;
			_promise = _add2Queue(_this, options, _batch);
		}
		else if ((_queue.length || _queue.active) || (options.type === 'POST' && request.setup('safeMode'))) {
			_promise = _add2Queue(_this, options, _queue);
		}
		else {
			_promise = _this.send(options);
		}


		_this.__logger__ = _promise.__logger__;


		/**
		 * «Обещание»
		 * @member {Promise} request.Request#url
		 * @private
		 */
		_this._promise = _promise;
		_promise.metaOffset = 1; // смещение на один вверх по стеку

		/**
		 * Куда делаем запрос
		 * @member {string} request.Request#url
		 */
		_this.url = options.url;

		/**
		 * Тип запроса GET, POST и т.п.
		 * @member {string} request.Request#type
		 */
		_this.type = options.type;

		/**
		 * Параметры запроса
		 * @member {Object} request.Request#data
		 */
		_this.data = options.data;

		/**
		 * Дополнительные опции запроса
		 * @member {Object} request.Request#options
		 */
		_this.options = options;

		/**
		 * Время начала запроса
		 * @member {number} request.Request#startTime
		 */
		_this.startTime = performance.now();

		if (_queue.length === 1 && !_queue.active) {
			if (_active.length) {
				Promise.all(_active).always(function () {
					_queueProcessing();
				});
			} else {
				_queueProcessing();
			}
		}

		request.trigger('start', _this);
	}


	Request.fn = Request.prototype = /** @lends request.Request# */ {
		__resultLogEntry__: {},

		/**
		 * Запрос в «пачке»
		 * @type {boolean}
		 */
		batched: false,


		/**
		 * Успешное выполнение запроса
		 * @param  {Function} fn
		 * @return {Request}
		 */
		done: function done(fn) {
			this._promise.__noLog = this.__noLog; // todo: Нужно избавлятся от этого флага
			this._promise.done(fn);

			return this;
		},


		/**
		 * Неудачное выполнение запроса
		 * @param  {Function} fn
		 * @return {Request}
		 */
		fail: function fail(fn) {
			this._promise.__noLog = this.__noLog;
			this._promise.fail(fn);

			return this;
		},


		/**
		 * Любой исход выполнения запроса
		 * @param  {Function} fn
		 * @return {Request}
		 */
		always: function always(fn) {
			this._promise.__noLog = this.__noLog;
			this._promise.always(fn);

			return this;
		},


		/**
		 * Подписаться на выполение запроса
		 * @param  {Function} doneFn
		 * @param  {Function} [failFn]
		 * @return {Promise}
		 */
		then: function then(doneFn, failFn) {
			return this._promise.then(doneFn, failFn);
		},


		/**
		 * Перехвотить ошибки при выполнении
		 * @param  {Function} fn
		 * @return {Promise}
		 */
		'catch': function (fn) {
			return this._promise['catch'](fn);
		},


		/**
		 * Отправить запрос
		 * @param  {Object}  options
		 * @return {Promise}
		 */
		send: function send(options) {
			var _this = this,
				xhr,
				promise;

			/**
			 * Время завершения
			 * @member {number} request.Request#endTime
			 */
			_this.endTime = null;

			/**
			 * Продолжительность запроса
			 * @member {number} request.Request#duration
			 */
			_this.duration = null;

			/**
			 * Запрос в ожидании ответа
			 * @member {boolean} request.Request#pending
			 */
			_this.pending = true;

			/**
			 * Запрос отменен
			 * @member {boolean} request.Request#aborted
			 */
			_this.aborted = false;

			/**
			 * Количество повторных попыток
			 * @member {number} request.Request#retries
			 */
			_this.retries = options.retries;

			/**
			 * Raw-тело ответа (text)
			 * @member {*} request.Request#responseText
			 */
			_this.responseText = null;

			/**
			 * Тело ответа
			 * @member {*} request.Request#body
			 */
			_this.body = null;

			/**
			 * Статус ответа сервера
			 * @type {number}
			 */
			_this.status = null;

			/**
			 * Ошибка
			 * @member {*} request.Request#error
			 */
			_this.error = null;

			// Произвольный траспорт
			if (options.transport) {
				options.xhr = function () {
					return {
						getAllResponseHeaders: function () {
							return String(this.headers);
						},

						open: function () {
						},

						send: function () {
							options.transport(options, function (res) {
								this.status = res.status;
								this.readyState = 4;
								this.headers = res.headers || 'Content-Type: application/json';
								this.responseText = res.responseText;
								this.onreadystatechange && this.onreadystatechange();
							}.bind(this));
						}
					};
				};
			}

			/**
			 * Объект запроса
			 * @member {XMLHttpRequest} request.Request#xhr
			 */
			_this.xhr = xhr = $.ajax(options);

			_active.push(xhr);

			promise = new Promise(function (resolve, reject) {
				xhr
					.done(function () {
						_removeActive(xhr);
						resolve(xhr);
					})
					.fail(function (x, err) {
						_removeActive(xhr);
						reject(err);
					})
				;
			});


			logger.wrap('[[' + options.logger + ']]', _getLog(options), promise);

			this.__resultLogEntry__ = logger.addEntry('log', options.logger + ':pending', null, promise.__logger__.id);
			this.__resultLogEntry__.meta = promise.__logger__.meta = options.loggerMeta;

			promise.__noLog = true;

			return promise.then(
				function (body) { return _this.end(false, body); },
				function (err) { return _this.end(err); }
			);
		},


		/**
		 * Получить заголовок ответа по его имени
		 * @param   {string}  name
		 * @returns {string}
		 */
		getResponseHeader: function (name) {
			return this.xhr.getResponseHeader(name);
		},


		/**
		 * Получить все заголовки от сервера
		 * @returns {string}
		 */
		getAllResponseHeaders: function () {
			return this.xhr.getAllResponseHeaders();
		},


		/**
		 * Отменить запрос
		 */
		abort: function () {
			this.aborted = true;
			this.xhr && this.xhr.abort();
			this.end(false);
		},


		/**
		 * Завершить запрос
		 */
		end: function (err, body) {
			var options = this.options;

			/* jshint eqnull:true */
			this.status = this.status == null ? this.xhr.status : this.status;
			this.statusText = this.statusText || this.xhr.statusText;
			this.readyState = this.xhr.readyState;
			this.responseText = this.xhr.responseText;

			this.endTime = performance.now();
			this.duration = this.endTime - this.startTime;
			this.pending = false;

			this.__resultLogEntry__.args = _getLog(this);

			// Проверяем на потерю WiFi
			if (request.setup('lossWiFiAuthDetect')(this, err)) {
				err = LOSS_WIFI_AUTH;
			}

			if (options.postProcessing) {
				// Пост-обработка
				options.postProcessing(this, body);
			}

			if (err === false) { // Это успех, бро!
				this.body = body;
				this.__resultLogEntry__.label = '[[' + options.logger + ':done]]';
			}
			else { // Всё плохо, но не стоит отчаиваться, возможно кто-то перехватит ошибку
				this.error = err;
				this.__resultLogEntry__.label = '[[' + options.logger + ':fail]]';

				// Emit error
				var evt = new Emitter.Event(err === LOSS_WIFI_AUTH ? err : 'error');

				request.trigger(evt, this);

				// Вернули «обещание», начинаем «веселье»
				if (evt.result && evt.result.then) {
					request.trigger('end', this);

					return evt.result; // вернем это «обещание»
				}
				else if (err === LOSS_WIFI_AUTH && !evt.isDefaultPrevented()) {
					request.setup('locationReload')(this); // перезагружаем страницу
				}
			}

			request.trigger('end', this);

			return Promise[this.isOK() ? 'resolve' : 'reject'](Object.create(this, {then: {value: null} }));
		},


		/**
		 * Сервер ответил 200, 201 или 202 и не было ошибок при парсинге ответа
		 * @returns {boolean}
		 */
		isOK: function () {
			return (this.status >= 200 && this.status <= 202 || this.status == 206) && !this.error;
		},


		/**
		 * Повторить запрос
		 * @param   {Promise|Function}  [promise]
		 * @param   {boolean}           [self]
		 * @returns {request.Request}
		 */
		retry: function (promise, self) {
			var _this = this,
				options = self ? _this.options : util.cloneObject(_this.options);

			if (options.retries > 0) {
				options.retries--;
				options.logger = 'retry:' + options.logger;

				promise = promise || Promise.resolve();

				if (!promise.then) {
					promise = new Promise(promise);
				}

				return promise.then(
					function () { // success
						if (self) {
							return _this.send(options);
						}
						else {
							return request(_this.url, _this.data, options);
						}
					},

					function () { // fail
						return Promise.reject(_this);
					}
				);
			}

			return Promise.reject(_this);
		},


		/**
		 * Проверить свойство на истинность
		 * @name request.Request#is
		 * @method
		 * @param   {string}  keys
		 * @returns {boolean}
		 */
		is: config.is,


		/**
		 * Проверить свойство на наличие
		 * @name request.Request#has
		 * @method
		 * @param   {string}  keys
		 * @returns {boolean}
		 */
		has: config.has,


		/**
		 * Получить свойство
		 * @name request.Request#get
		 * @method
		 * @param   {string}  key
		 * @returns {boolean}
		 */
		get: config.get,


		/**
		 * Маппинг данных ответа (боже, ну и описание)
		 * @param  {Object|Function} mappers
		 * @return {Object}
		 */
		map: function (mappers) {
			if (mappers instanceof Function) {
				return (mappers.map || mappers).call(mappers, this.get('body'));
			} else {
				var result = {};

				$.each(mappers, function (name, mapper) {
					result[name] = (mapper.map || mapper).call(mapper, this.get('body.' + name));
				}.bind(this));

				return result;
			}
		},


		/**
		 * Сравнить на равество
		 * @param  {request.Request} req
		 * @return {boolean}
		 */
		equals: function (req) {
			return req && (this._promise === req._promise); // возможно есть лучшая проверка, но я не знаю
		}
	};


	/**
	 * Группировать запросы в «пачку»  ***Экспериментальный метод***
	 * @param	{Function} executor
	 * @param	{string}   [url]
	 * @returns {Promise}
	 */
	request.batch = function (executor, url) {
		var batch = _batch || [], // создаем «пачку», либо используем текущию
			results;

		if (_batch === null) {
			_batch = batch;
			batch.promise = new Promise(util.nextTick(function (resolve, reject) {
				if (batch.length > 0) {
					var req = request.post(url || request.setup('batchUrl'), {
						batch: _stringify(batch.map(function (entry) {
							var opts = entry.opts;

							return {
								url: opts.url,
								type: opts.type,
								data: opts.data,
								headers: opts.headers
							};
						}))
					}, { batch: false }) // это запрос идет в не пачки
						.done(function () {
							req.body.forEach(function (body, i) {
								batch[i].req.xhr = req.xhr;
								batch[i].resolve(body);
							});

							resolve();
						})
						.fail(function () {
							batch.forEach(function (entry) {
								entry.req.xhr = req.xhr;
								entry.reject(req);
							});

							reject(req);
						})
					;
				} else {
					resolve();
				}

				_batch = null;
			}, true));
		}

		results = executor();

		return batch.promise.then(function () { return results; });
	};


	// Подмешиваем Emitter
	Emitter.apply(request);


	/**
	 * Создать `request.Request` из XHR
	 * @param  {string} url
	 * @param  {Object} data
	 * @param  {Object|XMLHttpRequest} xhr
	 * @return {request.Request}
	 * @memberOf request
	 */
	request.from = function (url, data, xhr) {
		var req = Object.create(this.Request.prototype, {then: {value: null}});

		req.xhr = xhr;
		req.url = url;
		req.data = data;
		req.status = xhr.status;
		req.statusText = xhr.statusText;
		req.readyState = xhr.readyState;
		req.responseText = xhr.responseText;
		req.pending = false;

		/* istanbul ignore else */
		if (req.isOK()) {
			req.body = JSON.parse(req.responseText);
		}

		return req;
	};


	/**
	 * Интеграция произвольного функционала в рабочий процесс отправки и обработки запроса
	 * @param  {Object}    options    опции запроса
	 * @param  {Function}  transport  функция отправки запроса
	 * @return {request.Request}
	 * @memberOf request
	 */
	request.workflow = function (options, transport) {
		options.transport = transport;
		return this.call(options.url, options.data, options);
	};


	/**
	 * Создание моков, основано на [jQuery.mockjax](https://github.com/appendto/jquery-mockjax)
	 * @name     request.mock
	 * @static
	 * @method
	 * @param    {Object} options
	 * @returns  {number}
	 */
	request.mock = $.mockjax;

	request.mock.once = $.mockjax.once;
	request.mock.clear = $.mockjaxClear;


	// Быстрый доступ к Promise
	request.all = Promise.all;
	request.Promise = Promise;


	// «Запрос», чтобы можно было расширять
	request.Request = Request;


	/**
	 * Массив активных запросов
	 * @memberOf request
	 * @type {request.Request[]}
	 */
	request.active = _active;


	// Export
	request.version = '0.8.0';
	return request;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author RubaXa <trash@rubaxa.org>
 * @license MIT
 */
(function () {
	"use strict";


	var R_SPACE = /\s+/,
		R_KEYCHAIN_CHECK = /[\[.\]]/,
		R_KEYCHAIN_SPLIT = /(?:\.|['"]?]?\.?\[['"]?|['"]?])/
	;


	/**
	 * Split строки по пробелу
	 * @private
	 * @param   {string} val
	 * @returns {Array}
	 */
	function _split(val) {
		return (val + '').trim().split(R_SPACE);
	}



	/**
	 * Проверить ключи на наличие и истинность
	 * @private
	 * @param   {object}  obj
	 * @param   {string}  keys
	 * @param   {boolean} [exists]
	 * @returns {boolean}
	 */
	function _check(obj, keys, exists) {
		var ret, i, key, not, min, max;

		/* istanbul ignore else */
		if (keys) {
			keys = _split(keys);
			i = keys.length;

			while (i--) {
				key = keys[i];
				not = false;

				if (key.charAt(0) === '!') {// НЕ ключ
					not = true;
					key = key.substr(1);
				}

				if (key.indexOf(':') !== -1) { // переданы аргументы
					key = key.split(':');
					min = key[1];
					max = key[2];
					key = key[0];
				}

				// Получаем значение ключа
				ret = _grep(obj, key);

				if (min !== void 0) { // сравниваем со значением ключа
					ret = (max === void 0)
							? (ret == min)
							: (ret >= min && ret <= max)
						;
				}

				if (exists) { // Проверка наличия ключа
					ret = ret !== void 0;
				} else { // Приводик к boolean
					ret = !!ret;
				}

				if (ret ^ not) { // применяем модификатор (т.е. XOR)
					return true;
				}
			}
		}

		return false;
	}


	/**
	 * Получить/установить/удалить значение по ключу
	 * @private
	 * @param   {object}  obj
	 * @param   {string}  key
	 * @param   {boolean} [set]
	 * @param   {*}       [value]
	 * @returns {*}
	 */
	function _grep(obj, key, set, value) {
		var isUnset = arguments.length === 3;

		if (R_KEYCHAIN_CHECK.test(key)) {
			var chain = key.split(R_KEYCHAIN_SPLIT),
				i = 0,
				n = chain.length,
				curObj = obj,
				prevObj = obj,
				lastKey
			;

			for (; i < n; i++) {
				key = chain[i];
				if (key !== '') {
					lastKey = key;

					if (curObj) {
						prevObj = curObj;
						curObj = curObj[key];
						if (set && !isUnset && !curObj) {
							prevObj[key] = curObj = {};
						}
					}
					else {
						return void 0;
					}
				}
			}

			if (set) {
				if (isUnset) {
					delete prevObj[lastKey];
				} else {
					prevObj[lastKey] = value;
				}
			}

			return curObj;
		}
		else {
			if (set) {
				if (isUnset) {
					delete obj[key];
				} else {
					obj[key] = value;
				}
			}
			return obj[key];
		}
	}



	/**
	 * Работа с конфигами/настройками
	 * @class config
	 * @constructs config
	 * @param   {Object}  [props]  конфиг
	 * @returns {config}
	 */
	var config = function (props) {
		if (!(this instanceof config)) {
			return	new config(props);
		}

		if (props) {
			this.set(props);
		}
	};


	config.fn = config.prototype = /** @lends config# */ {
		constructor: config,

		/**
		 * Проверить свойства на истинность
		 * @param   {string}  keys  название свойств, разделенных пробелом
		 * @returns {boolean}
		 */
		is: function (keys) {
			return _check(this, keys);
		},


		/**
		 * Проверить наличие свойства
		 * @param   {string}  keys  название свойств, разделенных пробелом
		 * @returns {boolean}
		 */
		has: function (keys) {
			return _check(this, keys, true);
		},


		/**
		 * Получить свойство
		 * @param   {string}  key    имя свойства
		 * @param   {*}       [def]  значение по умолчанию
		 * @returns {boolean}
		 */
		get: function (key, def) {
			var retVal = _grep(this, key);
			return retVal === void 0 ? def : retVal;
		},


		/**
		 * Назначить свойство
		 * @param   {Object|string} props   список свойств
		 * @param   {*}  [value]   значение
		 * @return  {config}
		 */
		set: function (props, value) {
			var _attrs = props;

			/* istanbul ignore else */
			if (typeof props !== 'object') {
				_attrs = {};
				_attrs[props] = value;
			}

			/* istanbul ignore else */
			if (_attrs instanceof Object) {
				for (var key in _attrs) {
					/* istanbul ignore else */
					if (_attrs.hasOwnProperty(key)) {
						_grep(this, key, true, _attrs[key]);
					}
				}
			}

			return this;
		},


		/**
		 * Удалить свойство
		 * @param   {string}  key   имя свойства
		 * @returns {config}
		 */
		unset: function (key) {
			var args = arguments, i = args.length;

			while (i--) {
				_grep(this, args[i], true);
			}

			return this;
		}
	};


	/**
	 * Подмешать методы к объекту
	 * @static
	 * @memberof config
	 * @param  {Object}  target  цель
	 * @returns {Object}  возвращает переданный объекь
	 */
	config.apply = function (target) {
		target.is = config.is;
		target.has = config.has;
		target.get = config.get;
		target.set = config.set;
		target.unset = config.unset;
		return	target;
	};


	// Создаем глобальный конфиг
	var globalConfig = config({ __version__: '0.1.0' }), key;
	for (key in globalConfig) {
		config[key] = globalConfig[key];
	}


	// Версия модуля
	config.version = "0.1.0";


	// Export
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return config;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})();


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author RubaXa <trash@rubaxa.org>
 * @license MIT
 */
(function () {
	"use strict";


	function _then(promise, method, callback) {
		return function () {
			var args = arguments, retVal;

			/* istanbul ignore else */
			if (typeof callback === 'function') {
				try {
					retVal = callback.apply(promise, args);
				} catch (err) {
					promise.reject(err);
					return;
				}

				if (retVal && typeof retVal.then === 'function') {
					if (retVal.done && retVal.fail) {
						retVal.__noLog = true;
						retVal.done(promise.resolve).fail(promise.reject);
						retVal.__noLog = false;
					}
					else {
						retVal.then(promise.resolve, promise.reject);
					}
					return;
				} else {
					args = [retVal];
					method = 'resolve';
				}
			}

			promise[method].apply(promise, args);
		};
	}


	/**
	 * «Обещания» поддерживают как [нативный](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
	 * интерфейс, так и [$.Deferred](http://api.jquery.com/category/deferred-object/).
	 *
	 * @class Promise
	 * @constructs Promise
	 * @param   {Function}  [executor]
	 */
	var Promise = function (executor) {
		var _completed = false;

		function _finish(state, result) {
			dfd.done =
			dfd.fail = function () {
				return dfd;
			};

			dfd[state ? 'done' : 'fail'] = function (fn) {
				/* istanbul ignore else */
				if (typeof fn === 'function') {
					fn(result);
				}
				return dfd;
			};

			var fn,
				fns = state ? _doneFn : _failFn,
				i = 0,
				n = fns.length
			;

			for (; i < n; i++) {
				fn = fns[i];
				/* istanbul ignore else */
				if (typeof fn === 'function') {
					fn(result);
				}
			}

			fns = _doneFn = _failFn = null;
		}


		function _setState(state) {
			return function (result) {
				if (_completed) {
					return dfd;
				}

				_completed = true;

				dfd.resolve =
				dfd.reject = function () {
					return dfd;
				};

				if (state && result && result.then && result.pending !== false) {
					// Опачки!
					result.then(
						function (result) { _finish(true, result); },
						function (result) { _finish(false, result); }
					);
				}
				else {
					_finish(state, result);
				}

				return dfd;
			};
		}

		var
			_doneFn = [],
			_failFn = [],

			dfd = {
				/**
				 * Добавляет обработчик, который будет вызван, когда «обещание» будет «разрешено»
				 * @param  {Function}  fn  функция обработчик
				 * @returns {Promise}
				 * @memberOf Promise#
				 */
				done: function done(fn) {
					_doneFn.push(fn);
					return dfd;
				},

				/**
				 * Добавляет обработчик, который будет вызван, когда «обещание» будет «отменено»
				 * @param  {Function}  fn  функция обработчик
				 * @returns {Promise}
				 * @memberOf Promise#
				 */
				fail: function fail(fn) {
					_failFn.push(fn);
					return dfd;
				},

				/**
				 * Добавляет сразу два обработчика
				 * @param   {Function}   [doneFn]   будет выполнено, когда «обещание» будет «разрешено»
				 * @param   {Function}   [failFn]   или когда «обещание» будет «отменено»
				 * @returns {Promise}
				 * @memberOf Promise#
				 */
				then: function then(doneFn, failFn) {
					var promise = Promise();

					dfd.__noLog = true; // для логгера

					dfd
						.done(_then(promise, 'resolve', doneFn))
						.fail(_then(promise, 'reject', failFn))
					;

					dfd.__noLog = false;

					return promise;
				},

				notify: function () { // jQuery support
					return dfd;
				},

				progress: function () { // jQuery support
					return dfd;
				},

				promise: function () { // jQuery support
					// jQuery support
					return dfd;
				},

				/**
				 * Добавить обработчик «обещаний» в независимости от выполнения
				 * @param   {Function}   fn   функция обработчик
				 * @returns {Promise}
				 * @memberOf Promise#
				 */
				always: function always(fn) {
					dfd.done(fn).fail(fn);
					return dfd;
				},


				/**
				 * «Разрешить» «обещание»
				 * @param    {*}  result
				 * @returns  {Promise}
				 * @method
				 * @memberOf Promise#
				 */
				resolve: _setState(true),


				/**
				 * «Отменить» «обещание»
				 * @param   {*}  result
				 * @returns {Promise}
				 * @method
				 * @memberOf Promise#
				 */
				reject: _setState(false)
			}
		;


		/**
		 * @name  Promise#catch
		 * @alias fail
		 * @method
		 */
		dfd['catch'] = function (fn) {
			return dfd.then(null, fn);
		};


		dfd.constructor = Promise;


		// Работеам как native Promises
		/* istanbul ignore else */
		if (typeof executor === 'function') {
			try {
				executor(dfd.resolve, dfd.reject);
			} catch (err) {
				dfd.reject(err);
			}
		}

		return dfd;
	};


	/**
	 * Дождаться «разрешения» всех обещаний
	 * @static
	 * @memberOf Promise
	 * @param    {Array} iterable  массив значений/обещаний
	 * @returns  {Promise}
	 */
	Promise.all = function (iterable) {
		var dfd = Promise(),
			d,
			i = 0,
			n = iterable.length,
			remain = n,
			values = [],
			_fn,
			_doneFn = function (i, val) {
				(i >= 0) && (values[i] = val);

				/* istanbul ignore else */
				if (--remain <= 0) {
					dfd.resolve(values);
				}
			},
			_failFn = function (err) {
				dfd.reject([err]);
			}
		;

		if (remain === 0) {
			_doneFn();
		}
		else {
			for (; i < n; i++) {
				d = iterable[i];

				if (d && typeof d.then === 'function') {
					_fn = _doneFn.bind(null, i); // todo: тест

					d.__noLog = true;

					if (d.done && d.fail) {
						d.done(_fn).fail(_failFn);
					} else {
						d.then(_fn, _failFn);
					}

					d.__noLog = false;
				}
				else {
					_doneFn(i, d);
				}
			}
		}

		return dfd;
	};


	/**
	 * Дождаться «разрешения» всех обещаний и вернуть результат последнего
	 * @static
	 * @memberOf Promise
	 * @param    {Array}   iterable   массив значений/обещаний
	 * @returns  {Promise}
	 */
	Promise.race = function (iterable) {
		return Promise.all(iterable).then(function (values) {
			return values.pop();
		});
	};


	/**
	 * Привести значение к «Обещанию»
	 * @static
	 * @memberOf Promise
	 * @param    {*}   value    переменная или объект имеющий метод then
	 * @returns  {Promise}
	 */
	Promise.cast = function (value) {
		var promise = Promise().resolve(value);
		return value && typeof value.then === 'function'
			? promise.then(function () { return value; })
			: promise
		;
	};


	/**
	 * Вернуть «разрешенное» обещание
	 * @static
	 * @memberOf Promise
	 * @param    {*}   value    переменная
	 * @returns  {Promise}
	 */
	Promise.resolve = function (value) {
		return (value && value.constructor === Promise) ? value : Promise().resolve(value);
	};


	/**
	 * Вернуть «отклоненное» обещание
	 * @static
	 * @memberOf Promise
	 * @param    {*}   value    переменная
	 * @returns  {Promise}
	 */
	Promise.reject = function (value) {
		return Promise().reject(value);
	};


	/**
	 * Дождаться «разрешения» всех обещаний
	 * @param   {Object}  map «Ключь» => «Обещание»
	 * @returns {Promise}
	 */
	Promise.map = function (map) {
		var array = [], key, idx = 0, results = {};

		for (key in map) {
			array.push(map[key]);
		}

		return Promise.all(array).then(function (values) {
			/* jshint -W088 */
			for (key in map) {
				results[key] = values[idx++];
			}

			return results;
		});
	};



	// Версия модуля
	Promise.version = "0.3.1";


	/* istanbul ignore else */
	if (!window.Promise) {
		window.Promise = Promise;
	}


	// exports
	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return Promise;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})();


/***/ }),

/***/ 301:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(104),
	__webpack_require__(726),
	__webpack_require__(199),
	__webpack_require__(78),
	__webpack_require__(89)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** util */util,
	/** Function */filter,
	/** Function */inherit,
	/** RPC */RPC,
	/** Emitter */Emitter
) {
	"use strict";


	/**
	 * «Обещание» с ссылкой на список моделей, которые будут загружены
	 * @typedef  {Object}  ModelListPromise
	 * @property {Model.List} list
	 * @property {Function} then
	 * @property {Function} done
	 * @property {Function} fail
	 * @property {Function} always
	 */



	var array = [],

		array_push = array.push,
		array_join = array.join,
		array_sort = array.sort,
		array_slice = array.slice,
		array_splice = array.splice,
		array_indexOf = array.indexOf,
		array_some = array.some,
		array_every = array.every,
		array_reduce = array.reduce,

		_allModelEvents = 'sync change remove destroy',

		stringifyJSON = JSON.stringify,

		_compareAttr = function (/* Model */a, /* Model **/b, /* string */attr, /* boolean */desc) {
			var aVal = a.get(attr),
				bVal = b.get(attr),
				res = aVal - bVal;

			if (res !== res) {
				if (aVal && aVal.localeCompare) {
					res = aVal.localeCompare(bVal);
				} else {
					res = (aVal == bVal) ? 0 : (aVal > bVal ? 1 : -1);
				}
			}

			return res * (desc ? -1 : 1);
		}
	;


	/**
	 * Список моделей (коллекция)
	 * @class Model.List
	 * @constructs Model.List
	 * @mixes  Emitter
	 * @mixes  inherit
	 * @param  {Model[]}    [models]  массив моделей
	 * @param  {boolean}    [lazy]    ленивая инициализация
	 */
	function List(models, lazy) {
		this._index = {};
		this._safedStore = {};
		this.length = 0;

		// Метод должен быть уникальный для каждого экземпляра класса
		this._debounceTriggerUpdate = util.debounce(function () {
			this.trigger('update', this);
		}, 0);

		if (models instanceof Array || models instanceof List) {
			this.set(models, true);
		}
		else if (lazy) {
			this.on = this._lazyOn;
			this.get = this._lazyGet;
		}
	}


	List.fn = List.prototype = /** @lends Model.List# */ {
		constructor: List,


		/**
		 * Как сортировать коллекцию, подробнее смотрите метод `sort`
		 * @type {string|object|function}
		 */
		comparator: null,


		/**
		 * Связанная модель
		 * @type {Model}
		 */
		Model: null,


		/**
		 * Количество моделей в коллекции
		 * @type {number}
		 */
		length: 0,

		/**
		 * Привязаны ли модели в этом списке к глобальному списку экзепляров (Model.all)
		 * @type {boolean}
		 */
		local: false,

		/**
		 * Дополнительные индексы
		 * @type {object}
		 * @private
		 */
		_indexes: null,


		/**
		 * Ленивая инициазиция слушателей событий
		 * @param   {string}    events
		 * @param   {Function}  fn
		 * @returns {Model.List}
		 * @private
		 */
		_lazyOn: function (events, fn) {
			var on = Emitter.fn.on,
				i = this.length;

			this.on = on; // возвращаем метод

			while (i--) {
				this[i].on(_allModelEvents, this);
			}

			return on.call(this, events, fn);
		},


		/**
		 * Ленивая инициазиция метода индекса
		 * @param   {*}    id
		 * @returns {Model}
		 * @private
		 */
		_lazyGet: function (id) {
			var get = List.fn.get,
				i = this.length,
				model,
				_index = this._index
			;

			this.get = get; // возвращаем метод

			while (i--) {
				model = this[i];
				_index[model.id] = _index[model.cid] = model;
				(this._addToIndex !== void 0) && this._addToIndex(model);
			}

			return get.call(this, id);
		},


		/**
		 * Подготовить модель
		 * @param   {Object}  attrs
		 * @param   {options} options
		 * @returns {Model}
		 * @private
		 */
		_prepareModel: function (attrs, options) {
			var Model = this.Model,
				model = attrs,
				all = Model.all,
				id
			;

			if (!(attrs instanceof Model)) {
				// попробуем достать из глобальной коллекции
				id = attrs.cid || attrs[Model.fn.idAttr];
				model = this.get(id) || (!this.local && all.get(id));

				if (!model) {
					// Создаем модель
					model = new Model(attrs);

					!this.local && all.set([model]);
				}
				else {
					// просто обновляем
					model.set(attrs, options);
				}
			}

			return model;
		},


		/**
		 * Обработка и делигирование события от модели
		 * @param  {Emitter.Event}  evt
		 * @param  {Model}  model
		 * @private
		 */
		handleEvent: function (evt, model) {
			var type = evt.type;

			if (type === 'remove' || type === 'destroy') {
				this.remove(model);
			}
			else { // Метод `remove` сам испускает события
				(model.id !== null) && (this._index[model.id] = model); // переиндексируем

				evt.list = this;
				this.trigger(evt, model);
			}

			this._changed = type === 'change';

			if (this._changing !== true) { // Выставляется в `set`
				this._debounceTriggerUpdate();
			}
		},


		/**
		 * Перебор моделей
		 * @param   {Function} iterator
		 * @param   {*}  thisArg
		 * @returns {Model.List}
		 */
		each: function (iterator, thisArg) {
			for (var i = 0, n = this.length; i < n; i++) {
				iterator.call(thisArg, this[i], i, this);
			}
			return this;
		},


		/**
		 * Вернет массив, полученный преобразованием каждой модели в функции iterator
		 * @param  {Function} iterator
		 * @param  {*} thisArg
		 * @return {Array}
		 */
		map: function (iterator, thisArg) {
			var retArr = [];

			for (var i = 0, n = this.length; i < n; i++) {
				retArr.push(iterator.call(thisArg, this[i], i, this));
			}

			return retArr;
		},


		/**
		 * Проверяет, удовлетворяет ли хоть какой-нибудь элемент массива условию, заданному в передаваемой функции.
		 * @param   {Function} callback
		 * @param   {*} [thisArg]
		 * @returns {boolean}
		 */
		some: function (callback, thisArg) {
			return array_some.call(this, callback, thisArg || this);
		},


		/**
		 * Проверяет, удовлетворяют ли все элементы массива условию, заданному в передаваемой функции.
		 * @param   {Function} callback
		 * @param   {*} [thisArg]
		 * @returns {boolean}
		 */
		every: function (callback, thisArg) {
			return array_every.call(this, callback, thisArg || this);
		},


		/**
		 * Применяет функцию `callback` по очереди к каждому элементу массива слева направо,
		 * сохраняя при этом промежуточный результат.
		 * @param   {Function} callback
		 * @param   {*} [initValue]
		 * @returns {*}
		 */
		reduce: function (callback, initValue) {
			return array_reduce.apply(this, arguments);
		},


		/**
		 * Посчитать сумму
		 * @param   {string} attr
		 * @returns {number}
		 */
		sum: function (attr) {
			var sum = 0;

			this.each(function (model) {
				sum += model.get(attr);
			});

			return sum;
		},


		/**
		 * Посчитать среднее арифметическое
		 * @param   {string} attr
		 * @returns {number}
		 */
		avg: function (attr) {
			return this.sum(attr) / this.length;
		},


		/**
		 * Вернет новую коллекцию, состоящую из моделей,
		 * для которых итератор возвращает истинное значение
		 * @param  {Function|Object} iterator   итератор, либо объект "имя аттрибута" => "зачение"
		 * @param  {*}               [thisArg]  `this` для итератора
		 * @param  {boolean}         [once]     вернуть первое найденное значение
		 * @returns {Model.List|Model|undefined}
		 */
		filter: function (iterator, thisArg, once) {
			var list = new (this.constructor)(null, true),
				i = 0,
				n = this.length,
				model,
				length = 0,
				isWhere
			;

			iterator = filter.createIterator(iterator, thisArg);
			isWhere = iterator.isWhere;

			for (; i < n; i++) {
				model = this[i];

				if (isWhere === true) {
					/* istanbul ignor else */
					if (iterator(model.attributes, model)) {
						list[length++] = model;
					}
				}
				else if (iterator(model, i, this)) {
					list[length++] = model;
				}

				if (length === 1 && once) {
					return list[0];
				}
			}

			if (once) {
				return;
			}

			list.length = length;

			return list;
		},


		/**
		 * Получить первую модель из коллекции
		 * @returns {Model}
		 */
		first: function () {
			return this[0];
		},


		/**
		 * Получить последнию модель из коллекции
		 * @returns {Model}
		 */
		last: function () {
			return this[this.length - 1];
		},


		/**
		 * Найти модель (см. filter)
		 * @param   {Function|Object}  iterator
		 * @param   {*}                [thisArg]
		 * @returns {Model}
		 */
		find: function (iterator, thisArg) {
			return this.filter(iterator, thisArg, true);
		},


		/**
		 * Получить массив значений по имени свойства
		 * @param   {string}  attr  имя свойства модели
		 * @returns {Array}
		 */
		pluck: function (attr) {
			return this.map(function (model) {
				return model.get(attr);
			});
		},


		/**
		 * Вернет `true`, если коллекция содержит элемент model
		 * @param   {*}  model   модель, идентификатор или cid
		 * @return {boolean}
		 */
		contains: function (model) {
			return !!this.get(model);
		},


		/**
		 * Получить index модели
		 * @param   {Model|object|string|number}  [model]   модель, объект, id или cid
		 * @returns {number}
		 */
		indexOf: function (model) {
			if (!(model instanceof Object)) {
				model = { id: model, cid: model };
			}

			var idx = this.length,
				_model;

			while (idx--) {
				_model = this[idx];

				if (_model.id === model.id || _model.cid === model.cid) {
					return idx;
				}
			}

			return -1;
		},


		/**
		 * Сортировать
		 * @param   {Object|Function}  attrs       аттрибут, объект { attr: desc(boolean) } или функция
		 * @param   {Object|boolean}   [options]   возможные опции: silent, reverse, clone
		 * @returns {Model.List}
		 */
		sort: function (attrs, options) {
			if (!attrs) {
				attrs = this.comparator || this.Model.fn.idAttr;
			}


			var _this = this,
				typeOf = typeof attrs,
				comparator,
				silent,
				reverse;


			if (options) {
				silent = options === true || options.silent;
				reverse = options.reverse;

				if (options.clone) {
					_this = _this.clone();
				}
			}


			if (typeOf === 'string') {
				// Сортировка по аттрибуту
				comparator = function (a, b) {
					return _compareAttr(a, b, attrs, reverse);
				};
			}
			else if (typeOf === 'object') {
				// сортировка по нескольким аттрибутам
				var keys = Object.keys(attrs),
					keysLength = keys.length;

				comparator = function (a, b) {
					var i = 0,
						res = 0;

					for (; i < keysLength; i++) {
						res = _compareAttr(a, b, keys[i], attrs[keys[i]] ^ reverse);

						if (res !== 0) {
							return res;
						}
					}

					return res;
				};
			}
			else {
				// Передана функция сравнения
				comparator = function (a, b) {
					return attrs.call(this, a, b) * (reverse ? -1 : 1);
				};
			}

			// Сортируем
			array_sort.call(_this, comparator);

			!silent && _this.trigger('sort', _this);

			return _this;
		},


		/**
		 * Получить модель по индексу
		 * @param   {number}  index
		 * @returns {Model|undefined}
		 */
		eq: function (index) {
			return this[index];
		},


		/**
		 * Получить модель по id
		 * @param   {*}  id   идентификатор, cid или модель
		 * @returns {Model|undefined}
		 */
		get: function (id) {
			/* jshint eqnull:true */
			return (id == null)
				? void 0
				: this._index[id.cid || id[this.Model.fn.idAttr] || id]
			;
		},


		/**
		 * Получить модель по id даже если её нет
		 * @param   {*}  id   идентификатор или cid
		 * @returns {Model}
		 */
		getSafe: function (id) {
			var model = this.get(id);
			var store = this.Model.all._safedStore;

			/* istanbul ignore else */
			if (model === void 0) {
				id = id && (id[this.Model.fn.idAttr] || id);

				model = store[id];

				if (model === void 0) {
					model = new (this.Model)({id: id});
					store[id] = model;
				}
			}

			return model;
		},


		/**
		 * Создать модель и добавить в коллекцию
		 * @param   {Object}  attrs  свойства модели
		 * @param   {Object}  [options]
		 * @returns {Model}
		 */
		create: function (attrs, options) {
			var model = this._prepareModel(attrs);
			this.set([model], options);
			return model;
		},


		/**
		 * Установить новый список моделей
		 * @param   {Model[]}  models  массив свойств или моеделей
		 * @param   {Object}   [options]   опции (clone: false, reset: false, silent: false, sort: boolean|preset, merge: true, sync: false)
		 * @returns {Model.List}
		 */
		set: function (models, options) {
			var i,
				n,
				evt = new Emitter.Event('add'),
				cid,
				model,
				_models, // предудущий список моделей

				_index = this._index,
				length = this.length,
				newLength,

				clone = false,
				merge = true,
				reset = false,
				silent = false,
				changed = false,

				modelOptions = {},

				sort = !!this.comparator,
				sorted = false
			;


			// Клонируем массив, потому что дальше мы будем его модифицировать
			models = (models && models.slice) ? models.slice() : [];
			newLength = models.length;

			if (options) {
				clone = options.clone;
				merge = options.merge !== false;
				reset = options.reset;
				silent = options.silent || options === true;

				if (options.sort !== void 0) {
					sort = options.sort;
				}

				modelOptions.sync = options.sync;
				modelOptions.clean = options.clean;
			}


			if (reset) {
				// Сбрасываем все модели
				_models = array_splice.call(this, 0, length);
				i = length;

				reset = length > 0 || newLength > 0;
				changed = reset;

				// Отписываемся от событий модели
				while (i--) {
					_models[i].off(_allModelEvents, this);
				}

				// Сбрасываем index и длину
				length = 0;
				_index = this._index = {};
			}


			for (i = 0, n = newLength; i < n; i++) {
				this._changed = false; // Выставляет в `handleEvent` при изменении моделей (оптимизация)
				this._changing = true; // Проверяется в `handleEvent` при изменении моделей (оптимизация)

				model = this._prepareModel(models[i], modelOptions);

				cid = model.cid;
				changed = changed || this._changed;
				models[i] = model;

				// Проверяем в индексе
				if (_index[cid] === void 0) {
					// Добавялем в индекс
					_index[cid] = model;
					(model.id !== null) && (_index[model.id] = model);
					(this._addToIndex !== void 0) && this._addToIndex(model);

					// Добавляем в коллекцию
					changed = true;
					this[length] = model;
					this.length = ++length;

					// Подписываемся на события
					model.on(_allModelEvents, this);

					if (!silent) {
						// Событие "add"
						evt.list = this;
						evt.target = model;
						this.trigger(evt, model);
					}
				}


				// Сохранить порядок в котором переданны элементы
				if (sort === 'preset' && this[i] !== model) {
					sorted = true;

					this[this.indexOf(model)] = this[i];
					this[i] = model;
				}
			}


			if (merge === false) {
				// Проходимся по моделяем и удаляем которых нет
				i = length;

				while (i--) {
					if (models.indexOf(this[i]) === -1) {
						changed = true;
						this.remove(this[i]);
					}
				}
			}


			if (changed && sort === true && !sorted) {
				// Сортируем коллекцию, если были изменения
				sorted = true;
				this.sort(null, { silent: true });
			}

			this._changing = false;

			if (!silent) { // Без событий
				sorted && this.trigger('sort', this);
				reset && this.trigger({ type: 'reset', models: this, previousModels: _models }, this);

				if (sorted || changed) {
					this._debounceTriggerUpdate.cancel();
					this.trigger('update', this);
				}
			}


			if (clone) {
				return new (this.constructor)(models);
			}

			return this;
		},


		/**
		 * Преобразовать в массив
		 * @returns {Model[]}
		 */
		toArray: function () {
			return array_slice.call(this);
		},


		/**
		 * Преобразовать в JSON
		 * @param   {boolean}  [ref]  вернуть ссылку на аттрибуты модели
		 * @returns {Object[]}
		 */
		toJSON: function (ref) {
			return this.map(function (model) {
				return model.toJSON(ref);
			});
		},


		/**
		 * Обрезать, возвращает новую коллекцию
		 * @param   {number}  [start]
		 * @param   {number}  [end]
		 * @returns {Model.List}
		 */
		slice: function (start, end) {
			var array = start === void 0 ? this : array_slice.call(this, start, end === void 0 ? this.length : end),
				i = array.length,
				newList = new (this.constructor)(null, true)
			;

			while (i--) {
				newList[i] = array[i];
			}

			newList.length = array.length;

			return newList;
		},


		/**
		 * Сбросить коллекуию
		 * @param   {Array}  [models]
		 * @param   {Object} [options]
		 * @returns {Model.List}
		 */
		reset: function (models, options) {
			options = options || {};

			if (options === true) {
				options = { silent: true };
			}

			options.reset = true;
			options.clone = false;

			return this.set(models, options);
		},


		/**
		 * Удалить модель из коллекции
		 * @param   {Model}  model
		 * @returns {Model.List}
		 */
		remove: function (model) {
			var evt,
				idx = array_indexOf.call(this, model);

			/* istanbul ignore else */
			if (idx !== -1) {
				model.off(_allModelEvents, this);
				array_splice.call(this, idx, 1);

				delete this._index[model.id];
				delete this._index[model.cid];

				evt = new Emitter.Event('remove');
				evt.list = this;
				evt.target = model;

				this.trigger(evt, model);

				if (this._changing !== true) { // Выставляется в `set`
					this._debounceTriggerUpdate();
				}
			}

			return this;
		},


		/**
		 * Сохранить изменения единой пачкой
		 * @param   {*} [attr]
		 * @param   {*} [value]
		 * @param   {*} [options]
		 * @returns {Promise}
		 */
		save: function (attr, value, options) {
			return RPC.batch(function () {
				this.each(function (model) {
					model.save(attr, value, options);
				});
			}.bind(this));
		},


		/**
		 * Удалить всю коллекцию
		 * @param   {Object}  [query] дополнительные параметры запроса
		 * @retruns {Promise}
		 */
		drop: function (query) {
			return RPC.batch(function () {
				this.each(function (model) {
					model.remove(query);
				});
			}.bind(this));
		},


		/**
		 * Уничтожить коллекцию и модели в ней
		 * @returns {Model.List}
		 */
		destroy: function () {
			var i = this.length;

			while (i--) {
				/* jshint expr:true */
				this[i] && this[i].destroy();
			}

			return this;
		},


		/**
		 * Получить или обновить список
		 * @param   {Object} [query]   параметры запроса
		 * @param   {Object} [options] опции (reset: false, force: false)
		 * @returns {ModelListPromise}
		 */
		fetch: function (query, options) {
			options = options || {};

			var list = this,
				Model = list.Model,
				all = Model.all,
				promise = Model.fetchData(query, null, options.force)
					.then(function (array) {
						!list.local && all.set(array); // глобальный список
						list[options.reset ? 'reset' : 'set'](array, options);

						return list;
					})
					.fail(function (err) {
						list.emit('error', err);
					})
			;

			promise.list = list;

			return promise;
		},


		/**
		 * Клонировать коллекцию
		 * @returns {Model.List}
		 */
		clone: function () {
			return this.slice();
		}
	};


	/**
	 * @name  Model.List#forEach
	 * @alias each
	 * @method
	 */
	List.fn.forEach = List.fn.each;


	/**
	 * @name  Model.List#where
	 * @alias filter
	 * @method
	 */
	List.fn.where = List.fn.filter;


	/**
	 * @name  Model.List#findWhere
	 * @alias find
	 * @method
	 */
	List.fn.findWhere = List.fn.find;


	// Подмещиваем методы Emitter'а
	Emitter.apply(List.fn);


	// Подмещиваем наследование
	inherit.apply(List);


	/**
	 * Добавить индекс для быстрого доступа к модели/моделям
	 * @param    {string}  attr  имя свойства
	 * @param    {boolean} [uniq]  уникальный индекс
	 * @methodOf List
	 */
	List.addIndex = function (attr, uniq) {
		var _indexes = this.fn._indexes;

		/* istanbul ignore else */
		if (!_indexes) {
			_indexes = this.fn._indexes = [];
		}

		_indexes.push({
			attr: attr,
			uniq: uniq
		});

		/* jshint evil:true */
		this.fn._addToIndex = Function('model', _indexes.map(function (index) {
			var attr = stringifyJSON(index.attr),
				value = attr.indexOf('.') > -1
							? 'model.get(' + attr + ')'
							: 'model.attributes[' + attr + ']';

			/* istanbul ignore else */
			if (index.uniq) {
				return 'this._index[' + value + '] = model;';
			} else {
				throw "todo: Нужно думать";
			}
		}).join('\n'));
	};

	/**
	 * Получить массив значений по имени свойства из массива или списка моделей
	 * @param    {model.List|Model[]}	list	список моделей
	 * @param    {string} property свойство
	 */
	List.pluck = function (list, property) {

		return List.fn.pluck.call(list, property);
	};

	// Export
	List.version = '0.13.0';
	return List;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* istanbul ignore next */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(243),
	__webpack_require__(104),
	__webpack_require__(244),
	__webpack_require__(27),
	__webpack_require__(89)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** uuid */uuid,
	/** util */util,
	/** performance */performance,
	/** Promise */Promise,
	/** Emitter */Emitter
) {
	'use strict';

	var R_AUTO_LEVELS = /\b(fail|error|warn(ing)?|info|success|done)\b/i;
	var AUTO_LEVELS_COLORS = {
		fail: '#c00',
		error: '#c00',
		warn: '#a6a616',
		warning: '#a6a616',
		info: '#00f',
		success: '#060',
		done: '#060'
	};

	Error.prototype.toJSON = function () {
		return {
			name: this.name,
			message: this.message,
			stack: this.stack
		};
	};

	/**
	 * @typedef   {Object}  LoggerMeta
	 * @property  {string}  fn     название метода
	 * @property  {strong}  file   путь к файлу
	 * @property  {number}  line
	 * @property  {number}  column
	 */


	var gid = 1,
		getListeners = Emitter.getListeners,
		encodeURIComponent = window.encodeURIComponent,

		RSPACE = /\s+/,

		index = {},
		entries = []
	;

	function _getPromiseName(entry, added) {
		return '[[' + entry.label.replace(/(:pending|^\[\[|\]\]$)/g, '') + ':' + added + ']]';
	}


	/**
	 * Глобальный объект логирования
	 * @class logger
	 * @constructs logger
	 */
	var logger = /** @lends logger */{
		index: index,
		parentId: 0,
		metaOffset: 0,


		/**
		 * Статус работы логера
		 * @type {boolean}
		 * @methodOf logger
		 */
		disabled: false,


		/**
		 * Массив записей
		 * @type {logger.Entry[]}
		 * @methodOf logger
		 */
		entries: entries,


		/**
		 * Использовать UUID идетификатор в качестве id записи
		 * @type {boolean}
		 * @methodOf logger
		 */
		useUUID: false,


		/**
		 * Генерация UUID
		 * @name logger.uuid
		 * @method
		 * @static
		 * @returns  {string}
		 * @methodOf logger
		 */
		uuid: uuid,


		/**
		 * Перехват ошибок с `window`
		 * @param  {Window}  window
		 * @methodOf logger
		 */
		catchUncaughtException: function (window) {
			window.onerror = function windowOnError(message, url, line, column, err) {
				logger.add('error', {
					type: err && err.type,
					message: message,
					url: url,
					line: line,
					column: column,
					stack: err && err.stack.toString()
				});
				return false;
			};
		},


		/**
		 * Добавить лог-запись
		 * @param  {string}  label  метка
		 * @param  {*}       args   аргументы для логирования
		 * @param  {*}       [parentId]
		 * @param  {LoggerMeta} [meta]
		 * @return {logger.Entry}
		 * @methodOf logger
		 */
		add: function (label, args, parentId, meta) {
			if (logger.disabled) {
				return this;
			}

			logger.metaOffset = 1;
			return this.addEntry('log', label, args, parentId, meta);
		},


		/**
		 * Функция фитрации аргументов
		 * @param  {*}  args
		 * @return {*}
		 * @methodOf logger
		 */
		filterArguments: function (args) {
			return args;
		},


		/**
		 * Создать scope
		 * @param  {string} label
		 * @param  {*} args
		 * @param  {LoggerMeta|number} [meta]  числом можно передать смещение (metaOffset) по stack
		 * @param  {number} [parentId]
		 * @return {logger.Entry}
		 * @methodOf logger
		 */
		scope: function (label, args, meta, parentId) {
			/* jshint eqnull:true */
			if (meta == null) {
				meta = -2;
			}

			/* istanbul ignore next */
			if (meta >= -99) {
				meta = logger.meta(meta);
			}

			logger.metaOffset = 1;
			return this.addEntry('scope', label, args, parentId, meta);
		},


		/**
		 * Добавить запись
		 * @param   {string|Entry}  type        тип записи (scope, log)
		 * @param   {string}        [label]     метка
		 * @param   {*}             [args]      аргументы
		 * @param   {*}             [parentId]  id родителя
		 * @param   {LoggerMeta}    [meta]
		 * @return  {logger.Entry}
		 * @methodOf logger
		 */
		addEntry: function (type, label, args, parentId, meta) {
			logger.metaOffset += 1;

			var entry = type instanceof Entry ? type : new Entry(type, label, args, parentId || this.parentId, meta);

			index[entry.id] = entry;
			entry.idx = entries.push(entry) - 1;

			this._emit();

			return entry;
		},


		/**
		 * Получить «родительскую» запись
		 * @param   {*} id
		 * @param   {string} label
		 * @returns {*}
		 * @methodOf logger
		 */
		closest: function (id, label) {
			var entry;

			id = id.id || id;

			while ((entry = index[id]) && id) {
				id = entry.parentId;

				if (entry.label === label) {
					return entry;
				}
			}

			return null;
		},


		/**
		 * Получить лог-цепочу по id записи
		 * @param   {number}  id
		 * @param   {string}  [glue]
		 * @returns {Array}
		 * @methodOf logger
		 */
		chain: function (id, glue) {
			var log = [], entry;

			while ((entry = index[id]) && id) {
				id = entry.parentId;
				log.push(entry);
			}

			log.reverse();

			if (glue) {
				log = log.map(function (entry) {
					return '[' + entry.id + '] ' + entry.label;
				}).join(glue);
			}

			return log;
		},


		/**
		 * Получить лог-scope
		 * @param   {string}  name   scope-название
		 * @param   {*}       args   аргументы
		 * @param   {*}       [parentId]
		 * @param   {LoggerMeta}  [meta]
		 * @returns {Object}
		 * @methodOf logger
		 */
		getScope: function (name, args, parentId, meta) {
			logger.metaOffset += 1;
			return typeof name === 'string' ? this.addEntry('scope', name, args, parentId, meta) : name;
		},


		/**
		 * Обернуть фунцию или Promise в лог-scope
		 * @param   {string}     name  scope-название
		 * @param   {*}          args  метод или аргументы
		 * @param   {Function}   [fn]  метод
		 * @param   {number}     [parentId]
		 * @param   {LoggerMeta} [meta]
		 * @returns {Function|Promise}
		 * @methodOf logger
		 */
		wrap: function (name, args, fn, parentId, meta) {
			if (arguments.length === 1) {
				fn = name;
				name = index[logger.parentId];
			}
			else if (fn === void 0) {
				fn = args;
				args = void 0;
			}

			if (fn && !fn.__logger__ && !this.disabled) {
				logger.metaOffset += 1;

				meta = meta || logger.meta();

				if (typeof fn === 'function') {
					var wrapper = function () {
						var entry = logger.getScope(name, args, parentId, meta),
							_parentId = logger.parentId,
							retVal;

						logger.parentId = entry.id;
						logger.metaOffset += 1;

						retVal = logger.wrap(entry, fn.apply(this, arguments));

						logger.parentId = _parentId;

						return retVal;
					};

					fn.__logger__ = true;
					wrapper.__logger__ = true;

					return wrapper;
				}
				else if (fn.then) {
					logger.getScope(name, args, null, meta).wrap(fn);
				}
			}

			logger.metaOffset = 0;

			return fn;
		},


		/**
		 * Выполнить метод в лог-конексте
		 * @param   {string} label
		 * @param   {*} args
		 * @param   {Function} fn
		 * @returns {*}
		 * @methodOf logger
		 */
		call: function (label, args, fn) {
			logger.metaOffset += 1;
			return this.wrap(label, args, fn)();
		},


		/**
		 * Сбросить лог
		 * @methodOf logger
		 */
		reset: function () {
			gid = 1;

			this.index = index = {};
			this.entries = entries = [];
			this.parentId = 0;
		},


		/**
		 * Вывод лога в консоль
		 * @param   {boolean} [ret]  вернуть лог строкой
		 * @returns {string|undefined}
		 * @methodOf logger
		 */
		print: /* istanbul ignore next */function (ret) {
			var groups = {},
				retLog = '';


			entries.forEach(function (entry) {
				var id = entry.parentId;
				(groups[id] = groups[id] || []).push(entry);
			});

			function _time(ms) {
				return new Date(ms).toISOString().slice(11, -1);
			}

			(function _print(id, indent) {
				var entries = groups[id] || [],
					i = 0,
					n = entries.length,
					entry,
					log,
					args
				;

				for (; i < n; i++) {
					entry = entries[i];
					args = entry.args;
					log = ('[' + _time(entry.ts) + '] ' + entry.label);

					if (ret) {
						log += args ? ': ' + JSON.stringify(args) : '';
					}

					/* istanbul ignore else */
					if (groups[entry.id]) {
						/* istanbul ignore else */
						if (ret) {
							retLog += indent + log + '\n';
							_print(entry.id, '  ' + indent);
						}
						else {
							if (R_AUTO_LEVELS.test(log)) {
								var styles = 'color: ' + AUTO_LEVELS_COLORS[RegExp.lastMatch.toLowerCase()];
								console.group('%c' + log, styles);
								args && console.log('%c[details] ', styles, args);
							} else {
								console.group(log);
								args && console.log('[details] ', args);
							}

							_print(entry.id);
							console.groupEnd();
						}
					}
					else if (ret) {
						retLog += indent + log + '\n';
					}
					else if (R_AUTO_LEVELS.test(log)) {
						console.log('%c' + log, 'color: ' + AUTO_LEVELS_COLORS[RegExp.lastMatch.toLowerCase()], args);
					}
					else {
						console.log(log, args);
					}
				}
			})(0, '');


			return ret && retLog;
		},


		/**
		 * Подписаться на добавление записи
		 * @param   {string}   labels
		 * @param   {Function} fn
		 * @returns {logger}
		 * @methodOf logger
		 */
		on: function (labels, fn) {
			labels = labels.trim().split(RSPACE);

			var i = labels.length, label;

			while (i--) {
				label = labels[i].split(':');
				getListeners(this, label[1] || label[0]).push({
					fn: fn,
					label: label[1] || label[0],
					parent: label[1] && label[0]
				});
			}

			return this;
		},


		/**
		 * Отписаться от добавление записи
		 * @param   {string}   labels
		 * @param   {Function} fn
		 * @returns {logger}
		 * @methodOf logger
		 */
		off: function (labels, fn) {
			labels = labels.trim().split(RSPACE);

			var i = labels.length, label, list, j, handle;

			while (i--) {
				label = labels[i].split(':');
				list = getListeners(this, label[1] || label[0]);
				j = list.length;

				while (j--) {
					handle = list[j];

					if (handle.fn === fn && (handle.parent === (label[1] && label[0]))) {
						list.splice(j, 1);
					}
				}
			}

			return this;
		},


		/**
		 * Испускаем события
		 * @private
		 * @methodOf logger
		 */
		_emit: function () {
			var entry,
				parentEntry,
				list,
				e = entries.length,
				i,
				handle
			;

			while (e--) {
				entry = entries[e];

				if (!entry.emitted) {
					entry.emitted = true;
					list = getListeners(this, entry.label);
					i = list.length;

					while (i--) {
						handle = list[i];

						if (handle.parent) {
							parentEntry = this.closest(entry.id, handle.parent);

							/* istanbul ignore else */
							if (parentEntry) {
								handle.fn(parentEntry, entry);
							}
						}
						else {
							handle.fn(entry);
						}
					}
				}
			}
		},


		last: function () {
			return entries[entries.length - 1];
		},

		/**
		 * Получить текущую мета информацию
		 * @param  {number} [offset]
		 * @return {LoggerMeta}
		 * @methodOf logger
		 */
		meta: function () {
			return {fn: 'unknown', file: 'unknown', line: 0, column: 0};
		},

		/**
		 * Разобрать строчку из стека
		 * @return {LoggerMeta}
		 * @methodOf logger
		 */
		parseStackRow: function (value) {
			value += '';

			var match = value.match(/at\s+([^\s]+)(?:.*?)\(((?:http|file|\/)[^)]+:\d+)\)/),
				file;

			/* istanbul ignore next */
			if (!match) {
				match = value.match(/at\s+(.+)/);

				if (!match) {
					match = value.match(/^(.*?)(?:\/<)*@(.*?)$/) || value.match(/^()(https?:\/\/.+)/);
				} else {
					match[0] = '<anonymous>';
					match.unshift('');
				}
			}

			/* istanbul ignore next */
			if (match) {
				file = match[2].match(/^(.*?):(\d+)(?::(\d+))?$/) || [];
				match = {
					fn: (match[1] || '<anonymous>').trim(),
					file: file[1],
					line: file[2]|0,
					column: file[3]|0
				};
			}
			else {
				match = null;
			}

			return match;
		},


		/**
		 * Сериализовать лог
		 * @return {string}
		 * @methodOf logger
		 */
		serialize: function () {
			return JSON.stringify(entries);
		},


		/**
		 * Отправить на почту
		 * @param {string} email
		 * @methodOf logger
		 */
		mailTo: /* istanbul ignore next */ function (email) {
			var el = document.createElement('a');
			el.href = 'mailto:' + email
					+ '?subject=' + encodeURIComponent('[logger] ' + new Date())
					+ '&body=' + encodeURIComponent(this.serialize());
			el.innerHTML = 'send';
			el.click();
		}
	};


	/**
	 * Описание записи лога
	 * @class  logger.Entry
	 * @methodOf logger
	 * @param  {string}  type
	 * @param  {string}  [label]
	 * @param  {*}       [args]
	 * @param  {*}       [parentId]
	 */
	function Entry(type, label, args, parentId, meta) {
		/**
		 * Идетификатор записи
		 * @member {*} logger.Entry#id
		 */
		this.id = (args && args.uuid) || /* istanbul ignore next */(logger.useUUID ? uuid() : gid++);


		/**
		 * Относительное время добавления
		 * @member {number} logger.Entry#ts
		 */
		this.ts = performance.now();


		/**
		 * Тип записи
		 * @member {string} logger.Entry#type
		 */
		this.type = type;


		/**
		 * Метка записи
		 * @member {string} logger.Entry#label
		 */
		this.label = label + '';


		try {
			args = util.cloneJSON(logger.filterArguments(args));
		} catch (err) {
			args = err;
		}


		/**
		 * Аргумерты логирования
		 * @member {*} logger.Entry#args
		 */
		this.args = args;


		/**
		 * Id родительской записи
		 * @member {*} logger.Entry#parentId
		 */
		this.parentId = parentId;


		/**
		 * Список id связанных записей
		 * @member {Array} logger.Entry#linked
		 */
		this.linked = [];


		/**
		 * Мета информация (строка, файл, метод и т.п.)
		 * @type {LoggerMeta}
		 */
		logger.metaOffset += 1;
		this.meta = meta || logger.meta();
		logger.metaOffset = 0;
	}


	Entry.fn = Entry.prototype = /** @lends logger.Entry.prototype */ {
		constructor: Entry,


		/**
		 * Добавить связанную запись
		 * @param  {string}  label
		 * @param  {*}       [args]
		 * @return {logger.Entry}
		 */
		add: function (label, args) {
			return logger.add(label, args, this.id, this.meta);
		},


		/**
		 * Выполнить метод в лог-конексте
		 * @param  {string|Function}   label
		 * @param  {*}        args
		 * @param  {Function} fn
		 * @return {*}
		 */
		call: function (label, args, fn) {
			if (typeof label === 'function') {
				var parentId = logger.parentId,
					retVal;

				logger.parentId = this.id;
				retVal = this.wrap(args ? label.apply(null, args) : label());
				logger.parentId = parentId;

				return retVal;
			}

			return logger.wrap(label, args, fn, this.id, this.meta)();
		},


		wrap: function (obj) {
			if (typeof obj === 'function') {
				return logger.wrap(this, obj);
			}
			else if (obj && !obj.__logger__ && obj.then) {
				var then = obj.then,
					done = obj.done,
					fail = obj.fail,
					always = obj.always,
					logScope = this;


				obj.__logger__ = logScope;


				/* jshint expr:true */
				done && (obj.done = function (callback) {
					var noLog = obj.__noLog,
						meta = logger.meta(-1 - (obj.metaOffset|0));

					return done.call(obj, function () {
						(noLog
							? obj.__logger__
							: logger.addEntry('scope', _getPromiseName(logScope, 'done'), null, obj.__logger__.id, meta)
						).call(callback, arguments);
					});
				});


				/* jshint expr:true */
				fail && (obj.fail = function (callback) {
					var noLog = obj.__noLog,
						meta = logger.meta(-1 - (obj.metaOffset|0));

					return fail.call(obj, function () {
						(noLog
							? obj.__logger__
							: logger.addEntry('scope', _getPromiseName(logScope, 'fail'), null, obj.__logger__.id, meta)
						).call(callback, arguments);
					});
				});


				/* jshint expr:true */
				always && (obj.always = function (callback) {
					var meta = logger.meta(-1 - (obj.metaOffset|0)),
						retVal;

					obj.__noLog = true;

					retVal = always.call(obj, function () {
						logger
							.addEntry('scope', _getPromiseName(logScope, 'always'), null, obj.__logger__.id, meta)
								.call(callback, arguments);
					});

					obj.__noLog = false;

					return retVal;
				});


				obj['catch'] = function (callback) {
					return obj.then(null, callback, true);
				};


				obj.then = function (onResolved, onRejected, isCatch) {
					if (obj.__noLog) {
						return then.call(obj, onResolved, onRejected);
					}

					var meta = logger.meta(-1 - (obj.metaOffset|0) - !!isCatch),
						label = isCatch ? 'catch' : 'then',
						scope = new Entry('scope', '', null, logScope.id, meta);

					function resolved() {
						scope.label = _getPromiseName(logScope, label + ':resolved');
						logger.addEntry(scope);

						return scope.call(onResolved, arguments);
					}

					function rejected() {
						scope.label = _getPromiseName(logScope, label + ':rejected');
						logger.addEntry(scope);

						return scope.call(onRejected, arguments);
					}

					return scope.wrap(then.call(obj, onResolved ? resolved : null, onRejected ? rejected : null));
				};
			}

			return obj;
		},


		/**
		 * Создать связанный scope
		 * @param  {string} label
		 * @param  {*} [args]
		 * @param  {*} [meta]
		 */
		scope: function (label, args, meta) {
			return logger.scope(label, args, meta || -3, this.id);
		},


		/**
		 * Получить цепочку записей
		 * @param  {string} [glue]
		 * @returns {Array|string}
		 */
		chain: function (glue) {
			return logger.chain(this.id, glue);
		},


		pluck: function (key) {
			return this.chain().map(function (entry) {
				return entry[key];
			});
		},


		/**
		 * Получить родителя
		 * @return {logger.Entry}
		 */
		parent: function () {
			return index[this.parentId];
		},


		/**
		 * Получить JSON-объект
		 * @returns {Object}
		 */
		toJSON: function () {
			return {
				id: this.id,
				dependId: this.dependId,
				linked: this.linked,
				type: this.type,
				label: this.label,
				args: this.args,
				meta: this.meta
			};
		}
	};


	Function.prototype.logger = function (label, args) {
		return logger.wrap(label, args, this, null, logger.meta(-1));
	};


	// Export Entry
	logger.Entry = Entry;


	/**
	 * Логируемый setTimeout
	 * @param  {string}    name
	 * @param  {function}  callback
	 * @param  {number}    ms
	 */
	/* istanbul ignore next */
	window.setTimeoutLog = function (name, callback, ms) {};


	/**
	 * Логируемый setIntervalLog
	 * @param  {string}    name
	 * @param  {function}  callback
	 * @param  {number}    ms
	 */
	/* istanbul ignore next */
	window.setIntervalLog = function (name, callback, ms) {};


	//['setTimeout', 'setInterval'].forEach(function (name) {
	//	var method = window[name];
	//
	//	window[name + 'Log'] = function (label, callback, ms) {
	//		if (typeof callback !== 'function') {
	//			ms = callback;
	//			callback = label;
	//			label = name;
	//		}
	//
	//		var scope = logger.scope('~' + label);
	//		return method(function () {
	//			scope.call(callback);
	//		}, ms);
	//	};
	//});



	Promise.Log = function (name, executor) {
		if (executor) {
			name = '[[' + name + ']]';
		}
		else {
			executor = name;
			name = '[[promise]]';
		}

		return logger.scope(name, null, -2).call(function () {
			return new Promise(executor);
		});
	};


	// Export
	logger.version = '0.8.0';

	/* jshint boss:true */
	return (window.octolog = window.logger = logger);
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function (require) {
	'use strict';

	var Action = __webpack_require__(724),
		Promise = __webpack_require__(27),
		RPC = __webpack_require__(78),
		utils = __webpack_require__(104);

	/**
	 * Действие "Восстановление телефона"
	 * @class mail.PasswordRecovery
	 * @constructs mail.PasswordRecovery
	 * @extends Action
	 */
	var PasswordRecovery = Action.extend(/** @lends mail.PasswordRecovery# */{

		/**
		 * @typedef {Object} PasswordRecoveryParams - входные параметры действия
		 * @property {string} phase - этап восстановления пароля (опции, отправка токена, проверка токена)
		 * @property {string} email - адрес, для которого мы восстанавливаем
		 * @property {string} by - фактор на основании которого будет сгенерирован токен
		 * @property {number|null} address - номер телефона в формате 712312312313
		 * @property {number|null} index - порядковый номер телефона среди телефонов для пользователя
		 * @property {string|null} token - токен, который необходимо подвтредить для восстановления
		 * @property {string|null} value - значение, которым пользователь подтверждает токен
		 * @property {string|null} captcha - значение капчи, если token/send ее затребовал
		 * @property {string|null} restoreToken - токен для восстановления проаля
		 * @property {string|null} password - новый пароль пользователя
		 */

		/**
		 * Структура токена для отправки SMS
		 */
		regToken: {
			target: 'user/password/restore',
			format: 'default'
		},

		urls: {
			options: 'user/password/restore',
			send: 'tokens/send',
			check: 'tokens/check',
			changePassword: 'user/password/restore/confirm'
		},

		/**
		 * Описание обязательных полей для каждого метода
		 */
		required: {
			getOptions: ['email'],
			sendToken: ['by', 'token'],
			checkToken: ['by', 'token', 'value'],
			changePassword: ['restoreToken', 'password']
		},

		/**
		 * Метод обрабатывает ответ от сервера и возвращает его в нужно формате
		 * @param {object} res - ответ
		 * @private
		 * @returns {object}
		 */
		_processResponse: function (res) {
			return res.body;
		},

		/**
		 * Метод получает опции востановления пароля
		 * @param {PasswordRecoveryParams} params
		 * @private
		 */
		_getOptions: function (params) {
			return RPC.call(this.urls.options, { email: params.email }).then(this._processResponse.bind(this));
		},

		/**
		 * Метод отправляет токен пользователю на телефон
		 * @param {PasswordRecoveryParams} params
		 * @private
		 */
		_sendToken: function (params) {
			var regToken = this.regToken;
			var options;

			regToken.transport = params.by;
			regToken.id = params.token;
			regToken.address = params.address;
			regToken.index = params.index;

			options = {
				email: params.email,
				capcha: params.captcha,
				reg_token: JSON.stringify(regToken)
			};

			if (params.redirectUri) {
				options.redirect_uri = params.redirectUri;
			}

			return RPC.call(this.urls.send, options).then(this._processResponse.bind(this));
		},

		/**
		 * Метод проверяет токен пользователя
		 * @param {PasswordRecoveryParams} params
		 * @private
		 */
		_checkToken: function (params) {
			var regToken = this.regToken;

			regToken.transport = params.by;
			regToken.id = params.token;
			regToken.value = params.value;

			if (params.captcha) {
				regToken.captcha = params.captcha;
			}

			return RPC.call(this.urls.check, {
				email: params.email,
				reg_token: JSON.stringify(regToken)
			}).then(this._processResponse.bind(this));
		},

		/**
		 * Метод меняте пароль пользователя
		 * @param {PasswordRecoveryParams} params
		 * @private
		 */
		_changePassword: function (params) {
			var options = {
				email: params.email,
				reg_token_check: params.restoreToken,
				password: params.password
			};

			if (params.redirectUri) {
				options.redirect_uri = params.redirectUri;
			}

			return RPC.call(this.urls.changePassword, options).then(this._processResponse.bind(this));
		},

		/**
		 * Метод валидирует переданные параметры
		 * @param params
		 * @return {Object|null} - если есть ошибки, то вернет спиоск {email: 'required' ... }
		 * @private
		 */
		_validate: function (params) {
			var errors = {},
				required = JSON.parse(JSON.stringify(this.required[params.method])) || [];

			required = required.filter(function (key) {
				return !params.hasOwnProperty(key);
			});

			if (!required.length) {
				return null;
			}

			required.forEach(function (key) {
				errors[key] = 'required';
			});

			return errors;
		},

		/**
		 * Логика действия "Восстановить"
		 * @param {PasswordRecoveryParams} params
		 * @returns {Promise}
		 */
		operation: function operation(params) {
			var errors,
				method;

			if (!params.method) {
				return Promise.reject({method: 'required'});
			}

			method = this['_' + params.method];

			if (typeof method !== 'function') {
				return Promise.reject({method: 'invalid'});
			}

			errors = this._validate(params);

			if (errors) {
				return Promise.reject(errors);
			}

			return method.call(this, params);
		}

	});

	/**
	 * Этапы восстановления пароля
	 * @type {{OPTIONS: number, SEND: number, CHECK: number}}
	 */
	PasswordRecovery.methods =  {
		OPTIONS: 'getOptions', // получить опции восстановления
		SEND: 'sendToken', // отправить токен
		CHECK: 'checkToken', // проверить отправленный токен
		CHANGE_PASSWORD: 'changePassword' // изменить пароль
	};

	/**
	 * Виды транспорта, через которые можно доставить и проверить токен
	 * @type {{PHONE: string}}
	 */
	PasswordRecovery.transports = {
		PHONE: 'phone'
	};

	// Export
	Action.register('mail.PasswordRecovery', PasswordRecovery);
	PasswordRecovery.version = '0.2.2';
	return PasswordRecovery;
}).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 724:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(41),
	__webpack_require__(199),
	__webpack_require__(27),
	__webpack_require__(89),
	__webpack_require__(725),
	__webpack_require__(301)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** logger */logger,
	/** inherit */inherit,
	/** Promise */Promise,
	/** Emitter */Emitter,
	/** Model */Model,
	/** Model.List */List
) {
	'use strict';


	// Получить параметры для логирования
	var _getLogParams = function (value) {
		var i,
			result = value;

		if (value && typeof value === 'object') {
			/* istanbul ignore next */
			if (value.toLogJSON) {
				result = value.toLogJSON();
			}
			else if (value instanceof Model) {
				result = value.id;
			}
			else if (value instanceof List) {
				result = value.pluck('id');
			}
			else if (Array.isArray(value)) {
				i = value.length;
				result = [];

				while (i--) {
					result[i] = _getLogParams(value[i]);
				}
			}
			else {
				result = {};
				Object.keys(value).forEach(function (key) {
					result[key] = _getLogParams(value[key]);
				});
			}
		}

		return result;
	};



	/**
	 * Действие.
	 * @abstract
	 * @class Action
	 * @constructs Action
	 * @extends Emitter
	 * @returns {Promise}
	 */
	var Action = inherit(Emitter, /** @lends Action# */{
		/**
		 * Имя действия
		 * @type {string}
		 */
		name: 'abstract',


		/**
		 * Конструктор
		 * @param  {Object}  params   параметры
		 * @param  {Object}  options  опции
		 * @constructor
		 */
		constructor: function (params, options) {
			/**
			 * Параметры
			 * @type {Object}
			 */
			this.params = params;


			/**
			 * Опции
			 * @type {Object}
			 */
			this.options = options;


			/**
			 * Подготовленные данные
			 * @type {boolean}
			 * @private
			 */
			this._data;


			/**
			 * Статус команды «в работе≠
			 * @type {boolean}
			 */
			this.pending = false;


			/**
			 * Статус выполнения действия
			 * @type {*}
			 */
			this.status;


			/**
			 * Ошибка при выполнении
			 * @type {*}
			 */
			this.error = null;


			/**
			 * Результат успешного выполнения
			 * @type {*}
			 */
			this.result = null;


			return options.logScope.call(this._execute.bind(this));
		},


		/**
		 * Выполнить действие
		 * @private
		 * @return {Promise}
		 */
		_execute: function () {
			var _this = this,
				params = _this.params,
				options = _this.options,
				logScope = options.logScope;


			// «Поехали!»
			_this.pending = true;

			(!options.silent) && Action.trigger('start', [_this, params, options]);

			return new Promise(function (resolve) {
				// Безопасное выполнение внутри `Promise`
				resolve(_this.prepare(params, options));
			}.logger(_this.name + '.prepare')).then(
				// Данные успешно подготовлены
				function (data) {
					if (data === null) {
						// нужно выходить
						logScope.add('operation:exit');
						_this._resolve('done', data);

						return _this;
					}

					if (data === void 0) {
						// используем исходные данные
						data = params;
					}

					_this._data = data;

					// «Операция!»
					return new Promise(function (resolve) {
						_this.trigger('operation', [data, params, options]);
						resolve(_this.operation(data, params, options));
					}.logger(_this.name + '.operation')).then(
						// Это успех!
						function (result) {
							logScope.add('operation:done');
							_this._resolve('done', result);

							return _this;
						},

						// Ошибка, нужно откатывать
						function (error) {
							logScope.add('operation:fail', error);

							_this.rollback();
							_this._resolve('fail', error);

							return Promise.reject(_this);
						}
					);
				},

				// Ошибка при подготовке данных
				function (error) {
					logScope.add('prepare:fail', error);
					_this._resolve('fail', error);

					return Promise.reject(_this);
				}
			);
		},


		/**
		 * Отмена действия
		 * @public
		 * @return {Promise}
		 */
		undo: function () {
			var _this = this,
				args = [_this._data, _this.params, _this.options],
				promise = _this._undoPromise,
				logScope;

			if (!promise) {
				logScope = logger.scope('[[' + _this.name + '.undo]]');

				_this._undoPromise = promise = new Promise(logScope.wrap(function (resolve) {
					_this.trigger.apply(_this, ['undo'].concat(args));
					(!_this.options.silent) && Action.trigger.apply(_this, ['undo', _this].concat(args));

					resolve(_this.undoOperation.apply(_this, args));
				}));

				promise.then(
					_this._resolveUndo.bind(_this, logScope, true),
					_this._resolveUndo.bind(_this, logScope, false)
				);
			}

			return promise;
		},


		/**
		 * Подготовить данные для выполнения действия.
		 * Если вернуть `null`, действие сразу перейдет в состояние `resolved` без выполнения `operation`.
		 * @protected
		 * @param  {Object}  params
		 * @param  {Object}  options
		 */
		prepare: function (params, options) {
		},


		/**
		 * Выполняемая операция, если `prepare` не вернул `null`
		 * @protected
		 * @param  {*}       data  данные подготовленные в `prepare` (или теже `params`)
		 * @param  {object}  params
		 * @param  {object}  options
		 */
		operation: function (data, params, options) {
		},


		/**
		 * Обратная операция
		 * @protected
		 * @param  {*}       data
		 * @param  {Object}  params
		 * @param  {Object}  options
		 */
		undoOperation: function (data, params, options) {
			logger.add('NOT_IMPLEMENTED');
			throw 'NOT_IMPLEMENTED';
		},


		/**
		 * Опредация откатки изменений
		 * @protected
		 * @param  {*}       data
		 * @param  {Object}  params
		 * @param  {Object}  options
		 */
		rollbackOperation: function (data, params, options) {
			logger.add('NOT_IMPLEMENTED');
		},


		/**
		 * Откатываем действие при ошибке (не путать с `undo`)
		 * @public
		 */
		rollback: function () {
			var _this = this,
				options = _this.options;

			options.logScope.call('[[' + _this.name + '.rollback]]', function () {
				try {
					_this.rollbackOperation(_this._data, _this.params, options);
				} catch (err) {
					logger.add('error', err);
				}
			});
		},


		/**
		 * Разрешить действие
		 * @private
		 * @param  {string} status
		 * @param  {*}      result
		 */
		_resolve: function (status, result) {
			this.pending = false;
			this.status = status;
			this[status == 'done' ? 'result' : 'error'] = result;

			this.trigger(status, result);
			this.trigger('complete', [this, status, result]);

			if (!this.options.silent) {
				Action.trigger(status, [this, result]);
				Action.trigger('complete', [this, status, result]);
			}
		},


		/**
		 * Разрешить аннуляцию действия
		 * @private
		 * @param  {logger.Entry} undoLogScope
		 * @param  {boolean}      status
		 * @param  {*}            result
		 */
		_resolveUndo: function (undoLogScope, status, result) {
			var args = [this, status, result];

			undoLogScope.add('undo:' + (status ? 'done' : 'fail'), status ? void 0 : result);

			this.trigger('undo:complete', args);
			(!this.options.silent) && Action.trigger('undo:complete', args);
		},


		/**
		 * Излучатель события
		 * @override
		 * @param {string} type
		 * @param {Array}  args
		 */
		emit: function (type, args) {
			var options = this.options;

			if (options['on' + type]) {
				options['on' + type].apply(this, args);
			}

			return Emitter.fn.emit.apply(this, arguments);
		}
	});


	// Подмешиваем события
	Emitter.apply(Action);


	/**
	 * Регистрация действия
	 * @static
	 * @param  {string}  name       название действия
	 * @param  {Action}  NewAction  класс действия
	 * @memberOf Action
	 */
	Action.register = function (name, NewAction) {
		this[name] = NewAction;

		// Экспортируем имя действия
		NewAction.prototype.name = name;

		// Статический метод для выполнения действия
		NewAction.execute = function (params, options) {
			return Action.execute(name, params, options);
		};

		return NewAction;
	};


	/**
	 * Выполнить действие.
	 * @static
	 * @param   {string}  name
	 * @param   {Object}  [params]
	 * @param   {Object}  [options]
	 * @return  {Promise}
	 * @memberOf Action
	 */
	Action.execute = function (name, params, options) {
		options = options || {};

		/** @type {Action}*/
		var Target = this[name],
			logScope = (options.logScope || logger).scope('[[Action:' + name + ']]', _getLogParams(params)),
			error = 'ACTION_NOT_FOUND:' + name;

		if (!Target) {
			logScope.add(error);
		}

		options.logScope = logScope;

		return Target ? new Target(params, options) : Promise.reject(error);
	};


	/**
	 * Бросаем событие с ожиданием Promise,
	 * для вызова UI (диалогов, форм) в процессе выполнения действия.
	 * @param  {string}  type
	 * @param  {*}       [args]
	 * @return {Promise}
	 */
	Action.waitFor = function waitFor(type, args) {
		var evt = new Emitter.Event(type),
			promise;

		// защищаемся от кривого аргумента; не меняем аргументы; первым параметром - текущий экземпляр Action
		Action.trigger(evt, [].concat(this, args));

		/* jshint eqnull:true */
		if (evt.result != null) {
			if (evt.result.then) { // если приехал Promise (или что то похожее) - возвращаем его
				promise = evt.result;
			} else {
				promise = Promise.cast(evt.result);
			}
		}
		else { // если нет - всё пропало, отказать!
			promise = Promise.reject();
		}

		return promise;
	};


	// Export
	Action.version = '0.2.0';
	return Action;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 725:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(199),
	__webpack_require__(41),
	__webpack_require__(131),
	__webpack_require__(27),
	__webpack_require__(89),
	__webpack_require__(301),
	__webpack_require__(245)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** function */inherit,
	/** logger */logger,
	/** request */request,
	/** Promise */Promise,
	/** Emitter */Emitter,
	/** Model.List */List,
	/** config */config
) {
	"use strict";

	var Event = Emitter.Event;
	var _toString = {}.toString;
	var _stringifyJSON = JSON.stringify;
	var _type = function (val) {
		return val === null ? 'null' : _toString.call(val).toLowerCase().slice(8, -1);
	};


	/**
	 * Локальный идентификтор модели
	 * @type {number}
	 */
	var cid = 1;


	/**
	 * Быстрое клонирование
	 * @param   {*}  obj
	 * @param   {boolean} [isObject]
	 * @returns {*}
	 * @private
	 */
	function _clone(obj, isObject) {
		var i, key,
			res = obj;

		if (isObject !== true && obj instanceof Array) {
			i = obj.length;
			res = [];
			while (i--) {
				res[i] = _clone(obj[i]);
			}
		} else if (isObject === true || obj instanceof Object) {
			if (obj.toJSON !== void 0) {
				res = obj.toJSON();
			} else {
				res = {};
				for (key in obj) {
					res[key] = _clone(obj[key]);
				}
			}
		}

		return res;
	}

	// Установкаизначальных аттрибутов
	var _setInitialAttr = function (model, defaults, target, absKey, localKey, value) {
		if (model.scheme[absKey] === 'set') {
			target[localKey] = _clone(defaults, true);

			for (var key in value) {
				_setInitialAttr(
					model,
					defaults[localKey],
					target[localKey],
					absKey + '.' + localKey,
					key,
					value[key]
				);
			}
		} else if (model.nested.hasOwnProperty(absKey)) {
			target[localKey] = new model.nested[absKey](value);
		} else {
			target[localKey] = value;
		}
	};

	// Установка аттрибутов согласно схеме
	var _setAttr = function (model, absKey, attr, newValue, changed, changes) {
		var idx = absKey.lastIndexOf('.'),
			attributes = model.attributes,
			_attributes = model._attributes,
			value = attributes[attr];

		if (idx !== -1) {
			attr = absKey.substr(idx + 1);
			value = model.get(absKey);
		}

		if (model.nested[absKey] !== void 0) {
			// Обновление вложенной модели или списка
			model.get(absKey).set(newValue, {reset: true});
		}
		else if (model.scheme[absKey] === 'set') {
			for (var key in newValue) {
				_setAttr(model, absKey + '.' + key, key, newValue[key], changed, changes);
			}
		}
		else if (_notEqual(value, newValue)) {
			if (absKey !== attr) {
				var chain = absKey.split('.'),
					length = chain.length,
					i = 0,
					n = length - 1,
					part,
					dottedKey;

				for (; i < n; i++) {
					part = chain[i];

					if (attributes[part] === void 0) {
						attributes[part] = {};
					}

					if (_attributes[part] === void 0) {
						_attributes[part] = {};
					}

					if (changed[part] === void 0) {
						changed[part] = {};
					}

					attributes = attributes[part];
					_attributes = _attributes[part];
					changed = changed[part];

					if (attributes.set !== void 0) {
						// Модель или Список
						attributes.set(chain.slice(i + 1).join('.'), newValue, {reset: true});
						return;
					}

					dottedKey = dottedKey === void 0 ? part : dottedKey + '.' + part;

					if (changes.byKey[dottedKey] === void 0) {
						changes.byKey[dottedKey] = attributes;
						changes.push(dottedKey);
					}
				}
			}

			_attributes[attr] = value;
			changed[attr] = newValue;
			attributes[attr] = newValue;

			changes.push(absKey);
			changes.byKey[absKey] = newValue;
		}
	};

	function _setNestedChanges(/** Array */nestendChanges, /** Array */changes, /** Object */changed) {
		var i = nestendChanges.length;

		while (i--) {
			var item = nestendChanges[i];
			var attr = item.attr;

			changes.push(attr);
			changes.byKey[attr] = item.changes;

			if (attr.indexOf('.') > -1) {
				var chain = attr.split('.');
				var endIdx = chain.length - 1;
				var _changed = changed;

				for (var c = 0; c < endIdx; c++) {
					if (_changed[chain[c]] === void 0) {
						_changed = _changed[chain[c]] = {};
					} else {
						_changed = _changed[chain[c]];
					}
				}

				_changed[chain[endIdx]] = item.changed;
			} else {
				changed[attr] = item.changed;
			}

			var innerChanges = item.changes;
			for (var j = 0, jn = innerChanges.length; j < jn; j++) {
				var innerAttr = attr + '.' + innerChanges[j];
				changes.push(innerAttr);
				changes.byKey[innerAttr] = innerChanges.byKey[innerChanges[j]];
			}
		}
	}

	/**
	 * Быстрое сравнение двух переменных
	 * @param   {*}  actual
	 * @param   {*}  expected
	 * @returns {boolean}
	 * @private
	 */
	function _notEqual(actual, expected) {
		if (actual === expected) {
			return false;
		}

		var expectedType = typeof expected;

		if (expectedType === 'string' || expectedType === 'number' || expectedType === 'boolean') {
			return actual != expected;
		}

		// А теперь детально расмотрим
		var idx, actualType = typeof actual;

		/* istanbul ignore else */
		if (actualType === expectedType) {
			if (actual === null) {
				return true;
			}

			/* istanbul ignore else */
			if (expected instanceof Array) {
				idx = expected.length;

				if (actual.length !== idx) {
					return true;
				}

				while (idx--) {
					if (_notEqual(actual[idx], expected[idx])) {
						return true;
					}
				}
			}
			else if (expected instanceof Object) {
				var key,
					keys = Object.keys(expected)
				;

				idx = keys.length;

				if (Object.keys(actual).length !== idx) {
					return true;
				}

				while (idx--) {
					key = keys[idx];

					if (_notEqual(actual[key], expected[key])) {
						return true;
					}
				}
			}

			return false;
		}

		return true;
	}


	/**
	 * Создаеть геттер для атрибутов
	 * @param   {string}   attrs    название своства
	 * @param   {boolean}  retBool  вернуть булево значение
	 * @returns {Function}
	 * @private
	 */
	function _createGetter(attrs, retBool) {
		var code = (function (name) {
			var attributes = this.$,
				scheme = this.scheme,
				nested = this.nested,
				retVal = attributes[name = (this.shortcuts[name] || name)],
				key,
				length
			;

			(this.__beforeGet__ !== null) && this.__beforeGet__(this, name);

			/* istanbul ignore else */
			if (retVal === void 0 && name.indexOf('.') !== -1) {
				name = name.split('.');
				key = name[0];
				length = name.length;

				if (nested[key] !== void 0) {
					// Вложенная модель
					retVal = attributes[key];

					if (scheme[key] === 'model.list') {
						retVal = length === 2
								? retVal[name[1]]
								: retVal[name[1]].get(name.slice(2).join('.'));
					} else {
						retVal = retVal.get(length === 2 ? name[1] : name.slice(1).join('.'));
					}
				}
				else if (length === 2) {
					retVal = attributes[key] && attributes[key][name[1]];
				}
				else {
					for (var i = 0, n = length - 1; i < n; i++) {
						key = name[i];
						attributes = attributes[key];

						/* jshint eqnull:true */
						if (attributes == null) {
							return;
						} else if (attributes.get !== void 0) {
							if (attributes.Model !== void 0) {
								retVal = attributes[name[i + 1]];

								if (i + 2 <= n) {
									retVal = retVal.get(name.slice(i + 2).join('.'));
								}

								return retVal;
							}
							else {
								return attributes.get(name.slice(i + 1).join('.'));
							}
						}
					}

					retVal = attributes[name[n]];
				}
			}

			return retVal;
		}).toString();

		if (retBool) {
			code = code
				.replace(/(return)\s+(.+,\s*)?(\w+)/g, function (_, ret, incut, retVal) {
					return ret + ' ' + (incut || '') + '!!' + retVal;
				})
				.replace(/(return)(.*?)(;|})/, function (_, ret, incut, end) {
					/* istanbul ignore next */
					return ret + (incut ? incut + ',' : '') + ' false' + end;
				})
			;
		}

		/* jshint evil:true */
		return Function('return ' + code.replace('this.$', 'this.' + attrs))();
	}


	function _emitChangeEvents(/** string */type, /** Model */model, /** Array */changes, /** Object */changed) {
		var i = changes.length;
		var evt = new Event(type); // для «скорости» используем единый объект

		evt.target = model;
		evt.changes = changes;
		evt.allChanged = changed;

		while (i--) {
			var attr = changes[i];

			evt.attr = attr;
			evt.type = type + ':' + attr;
			evt.changed = changes.byKey[attr];

			model.emit(evt.type, [evt, model]);
		}

		evt.type = type;
		evt.attr = void 0;
		evt.changed = changed;

		model.emit(evt.type, [evt, model]);
	}


	/**
	 * Модель
	 * @class Model
	 * @constructs Model
	 * @mixes Emitter
	 * @param  {Object}  [attrs]  свойства
	 */
	function Model(attrs) {
		var key,
			valueValidator = this.valueValidator,
			value,
			attributes = this.attributes = {},
			defaults = this.defaults
		;


		this.cid = 'c' + cid++;
		this.changed = {}; // Если это не сделать, будет работать с общим объектом в прототипе
		this._attributes = {};


		// Устанавливаем свойства модели
		/* istanbul ignore else */
		if (attrs) {
			for (key in attrs) {
				value = attrs[key];

				/* istanbul ignore else */
				if (valueValidator !== null) {
					value = valueValidator(value, key, attrs, this);
				}

				_setInitialAttr(this, defaults[key], attributes, key, key, value);
			}
		}


		// Заполняем свойствами по умолчанию
		for (key in defaults) {
			/* istanbul ignore else */
			if (!attributes.hasOwnProperty(key)) {
				value = defaults[key];

				/* jshint eqnull:true */
				/* istanbul ignore else */
				if ((value !== null) && (typeof value === 'object')) {
					value = _clone(value);
				}

				attributes[key] = value;
			}
		}


		// Идетификатор модели
		/* istanbul ignore else */
		if (attributes[this.idAttr] !== void 0) {
			this.id = attributes[this.idAttr];
		}

		// Активация вложенных моделей
		if (this._activateNested !== void 0) {
			this._activateNested(attributes);
		}

		// Обновление геттеров
		if (this._updateGetters !== void 0) {
			this._updateGetters(attributes, attributes);
		}
	}


	Model.fn = Model.prototype = /** @lends Model# */{
		constructor: Model,

		__beforeGet__: null,

		/**
		 * Название класса
		 * @type {string}
		 */
		className: 'Model',


		/**
		 * Локальный идентификатор модели
		 * @type  {string}
		 */
		cid: null,

		/**
		 * Идентификатор модели (PK)
		 * @type {*}
		 */
		id: null,


		/**
		 * Имя свойства-идентификатора (PK)
		 * @type {string}
		 */
		idAttr: 'id',


		/**
		 * Индекс вложенных моделей/списков
		 * @type {Object}
		 * @private
		 */
		nested: {},


		/**
		 * Схема модели (создается на основе `defaults` при `extend`)
		 * @type {Object}
		 * @private
		 */
		scheme: {},


		/**
		 * Свойства по умолчанию
		 * @type {Object}
		 */
		defaults: {},


		/**
		 * Массив обязательных свойств от сервер, если их не будет, то запонить из `defaults`
		 * @type {string[]}
		 */
		required: [],


		/**
		 * Доступ к свойствам через гетеры, либо определить объект "геттер" => "свойство"
		 * @type {boolean|Object}
		 */
		getters: false,


		/**
		 * Тригеры на add/update/save/remove, а так же beforeadd и т.д.
		 * @type {Object}
		 */
		triggers: {},


		/**
		 * Валидатор значения аттрибута
		 * @type {Function|null}
		 */
		valueValidator: null,


		/**
		 * Список измененнных ствойств их новых значений
		 * @type {Object}
		 */
		changed: {},


		/**
		 * Всегда отправлять полный список атрибутов при сохранении
		 * @type {boolean}
		 */
		alwaysSendAllAttributes: false,


		/**
		 * Список измененнных ствойств их старых значений
		 * @type {Object}
		 * @private
		 */
		_attributes: {},


		/**
		 * Короткий доступ к свойствам
		 * @type {Object}
		 */
		shortcuts: {},


		/**
		 * Объект отвечающий за запросы к серверу
		 * @type {request}
		 */
		request: request,


		/**
		 * Объект отвечающий за хранение данных (кеш)
		 * @type {Storage}
		 */
		storage: null,


		/**
		 * URL получения/сохранения/удаления модели
		 * @type {string}
		 */
		url: "",


		/**
		 * URL получения списка моделей (коллекции)
		 * @type {string}
		 */
		findUrl: "",


		/**
		 * URL получения одной модели
		 * @type {string}
		 */
		findOneUrl: "",


		/**
		 * URL создания модели
		 * @type {string}
		 */
		addUrl: "",


		/**
		 * URL сохранения модели
		 * @type {string}
		 */
		saveUrl: "",


		/**
		 * URL удаления
		 * @type {string}
		 */
		removeUrl: "",

		/**
		 * Идут изменения модели (set)
		 * @type {boolean}
		 * @private
		 */
		_changing: false,


		/**
		 * Проверить значение свойства на истинность
		 * @param   {string}  name
		 * @returns {boolean}
		 * @method Model#is
		 */
		is: _createGetter('attributes', true),


		/**
		 * Получить значение свойства
		 * @param   {string}  name
		 * @returns {*}
		 * @method Model#get
		 */
		get: _createGetter('attributes'),


		/**
		 * Получить предыдущие значение свойства
		 * @param   {string}  name
		 * @returns {*}
		 * @method Model#previous
		 */
		previous: _createGetter('_attributes'),


		/**
		 * Вызвать тригер
		 * @param  {String} name
		 * @param  {*} [args]
		 * @private
		 */
		_callTrigger: function (name, args) {
			var trigger = this.triggers[name];
			trigger && trigger.call(this, args);
		},


		/**
		 * Обработка события вожженых моделей
		 * todo: Нужно доработать события для всей цепочки
		 * @param {string} attr
		 * @param {Object} evt
		 * @private
		 */
		_nestedHandleEvent: function (attr, evt) {
			var type = evt.type;
			var evtChanged = evt.changed || evt.target;
			var evtChanges = evt.changes;

			if (type === 'update') {
				type = 'change';
			}

			if (evtChanges === void 0) {
				evtChanges = [attr];
				evtChanges.byKey = {};
				evtChanges.byKey[attr] = evtChanged;
			}

			if (this._changing && type === 'change') {
				if (this._nestedChanges === void 0) {
					this._nestedChanges = [];
				}

				this._nestedChanges.push({
					attr: attr,
					changed: evtChanged,
					changes: evtChanges
				});
			} else if (type === 'add' || type === 'remove') {
				var nextEvt = new Event({
					type: type + ':' + attr,
					attr: attr,
					list: evt.list,
					target: evt.target
				});

				this.emit(nextEvt.type, [nextEvt, this]);
			} else {
				var allChanged = {};
				var changes = [];

				changes.byKey = {};

				_setNestedChanges([{
					attr: attr,
					changed: evtChanged,
					changes: evtChanges
				}], changes, allChanged);

				_emitChangeEvents(type, this, changes, allChanged);
			}
		},


		/**
		 * Установить свойства или свойство
		 * @param   {string|Object}  attr  название или объект свойств
		 * @param   {*|Object}       [newValue]  значение или опции
		 * @param   {boolean|Object} [options] опции (silent, clean, sync)
		 * @returns {Model}
		 */
		set: function (attr, newValue, options) {
			var attrs,
				changes = [],
				silent, // не испускать событий при изменении
				sync, // режим синхронизации (напрмиер надо проверить required)
				changed = this.changed,
				valueValidator = this.valueValidator
			;

			changes.byKey = {};
			this._changing = true;

			// Получем свойства
			if (typeof attr === 'object') {
				attrs = attr;
				options = options || newValue;
			} else {
				(attrs = {})[attr] = newValue;
			}


			// Опции
			if (options instanceof Object) {
				sync = options.sync;
				silent = options.silent;

				if (options.clean) {
					// установить свойства и не оставить следа об этих изменениях
					changed = {};
				}
			}
			else {
				silent = (options === true);
			}


			// Назначаем идентификатор (PK), если его передали
			/* istanbul ignore else */
			if (attrs[this.idAttr] !== void 0) {
				this.id = attrs[this.idAttr];
			}

			if (sync) {
				this._setRequired && this._setRequired(attrs);
			}

			// Перебераем и изменяем свойства
			for (attr in attrs) {
				newValue = attrs[attr]; // Новое значение
				attr = (this.shortcuts[attr] || attr);

				/* istanbul ignore else */
				if (valueValidator !== null) {
					newValue = valueValidator(newValue, attr, attrs, this);
				}

				_setAttr(this, attr, attr, newValue, changed, changes);
			}

			if (this._nestedChanges !== void 0) {
				_setNestedChanges(this._nestedChanges, changes, changed);
			}

			if ((this._updateGetters !== void 0) && (changes.length > 0)) {
				// Обновим геттеры
				this._updateGetters(changed, attrs);
			}

			// Если есть изменения и не «тишина»
			/* istanbul ignore else */
			if ((changes.length > 0) && !silent) {
				_emitChangeEvents('change', this, changes, changed);
			}

			this._changing = false;
			this._nestedChanges = void 0;

			return this;
		},


		/**
		 * Увеличить атрибут на `value`
		 * @param   {string}  attr
		 * @param   {number}  [value]
		 * @param   {object}  [options]
		 * @returns {Model}
		 */
		increment: function (attr, value, options) {
			if (arguments.length == 1 || value instanceof Object) {
				options = value;
				value = 1;
			}

			value = parseInt(value, 10);

			return Number.isNaN(value) ? this : this.set(attr, this.get(attr) + value, options);
		},


		/**
		 * Получить объект свойств (клон аттрибутов)
		 * @param   {boolean}  [ref]  вернуть ссылку на аттрибуты
		 * @returns {Object}
		 */
		toJSON: function (ref) {
			var attrs = this.attributes;
			return ref ? attrs : _clone(attrs, true);
		},


		/**
		 * Явялется ли модель «новой»?
		 * @returns {boolean}
		 */
		isNew: function () {
			return this.id === null;
		},


		/**
		 * Очередь действий
		 * @param   {Function}  fn
		 * @returns {Promise}
		 */
		queue: function (fn) {
			var meta = logger.meta(-2),
				model = this,
				call = function () {
					/* istanbul ignore else */
					if (model.removed) {
						// @todo: Безумно спорное место, как и весь `removed`
						var err = new Error('MODEL_REMOVED');
						err.model = model;
						return Promise.reject(err);
					}

					return fn(model, meta);
				}
			;

			if (!this._queue) {
				this._queue = new Promise(function (resolve) { resolve(); });
				//this._queue.__logger__.meta = meta;
			}


			this._queue = this._queue.then(call, call);
			//this._queue.__logger__.meta = meta;

			return this._queue;
		},


		/**
		 * Вызывается при findOne, если вернуть `false` будет отправлен запрос на серевер
		 * @returns {boolean}
		 * @protected
		 */
		isDataFully: function () {
			return true;
		},


		/**
		 * Изменена ли модель?
		 * @param   {string}  [name]
		 * @returns {boolean}
		 */
		hasChanged: function (name) {
			/* istanbul ignore else */
			if (name) {
				return this.changed[name];
			}

			for (var key in this.changed) {
				/* istanbul ignore else */
				if (this.changed.hasOwnProperty(key)) {
					return true;
				}
			}

			return this.isNew();
		},


		/**
		 * Обновить информацию о модели
		 * @param   {Object}  [params]  доп. параметры
		 * @returns {Promise}
		 */
		fetch: function (params) {
			params = params || {};
			params[this.idAttr] = this.id;
			return this.constructor.findOne(params);
		},


		/**
		 * Предварительная обработка ответа сервера
		 * @param   {Object}  body  тело ответа
		 * @param   {request.Request} req  объект запроса
		 * @returns {Object}
		 */
		parse: function (body, req) {
			return body;
		},

		/**
		 * Подготовка данных модели перед отправкой на сервер
		 * @param   {String} method метод сохранения add или save
		 * @param   {Object} attrs свойства модели
		 * @returns {Object} свойства модели, подготовленные для передачи в запрос
		 */
		prepareSendData: function (method, attrs) {
			return attrs;
		},

		/**
		 * Сохранить модель
		 * @param   {string|Object}   [attr]    свойство, которое нужно установить перед сохранением
		 * @param   {*}               [value]   значение
		 * @param   {Object|boolean}  [options] опции
		 * @returns {Promise}
		 */
		save: function save(attr, value, options) {
			/* istanbul ignore else */

			if (attr) {
				// Устанавливаем аттрибуты, если переданны (до сохранения)
				this.set(attr, value, options);
			}

			return this.queue(function (/** Model */model, /** LoggerMeta */meta) {
				if (model.hasChanged()) {
					var isNew = model.isNew(),
						attrs = model[isNew || model.alwaysSendAllAttributes ? 'attributes' : 'changed'],
						method = model.addUrl && isNew ? 'add' : 'save',
						url = model.constructor.url(method, model.attributes),
						cacheChanged = model.changed
					;

					model._callTrigger(isNew ? 'beforeadd' : 'beforeupdate', attrs);
					model._callTrigger('beforesave', attrs);

					// Для поддержки saveUrl
					if (!isNew) {
						attrs[model.idAttr] = model.id;
					}

					// Подготавливаем данные
					attrs = model.prepareSendData(method, attrs);

					// Сбрасываем изменения
					model.changed = {};

					// Обновляем данные в хранилище
					model.storage && model.storage.update(model.toJSON());

					// Отправляем запрос
					return model.request.post(
						url,
						attrs,
						{
							logger: model.className + '.save',
							loggerMeta: meta
						}).then(function (req) {
							var body = model.parse(req.body, req);

							body && model.set(body, { clean: true, sync: true });
							model.constructor.all.set([model]);
							model.trigger('sync', model);

							model._callTrigger(isNew ? 'add' : 'update', attrs);
							model._callTrigger('save', attrs);

							return model;
						}).fail(function () {
							// При неудаче возвращаем поля на место
							model.changed = cacheChanged;
						});
				} else {
					return model;
				}
			});
		},


		/**
		 * Удалить модель
		 * @param   {Object}   [query]  дополнительные GET-параметры
		 * @returns {Promise}
		 */
		remove: function remove(query) {
			return this.queue(function (/** Model */model, /** LoggerMeta */meta) {
				query = query || {};
				query[model.idAttr] = model.id;

				query = model.prepareSendData('remove', query);
				model._callTrigger('beforeremove', query);

				return model.request.call(
					model.constructor.url('remove', model),
					query,
					{
						logger: model.className + '.remove',
						loggerMeta: meta,
						type: 'DELETE'
					}).done(function () {
						model.removed = true; // помечаем объект как удаленный
						model.trigger({ type: 'remove', model: model }, model);
						model.destroy();
						model._callTrigger('remove', query);
					});
			});
		},


		/**
		 * Уничтожить модель
		 * @returns {Model}
		 */
		destroy: function () {
			var model = this;

			/* istanbul ignore else */
			if (!model.destroyed) {
				model.destroyed = true;

				// Удаляем данные из хранилища
				model.storage && model.storage.remove(model.id);
				model.trigger({type: 'destroy', model: model}, model);

				model.off(); // и отписываем всех слушателей

				/* jshint expr:true */
				(model._deactivateNested !== void 0) && model._deactivateNested(this.attributes);
			}
		},


		/**
		 * Метод для установки или получения мета информации о модели
		 * @param {string|object} [property] имя свойства (с поддержкой точечной нотации) или обьект свойство:значение
		 * @param {*} [value] значение для установки
		 * @returns {*}
		 */
		meta: function (property, value) {
			var _meta = this._meta,
				argsLength = arguments.length;

			if (_meta === void 0 || property === null) {
				this._meta = _meta = config({});
			}

			/* istanbul ignore else */
			if (argsLength === 0) {
				return _meta;
			}
			else if (argsLength === 2) {
				_meta.set(property, value);
			}
			else if (argsLength === 1) {
				if (typeof property === 'object') {
					_meta.set(property);
				} else {
					return _meta.get(property);
				}
			}

			return this;
		},

		/**
		 * Анулировать кеш
		 * @return {Model}
		 */
		expire: function () {
			this.expired = true;
			return this;
		}
	};


	/**
	 * Создание расширенной модели
	 * @memberOf Model
	 * @param   {Object} methods
	 * @returns {Model}
	 */
	Model.extend = function (methods) {
		var ModelExt = inherit(this, methods),
			prototype = ModelExt.fn,
			scheme = (prototype.scheme = {}),
			nested = (prototype.nested = {}),
			defaults = prototype.defaults,
			required = prototype.required,
			getters = prototype.getters;

		// Коллекция
		if (methods.List) {
			ModelExt.List = methods.List;
			ModelExt.List.prototype.Model = ModelExt;
		} else {
			ModelExt.List = ModelExt.List.extend({Model: ModelExt});
		}

		// Глобальная коллекция в рамках модели
		ModelExt.all = new (ModelExt.List);
		ModelExt.all.local = true;

		// Генерируем схему
		/* istanbul ignore else */
		if (defaults) {
			(function _walker(attrs, prefix) {
				var keys = Object.keys(attrs);

				if (keys.length) {
					prefix = prefix ? prefix + '.' : '';

					keys.forEach(function (key) {
						var value = attrs[key];

						key = prefix + key;

						if (value instanceof Object) {
							if (value instanceof Model) {
								nested[key] = value.constructor;
								scheme[key] = 'model';
							}
							else if (value instanceof List) {
								nested[key] = value.constructor;
								scheme[key] = 'model.list';
							}
							else if (value instanceof Array) {
								scheme[key] = 'array';
							} else {
								scheme[key] = 'set';
								_walker(value, key);
							}
						}
						else {
							scheme[key] = _type(value);
						}
					});
				}
				else {
					scheme[prefix] = _type(attrs);
				}
			})(defaults);
		}

		// Генерируем метод установки обязательных параметров
		/* istanbul ignore else */
		if (required.length) {
			/* jshint evil:true */
			prototype._setRequired = Function('_clone', 'return function _setRequired(attrs) {\n' + required.map(function (name) {
				return name.split('.').reduce(function (prev, part, idx, parts) {
					var chain = parts.slice(0, idx + 1).join('.');
					return [
						prev,
						'if (attrs.' + chain + ' === void 0)',
						'  attrs.' + chain + ' = ' + (chain === name ? '_clone(this.defaults.' + chain + ')' : '{}')
					].join('\n');
				}, '');
			}).join('\n') + '\n}')(_clone);
		}

		// Генерируем активатор вложенных моделей
		var _nestedKeys = Object.keys(nested);

		if (_nestedKeys.length) {
			var _activateCode = [];
			var _deactivateCode = [];

			_nestedKeys.forEach(function (absKey) {
				var attr = 'attrs["' + absKey.replace(/\./g, '"]["') + '"]';
				var events = (scheme[absKey] === 'model' ? 'change' : 'update') + ' add remove destroy reset';

				_activateCode.push(
					'var _this = this;',
					'var Class = this.nested["' + absKey + '"];',
					'var isList = this.scheme["' + absKey + '"] == "model.list";',
					'var callback = this["_nested:' + absKey + '"] = function (evt) {',
					'  _this._nestedHandleEvent("' + absKey + '", evt);',
					'};',
					attr + ' = (Class.map ? Class.map(' + attr + ') : new Class(' + attr + ')).on("' + events + '", callback);'
				);

				_deactivateCode.push(
					attr + '.off("' + events + '", this["_nested:' + absKey + '"]);'
				);
			}, this);

			/* jshint evil:true */
			prototype._activateNested = Function('attrs', _activateCode.join('\n'));
			prototype._deactivateNested = Function('attrs', _deactivateCode.join('\n'));
		} else {
			prototype._activateNested = void 0;
			prototype._deactivateNested = void 0;
		}

		// Генерируем геттеры
		if (getters) {
			if (getters === true) {
				getters = {};

				Object.keys(defaults).forEach(function (attr) {
					getters[attr] = null;
				});
			}

			// Генерируем метод обновления геттеров
			/* jshint evil:true */
			prototype._updateGetters = Function(Object.keys(getters).map(function (name, getter) {
				getter = getters[name];

				/* istanbul ignore else */
				if (prototype.hasOwnProperty(name)) {
					throw "Unable to create a getter `" + name + "`, this key is already in use";
				}
				else if (typeof getter === 'function') {
					prototype['__getter__' + name] = getter;
					getter = 'this.__getter__' + name + '()';
				}
				else if (typeof prototype[getter] === 'function') {
					getter = 'this.' + getter + '()';
				}
				else if (getter === null || typeof getter === 'string') {
					getter = 'this.get(' + _stringifyJSON(getter || name) + ')';
				}

				return 'this.' + name + ' = ' + getter;
			}).join('\n'));
		}

		return	ModelExt;
	};


	/**
	 * Класс коллекции
	 * @static
	 * @memberOf Model
	 * @type {Model.List}
	 */
	Model.List = List;
	Model.List.fn.Model = Model; // Спорно, знаю.


	/**
	 * Глобальная коллекция для модели
	 * @static
	 * @memberOf Model
	 * @type {Model.List}
	 */
	Model.all = new List;
	Model.all.local = true;


	/**
	 * Установить модели в глобальной колеккции
	 * @memberOf Model
	 * @param   {Model[]}   models
	 * @param   {Object}    options
	 * @returns {*}
	 */
	Model.set = function (models, options) {
		return this.all.set(models, options);
	};


	/**
	 * Получить модель из глобальной коллекции
	 * @memberOf Model
	 * @param   {string|number}  id
	 * @returns {Model|undefined}
	 */
	Model.get = function (id) {
		return this.all.get(id);
	};


	/**
	 * Получить модель из глобальной коллекции даже если её нет
	 * @memberOf Model
	 * @param   {string|number}  id
	 * @returns {Model}
	 */
	Model.getSafe = function (id) {
		return this.all.getSafe(id);
	};


	/**
	 * Создание mock для модели
	 * @memberOf Model
	 * @param  {Object}  mocks
	 */
	Model.mock = function (mocks) {
		for (var method in mocks) {
			var url,
				variants = [].concat(mocks[method]),
				i = 0,
				n = variants.length,
				query
			;

			for (; i < n; i++) {
				url = this.url(method, variants[i].query || {});
				query = method == 'add' ? new this(variants[i].query).toJSON() : variants[i].query;

				this.fn.request.mock({
					url: url,
					once: variants[i].once,
					type: /^find/.test(method) ? 'GET' : (/remove/.test(method) && !this.fn.request.setup('emulateHTTP') ? 'DELETE' : 'POST'),
					data: /^(add|save|remove)$/.test(method) ? this.fn.prepareSendData(method, query) : query,
					status: variants[i].status,
					body: variants[i].body,
					responseText: variants[i].result
				});
			}
		}
	};


	/**
	 * Сформировать URL
	 * @memberOf Model
	 * @param   {string}  name
	 * @param   {Object}  [params]
	 * @returns {string}
	 */
	Model.url = function (name, params) {
		var url = this.fn[name + 'Url'] || this.fn.url;

		/* istanbul ignore else */
		if (typeof url === 'function') {
			url = url(params);
		}

		return String(url).replace(/:([a-z_]+)/g, function (_, name) {
			return params[name] || '';
		}).replace(/([^$\/])\/+/g, '$1/');
	};


	/**
	 * Получить данные от сервера, либо из кеша
	 * @memberOf Model
	 * @param   {Object}   query
	 * @param   {boolean}  [single]
	 * @param   {boolean}  [force]
	 * @returns {Promise}
	 */
	Model.fetchData = function (query, single, force) {
		var meta = logger.meta(-2),
			XModel = this,
			storage = XModel.fn.storage,
			method = single ? 'findOne' : 'find',
			promise,

			findReq = function () {
				// Формируем url
				var url = XModel.url(method, query);

				// В стородже ничего, выполняем запрос
				return XModel.fn.request.get(
					url,
					query,
					{
						logger: XModel.fn.className + '.' + method,
						loggerMeta: meta,
						dataType: 'json'
					}).then(function (req) {
						// Данные получены, сохраняем в хранилище
						var body = XModel.fn.parse(req.body, req);
						storage && storage.save(method, query, body);
						return body;
					});
			}
		;

		query = query || {};

		if (storage && !force) {
			// Пробуем получить данные из хранилища
			promise = logger.wrap('[[' + XModel.fn.className + '.storage.' + method + ']]', query, storage[method](query))['catch'](findReq);
		} else {
			promise = findReq();
		}

		/* jshint expr:true */
		promise.__logger__ && (promise.__logger__.meta = meta);
		promise.__noLog = true;

		return promise;
	};


	/**
	 * Получить коллекцию
	 * @memberOf Model
	 * @param   {Object}   [query]   запрос
	 * @param   {Object}   [options] опции
	 * @returns {ModelListPromise}
	 */
	Model.find = function find(query, options) {
		return (new this.List).fetch(query, options);
	};


	/**
	 * Получить модель
	 * @memberOf Model
	 * @param   {Object|string}   query   запрос или id
	 * @returns {Promise}
	 */
	Model.findOne = function findOne(query) {
		var XModel = this,
			idAttr = XModel.fn.idAttr,
			hasOne = !!(XModel.fn.findOneUrl || XModel.fn.url),
			model,
			id,
			promise,
			queryKey
		;

		/* jshint eqnull:true */
		if ((query != null) && !(query instanceof Object)) {
			id = query;
			(query = {})[idAttr] = id;
		} else {
			query = query || /* istanbul ignore next */ {};
		}

		// Пробуем получить модель из глобальной коллекции или зарезервировать его в длкальном хранилиже.
		id = query[idAttr];
		queryKey = _stringifyJSON(query);
		model = XModel.all.get(id);

		if (model && !model.expired && model.isDataFully(query)) {
			promise = Promise.resolve(model);
		}
		else {
			// Если нет `findOneUrl` то делаем запрос без параметров,
			// после чего из коллекции получем модель
			promise = this.fetchData(hasOne ? query : {}, hasOne)
				.then(function (attrs) {
					var err;

					if (!hasOne || id == null) {
						attrs = (id == null)
									? ((attrs instanceof Array) ? attrs[0] : attrs)
									: attrs.filter(function (attrs) { return attrs[idAttr] == id; })[0]
						;
					}

					if (attrs) {
						// Получаем "safe" модель
						model = XModel.all.getSafe(attrs[idAttr]);

						model.expired = false;
						model.set(attrs, {clean: true, query: query, sync: true});

						XModel.all.set([model]);

						return model;
					}
					else {
						return Promise.reject(new Error('MODEL_NOT_FOUND'));
					}
				})
			;
		}

		return promise;
	};


	/**
	 * Создать и сохранить модель
	 * @param   {Object}  attrs
	 * @returns {Promise}
	 */
	Model.save = function (attrs) {
		var model = new this(attrs);
		return model.save();
	};


	/**
	 * Мапинг данных в модель или коллекцию
	 * @memberOf Model
	 * @param   {Object|Object[]} data
	 * @returns {Model|Model.List}
	 */
	Model.map = function (data) {
		var result = this.all.set([].concat(data), {clone: true});
		return (data instanceof Array) ? result : result[0];
	};


	/**
	 * Наблюдать за изменениями модели (только для браузеров с поддердкой Object.observe)
	 * @param {string} level  уровень: `log`, `info`, `warn` или `error`
	 * @param {Model|Model.List|Array|function} target  цель наблюдения, если передана функция, то следим за `all`
	 * @param {function} [callback]   Функция, вызываемая при возникновении изменений в объекте
	 */
	/* istanbul ignore next */
	Model.observe = function (level, target, callback) {
		if (!callback) {
			if (target instanceof Function) {
				callback = target;
			}

			target = this.all;
		}

		if (!(target instanceof Array || target instanceof List)) {
			target = [target];
		}

		level = level || 'log';

		var observer = function (chain, changes) {
			changes.forEach(function (change) {
				var attr = change.name,
					newValue = chain === '' ?
								this[attr] :
								this.get((chain.indexOf('.') > 0 ? chain.substr(chain.indexOf('.') + 1) + '.' : '') + attr);

				console[level](this.className +
					'(' + this.id + ')' +
					(chain ? '.' + chain : '') +
					'.{' + attr + '} is ' +
					(change.type === 'add' ? 'added' : 'updated') +
					': {' + change.oldValue + '} → {' + newValue + '}'
				);
			}, this);

			/* jshint expr:true */
			callback && callback(this, level, type, changes);

			if (level === 'error') {
				/* jshint -W087 */
				debugger;
			}
		};

		target.forEach(function (model) {
			Object.observe(model, observer.bind(model, ''));

			(function _next(chain, attrs) {
				if (attrs instanceof Object && !attrs.set) {
					Object.observe(attrs, observer.bind(model, chain.join('.')));

					Object.keys(attrs).forEach(function (key) {
						_next(chain.concat(key), attrs[key]);
					});
				}
			})(['attributes'], model.attributes);
		});
	};


	// Подмешиваем Emitter
	Emitter.apply(Model.fn);

	// Export
	Model.version = '0.14.0';
	return Model;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	__webpack_require__(41),
	__webpack_require__(131),
	__webpack_require__(89),
	__webpack_require__(27),
	__webpack_require__(104)
], __WEBPACK_AMD_DEFINE_RESULT__ = (function (
	/** logger */logger,
	/** request */request,
	/** Emitter */Emitter,
	/** Promise */Promise,
	/** util */util
) {
	"use strict";


	var R_URL_VERSION = /^\/?v\d+/,
		R_URL_LAST_SLASH = /\/$/,
		R_URL_FIRST_SLASH = /^\//,
		R_URL_2xSLASH = /\/{2,}/g,
		R_URL_NO_FIRST_2xSLASH = /([^$\/])\/+/g,

		_stringify = JSON.stringify,
		_cloneObject = util.cloneObject
	;


	/**
	 * Объект для работы с API.
	 * Для подключения дополнительный возможностей, таких как обработка SDC и т.п. нужно [их подключить](statuses/) ;]
	 * @class  RPC
	 * @mixes  Emitter
	 */
	var RPC = {
			all: Promise.all,
			request: request,
			Promise: Promise,
			errorHandler: []
		},

		_settings = {
			version: 1,
			sdcUrl: '//auth.mail.ru/sdc',
			baseUrl: '//api.mail.ru/',
			timeout: 10000,
			email: '',
			token: '',
			htmlencoded: false,
			tokenRetries: 2,
			emulateHTTP: true,
			session: ''
		},

		_hasOwn = Object.prototype.hasOwnProperty;


	/**
	 * Трансляция кодов ответа в имена статусов API.
	 * @type {Object}
	 * @memberof RPC
	 */
	RPC.codes = {
		102: 'processing',
		200: 'ok',
		202: 'accepted',
		203: 'non_authoritative',
		206: 'partial',
		301: 'move',
		304: 'notmodified',
		400: 'invalid',
		402: 'payment_required',
		403: 'denied',
		404: 'notfound',
		406: 'unacceptable',
		408: 'timeout',
		409: 'conflict',
		417: 'expectation_failed',
		422: 'unprocessable',
		423: 'locked',
		424: 'failed_dependency',
		426: 'upgrade_required',
		429: 'many_requests',
		449: 'retry_with',
		451: 'unavailable_for_legal_reasons',
		500: 'fail',
		501: 'not_implemented',
		503: 'unavaliable',
		507: 'insufficient'
	};


	/**
	 * Трансляция статусов в коды ответа API.
	 * @type {Object}
	 * @memberof RPC
	 */
	RPC.statuses = {};
	for (var code in RPC.codes) {
		RPC.statuses[RPC.codes[code]] = code;
	}


	// Делаем из входных данных для RPC.mock объект для $.mockjax
	function _makeMockSettings(path, settings) {
		if (typeof path === 'object') {
			settings = path;
			path = settings.url;
		}

		settings = settings || /* istanbul ignore next */ {};
		var data = settings.data || {};

		return {
			url: RPC.normalizeUrl(path),
			once: settings.once,
			contentType: 'application/json',
			type: settings.type,
			headers: settings.headers || {},
			responseTime: settings.responseTime || 15,
			data: data,
			responseText: _stringify(settings.responseText || {
				body: settings.body || '',
				status: settings.status || /* istanbul ignore next */ 200,
				email: settings.email || '',
				htmlencoded: settings.htmlencoded || '',
				last_modified: settings.last_modified || ''
			}),
			response: settings.response
		};
	}


	// Создаем объект запроса, указанного типа (POST/GET)
	function _call(path, data, options, type) {
		options = _cloneObject(options);
		options.type = type;
		options.loggerMeta = options.loggerMeta || logger.meta(-2);

		return RPC.call(path, data, options);
	}


	/**
	 * Метод для установки/получения настроек.
	 * @static
	 * @method
	 * @memberof RPC
	 * @param  {Object|string}  [options]  Может быть как объектом настроек, так и строковым ключом
	 * @param  {*}  [value]  Используется только для установки значения
	 * @returns {*}
	 */
	RPC.setup = function (options, value) {
		if (options === undefined) { // get all settings
			return _settings;
		} else {
			if (value !== undefined) { // set setting
				_settings[options] = value;
			} else if (typeof options === 'string') { // get setting, options - is a key
				return _settings[options];
			} else {
				for (var key in options) { // set bundle of settings
					/* istanbul ignore next */
					if (_hasOwn.call(options, key)) {
						_settings[key] = options[key];
					}
				}
			}
		}
	};

	/**
	 * Нормализация пути
	 * @static
	 * @method
	 * @memberof RPC
	 * @param   {string}  path  вызываемый метод
	 * @returns {string}
	 */
	RPC.normalizeUrl = function (path) {
		var baseUrl = _settings.baseUrl;
		var url = String(path || "");

		/* istanbul ignore else */
		if (R_URL_FIRST_SLASH.test(url)) {
			url = url.replace(R_URL_NO_FIRST_2xSLASH, '$1/');
		} else if (url.indexOf(baseUrl) === -1) {
			if (_settings.version && !R_URL_VERSION.test(url)) {
				url = '/v' + _settings.version + '/' + url;
			}

			// Вырезаем все повторяющиеся слеши, кроме первых двух
			url = baseUrl.replace(R_URL_LAST_SLASH, "") + ("/" + url).replace(R_URL_2xSLASH, "/");
		}

		return url;
	};

	/**
	 * Метод для получения URL конца API
	 * @static
	 * @method
	 * @memberof RPC
	 * @param  {string} method  название метода или абсолютный если начинается с "/" или "//"
	 * @param  {object} [data]  данные запроса
	 * @return {string}
	 */
	RPC.url = function (method, data) {
		return RPC.normalizeUrl(method);
	};

	/**
	 * Метод проверяет активна ли для пользователя безопасная сессия (см. [Авторизация](http://api.tornado.dev.mail.ru/auth))
	 * @static
	 * @method
	 * @memberof RPC
	 * @returns {boolean}
	 */
	RPC.hasSession = function () {
		return !!_settings.session;
	};

	/**
	 * Метод для проверки наличия токена
	 * @static
	 * @method
	 * @memberof RPC
	 * @return {boolean}
	 */
	RPC.hasToken = function () {
		return !!_settings.token;
	};


	/**
	 * Метод, сбрасывыющий токен
	 * @static
	 * @method
	 * @memberof RPC
	 */
	RPC.resetToken = function () {
		_settings.token = '';
	};


	/**
	 * Получение токена. В случае успешного выполнения устанавливает полученный токен.
	 * @static
	 * @memberof RPC
	 * @return {Promise}
	 */
	RPC.token = function () {
		return RPC.call('tokens').then(function (/* RPC.Request */req) {
			/* jshint expr:true */
			return (_settings.token = req.get('body.token'));
		});
	};


	/**
	 * Универсальный метод для отправки запроса к API.
	 * В случае ответа xhr.is('denied:token') запрашивает токен.
	 * @static
	 * @method
	 * @memberof RPC
	 * @param  {string}        method метод API
	 * @param  {Object}        [data] данные запроса
	 * @param  {Object}        [options] настройки для request
	 * @return {RPC.Request}
	 */
	RPC.call = function call(method, data, options) {
		options = _cloneObject(options);
		options.timeout = options.timeout || _settings.timeout;
		options.Request = RPCRequest;
		options.dataType = 'json';
		options.type = options.type ? options.type.toUpperCase() : 'POST';
		options.loggerMeta = options.loggerMeta || logger.meta(-1);

		data  = _cloneObject(data || {});

		/* istanbul ignore else */
		if (!data.email && _settings.email) {
			data.email = _settings.email;
		}

		/* jshint eqnull:true */
		/* istanbul ignore else */
		if (_settings.htmlencoded != null) {
			data.htmlencoded = _settings.htmlencoded;
		}

		/* istanbul ignore else */
		if (_settings.token) {
			data.token = _settings.token;
		}

		/* istanbul ignore else */
		if (_settings.emulateHTTP === true && options.type != 'GET' && options.type != 'POST') {
			options.type = 'POST';
		}

		/* istanbul ignore else */
		if (_settings.session) {
			data.session = _settings.session;
		}

		options.logger = options.logger || method;

		return request(RPC.url(method, data), RPC.serialize(data), options);
	};

	/**
	 * Метод сериализации данных, перед отправкой
	 * может быть переопределен
	 * @static
	 * @method
	 * @memberof RPC
	 * @param {*} data - даные
	 * @returns {*}
	 */
	RPC.serialize = function (data) {
		return data;
	};

	/**
	 * Метода для совершения GET зароса
	 * @static
	 * @method
	 * @memberof RPC
	 * @param    {string}        path       метод API
	 * @param    {Object}        [data]     данные запроса
	 * @param    {Object}        [options]  опции
	 * @returns  {RPC.Request}
	 */
	RPC.get = function get(path, data, options) {
		return _call(path, data, options, 'GET');
	};


	/**
	 * Метода для совершения POST зароса
	 * @static
	 * @method
	 * @memberof RPC
	 * @param    {string}        path       метод API
	 * @param    {Object}        [data]     данные запроса
	 * @param    {Object}        [options]  опции
	 * @returns  {RPC.Request}
	 */
	RPC.post = function post(path, data, options) {
		return _call(path, data, options, 'POST');
	};


	/**
	 * Выполнить действия «пачкой»    ***Экспериментальный метод***
	 * @static
	 * @method
	 * @memberof RPC
	 * @param	{Function} executor
	 * @returns {Promise}
	 */
	RPC.batch = function (executor) {
		return request.batch(executor, this.url('batch'));
	};


	/**
	 * Эмуляция XHR
	 * @static
	 * @method
	 * @memberof RPC
	 * @param    {string}   path        Имя метода API
	 * @param    {Object}   [settings]  Результат запроса
	 * @return   {number}               id мока
	 */
	RPC.mock = function (path, settings) {
		return request.mock(_makeMockSettings(path, settings));
	};


	/**
	 * Разовая эмуляция XHR
	 * @static
	 * @method
	 * @memberof RPC.mock
	 * @param    {string}  path        Имя метода API
	 * @param    {Object}  [settings]  Результат запроса
	 * @returns  {number}              id мока
	 */
	RPC.mock.once = function (path, settings) {
		return request.mock.once(_makeMockSettings(path, settings));
	};


	/**
	 * Объект запроса RPC
	 * @class Request
	 * @memberOf RPC
	 * @constructs RPC.Request
	 * @extends request.Request
	 */
	var RPCRequest = function () {
		/**
		 * Время изменения, аналог If-Modified-Since HTTP заголовка.
		 * @type {number}
		 * @name lastModified
		 * @memberof RPC.Request#
		 */
		this.lastModified = null;

		/**
		 * Флаг, указывающий на включенное/отключенное htmlencode
		 * конвертирование значений полей в ответе API.
		 * @type {boolean}
		 * @name htmlencoded
		 * @memberof RPC.Request#
		 */
		this.htmlencoded = null;

		/**
		 * email учетки, над которой производится действие
		 * @type {string}
		 * @name email
		 * @memberof RPC.Request#
		 */
		this.email = null;

		/**
		 * Имя статуса ответа API.
		 * @type {string}
		 * @name statusName
		 * @memberof RPC.Request#
		 */
		this.statusName = null;

		return request.Request.apply(this, arguments);
	};

	// Extend
	RPCRequest.prototype = Object.create(request.Request.prototype, {
		constructor: {value: RPCRequest}
	});


	/**
	 * Завершить запрос
	 * @name RPC.Request#end
	 * @method
	 * @param  {string|boolean} err
	 * @param  {Object} api
	 * @return {*}
	 */
	RPCRequest.prototype.end = function (err, api) {
		// сохраняем реальный статус
		this.httpStatus = this.status;
		
		if (!err && !this.aborted) {
			// Всё ок, API ответило корретно, никаких http ошибок
			for (var key in api) {
				/* istanbul ignore else */
				if (_hasOwn.call(api, key)) {
					this[util.toCamelCase(key)] = api[key];
				}
			}

			// Преобразуем код в название статуса
			this.statusName = RPC.codes[api.status];

			// если пользователю была выставлена безопасная сессия, то сохранить ее
			if (api.session) {
				_settings.session = api.session;
			}

			// В родительский метод передаем именно ответ api.body
			api = api.body;
			err = err || !this.isOK(); // todo: проверить всё это
		}

		// вызываем родительский метод
		return request.Request.fn.end.call(this, err, api);
	};


	/**
	 * Проверить свойство на истинность
	 * @param  {string}  keys
	 * @return {boolean}
	 * @method RPC.Request#is
	 */
	RPCRequest.prototype.is = function (keys) {
		var R_STATUS = /\b(\w+)(?::(\w+))?\b/g, // Не кешируем RegExp, а то «криво» будет работа exec
			key,
			val,
			matches;

		while (!!(matches = R_STATUS.exec(keys))) {
			key = matches[1]; // статус
			val = matches[2]; // значение

			if (RPC.statuses[key] == this.status && (!val || this.body == val)) {
				return true;
			}
		}

		return request.Request.fn.is.call(this, keys);
	};



	// Доступ к RPCRequest
	RPC.Request = RPCRequest;


	// Подмешиваем Emitter
	Emitter.apply(RPC);


	// Обработка ошибок
	request.on('error', function (evt, req) {
		var i = RPC.errorHandler.length,
			handle,
			result;

		while (i--) {
			handle = RPC.errorHandler[i];

			if (req.is(handle.status)) {
				result = handle.process(req);

				/* istanbul ignore else */
				if (result) {
					evt.preventDefault();
					return req.retry(result, true);
				}
			}
		}
	});


	/**
	 * Создать `RPC.Request` из XHR
	 * @param  {string} url
	 * @param  {Object} data
	 * @param  {Object|XMLHttpRequest} xhr
	 * @return {RPC.Request}
	 * @memberOf RPC
	 */
	RPC.from = function (url, data, xhr) {
		var req = request.from.apply(request, arguments);

		/* istanbul ignore else */
		if (req.isOK()) {
			req.status = req.get('body.status');
			req.body = req.get('body.body');
		}

		return req;
	};


	/**
	 * Интеграция произвольного функционала в рабочий процесс отправки и обработки запроса к API
	 * @param  {Object}    options    опции запроса
	 * @param  {Function}  transport  функция отправки запроса
	 * @return {RPC.Request}
	 * @method
	 * @memberOf RPC
	 */
	RPC.workflow = request.workflow;


	// Export
	RPC.version = '0.10.1';
	return RPC;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 89:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * @author RubaXa <trash@rubaxa.org>
 * @license MIT
 */
(function () {
	"use strict";

	var RDASH = /-/g,
		RSPACE = /\s+/,

		r_camelCase = /-(.)/g,
		camelCase = function (_, chr) {
			return chr.toUpperCase();
		},

		hasOwn = ({}).hasOwnProperty,
		emptyArray = []
	;



	/**
	 * Получить список слушателей
	 * @param    {Object}  target
	 * @param    {string}  name
	 * @returns  {Array}
	 * @memberOf Emitter
	 */
	function getListeners(target, name) {
		var list = target.__emList;

		name = name.toLowerCase().replace(RDASH, '');

		if (list === void 0) {
			list = target.__emList = {};
			list[name] = [];
		}
		else if (list[name] === void 0) {
			list[name] = [];
		}

		return list[name];
	}



	/**
	 * Излучатель событий
	 * @class Emitter
	 * @constructs Emitter
	 */
	var Emitter = function () {
	};
	Emitter.fn = Emitter.prototype = /** @lends Emitter# */ {
		constructor: Emitter,


		/**
		 * Прикрепить обработчик для одного или нескольких событий, поддерживается `handleEvent`
		 * @param   {string}    events  одно или несколько событий, разделенных пробелом
		 * @param   {Function}  fn      функция обработчик
		 * @returns {Emitter}
		 */
		on: function (events, fn) {
			events = events.split(RSPACE);

			var n = events.length, list;

			while (n--) {
				list = getListeners(this, events[n]);
				list.push(fn);
			}

			return this;
		},


		/**
		 * Удалить обработчик для одного или нескольких событий
		 * @param   {string}    [events]  одно или несколько событий, разделенных пробелом
		 * @param   {Function}  [fn]      функция обработчик, если не передать, будут отвязаны все обработчики
		 * @returns {Emitter}
		 */
		off: function (events, fn) {
			if (events === void 0) {
				this.__emList = events;
			}
			else {
				events = events.split(RSPACE);

				var n = events.length;

				while (n--) {
					var list = getListeners(this, events[n]), i = list.length, idx = -1;

					if (arguments.length === 1) {
						list.splice(0, 1e5); // dirty hack
					} else {
						if (list.indexOf) {
							idx = list.indexOf(fn);
						} else { // old browsers
							while (i--) {
								/* istanbul ignore else */
								if (list[i] === fn) {
									idx = i;
									break;
								}
							}
						}

						if (idx !== -1) {
							list.splice(idx, 1);
						}
					}
				}
			}

			return this;
		},


		/**
		 * Прикрепить обработчик события, который выполняется единожды
		 * @param   {string}    events  событие или список
		 * @param   {Function}  fn      функция обработчик
		 * @returns {Emitter}
		 */
		one: function (events, fn) {
			var proxy = function () {
				this.off(events, proxy);
				return fn.apply(this, arguments);
			};

			return this.on(events, proxy);
		},


		/**
		 * Распространить событие
		 * @param   {string}  type    тип события
		 * @param   {Array}   [args]  аргумент или массив аргументов
		 * @returns {*}
		 */
		emit: function (type, args) {
			var list = getListeners(this, type),
				i = list.length,
				fn,
				ctx,
				tmp,
				retVal,
				argsLength
			;

			type = 'on' + type.charAt(0).toUpperCase() + type.substr(1);

			if (type.indexOf('-') > -1) {
				type = type.replace(r_camelCase, camelCase);
			}

			if (typeof this[type] === 'function') {
				retVal = this[type].apply(this, [].concat(args));
			}

			if (i > 0) {
				args = args === void 0 ? emptyArray : [].concat(args);
				argsLength = args.length;

				while (i--) {
					fn = list[i];
					ctx = this;

					/* istanbul ignore else */
					if (fn !== void 0) {
						if (fn.handleEvent !== void 0) {
							ctx = fn;
							fn = fn.handleEvent;
						}

						if (argsLength === 0) {
							tmp = fn.call(ctx);
						}
						else if (argsLength === 1) {
							tmp = fn.call(ctx, args[0]);
						}
						else if (argsLength === 2) {
							tmp = fn.call(ctx, args[0], args[1]);
						}
						else {
							tmp = fn.apply(ctx, args);
						}

						if (tmp !== void 0) {
							retVal = tmp;
						}
					}
				}
			}

			return retVal;
		},


		/**
		 * Распространить `Emitter.Event`
		 * @param   {string}  type    тип события
		 * @param   {Array}   [args]  аргумент или массив аргументов
		 * @param   {*}   [details]  детали объекта события
		 * @returns {Emitter}
		 */
		trigger: function (type, args, details) {
			var evt = new Event(type);

			evt.target = evt.target || this;
			evt.details = details;
			evt.result = this.emit(type.type || type, [evt].concat(args));

			return this;
		}
	};



	/**
	 * Событие
	 * @class Emitter.Event
	 * @constructs Emitter.Event
	 * @param   {string|Object|Event}  type  тип события
	 * @returns {Emitter.Event}
	 */
	function Event(type) {
		if (type instanceof Event) {
			return type;
		}

		if (type.type) {
			for (var key in type) {
				/* istanbul ignore else */
				if (hasOwn.call(type, key)) {
					this[key] = type[key];
				}
			}

			type = type.type;
		}

		this.type = type.toLowerCase().replace(RDASH, '');
	}

	Event.fn = Event.prototype = /** @lends Emitter.Event# */ {
		constructor: Event,


		/**
		 * Действие по умолчанию отмененом
		 * @type {boolean}
		 */
		defaultPrevented: false,


		/**
		 * Вcплытие события отменено
		 * @type {boolean}
		 */
		propagationStopped: false,


		/**
		 * Позволяет определить, было ли отменено действие по умолчанию
		 * @returns {boolean}
		 */
		isDefaultPrevented: function () {
			return this.defaultPrevented;
		},


		/**
		 * Отменить действие по умолчанию
		 */
		preventDefault: function () {
			this.defaultPrevented = true;
		},


		/**
		 * Остановить продвижение события
		 */
		stopPropagation: function () {
			this.propagationStopped = true;
		},


		/**
		 * Позволяет определить, было ли отменено продвижение события
		 * @return {boolean}
		 */
		isPropagationStopped: function () {
			return this.propagationStopped;
		}
	};


	/**
	 * Подмешать методы к объекту
	 * @static
	 * @memberof Emitter
	 * @param   {Object}  target    цель
	 * @returns {Object}
	 */
	Emitter.apply = function (target) {
		target.on = Emitter.fn.on;
		target.off = Emitter.fn.off;
		target.one = Emitter.fn.one;
		target.emit = Emitter.fn.emit;
		target.trigger = Emitter.fn.trigger;
		return target;
	};


	// Версия модуля
	Emitter.version = "0.4.0";


	// exports
	Emitter.Event = Event;
	Emitter.getListeners = getListeners;


	if (true) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return Emitter;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
})();


/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9qYW0vanNzZGsvdXRpbHMvdXRpbC91dGlsLmpzIiwid2VicGFjazovLy8uL2phbS9qc3Nkay9yZXF1ZXN0L3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vamFtL2pzc2RrL2NvbmZpZy9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vamFtL2pzc2RrL1Byb21pc2UvUHJvbWlzZS5qcyIsIndlYnBhY2s6Ly8vLi9qYW0vanNzZGsvTW9kZWwuTGlzdC9Nb2RlbC5MaXN0LmpzIiwid2VicGFjazovLy8uL2phbS9qc3Nkay9sb2dnZXIvbG9nZ2VyLmpzIiwid2VicGFjazovLy8uL2phbS9qc3Nkay9tYWlsL2FjdGlvbnMvUGFzc3dvcmRSZWNvdmVyeS9QYXNzd29yZFJlY292ZXJ5LmpzIiwid2VicGFjazovLy8uL2phbS9qc3Nkay9BY3Rpb24vQWN0aW9uLmpzIiwid2VicGFjazovLy8uL2phbS9qc3Nkay9Nb2RlbC9Nb2RlbC5qcyIsIndlYnBhY2s6Ly8vLi9qYW0vanNzZGsvUlBDL1JQQy5qcyIsIndlYnBhY2s6Ly8vLi9qYW0vanNzZGsvRW1pdHRlci9FbWl0dGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUpBQXFCLENBQUMsd0JBQVEsRUFBRSx1QkFBUyxDQUFDLG1DQUFFO0FBQzVDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLFNBQVM7QUFDeEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsU0FBUztBQUN4Qjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVU7QUFDeEIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxlQUFlLEVBQUU7QUFDakIsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlO0FBQ2Y7QUFDQTtBQUNBLGVBQWU7O0FB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V0FBVztBQUNYO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0EsY0FBYyxPQUFPO0FBQ3JCLGNBQWMsT0FBTztBQUNyQixjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsT0FBTztBQUNyQixjQUFjLGNBQWM7QUFDNUIsY0FBYyxPQUFPO0FBQ3JCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGNBQWM7QUFDNUIsY0FBYyxFQUFFO0FBQ2hCLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFD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dGlscy91dGlsJywgWydqcXVlcnknLCAnUHJvbWlzZSddLCBmdW5jdGlvbiAoJCwgUHJvbWlzZSkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIHNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCxcblx0XHRzZXRJbW1lZGlhdGUgPSB3aW5kb3cuc2V0SW1tZWRpYXRlIHx8IHNldFRpbWVvdXQ7XG5cblx0LyoqXG5cdCAqIEB0eXBlZGVmICB7RnVuY3Rpb259IERlYm91bmNlZEZ1bmN0aW9uXG5cdCAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwaWRcblx0ICogQHByb3BlcnR5IHtGdW5jdGlvbn0gY2FuY2VsXG5cdCAqL1xuXG5cblx0LyoqXG5cdCAqINCR0LDQt9C+0LLRi9C1INGD0YLQuNC70LjRgtGLXG5cdCAqIEBtb2R1bGUgdXRpbFxuXHQgKi9cblx0dmFyIHV0aWwgPSB7XG5cblx0XHQvKipcblx0XHQgKiDQntCx0YrQtdC00LjQvdGP0LXRgiDRgdC+0LTQtdGA0LbQuNC80L7QtSDQtNCy0YPRhSDQuNC70Lgg0LHQvtC70LXQtSDQvtCx0YrQtdC60YLQvtCyLlxuXHRcdCAqIEBtZW1iZXJPZiB1dGlsXG5cdFx0ICogQHBhcmFtICB7Li4uT2JqZWN0fSBhcmdzXG5cdFx0ICogQHJldHVybnMge09iamVjdH1cblx0XHQgKi9cblx0XHRleHRlbmQ6IGZ1bmN0aW9uIChhcmdzKSB7XG5cdFx0XHRyZXR1cm4gJC5leHRlbmQuYXBwbHkoJCwgYXJndW1lbnRzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQmtC70L7QvdC40YDQvtCy0LDQvdC40LUg0YfQtdGA0LXQtyBKU09OXG5cdFx0ICogQHBhcmFtICAgeyp9IHNyY1xuXHRcdCAqIEByZXR1cm5zIHsqfVxuXHRcdCAqL1xuXHRcdGNsb25lSlNPTjogZnVuY3Rpb24gKHNyYykge1xuXHRcdFx0cmV0dXJuIHR5cGVvZiBzcmMgPT09ICdvYmplY3QnID8gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzcmMpKSA6IHNyYztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQkdGL0YHRgtGA0L7QtSDQutC70L7QvdC40YDQvtCy0LDQvdC40LUg0L7QsdGK0LXQutGC0LBcblx0XHQgKiBAbWVtYmVyT2YgdXRpbFxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBvYmpcblx0XHQgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGNsb25lT2JqZWN0OiBmdW5jdGlvbiAob2JqKSB7XG5cdFx0XHR2YXIgcmV0ID0ge30sIGtleTtcblxuXHRcdFx0aWYgKG9iaiAmJiBvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcblx0XHRcdFx0Zm9yIChrZXkgaW4gb2JqKSB7XG5cdFx0XHRcdFx0cmV0W2tleV0gPSBvYmpba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCc0LXRgtC+0LQg0LTQu9GPINC/0YDQuNCy0LXQtNC10L3QuNGPINGB0YLRgNC+0Log0LogY2FtZWxDYXNlINC90L7RgtCw0YbQuNC4XG5cdFx0ICogQG1lbWJlck9mIHV0aWxcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IHN0ciAgICAgICAgICDQodGC0YDQvtC60LAg0LIgc25ha2Ug0L3QvtGC0LDRhtC40Lhcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IFtkZWxpbWl0ZXJdICDQoNCw0LfQtNC10LvQuNGC0LXQu9GMLCDQv9C+INGD0LzQvtC70YfQsNC90LjRjiAnXydcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgICDQodGC0YDQvtC60LAg0LIgY2FtZWxDYXNlXG5cdFx0ICovXG5cdFx0dG9DYW1lbENhc2U6IGZ1bmN0aW9uIChzdHIsIGRlbGltaXRlcikge1xuXHRcdFx0ZGVsaW1pdGVyID0gZGVsaW1pdGVyIHx8ICdfJztcblxuXHRcdFx0dmFyIHJlZ2V4cCA9IG5ldyBSZWdFeHAoJyhcXFxcJyArIGRlbGltaXRlciArICdcXFxcdyknLCAnZycpO1xuXG5cdFx0XHRyZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhwLCBmdW5jdGlvbiAobWF0Y2gpIHtcblx0XHRcdFx0cmV0dXJuIG1hdGNoWzFdLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQktGL0L/QvtC70L3QuNGC0Ywg0YTRg9C90LrRhtC40Y4g0LIg0YHQu9C10LTRg9GO0YnQtdC8IMKr0YLQuNC60LXCq1xuXHRcdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gZm5cblx0XHQgKiBAcGFyYW0gICB7Ym9vbGVhbn0gIFtyZXR1cm5GdW5jXVxuXHRcdCAqIEByZXR1cm5zIHt1bmRlZmluZWR8RnVuY3Rpb259XG5cdFx0ICovXG5cdFx0bmV4dFRpY2s6IGZ1bmN0aW9uIChmbiwgcmV0dXJuRnVuYykge1xuXHRcdFx0aWYgKHJldHVybkZ1bmMpIHtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cyxcblx0XHRcdFx0XHRcdF90aGlzID0gdGhpcztcblxuXHRcdFx0XHRcdHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRmbi5hcHBseShfdGhpcywgYXJncyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2V0SW1tZWRpYXRlKGZuKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQntGC0LvQvtC20LjRgtGMINCy0YvQv9C+0LvQvdC10L3QuNC1INC80LXRgtC+0LTQsFxuXHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuXHRcdCAqIEBwYXJhbSAge251bWJlcn0gW21zXSDQvNC40L3QuNC80LDQu9GM0L3QsNGPINC30LDQtNCw0YDQttC60LAg0L/QtdGA0LXQtCDQstGL0L/QvtC70L3QtdC90LjQtdC8XG5cdFx0ICogQHBhcmFtICB7T2JqZWN0fSBbdGhpc0FyZ11cblx0XHQgKiBAcmV0dXJuIHtEZWJvdW5jZWRGdW5jdGlvbn1cblx0XHQgKi9cblx0XHRkZWJvdW5jZTogZnVuY3Rpb24gKGZuLCBtcywgdGhpc0FyZykge1xuXHRcdFx0dmFyIGRlYm91bmNlZCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHMsXG5cdFx0XHRcdFx0bGVuZ3RoID0gYXJncy5sZW5ndGgsXG5cdFx0XHRcdFx0Y3R4ID0gdGhpc0FyZyB8fCB0aGlzO1xuXG5cdFx0XHRcdGNsZWFyVGltZW91dChkZWJvdW5jZWQucGlkKTtcblx0XHRcdFx0ZGVib3VuY2VkLnBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdGlmIChsZW5ndGggPT09IDApIHtcblx0XHRcdFx0XHRcdGZuLmNhbGwoY3R4KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAobGVuZ3RoID09PSAxKSB7XG5cdFx0XHRcdFx0XHRmbi5jYWxsKGN0eCwgYXJnc1swXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKGxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRcdFx0Zm4uY2FsbChjdHgsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChsZW5ndGggPT09IDMpIHtcblx0XHRcdFx0XHRcdGZuLmNhbGwoY3R4LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRmbi5hcHBseShjdHgsIGFyZ3MpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgbXMpO1xuXHRcdFx0fTtcblxuXHRcdFx0ZGVib3VuY2VkLmNhbmNlbCA9IF9jYW5jZWxEZWJvdW5jZTtcblxuXHRcdFx0cmV0dXJuIGRlYm91bmNlZDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQkdGL0YHRgtGA0YvQuSBgYmluZGBcblx0XHQgKiBAcGFyYW0gIHsqfSAgICAgICAgIHRoaXNBcmdcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gIGZuXG5cdFx0ICogQHBhcmFtICB7QXJyYXl8bnVsbH0gICAgIFthcmdzXVxuXHRcdCAqIEBwYXJhbSAge0FycmF5fSAgICAgW2xpbWl0XVxuXHRcdCAqL1xuXHRcdGJpbmQ6IGZ1bmN0aW9uICh0aGlzQXJnLCBmbiwgYXJncywgbGltaXQpIHtcblx0XHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdFx0aWYgKGFyZ3MgPT0gbnVsbCkge1xuXHRcdFx0XHRhcmdzID0gW107XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICghQXJyYXkuaXNBcnJheShhcmdzKSkge1xuXHRcdFx0XHR0aHJvdyAndXRpbC5iaW5kOiBgYXJnc2AgbXVzdCBiZSBhcnJheSBvciBudWxsJztcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyIF9hcmdzID0gYXJncztcblx0XHRcdFx0dmFyIF9saW1pdCA9IGxpbWl0O1xuXG5cdFx0XHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdFx0XHRpZiAoX2xpbWl0ID09IG51bGwpIHtcblx0XHRcdFx0XHRfbGltaXQgPSBhcmd1bWVudHMubGVuZ3RoO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKF9saW1pdCA+IDApIHtcblx0XHRcdFx0XHRfYXJncyA9IGFyZ3Muc2xpY2UoKTtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX2xpbWl0OyBpKyspIHtcblx0XHRcdFx0XHRcdF9hcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZm4uYXBwbHkodGhpc0FyZyB8fCB0aGlzLCBfYXJncyk7XG5cdFx0XHR9O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDQotC+0YIg0LbQtSBgYmluZGAsINC90L4g0L3QtSDRg9GH0YPRgtGL0LLQsNGO0YLRgdGPINCw0YDQs9GD0LzQtdC90YLRiyDQv9GA0Lgg0LLRi9C30L7QstC1XG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb259ICBmblxuXHRcdCAqIEBwYXJhbSAge0FycmF5fSAgICAgW2FyZ3NdXG5cdFx0ICogQHBhcmFtICB7Kn0gICAgICAgICBbdGhpc0FyZ11cblx0XHQgKi9cblx0XHRiaW5kV2l0aG91dEFyZ3M6IGZ1bmN0aW9uIChmbiwgYXJncywgdGhpc0FyZykge1xuXHRcdFx0cmV0dXJuIEFycmF5LmlzQXJyYXkoYXJncylcblx0XHRcdFx0PyBmdW5jdGlvbiAoKSB7IHJldHVybiBmbi5hcHBseSh0aGlzQXJnIHx8IHRoaXMsIGFyZ3MpOyB9XG5cdFx0XHRcdDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZm4uY2FsbCh0aGlzQXJnIHx8IHRoaXMpOyB9XG5cdFx0XHQ7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHQvtC30LTQsNGC0Ywg0LzQsNGB0YHQuNCyINGN0LvQtdC80LXQvdGC0L7QslxuXHRcdCAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGhcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyW119XG5cdFx0ICovXG5cdFx0cmFuZ2U6IGZ1bmN0aW9uIChsZW5ndGgpIHtcblx0XHRcdHZhciBhcnJheSA9IFtdLFxuXHRcdFx0XHRpID0gMDtcblxuXHRcdFx0Zm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuXHRcdFx0XHRhcnJheS5wdXNoKGkpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYXJyYXk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0YHQstC+0LnRgdGC0LLQsCDQvtCx0YrQtdC60YLQvtCyINCyINC60L7Qu9C70LXQutGG0LjQuFxuXHRcdCAqIEBwYXJhbSB7QXJyYXl9ICBjb2xsZWN0aW9uXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHByb3BlcnR5IFxuXHRcdCAqIEByZXR1cm5zIHtBcnJheX1cblx0XHQgKi9cblx0XHRwbHVjazogZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHByb3BlcnR5KSB7XG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoY29sbGVjdGlvbikpIHtcblx0XHRcdFx0cmV0dXJuIFtdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY29sbGVjdGlvbi5tYXAoZnVuY3Rpb24gKG9iaikge1xuXHRcdFx0XHRyZXR1cm4gb2JqW3Byb3BlcnR5XTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDQodC+0LfQtNCw0YLRjCDQvtCx0YrQtdC60YJcblx0XHQgKiBAcGFyYW0ge0FycmF5fEFycmF5W119IGtleXNcblx0XHQgKiBAcGFyYW0ge0FycmF5fSAgICAgICAgIFt2YWx1ZXNdXG5cdFx0ICogQHJldHVybnMge09iamVjdH1cblx0XHQgKi9cblx0XHRvYmplY3Q6IGZ1bmN0aW9uIChrZXlzLCB2YWx1ZXMpIHtcblxuXHRcdFx0a2V5cyA9IChrZXlzID09PSB2b2lkKDApIHx8IGtleXMgPT09IG51bGwpID8gW10gOiBbXS5jb25jYXQoa2V5cyk7XG5cdFx0XHR2YWx1ZXMgPSB2YWx1ZXMgPT09IHZvaWQoMCkgPyBbXSA6IFtdLmNvbmNhdCh2YWx1ZXMpO1xuXG5cdFx0XHRyZXR1cm4ga2V5cy5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwga2V5LCBpbmRleCkge1xuXHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShrZXkpKSB7XG5cdFx0XHRcdFx0b2JqW2tleVswXV0gPSBrZXlbMV07XG5cblx0XHRcdFx0XHRyZXR1cm4gb2JqO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0b2JqW2tleV0gPSB2YWx1ZXNbaW5kZXhdO1xuXG5cdFx0XHRcdHJldHVybiBvYmo7XG5cdFx0XHR9LCB7fSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQvtC80LjRhNC40YbQuNGA0L7QstCw0YLRjCDQsNGB0LjQvdGF0YDQvtC90L3Rg9GOINGE0YPQvdC60YbQuNGOLCDQutC+0YLQvtGA0LDRjyDQstC+0LfQstGA0LDRidCw0LXRgiDQt9C90LDRh9C10L3QuNGPINGH0LXRgNC10LcgY2FsbGJhY2sgKGVyciwgcmVzKVxuXHRcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIC0g0YTRg9C90LrRhtC40Y8sINC60L7RgtC+0YDRg9GOINC90YPQttC90L4g0L/RgNC+0LzQuNGE0LjRhtC40YDQvtCy0LDRgtGMXG5cdFx0ICogQHBhcmFtIHsqfSBbY29udGV4dF0gLSDQutC+0L3RgtC10LrRgdGCINCy0YvQt9C+0LLQsCDRhNGD0L3QutGG0LjQuFxuXHRcdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gLSDQv9GA0L7QvNGE0LjRhtC40YDQvtCy0LDQvdGPINGE0YPQvdC60YbQuNGPXG5cdFx0ICovXG5cdFx0cHJvbWlzaWZ5OiBmdW5jdGlvbiAoZm4sIGNvbnRleHQpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbiBwcm9taXNpZnlXcmFwcGVyKCkge1xuXHRcdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cblx0XHRcdFx0aWYgKCFjb250ZXh0KSB7XG5cdFx0XHRcdFx0Y29udGV4dCA9IHRoaXM7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gcHJvbWlzaWZ5V3JhcHBlckNhbGxiYWNrKHJlc29sdmUsIHJlamVjdCkge1xuXG5cdFx0XHRcdFx0YXJncy5wdXNoKGZ1bmN0aW9uIChlcnIsIHJlcykge1xuXHRcdFx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHJlc29sdmUocmVzKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXG5cblx0ZnVuY3Rpb24gX2NhbmNlbERlYm91bmNlKCkge1xuXHRcdC8qIGpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuXHRcdGNsZWFyVGltZW91dCh0aGlzLnBpZCk7XG5cdH1cblxuXG5cdC8vIEV4cG9ydFxuXHR1dGlsLnZlcnNpb24gPSAnMC43LjAnO1xuXHRyZXR1cm4gdXRpbDtcbn0pO1xuIiwiZGVmaW5lKCdyZXF1ZXN0JywgW1xuXHQndXVpZCcsXG5cdCdsb2dnZXInLFxuXHQncGVyZm9ybWFuY2UnLFxuXHQnY29uZmlnJyxcblx0J1Byb21pc2UnLFxuXHQnRW1pdHRlcicsXG5cdCd1dGlscy91dGlsJyxcblx0J2pxdWVyeScsXG5cdCdqcXVlcnkubW9ja2pheCdcbl0sIGZ1bmN0aW9uIChcblx0LyoqIGZ1bmN0aW9uICovdXVpZCxcblx0LyoqIGxvZ2dlciAqL2xvZ2dlcixcblx0LyoqIHBlcmZvcm1hbmNlICovcGVyZm9ybWFuY2UsXG5cdC8qKiBjb25maWcgKi9jb25maWcsXG5cdC8qKiBQcm9taXNlICovUHJvbWlzZSxcblx0LyoqIEVtaXR0ZXIgKi9FbWl0dGVyLFxuXHQvKiogdXRpbCAqL3V0aWwsXG5cdC8qKiBmdW5jdGlvbiAqLyRcbikge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXG5cdC8qKlxuXHQgKiDCq9Cf0LDRh9C60LDCu1xuXHQgKiBAdHlwZSB7QXJyYXl8bnVsbH1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdHZhciBfYmF0Y2ggPSBudWxsO1xuXG5cblx0LyoqXG5cdCAqINCe0YfQtdGA0LXQtNGMINC30LDQv9GA0L7RgdC+0LJcblx0ICogQHR5cGUge0FycmF5fVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0dmFyIF9xdWV1ZSA9IFtdO1xuXHRfcXVldWUuYWN0aXZlID0gMDsgLy8g0LDQutGC0LjQstC90YvRhSDQt9Cw0L/RgNC+0YHQvtCyXG5cblxuXHQvKipcblx0ICog0JzQsNGB0YHQuNCyINCw0LrRgtC40LLQvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuXHQgKiBAdHlwZSB7cmVxdWVzdC5SZXF1ZXN0W119XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHR2YXIgX2FjdGl2ZSA9IFtdO1xuXG5cblx0LyoqXG5cdCAqINCd0LDQt9Cy0LDQvdC40LUg0YHQvtCx0YvRgtC40Y8gwqvQv9C+0YLQtdGA0Y8gV2lGaSDQsNCy0YLQvtGA0LjQt9Cw0YbQuNC4wrtcblx0ICogQGNvbnN0XG5cdCAqL1xuXHR2YXIgTE9TU19XSUZJX0FVVEggPSAnbG9zc3dpZmlhdXRoJztcblxuXG5cdC8qKlxuXHQgKiDQmtC10Ygg0LDQutGC0LjQstC90YvRhSBHRVQt0LfQsNC/0YDQvtGB0L7QslxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0dmFyIF9hY3RpdmVDYWNoZSA9IHt9O1xuXG5cblx0dmFyIF9zdHJpbmdpZnkgPSBKU09OLnN0cmluZ2lmeTtcblxuXG5cdC8qKlxuXHQgKiDQn9C+0LvRg9GH0LjRgtGMINC00LDQvdC90YvQtSDQtNC70Y8g0LvQvtCz0LjRgNC+0LLQsNC90LjRj1xuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgcmVxXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBbdXVpZF1cblx0ICogQHJldHVybnMge09iamVjdH1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIF9nZXRMb2cocmVxLCB1dWlkKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdC8vaWQ6IHV1aWQgfHwgcmVxLnV1aWQsXG5cdFx0XHR1cmw6IHJlcS51cmwsXG5cdFx0XHRkYXRhOiB1dGlsLmNsb25lSlNPTihyZXEuZGF0YSksXG5cdFx0XHR0eXBlOiByZXEudHlwZSxcblx0XHRcdGhlYWRlcnM6IHJlcS5vcHRpb25zICYmIHJlcS5vcHRpb25zLmhlYWRlcnMgfHwgcmVxLmhlYWRlcnMsXG5cdFx0XHRzdGFydFRpbWU6IHJlcS5zdGFydFRpbWUsXG5cdFx0XHRkdXJhdGlvbjogcmVxLmR1cmF0aW9uLFxuXHRcdFx0c3RhdHVzOiByZXEuaHR0cFN0YXR1cyB8fCByZXEuc3RhdHVzLFxuXHRcdFx0c3RhdHVzVGV4dDogcmVxLnN0YXR1c1RleHQsXG5cdFx0XHRyZWFkeVN0YXRlOiByZXEucmVhZHlTdGF0ZSxcblx0XHRcdHJlc3BvbnNlVGV4dDogcmVxLnN0YXR1cyAhPSAyMDAgPyByZXEucmVzcG9uc2VUZXh0IDogdm9pZCAwXG5cdFx0fTtcblx0fVxuXG5cblx0ZnVuY3Rpb24gX3JlbW92ZUFjdGl2ZSh4aHIpIHtcblx0XHR2YXIgaWR4ID0gX2FjdGl2ZS5pbmRleE9mKHhocik7XG5cdFx0KGlkeCA+IC0xKSAmJiBfYWN0aXZlLnNwbGljZShpZHgsIDEpO1xuXHR9XG5cblxuXG5cdC8qKlxuXHQgKiBMb3ctbGV2ZWwg0LjQvdGC0LXRgNGE0LXQudGBINC00LvRjyDRgNCw0LHQvtGC0Ysg0YEgYWpheC9qc29uL9C4INGCLtC/LiDQt9Cw0L/RgNC+0YHQsNC80Lhcblx0ICogQGNsYXNzICAgcmVxdWVzdFxuXHQgKiBAbWl4ZXNcdEVtaXR0ZXJcblx0ICogQHBhcmFtICAge3N0cmluZ30gICAgICAgICB1cmwgICAgICAgINC60YPQtNCwINC+0YLQv9GA0LDQstC40YLRjCDQt9Cw0L/RgNC+0YFcblx0ICogQHBhcmFtICAge3N0cmluZ3xPYmplY3R9ICBbZGF0YV0gICAgINC00LDQvdC90YvQtSDQt9Cw0L/RgNC+0YHQsFxuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgICAgICAgIFtvcHRpb25zXSAg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQvtC/0YbQuNC4XG5cdCAqIEByZXR1cm5zIHtyZXF1ZXN0LlJlcXVlc3R9XG5cdCAqL1xuXHRmdW5jdGlvbiByZXF1ZXN0KHVybCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdG9wdGlvbnMgPSB1dGlsLmV4dGVuZChcblx0XHRcdHtcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRsb2dnZXI6ICdyZXF1ZXN0Jyxcblx0XHRcdFx0bG9nZ2VyTWV0YTogb3B0aW9ucyAmJiBvcHRpb25zLmxvZ2dlck1ldGEgfHwgbG9nZ2VyLm1ldGEoLTEpLFxuXHRcdFx0XHRoZWFkZXJzOiB7fSxcblx0XHRcdFx0cmV0cmllczogcmVxdWVzdC5zZXR1cCgncmV0cmllcycpLFxuXHRcdFx0XHRSZXF1ZXN0OiBSZXF1ZXN0LFxuXHRcdFx0XHR3aXRob3V0UmVxdWVzdElkOiBmYWxzZVxuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnMsXG5cdFx0XHR7XG5cdFx0XHRcdHVybDogdXJsLFxuXHRcdFx0XHRkYXRhOiBkYXRhXG5cdFx0XHR9XG5cdFx0KTtcblxuXG5cdFx0dmFyIHJlcSxcblx0XHRcdGNhY2hlS2V5LFxuXHRcdFx0T3B0UmVxdWVzdCA9IG9wdGlvbnMuUmVxdWVzdDtcblxuXHRcdG9wdGlvbnMudHlwZSA9IG9wdGlvbnMudHlwZS50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0aWYgKG9wdGlvbnMudHlwZSA9PSAnR0VUJykge1xuXHRcdFx0Y2FjaGVLZXkgPSB1cmwgKyAnfCcgKyBfc3RyaW5naWZ5KGRhdGEpICsgJ3wnICsgX3N0cmluZ2lmeShvcHRpb25zICYmIG9wdGlvbnMuaGVhZGVycyk7XG5cdFx0XHRyZXEgPSBfYWN0aXZlQ2FjaGVbY2FjaGVLZXldO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqINCX0LDQv9GA0LXRgiDQutC10YjQuNGA0L7QstCw0L3QuNGPIEdFVCDQt9Cw0L/RgNC+0YHQvtCyXG5cdFx0XHQgKi9cblx0XHRcdGlmIChvcHRpb25zLmNhY2hlID09PSB2b2lkIDApIHtcblx0XHRcdFx0b3B0aW9ucy5jYWNoZSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXJlcSkge1xuXHRcdFx0XHRyZXEgPSBuZXcgT3B0UmVxdWVzdChvcHRpb25zKTtcblx0XHRcdFx0X2FjdGl2ZUNhY2hlW2NhY2hlS2V5XSA9IHJlcTtcblxuXHRcdFx0XHRyZXEuYWx3YXlzKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRsb2dnZXIuYWRkKCdfYWN0aXZlQ2FjaGUucmVtb3ZlJywgY2FjaGVLZXkpO1xuXHRcdFx0XHRcdGRlbGV0ZSBfYWN0aXZlQ2FjaGVbY2FjaGVLZXldO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRyZXEgPSBuZXcgT3B0UmVxdWVzdChvcHRpb25zKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVxO1xuXHR9XG5cblxuXHQvKipcblx0ICog0J7RgtC/0YDQsNCy0LjRgtGMINC30LDQv9GA0L7RgVxuXHQgKiBAbmFtZSByZXF1ZXN0LmNhbGxcblx0ICogQGFsaWFzIHJlcXVlc3Rcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiByZXF1ZXN0XG5cdCAqL1xuXHRyZXF1ZXN0LmNhbGw7XG5cblxuXHQvKipcblx0ICog0J7RgtC/0YDQsNCy0LjRgtGMIEdFVC3Qt9Cw0L/RgNC+0YFcblx0ICogQGFsaWFzIHJlcXVlc3Rcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiByZXF1ZXN0XG5cdCAqL1xuXHRyZXF1ZXN0LmdldDtcblxuXG5cdC8qKlxuXHQgKiDQntGC0L/RgNCw0LLQuNGC0YwgUE9TVC3Qt9Cw0L/RgNC+0YFcblx0ICogQGFsaWFzIHJlcXVlc3Rcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiByZXF1ZXN0XG5cdCAqL1xuXHRyZXF1ZXN0LnBvc3Q7XG5cblxuXHQvLyBTaG9ydC3QvNC10YLQvtC00YsgXCJnZXRcIiDQuCBcInBvc3RcIlxuXHRbJ2NhbGwnLCAnZ2V0JywgJ3Bvc3QnXS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0cmVxdWVzdFtuYW1lXSA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRcdHZhciBtZXRhID0gbG9nZ2VyLm1ldGEoLTEpO1xuXG5cdFx0XHRtZXRhLmZuID0gJ3JlcXVlc3QuJyArIG5hbWU7XG5cblx0XHRcdG9wdGlvbnMgPSB1dGlsLmNsb25lT2JqZWN0KG9wdGlvbnMpO1xuXHRcdFx0b3B0aW9ucy50eXBlID0gb3B0aW9ucy50eXBlIHx8IChuYW1lID09ICdjYWxsJyA/ICdwb3N0JyA6IG5hbWUpO1xuXHRcdFx0b3B0aW9ucy5sb2dnZXJNZXRhID0gb3B0aW9ucy5sb2dnZXJNZXRhIHx8IG1ldGE7XG5cblx0XHRcdHJldHVybiByZXF1ZXN0KHVybCwgZGF0YSwgb3B0aW9ucyk7XG5cdFx0fTtcblx0fSk7XG5cblxuXHQvKipcblx0ICog0JPQu9C+0LHQsNC70YzQvdGL0LUg0L3QsNGB0YLRgNC+0LnQutC4INC00LvRjyDQt9Cw0L/RgNC+0YHQvtCyLCBbJC5hamF4U2V0dXBdKGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9qUXVlcnkuYWpheFNldHVwLylcblx0ICogQG5hbWUgICAgIHJlcXVlc3Quc2V0dXBcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R8c3RyaW5nfSBvcHRzICAgICDQvdC30LLQsNC90LjQtSwg0LvQuNCx0L4g0L7QsdGK0LXQutGCINC+0L/RhtC40LkgKNGB0LwuIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2pRdWVyeS5hamF4LyNqUXVlcnktYWpheC1zZXR0aW5ncykpXG5cdCAqIEBwYXJhbSAgIHsqfSAgICAgICAgICAgICBbdmFsdWVdICDQt9C90LDRh9C10L3QuNC1XG5cdCAqIEByZXR1cm5zIHsqfVxuXHQgKi9cblx0cmVxdWVzdC5zZXR1cCA9IGZ1bmN0aW9uIChvcHRzLCB2YWx1ZSkge1xuXHRcdHZhciBzZXR0aW5ncyA9ICQuYWpheFNldHRpbmdzO1xuXG5cdFx0aWYgKHR5cGVvZiBvcHRzID09PSAnc3RyaW5nJykge1xuXHRcdFx0aWYgKHZhbHVlICE9PSB2b2lkIDApIHtcblx0XHRcdFx0c2V0dGluZ3Nbb3B0c10gPSB2YWx1ZTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBzZXR0aW5nc1tvcHRzXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSBpZiAob3B0cyA9PT0gdm9pZCAwKSB7XG5cdFx0XHRyZXR1cm4gc2V0dGluZ3M7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0JC5hamF4U2V0dXAob3B0cyk7XG5cdFx0fVxuXHR9O1xuXG5cblx0Ly8gwqvQndCw0YjQuMK7INC90LDRgdGC0YDQvtC50LrQuFxuXHRyZXF1ZXN0LnNldHVwKHtcblx0XHRyZXRyaWVzOiAxLCAvLyDQvNCw0LrRgdC40LzRg9C8INC/0L7Qv9GL0YLQvtC6IGB4aHIucmV0cnkoKWBcblx0XHRiYXRjaFVybDogJy9iYXRjaCcsIC8vIHVybCDQv9C+INGD0LzQvtC70YfQsNC90LjRjiDQtNC70Y8g0L7RgtGA0LDQstC60LggwqvQv9Cw0YfQutC4wrtcblx0XHRzYWZlTW9kZTogZmFsc2UsIC8vINCf0YDQuCDQstC60LvRjtGH0LXQvdC90L7QvCDRgNC10LbQuNC80LUsINCy0YHQtSDQt9Cw0L/RgNC+0YHRiyDQstGL0YHRgtGA0LDQuNCy0LDRjtGC0YHRjyDQsiDQvtGH0LXRgNC10LTRjCwg0YfRgtC+INC/0L7Qt9Cy0L7Qu9GP0LXRgiDQuNC30LHQtdC20LDRgtGMINCz0L7QvdC60LguXG5cblx0XHRsb2NhdGlvblJlbG9hZDogZnVuY3Rpb24gKCkge1xuXHRcdFx0KHdpbmRvdy5tb2NrV2luZG93IHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIHdpbmRvdykubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fSxcblxuXHRcdGxvc3NXaUZpQXV0aERldGVjdDogZnVuY3Rpb24gKHhociwgZXJyKSB7XG5cdFx0XHR2YXIgcmVzcG9uc2VUZXh0ID0geGhyLnJlc3BvbnNlVGV4dDtcblx0XHRcdHJldHVybiAoZXJyID09ICdwYXJzZXJlcnJvcicpICYmIC88bWV0YVtePl0rcmVmcmVzaC9pLnRlc3QocmVzcG9uc2VUZXh0KTtcblx0XHR9XG5cdH0pO1xuXG5cblx0ZnVuY3Rpb24gX2FkZDJRdWV1ZSgvKiogcmVxdWVzdC5SZXF1ZXN0ICovcmVxLCAvKiogT2JqZWN0ICovb3B0aW9ucywgLyoqIEFycmF5ICovcXVldWUpIHtcblx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblx0XHRcdHF1ZXVlLnB1c2goe1xuXHRcdFx0XHRyZXE6IHJlcSxcblx0XHRcdFx0b3B0czogb3B0aW9ucyxcblx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcblx0XHRcdFx0cmVqZWN0OiByZWplY3Rcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHByb21pc2UudGhlbihcblx0XHRcdGZ1bmN0aW9uIChib2R5KSB7IHJldHVybiByZXEuZW5kKGZhbHNlLCBib2R5KTsgfSxcblx0XHRcdGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIHJlcS5lbmQoZXJyKTsgfVxuXHRcdCk7XG5cdH1cblxuXHRmdW5jdGlvbiBfcXVldWVQcm9jZXNzaW5nKCkge1xuXHRcdGlmIChfcXVldWUubGVuZ3RoKSB7XG5cdFx0XHR2YXIgaXRlbSA9IF9xdWV1ZS5zaGlmdCgpO1xuXHRcdFx0dmFyIG9wdGlvbnMgPSBpdGVtLm9wdHM7XG5cblx0XHRcdF9xdWV1ZS5hY3RpdmUrKztcblx0XHRcdGl0ZW0ucmVxLnNlbmQob3B0aW9ucykudGhlbihfcXVldWVQcm9jZXNzaW5nUmVzb2x2ZXIoaXRlbSksIF9xdWV1ZVByb2Nlc3NpbmdSZXNvbHZlcihpdGVtKSk7XG5cblx0XHRcdGlmIChvcHRpb25zLnR5cGUgPT09ICdHRVQnICYmIF9xdWV1ZVswXSAmJiBfcXVldWVbMF0ub3B0cy50eXBlID09PSAnR0VUJykge1xuXHRcdFx0XHRfcXVldWVQcm9jZXNzaW5nKCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX3F1ZXVlUHJvY2Vzc2luZ1Jlc29sdmVyKGl0ZW0pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24gX3F1ZXVlUHJvY2Vzc2luZ0NhbGxiYWNrKHJlc3VsdCkge1xuXHRcdFx0X3F1ZXVlLmFjdGl2ZS0tO1xuXG5cdFx0XHRpdGVtW3Jlc3VsdC5pc09LKCkgPyAncmVzb2x2ZScgOiAncmVqZWN0J10ocmVzdWx0KTtcblx0XHRcdCFfcXVldWUuYWN0aXZlICYmIF9xdWV1ZVByb2Nlc3NpbmcoKTtcblx0XHR9O1xuXHR9XG5cblxuXHQvKipcblx0ICog0J7QsdGK0LXQutGCINC30LDQv9GA0L7RgdCwXG5cdCAqIEBjbGFzcyByZXF1ZXN0LlJlcXVlc3Rcblx0ICogQGNvbnN0cnVjdHMgcmVxdWVzdC5SZXF1ZXN0XG5cdCAqIEBtaXhlcyAgIFByb21pc2Vcblx0ICogQHBhcmFtICAge09iamVjdH0gICBvcHRpb25zXG5cdCAqL1xuXHRmdW5jdGlvbiBSZXF1ZXN0KG9wdGlvbnMpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0X3Byb21pc2U7XG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0L3QuNC60LDQu9GM0L3Ri9C5INC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGAINC30LDQv9GA0L7RgdCwXG5cdFx0ICogQG1lbWJlciB7c3RyaW5nfSByZXF1ZXN0LlJlcXVlc3QjdXVpZFxuXHRcdCAqL1xuXHRcdF90aGlzLnV1aWQgPSB1dWlkKCk7XG5cblx0XHRpZiAob3B0aW9ucy53aXRob3V0UmVxdWVzdElkID09PSBmYWxzZSkge1xuXHRcdFx0b3B0aW9ucy5oZWFkZXJzWydYLVJlcXVlc3QtSWQnXSA9IF90aGlzLnV1aWQ7XG5cdFx0fVxuXG5cblx0XHRpZiAob3B0aW9ucy5iYXRjaCAhPT0gZmFsc2UgJiYgX2JhdGNoKSB7XG5cdFx0XHRfdGhpcy5iYXRjaGVkID0gdHJ1ZTtcblx0XHRcdF9wcm9taXNlID0gX2FkZDJRdWV1ZShfdGhpcywgb3B0aW9ucywgX2JhdGNoKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoKF9xdWV1ZS5sZW5ndGggfHwgX3F1ZXVlLmFjdGl2ZSkgfHwgKG9wdGlvbnMudHlwZSA9PT0gJ1BPU1QnICYmIHJlcXVlc3Quc2V0dXAoJ3NhZmVNb2RlJykpKSB7XG5cdFx0XHRfcHJvbWlzZSA9IF9hZGQyUXVldWUoX3RoaXMsIG9wdGlvbnMsIF9xdWV1ZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0X3Byb21pc2UgPSBfdGhpcy5zZW5kKG9wdGlvbnMpO1xuXHRcdH1cblxuXG5cdFx0X3RoaXMuX19sb2dnZXJfXyA9IF9wcm9taXNlLl9fbG9nZ2VyX187XG5cblxuXHRcdC8qKlxuXHRcdCAqIMKr0J7QsdC10YnQsNC90LjQtcK7XG5cdFx0ICogQG1lbWJlciB7UHJvbWlzZX0gcmVxdWVzdC5SZXF1ZXN0I3VybFxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0X3RoaXMuX3Byb21pc2UgPSBfcHJvbWlzZTtcblx0XHRfcHJvbWlzZS5tZXRhT2Zmc2V0ID0gMTsgLy8g0YHQvNC10YnQtdC90LjQtSDQvdCwINC+0LTQuNC9INCy0LLQtdGA0YUg0L/QviDRgdGC0LXQutGDXG5cblx0XHQvKipcblx0XHQgKiDQmtGD0LTQsCDQtNC10LvQsNC10Lwg0LfQsNC/0YDQvtGBXG5cdFx0ICogQG1lbWJlciB7c3RyaW5nfSByZXF1ZXN0LlJlcXVlc3QjdXJsXG5cdFx0ICovXG5cdFx0X3RoaXMudXJsID0gb3B0aW9ucy51cmw7XG5cblx0XHQvKipcblx0XHQgKiDQotC40L8g0LfQsNC/0YDQvtGB0LAgR0VULCBQT1NUINC4INGCLtC/LlxuXHRcdCAqIEBtZW1iZXIge3N0cmluZ30gcmVxdWVzdC5SZXF1ZXN0I3R5cGVcblx0XHQgKi9cblx0XHRfdGhpcy50eXBlID0gb3B0aW9ucy50eXBlO1xuXG5cdFx0LyoqXG5cdFx0ICog0J/QsNGA0LDQvNC10YLRgNGLINC30LDQv9GA0L7RgdCwXG5cdFx0ICogQG1lbWJlciB7T2JqZWN0fSByZXF1ZXN0LlJlcXVlc3QjZGF0YVxuXHRcdCAqL1xuXHRcdF90aGlzLmRhdGEgPSBvcHRpb25zLmRhdGE7XG5cblx0XHQvKipcblx0XHQgKiDQlNC+0L/QvtC70L3QuNGC0LXQu9GM0L3Ri9C1INC+0L/RhtC40Lgg0LfQsNC/0YDQvtGB0LBcblx0XHQgKiBAbWVtYmVyIHtPYmplY3R9IHJlcXVlc3QuUmVxdWVzdCNvcHRpb25zXG5cdFx0ICovXG5cdFx0X3RoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblx0XHQvKipcblx0XHQgKiDQktGA0LXQvNGPINC90LDRh9Cw0LvQsCDQt9Cw0L/RgNC+0YHQsFxuXHRcdCAqIEBtZW1iZXIge251bWJlcn0gcmVxdWVzdC5SZXF1ZXN0I3N0YXJ0VGltZVxuXHRcdCAqL1xuXHRcdF90aGlzLnN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG5cdFx0aWYgKF9xdWV1ZS5sZW5ndGggPT09IDEgJiYgIV9xdWV1ZS5hY3RpdmUpIHtcblx0XHRcdGlmIChfYWN0aXZlLmxlbmd0aCkge1xuXHRcdFx0XHRQcm9taXNlLmFsbChfYWN0aXZlKS5hbHdheXMoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdF9xdWV1ZVByb2Nlc3NpbmcoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRfcXVldWVQcm9jZXNzaW5nKCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmVxdWVzdC50cmlnZ2VyKCdzdGFydCcsIF90aGlzKTtcblx0fVxuXG5cblx0UmVxdWVzdC5mbiA9IFJlcXVlc3QucHJvdG90eXBlID0gLyoqIEBsZW5kcyByZXF1ZXN0LlJlcXVlc3QjICovIHtcblx0XHRfX3Jlc3VsdExvZ0VudHJ5X186IHt9LFxuXG5cdFx0LyoqXG5cdFx0ICog0JfQsNC/0YDQvtGBINCyIMKr0L/QsNGH0LrQtcK7XG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0YmF0Y2hlZDogZmFsc2UsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0YHQv9C10YjQvdC+0LUg0LLRi9C/0L7Qu9C90LXQvdC40LUg0LfQsNC/0YDQvtGB0LBcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cblx0XHQgKiBAcmV0dXJuIHtSZXF1ZXN0fVxuXHRcdCAqL1xuXHRcdGRvbmU6IGZ1bmN0aW9uIGRvbmUoZm4pIHtcblx0XHRcdHRoaXMuX3Byb21pc2UuX19ub0xvZyA9IHRoaXMuX19ub0xvZzsgLy8gdG9kbzog0J3Rg9C20L3QviDQuNC30LHQsNCy0LvRj9GC0YHRjyDQvtGCINGN0YLQvtCz0L4g0YTQu9Cw0LPQsFxuXHRcdFx0dGhpcy5fcHJvbWlzZS5kb25lKGZuKTtcblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J3QtdGD0LTQsNGH0L3QvtC1INCy0YvQv9C+0LvQvdC10L3QuNC1INC30LDQv9GA0L7RgdCwXG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG5cdFx0ICogQHJldHVybiB7UmVxdWVzdH1cblx0XHQgKi9cblx0XHRmYWlsOiBmdW5jdGlvbiBmYWlsKGZuKSB7XG5cdFx0XHR0aGlzLl9wcm9taXNlLl9fbm9Mb2cgPSB0aGlzLl9fbm9Mb2c7XG5cdFx0XHR0aGlzLl9wcm9taXNlLmZhaWwoZm4pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQm9GO0LHQvtC5INC40YHRhdC+0LQg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LfQsNC/0YDQvtGB0LBcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cblx0XHQgKiBAcmV0dXJuIHtSZXF1ZXN0fVxuXHRcdCAqL1xuXHRcdGFsd2F5czogZnVuY3Rpb24gYWx3YXlzKGZuKSB7XG5cdFx0XHR0aGlzLl9wcm9taXNlLl9fbm9Mb2cgPSB0aGlzLl9fbm9Mb2c7XG5cdFx0XHR0aGlzLl9wcm9taXNlLmFsd2F5cyhmbik7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7QtNC/0LjRgdCw0YLRjNGB0Y8g0L3QsCDQstGL0L/QvtC70LXQvdC40LUg0LfQsNC/0YDQvtGB0LBcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZG9uZUZuXG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb259IFtmYWlsRm5dXG5cdFx0ICogQHJldHVybiB7UHJvbWlzZX1cblx0XHQgKi9cblx0XHR0aGVuOiBmdW5jdGlvbiB0aGVuKGRvbmVGbiwgZmFpbEZuKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fcHJvbWlzZS50aGVuKGRvbmVGbiwgZmFpbEZuKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C10YDQtdGF0LLQvtGC0LjRgtGMINC+0YjQuNCx0LrQuCDQv9GA0Lgg0LLRi9C/0L7Qu9C90LXQvdC40Lhcblx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cblx0XHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHRcdCAqL1xuXHRcdCdjYXRjaCc6IGZ1bmN0aW9uIChmbikge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3Byb21pc2VbJ2NhdGNoJ10oZm4pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0YLQv9GA0LDQstC40YLRjCDQt9Cw0L/RgNC+0YFcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9ICBvcHRpb25zXG5cdFx0ICogQHJldHVybiB7UHJvbWlzZX1cblx0XHQgKi9cblx0XHRzZW5kOiBmdW5jdGlvbiBzZW5kKG9wdGlvbnMpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXG5cdFx0XHRcdHhocixcblx0XHRcdFx0cHJvbWlzZTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiDQktGA0LXQvNGPINC30LDQstC10YDRiNC10L3QuNGPXG5cdFx0XHQgKiBAbWVtYmVyIHtudW1iZXJ9IHJlcXVlc3QuUmVxdWVzdCNlbmRUaW1lXG5cdFx0XHQgKi9cblx0XHRcdF90aGlzLmVuZFRpbWUgPSBudWxsO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqINCf0YDQvtC00L7Qu9C20LjRgtC10LvRjNC90L7RgdGC0Ywg0LfQsNC/0YDQvtGB0LBcblx0XHRcdCAqIEBtZW1iZXIge251bWJlcn0gcmVxdWVzdC5SZXF1ZXN0I2R1cmF0aW9uXG5cdFx0XHQgKi9cblx0XHRcdF90aGlzLmR1cmF0aW9uID0gbnVsbDtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiDQl9Cw0L/RgNC+0YEg0LIg0L7QttC40LTQsNC90LjQuCDQvtGC0LLQtdGC0LBcblx0XHRcdCAqIEBtZW1iZXIge2Jvb2xlYW59IHJlcXVlc3QuUmVxdWVzdCNwZW5kaW5nXG5cdFx0XHQgKi9cblx0XHRcdF90aGlzLnBlbmRpbmcgPSB0cnVlO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqINCX0LDQv9GA0L7RgSDQvtGC0LzQtdC90LXQvVxuXHRcdFx0ICogQG1lbWJlciB7Ym9vbGVhbn0gcmVxdWVzdC5SZXF1ZXN0I2Fib3J0ZWRcblx0XHRcdCAqL1xuXHRcdFx0X3RoaXMuYWJvcnRlZCA9IGZhbHNlO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqINCa0L7Qu9C40YfQtdGB0YLQstC+INC/0L7QstGC0L7RgNC90YvRhSDQv9C+0L/Ri9GC0L7QulxuXHRcdFx0ICogQG1lbWJlciB7bnVtYmVyfSByZXF1ZXN0LlJlcXVlc3QjcmV0cmllc1xuXHRcdFx0ICovXG5cdFx0XHRfdGhpcy5yZXRyaWVzID0gb3B0aW9ucy5yZXRyaWVzO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIFJhdy3RgtC10LvQviDQvtGC0LLQtdGC0LAgKHRleHQpXG5cdFx0XHQgKiBAbWVtYmVyIHsqfSByZXF1ZXN0LlJlcXVlc3QjcmVzcG9uc2VUZXh0XG5cdFx0XHQgKi9cblx0XHRcdF90aGlzLnJlc3BvbnNlVGV4dCA9IG51bGw7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICog0KLQtdC70L4g0L7RgtCy0LXRgtCwXG5cdFx0XHQgKiBAbWVtYmVyIHsqfSByZXF1ZXN0LlJlcXVlc3QjYm9keVxuXHRcdFx0ICovXG5cdFx0XHRfdGhpcy5ib2R5ID0gbnVsbDtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiDQodGC0LDRgtGD0YEg0L7RgtCy0LXRgtCwINGB0LXRgNCy0LXRgNCwXG5cdFx0XHQgKiBAdHlwZSB7bnVtYmVyfVxuXHRcdFx0ICovXG5cdFx0XHRfdGhpcy5zdGF0dXMgPSBudWxsO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqINCe0YjQuNCx0LrQsFxuXHRcdFx0ICogQG1lbWJlciB7Kn0gcmVxdWVzdC5SZXF1ZXN0I2Vycm9yXG5cdFx0XHQgKi9cblx0XHRcdF90aGlzLmVycm9yID0gbnVsbDtcblxuXHRcdFx0Ly8g0J/RgNC+0LjQt9Cy0L7Qu9GM0L3Ri9C5INGC0YDQsNGB0L/QvtGA0YJcblx0XHRcdGlmIChvcHRpb25zLnRyYW5zcG9ydCkge1xuXHRcdFx0XHRvcHRpb25zLnhociA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0Z2V0QWxsUmVzcG9uc2VIZWFkZXJzOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBTdHJpbmcodGhpcy5oZWFkZXJzKTtcblx0XHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRcdG9wZW46IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRcdHNlbmQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0b3B0aW9ucy50cmFuc3BvcnQob3B0aW9ucywgZnVuY3Rpb24gKHJlcykge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuc3RhdHVzID0gcmVzLnN0YXR1cztcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnJlYWR5U3RhdGUgPSA0O1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuaGVhZGVycyA9IHJlcy5oZWFkZXJzIHx8ICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nO1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucmVzcG9uc2VUZXh0ID0gcmVzLnJlc3BvbnNlVGV4dDtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSAmJiB0aGlzLm9ucmVhZHlzdGF0ZWNoYW5nZSgpO1xuXHRcdFx0XHRcdFx0XHR9LmJpbmQodGhpcykpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICog0J7QsdGK0LXQutGCINC30LDQv9GA0L7RgdCwXG5cdFx0XHQgKiBAbWVtYmVyIHtYTUxIdHRwUmVxdWVzdH0gcmVxdWVzdC5SZXF1ZXN0I3hoclxuXHRcdFx0ICovXG5cdFx0XHRfdGhpcy54aHIgPSB4aHIgPSAkLmFqYXgob3B0aW9ucyk7XG5cblx0XHRcdF9hY3RpdmUucHVzaCh4aHIpO1xuXG5cdFx0XHRwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuXHRcdFx0XHR4aHJcblx0XHRcdFx0XHQuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRfcmVtb3ZlQWN0aXZlKHhocik7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKHhocik7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZmFpbChmdW5jdGlvbiAoeCwgZXJyKSB7XG5cdFx0XHRcdFx0XHRfcmVtb3ZlQWN0aXZlKHhocik7XG5cdFx0XHRcdFx0XHRyZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQ7XG5cdFx0XHR9KTtcblxuXG5cdFx0XHRsb2dnZXIud3JhcCgnW1snICsgb3B0aW9ucy5sb2dnZXIgKyAnXV0nLCBfZ2V0TG9nKG9wdGlvbnMpLCBwcm9taXNlKTtcblxuXHRcdFx0dGhpcy5fX3Jlc3VsdExvZ0VudHJ5X18gPSBsb2dnZXIuYWRkRW50cnkoJ2xvZycsIG9wdGlvbnMubG9nZ2VyICsgJzpwZW5kaW5nJywgbnVsbCwgcHJvbWlzZS5fX2xvZ2dlcl9fLmlkKTtcblx0XHRcdHRoaXMuX19yZXN1bHRMb2dFbnRyeV9fLm1ldGEgPSBwcm9taXNlLl9fbG9nZ2VyX18ubWV0YSA9IG9wdGlvbnMubG9nZ2VyTWV0YTtcblxuXHRcdFx0cHJvbWlzZS5fX25vTG9nID0gdHJ1ZTtcblxuXHRcdFx0cmV0dXJuIHByb21pc2UudGhlbihcblx0XHRcdFx0ZnVuY3Rpb24gKGJvZHkpIHsgcmV0dXJuIF90aGlzLmVuZChmYWxzZSwgYm9keSk7IH0sXG5cdFx0XHRcdGZ1bmN0aW9uIChlcnIpIHsgcmV0dXJuIF90aGlzLmVuZChlcnIpOyB9XG5cdFx0XHQpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LfQsNCz0L7Qu9C+0LLQvtC6INC+0YLQstC10YLQsCDQv9C+INC10LPQviDQuNC80LXQvdC4XG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIG5hbWVcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGdldFJlc3BvbnNlSGVhZGVyOiBmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0cmV0dXJuIHRoaXMueGhyLmdldFJlc3BvbnNlSGVhZGVyKG5hbWUpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LLRgdC1INC30LDQs9C+0LvQvtCy0LrQuCDQvtGCINGB0LXRgNCy0LXRgNCwXG5cdFx0ICogQHJldHVybnMge3N0cmluZ31cblx0XHQgKi9cblx0XHRnZXRBbGxSZXNwb25zZUhlYWRlcnM6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLnhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQntGC0LzQtdC90LjRgtGMINC30LDQv9GA0L7RgVxuXHRcdCAqL1xuXHRcdGFib3J0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLmFib3J0ZWQgPSB0cnVlO1xuXHRcdFx0dGhpcy54aHIgJiYgdGhpcy54aHIuYWJvcnQoKTtcblx0XHRcdHRoaXMuZW5kKGZhbHNlKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQl9Cw0LLQtdGA0YjQuNGC0Ywg0LfQsNC/0YDQvtGBXG5cdFx0ICovXG5cdFx0ZW5kOiBmdW5jdGlvbiAoZXJyLCBib2R5KSB7XG5cdFx0XHR2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuXHRcdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0XHR0aGlzLnN0YXR1cyA9IHRoaXMuc3RhdHVzID09IG51bGwgPyB0aGlzLnhoci5zdGF0dXMgOiB0aGlzLnN0YXR1cztcblx0XHRcdHRoaXMuc3RhdHVzVGV4dCA9IHRoaXMuc3RhdHVzVGV4dCB8fCB0aGlzLnhoci5zdGF0dXNUZXh0O1xuXHRcdFx0dGhpcy5yZWFkeVN0YXRlID0gdGhpcy54aHIucmVhZHlTdGF0ZTtcblx0XHRcdHRoaXMucmVzcG9uc2VUZXh0ID0gdGhpcy54aHIucmVzcG9uc2VUZXh0O1xuXG5cdFx0XHR0aGlzLmVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcblx0XHRcdHRoaXMuZHVyYXRpb24gPSB0aGlzLmVuZFRpbWUgLSB0aGlzLnN0YXJ0VGltZTtcblx0XHRcdHRoaXMucGVuZGluZyA9IGZhbHNlO1xuXG5cdFx0XHR0aGlzLl9fcmVzdWx0TG9nRW50cnlfXy5hcmdzID0gX2dldExvZyh0aGlzKTtcblxuXHRcdFx0Ly8g0J/RgNC+0LLQtdGA0Y/QtdC8INC90LAg0L/QvtGC0LXRgNGOIFdpRmlcblx0XHRcdGlmIChyZXF1ZXN0LnNldHVwKCdsb3NzV2lGaUF1dGhEZXRlY3QnKSh0aGlzLCBlcnIpKSB7XG5cdFx0XHRcdGVyciA9IExPU1NfV0lGSV9BVVRIO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0aW9ucy5wb3N0UHJvY2Vzc2luZykge1xuXHRcdFx0XHQvLyDQn9C+0YHRgi3QvtCx0YDQsNCx0L7RgtC60LBcblx0XHRcdFx0b3B0aW9ucy5wb3N0UHJvY2Vzc2luZyh0aGlzLCBib2R5KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGVyciA9PT0gZmFsc2UpIHsgLy8g0K3RgtC+INGD0YHQv9C10YUsINCx0YDQviFcblx0XHRcdFx0dGhpcy5ib2R5ID0gYm9keTtcblx0XHRcdFx0dGhpcy5fX3Jlc3VsdExvZ0VudHJ5X18ubGFiZWwgPSAnW1snICsgb3B0aW9ucy5sb2dnZXIgKyAnOmRvbmVdXSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHsgLy8g0JLRgdGRINC/0LvQvtGF0L4sINC90L4g0L3QtSDRgdGC0L7QuNGCINC+0YLRh9Cw0LjQstCw0YLRjNGB0Y8sINCy0L7Qt9C80L7QttC90L4g0LrRgtC+LdGC0L4g0L/QtdGA0LXRhdCy0LDRgtC40YIg0L7RiNC40LHQutGDXG5cdFx0XHRcdHRoaXMuZXJyb3IgPSBlcnI7XG5cdFx0XHRcdHRoaXMuX19yZXN1bHRMb2dFbnRyeV9fLmxhYmVsID0gJ1tbJyArIG9wdGlvbnMubG9nZ2VyICsgJzpmYWlsXV0nO1xuXG5cdFx0XHRcdC8vIEVtaXQgZXJyb3Jcblx0XHRcdFx0dmFyIGV2dCA9IG5ldyBFbWl0dGVyLkV2ZW50KGVyciA9PT0gTE9TU19XSUZJX0FVVEggPyBlcnIgOiAnZXJyb3InKTtcblxuXHRcdFx0XHRyZXF1ZXN0LnRyaWdnZXIoZXZ0LCB0aGlzKTtcblxuXHRcdFx0XHQvLyDQktC10YDQvdGD0LvQuCDCq9C+0LHQtdGJ0LDQvdC40LXCuywg0L3QsNGH0LjQvdCw0LXQvCDCq9Cy0LXRgdC10LvRjNC1wrtcblx0XHRcdFx0aWYgKGV2dC5yZXN1bHQgJiYgZXZ0LnJlc3VsdC50aGVuKSB7XG5cdFx0XHRcdFx0cmVxdWVzdC50cmlnZ2VyKCdlbmQnLCB0aGlzKTtcblxuXHRcdFx0XHRcdHJldHVybiBldnQucmVzdWx0OyAvLyDQstC10YDQvdC10Lwg0Y3RgtC+IMKr0L7QsdC10YnQsNC90LjQtcK7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZXJyID09PSBMT1NTX1dJRklfQVVUSCAmJiAhZXZ0LmlzRGVmYXVsdFByZXZlbnRlZCgpKSB7XG5cdFx0XHRcdFx0cmVxdWVzdC5zZXR1cCgnbG9jYXRpb25SZWxvYWQnKSh0aGlzKTsgLy8g0L/QtdGA0LXQt9Cw0LPRgNGD0LbQsNC10Lwg0YHRgtGA0LDQvdC40YbRg1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJlcXVlc3QudHJpZ2dlcignZW5kJywgdGhpcyk7XG5cblx0XHRcdHJldHVybiBQcm9taXNlW3RoaXMuaXNPSygpID8gJ3Jlc29sdmUnIDogJ3JlamVjdCddKE9iamVjdC5jcmVhdGUodGhpcywge3RoZW46IHt2YWx1ZTogbnVsbH0gfSkpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0LXRgNCy0LXRgCDQvtGC0LLQtdGC0LjQuyAyMDAsIDIwMSDQuNC70LggMjAyINC4INC90LUg0LHRi9C70L4g0L7RiNC40LHQvtC6INC/0YDQuCDQv9Cw0YDRgdC40L3Qs9C1INC+0YLQstC10YLQsFxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGlzT0s6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAodGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDw9IDIwMiB8fCB0aGlzLnN0YXR1cyA9PSAyMDYpICYmICF0aGlzLmVycm9yO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7QstGC0L7RgNC40YLRjCDQt9Cw0L/RgNC+0YFcblx0XHQgKiBAcGFyYW0gICB7UHJvbWlzZXxGdW5jdGlvbn0gIFtwcm9taXNlXVxuXHRcdCAqIEBwYXJhbSAgIHtib29sZWFufSAgICAgICAgICAgW3NlbGZdXG5cdFx0ICogQHJldHVybnMge3JlcXVlc3QuUmVxdWVzdH1cblx0XHQgKi9cblx0XHRyZXRyeTogZnVuY3Rpb24gKHByb21pc2UsIHNlbGYpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXG5cdFx0XHRcdG9wdGlvbnMgPSBzZWxmID8gX3RoaXMub3B0aW9ucyA6IHV0aWwuY2xvbmVPYmplY3QoX3RoaXMub3B0aW9ucyk7XG5cblx0XHRcdGlmIChvcHRpb25zLnJldHJpZXMgPiAwKSB7XG5cdFx0XHRcdG9wdGlvbnMucmV0cmllcy0tO1xuXHRcdFx0XHRvcHRpb25zLmxvZ2dlciA9ICdyZXRyeTonICsgb3B0aW9ucy5sb2dnZXI7XG5cblx0XHRcdFx0cHJvbWlzZSA9IHByb21pc2UgfHwgUHJvbWlzZS5yZXNvbHZlKCk7XG5cblx0XHRcdFx0aWYgKCFwcm9taXNlLnRoZW4pIHtcblx0XHRcdFx0XHRwcm9taXNlID0gbmV3IFByb21pc2UocHJvbWlzZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcHJvbWlzZS50aGVuKFxuXHRcdFx0XHRcdGZ1bmN0aW9uICgpIHsgLy8gc3VjY2Vzc1xuXHRcdFx0XHRcdFx0aWYgKHNlbGYpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzLnNlbmQob3B0aW9ucyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcXVlc3QoX3RoaXMudXJsLCBfdGhpcy5kYXRhLCBvcHRpb25zKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0ZnVuY3Rpb24gKCkgeyAvLyBmYWlsXG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoX3RoaXMpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KF90aGlzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0L7QstC10YDQuNGC0Ywg0YHQstC+0LnRgdGC0LLQviDQvdCwINC40YHRgtC40L3QvdC+0YHRgtGMXG5cdFx0ICogQG5hbWUgcmVxdWVzdC5SZXF1ZXN0I2lzXG5cdFx0ICogQG1ldGhvZFxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBrZXlzXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0aXM6IGNvbmZpZy5pcyxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/RgNC+0LLQtdGA0LjRgtGMINGB0LLQvtC50YHRgtCy0L4g0L3QsCDQvdCw0LvQuNGH0LjQtVxuXHRcdCAqIEBuYW1lIHJlcXVlc3QuUmVxdWVzdCNoYXNcblx0XHQgKiBAbWV0aG9kXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIGtleXNcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRoYXM6IGNvbmZpZy5oYXMsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0YHQstC+0LnRgdGC0LLQvlxuXHRcdCAqIEBuYW1lIHJlcXVlc3QuUmVxdWVzdCNnZXRcblx0XHQgKiBAbWV0aG9kXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIGtleVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGdldDogY29uZmlnLmdldCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JzQsNC/0L/QuNC90LMg0LTQsNC90L3Ri9GFINC+0YLQstC10YLQsCAo0LHQvtC20LUsINC90YMg0Lgg0L7Qv9C40YHQsNC90LjQtSlcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R8RnVuY3Rpb259IG1hcHBlcnNcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0bWFwOiBmdW5jdGlvbiAobWFwcGVycykge1xuXHRcdFx0aWYgKG1hcHBlcnMgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0XHRyZXR1cm4gKG1hcHBlcnMubWFwIHx8IG1hcHBlcnMpLmNhbGwobWFwcGVycywgdGhpcy5nZXQoJ2JvZHknKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge307XG5cblx0XHRcdFx0JC5lYWNoKG1hcHBlcnMsIGZ1bmN0aW9uIChuYW1lLCBtYXBwZXIpIHtcblx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSAobWFwcGVyLm1hcCB8fCBtYXBwZXIpLmNhbGwobWFwcGVyLCB0aGlzLmdldCgnYm9keS4nICsgbmFtZSkpO1xuXHRcdFx0XHR9LmJpbmQodGhpcykpO1xuXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0XHR9XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHRgNCw0LLQvdC40YLRjCDQvdCwINGA0LDQstC10YHRgtCy0L5cblx0XHQgKiBAcGFyYW0gIHtyZXF1ZXN0LlJlcXVlc3R9IHJlcVxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0ZXF1YWxzOiBmdW5jdGlvbiAocmVxKSB7XG5cdFx0XHRyZXR1cm4gcmVxICYmICh0aGlzLl9wcm9taXNlID09PSByZXEuX3Byb21pc2UpOyAvLyDQstC+0LfQvNC+0LbQvdC+INC10YHRgtGMINC70YPRh9GI0LDRjyDQv9GA0L7QstC10YDQutCwLCDQvdC+INGPINC90LUg0LfQvdCw0Y5cblx0XHR9XG5cdH07XG5cblxuXHQvKipcblx0ICog0JPRgNGD0L/Qv9C40YDQvtCy0LDRgtGMINC30LDQv9GA0L7RgdGLINCyIMKr0L/QsNGH0LrRg8K7ICAqKirQrdC60YHQv9C10YDQuNC80LXQvdGC0LDQu9GM0L3Ri9C5INC80LXRgtC+0LQqKipcblx0ICogQHBhcmFtXHR7RnVuY3Rpb259IGV4ZWN1dG9yXG5cdCAqIEBwYXJhbVx0e3N0cmluZ30gICBbdXJsXVxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX1cblx0ICovXG5cdHJlcXVlc3QuYmF0Y2ggPSBmdW5jdGlvbiAoZXhlY3V0b3IsIHVybCkge1xuXHRcdHZhciBiYXRjaCA9IF9iYXRjaCB8fCBbXSwgLy8g0YHQvtC30LTQsNC10LwgwqvQv9Cw0YfQutGDwrssINC70LjQsdC+INC40YHQv9C+0LvRjNC30YPQtdC8INGC0LXQutGD0YnQuNGOXG5cdFx0XHRyZXN1bHRzO1xuXG5cdFx0aWYgKF9iYXRjaCA9PT0gbnVsbCkge1xuXHRcdFx0X2JhdGNoID0gYmF0Y2g7XG5cdFx0XHRiYXRjaC5wcm9taXNlID0gbmV3IFByb21pc2UodXRpbC5uZXh0VGljayhmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG5cdFx0XHRcdGlmIChiYXRjaC5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0dmFyIHJlcSA9IHJlcXVlc3QucG9zdCh1cmwgfHwgcmVxdWVzdC5zZXR1cCgnYmF0Y2hVcmwnKSwge1xuXHRcdFx0XHRcdFx0YmF0Y2g6IF9zdHJpbmdpZnkoYmF0Y2gubWFwKGZ1bmN0aW9uIChlbnRyeSkge1xuXHRcdFx0XHRcdFx0XHR2YXIgb3B0cyA9IGVudHJ5Lm9wdHM7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdFx0XHR1cmw6IG9wdHMudXJsLFxuXHRcdFx0XHRcdFx0XHRcdHR5cGU6IG9wdHMudHlwZSxcblx0XHRcdFx0XHRcdFx0XHRkYXRhOiBvcHRzLmRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0aGVhZGVyczogb3B0cy5oZWFkZXJzXG5cdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHR9KSlcblx0XHRcdFx0XHR9LCB7IGJhdGNoOiBmYWxzZSB9KSAvLyDRjdGC0L4g0LfQsNC/0YDQvtGBINC40LTQtdGCINCyINC90LUg0L/QsNGH0LrQuFxuXHRcdFx0XHRcdFx0LmRvbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHRyZXEuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChib2R5LCBpKSB7XG5cdFx0XHRcdFx0XHRcdFx0YmF0Y2hbaV0ucmVxLnhociA9IHJlcS54aHI7XG5cdFx0XHRcdFx0XHRcdFx0YmF0Y2hbaV0ucmVzb2x2ZShib2R5KTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5mYWlsKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdFx0YmF0Y2guZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcblx0XHRcdFx0XHRcdFx0XHRlbnRyeS5yZXEueGhyID0gcmVxLnhocjtcblx0XHRcdFx0XHRcdFx0XHRlbnRyeS5yZWplY3QocmVxKTtcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0cmVqZWN0KHJlcSk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfYmF0Y2ggPSBudWxsO1xuXHRcdFx0fSwgdHJ1ZSkpO1xuXHRcdH1cblxuXHRcdHJlc3VsdHMgPSBleGVjdXRvcigpO1xuXG5cdFx0cmV0dXJuIGJhdGNoLnByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiByZXN1bHRzOyB9KTtcblx0fTtcblxuXG5cdC8vINCf0L7QtNC80LXRiNC40LLQsNC10LwgRW1pdHRlclxuXHRFbWl0dGVyLmFwcGx5KHJlcXVlc3QpO1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDRgtGMIGByZXF1ZXN0LlJlcXVlc3RgINC40LcgWEhSXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gdXJsXG5cdCAqIEBwYXJhbSAge09iamVjdH0gZGF0YVxuXHQgKiBAcGFyYW0gIHtPYmplY3R8WE1MSHR0cFJlcXVlc3R9IHhoclxuXHQgKiBAcmV0dXJuIHtyZXF1ZXN0LlJlcXVlc3R9XG5cdCAqIEBtZW1iZXJPZiByZXF1ZXN0XG5cdCAqL1xuXHRyZXF1ZXN0LmZyb20gPSBmdW5jdGlvbiAodXJsLCBkYXRhLCB4aHIpIHtcblx0XHR2YXIgcmVxID0gT2JqZWN0LmNyZWF0ZSh0aGlzLlJlcXVlc3QucHJvdG90eXBlLCB7dGhlbjoge3ZhbHVlOiBudWxsfX0pO1xuXG5cdFx0cmVxLnhociA9IHhocjtcblx0XHRyZXEudXJsID0gdXJsO1xuXHRcdHJlcS5kYXRhID0gZGF0YTtcblx0XHRyZXEuc3RhdHVzID0geGhyLnN0YXR1cztcblx0XHRyZXEuc3RhdHVzVGV4dCA9IHhoci5zdGF0dXNUZXh0O1xuXHRcdHJlcS5yZWFkeVN0YXRlID0geGhyLnJlYWR5U3RhdGU7XG5cdFx0cmVxLnJlc3BvbnNlVGV4dCA9IHhoci5yZXNwb25zZVRleHQ7XG5cdFx0cmVxLnBlbmRpbmcgPSBmYWxzZTtcblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKHJlcS5pc09LKCkpIHtcblx0XHRcdHJlcS5ib2R5ID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVxO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCY0L3RgtC10LPRgNCw0YbQuNGPINC/0YDQvtC40LfQstC+0LvRjNC90L7Qs9C+INGE0YPQvdC60YbQuNC+0L3QsNC70LAg0LIg0YDQsNCx0L7Rh9C40Lkg0L/RgNC+0YbQtdGB0YEg0L7RgtC/0YDQsNCy0LrQuCDQuCDQvtCx0YDQsNCx0L7RgtC60Lgg0LfQsNC/0YDQvtGB0LBcblx0ICogQHBhcmFtICB7T2JqZWN0fSAgICBvcHRpb25zICAgINC+0L/RhtC40Lgg0LfQsNC/0YDQvtGB0LBcblx0ICogQHBhcmFtICB7RnVuY3Rpb259ICB0cmFuc3BvcnQgINGE0YPQvdC60YbQuNGPINC+0YLQv9GA0LDQstC60Lgg0LfQsNC/0YDQvtGB0LBcblx0ICogQHJldHVybiB7cmVxdWVzdC5SZXF1ZXN0fVxuXHQgKiBAbWVtYmVyT2YgcmVxdWVzdFxuXHQgKi9cblx0cmVxdWVzdC53b3JrZmxvdyA9IGZ1bmN0aW9uIChvcHRpb25zLCB0cmFuc3BvcnQpIHtcblx0XHRvcHRpb25zLnRyYW5zcG9ydCA9IHRyYW5zcG9ydDtcblx0XHRyZXR1cm4gdGhpcy5jYWxsKG9wdGlvbnMudXJsLCBvcHRpb25zLmRhdGEsIG9wdGlvbnMpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDQvdC40LUg0LzQvtC60L7Qsiwg0L7RgdC90L7QstCw0L3QviDQvdCwIFtqUXVlcnkubW9ja2pheF0oaHR0cHM6Ly9naXRodWIuY29tL2FwcGVuZHRvL2pxdWVyeS1tb2NramF4KVxuXHQgKiBAbmFtZSAgICAgcmVxdWVzdC5tb2NrXG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAcGFyYW0gICAge09iamVjdH0gb3B0aW9uc1xuXHQgKiBAcmV0dXJucyAge251bWJlcn1cblx0ICovXG5cdHJlcXVlc3QubW9jayA9ICQubW9ja2pheDtcblxuXHRyZXF1ZXN0Lm1vY2sub25jZSA9ICQubW9ja2pheC5vbmNlO1xuXHRyZXF1ZXN0Lm1vY2suY2xlYXIgPSAkLm1vY2tqYXhDbGVhcjtcblxuXG5cdC8vINCR0YvRgdGC0YDRi9C5INC00L7RgdGC0YPQvyDQuiBQcm9taXNlXG5cdHJlcXVlc3QuYWxsID0gUHJvbWlzZS5hbGw7XG5cdHJlcXVlc3QuUHJvbWlzZSA9IFByb21pc2U7XG5cblxuXHQvLyDCq9CX0LDQv9GA0L7RgcK7LCDRh9GC0L7QsdGLINC80L7QttC90L4g0LHRi9C70L4g0YDQsNGB0YjQuNGA0Y/RgtGMXG5cdHJlcXVlc3QuUmVxdWVzdCA9IFJlcXVlc3Q7XG5cblxuXHQvKipcblx0ICog0JzQsNGB0YHQuNCyINCw0LrRgtC40LLQvdGL0YUg0LfQsNC/0YDQvtGB0L7QslxuXHQgKiBAbWVtYmVyT2YgcmVxdWVzdFxuXHQgKiBAdHlwZSB7cmVxdWVzdC5SZXF1ZXN0W119XG5cdCAqL1xuXHRyZXF1ZXN0LmFjdGl2ZSA9IF9hY3RpdmU7XG5cblxuXHQvLyBFeHBvcnRcblx0cmVxdWVzdC52ZXJzaW9uID0gJzAuOC4wJztcblx0cmV0dXJuIHJlcXVlc3Q7XG59KTtcbiIsIi8qKlxuICogQGF1dGhvciBSdWJhWGEgPHRyYXNoQHJ1YmF4YS5vcmc+XG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuKGZ1bmN0aW9uICgpIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblxuXHR2YXIgUl9TUEFDRSA9IC9cXHMrLyxcblx0XHRSX0tFWUNIQUlOX0NIRUNLID0gL1tcXFsuXFxdXS8sXG5cdFx0Ul9LRVlDSEFJTl9TUExJVCA9IC8oPzpcXC58WydcIl0/XT9cXC4/XFxbWydcIl0/fFsnXCJdP10pL1xuXHQ7XG5cblxuXHQvKipcblx0ICogU3BsaXQg0YHRgtGA0L7QutC4INC/0L4g0L/RgNC+0LHQtdC70YNcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtICAge3N0cmluZ30gdmFsXG5cdCAqIEByZXR1cm5zIHtBcnJheX1cblx0ICovXG5cdGZ1bmN0aW9uIF9zcGxpdCh2YWwpIHtcblx0XHRyZXR1cm4gKHZhbCArICcnKS50cmltKCkuc3BsaXQoUl9TUEFDRSk7XG5cdH1cblxuXG5cblx0LyoqXG5cdCAqINCf0YDQvtCy0LXRgNC40YLRjCDQutC70Y7Rh9C4INC90LAg0L3QsNC70LjRh9C40LUg0Lgg0LjRgdGC0LjQvdC90L7RgdGC0Yxcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtICAge29iamVjdH0gIG9ialxuXHQgKiBAcGFyYW0gICB7c3RyaW5nfSAga2V5c1xuXHQgKiBAcGFyYW0gICB7Ym9vbGVhbn0gW2V4aXN0c11cblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqL1xuXHRmdW5jdGlvbiBfY2hlY2sob2JqLCBrZXlzLCBleGlzdHMpIHtcblx0XHR2YXIgcmV0LCBpLCBrZXksIG5vdCwgbWluLCBtYXg7XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChrZXlzKSB7XG5cdFx0XHRrZXlzID0gX3NwbGl0KGtleXMpO1xuXHRcdFx0aSA9IGtleXMubGVuZ3RoO1xuXG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdGtleSA9IGtleXNbaV07XG5cdFx0XHRcdG5vdCA9IGZhbHNlO1xuXG5cdFx0XHRcdGlmIChrZXkuY2hhckF0KDApID09PSAnIScpIHsvLyDQndCVINC60LvRjtGHXG5cdFx0XHRcdFx0bm90ID0gdHJ1ZTtcblx0XHRcdFx0XHRrZXkgPSBrZXkuc3Vic3RyKDEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGtleS5pbmRleE9mKCc6JykgIT09IC0xKSB7IC8vINC/0LXRgNC10LTQsNC90Ysg0LDRgNCz0YPQvNC10L3RgtGLXG5cdFx0XHRcdFx0a2V5ID0ga2V5LnNwbGl0KCc6Jyk7XG5cdFx0XHRcdFx0bWluID0ga2V5WzFdO1xuXHRcdFx0XHRcdG1heCA9IGtleVsyXTtcblx0XHRcdFx0XHRrZXkgPSBrZXlbMF07XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyDQn9C+0LvRg9GH0LDQtdC8INC30L3QsNGH0LXQvdC40LUg0LrQu9GO0YfQsFxuXHRcdFx0XHRyZXQgPSBfZ3JlcChvYmosIGtleSk7XG5cblx0XHRcdFx0aWYgKG1pbiAhPT0gdm9pZCAwKSB7IC8vINGB0YDQsNCy0L3QuNCy0LDQtdC8INGB0L4g0LfQvdCw0YfQtdC90LjQtdC8INC60LvRjtGH0LBcblx0XHRcdFx0XHRyZXQgPSAobWF4ID09PSB2b2lkIDApXG5cdFx0XHRcdFx0XHRcdD8gKHJldCA9PSBtaW4pXG5cdFx0XHRcdFx0XHRcdDogKHJldCA+PSBtaW4gJiYgcmV0IDw9IG1heClcblx0XHRcdFx0XHRcdDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChleGlzdHMpIHsgLy8g0J/RgNC+0LLQtdGA0LrQsCDQvdCw0LvQuNGH0LjRjyDQutC70Y7Rh9CwXG5cdFx0XHRcdFx0cmV0ID0gcmV0ICE9PSB2b2lkIDA7XG5cdFx0XHRcdH0gZWxzZSB7IC8vINCf0YDQuNCy0L7QtNC40Log0LogYm9vbGVhblxuXHRcdFx0XHRcdHJldCA9ICEhcmV0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHJldCBeIG5vdCkgeyAvLyDQv9GA0LjQvNC10L3Rj9C10Lwg0LzQvtC00LjRhNC40LrQsNGC0L7RgCAo0YIu0LUuIFhPUilcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cblx0LyoqXG5cdCAqINCf0L7Qu9GD0YfQuNGC0Ywv0YPRgdGC0LDQvdC+0LLQuNGC0Ywv0YPQtNCw0LvQuNGC0Ywg0LfQvdCw0YfQtdC90LjQtSDQv9C+INC60LvRjtGH0YNcblx0ICogQHByaXZhdGVcblx0ICogQHBhcmFtICAge29iamVjdH0gIG9ialxuXHQgKiBAcGFyYW0gICB7c3RyaW5nfSAga2V5XG5cdCAqIEBwYXJhbSAgIHtib29sZWFufSBbc2V0XVxuXHQgKiBAcGFyYW0gICB7Kn0gICAgICAgW3ZhbHVlXVxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICovXG5cdGZ1bmN0aW9uIF9ncmVwKG9iaiwga2V5LCBzZXQsIHZhbHVlKSB7XG5cdFx0dmFyIGlzVW5zZXQgPSBhcmd1bWVudHMubGVuZ3RoID09PSAzO1xuXG5cdFx0aWYgKFJfS0VZQ0hBSU5fQ0hFQ0sudGVzdChrZXkpKSB7XG5cdFx0XHR2YXIgY2hhaW4gPSBrZXkuc3BsaXQoUl9LRVlDSEFJTl9TUExJVCksXG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRuID0gY2hhaW4ubGVuZ3RoLFxuXHRcdFx0XHRjdXJPYmogPSBvYmosXG5cdFx0XHRcdHByZXZPYmogPSBvYmosXG5cdFx0XHRcdGxhc3RLZXlcblx0XHRcdDtcblxuXHRcdFx0Zm9yICg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0a2V5ID0gY2hhaW5baV07XG5cdFx0XHRcdGlmIChrZXkgIT09ICcnKSB7XG5cdFx0XHRcdFx0bGFzdEtleSA9IGtleTtcblxuXHRcdFx0XHRcdGlmIChjdXJPYmopIHtcblx0XHRcdFx0XHRcdHByZXZPYmogPSBjdXJPYmo7XG5cdFx0XHRcdFx0XHRjdXJPYmogPSBjdXJPYmpba2V5XTtcblx0XHRcdFx0XHRcdGlmIChzZXQgJiYgIWlzVW5zZXQgJiYgIWN1ck9iaikge1xuXHRcdFx0XHRcdFx0XHRwcmV2T2JqW2tleV0gPSBjdXJPYmogPSB7fTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdm9pZCAwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2V0KSB7XG5cdFx0XHRcdGlmIChpc1Vuc2V0KSB7XG5cdFx0XHRcdFx0ZGVsZXRlIHByZXZPYmpbbGFzdEtleV07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cHJldk9ialtsYXN0S2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjdXJPYmo7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aWYgKHNldCkge1xuXHRcdFx0XHRpZiAoaXNVbnNldCkge1xuXHRcdFx0XHRcdGRlbGV0ZSBvYmpba2V5XTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvYmpba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqW2tleV07XG5cdFx0fVxuXHR9XG5cblxuXG5cdC8qKlxuXHQgKiDQoNCw0LHQvtGC0LAg0YEg0LrQvtC90YTQuNCz0LDQvNC4L9C90LDRgdGC0YDQvtC50LrQsNC80Lhcblx0ICogQGNsYXNzIGNvbmZpZ1xuXHQgKiBAY29uc3RydWN0cyBjb25maWdcblx0ICogQHBhcmFtICAge09iamVjdH0gIFtwcm9wc10gINC60L7QvdGE0LjQs1xuXHQgKiBAcmV0dXJucyB7Y29uZmlnfVxuXHQgKi9cblx0dmFyIGNvbmZpZyA9IGZ1bmN0aW9uIChwcm9wcykge1xuXHRcdGlmICghKHRoaXMgaW5zdGFuY2VvZiBjb25maWcpKSB7XG5cdFx0XHRyZXR1cm5cdG5ldyBjb25maWcocHJvcHMpO1xuXHRcdH1cblxuXHRcdGlmIChwcm9wcykge1xuXHRcdFx0dGhpcy5zZXQocHJvcHMpO1xuXHRcdH1cblx0fTtcblxuXG5cdGNvbmZpZy5mbiA9IGNvbmZpZy5wcm90b3R5cGUgPSAvKiogQGxlbmRzIGNvbmZpZyMgKi8ge1xuXHRcdGNvbnN0cnVjdG9yOiBjb25maWcsXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0L7QstC10YDQuNGC0Ywg0YHQstC+0LnRgdGC0LLQsCDQvdCwINC40YHRgtC40L3QvdC+0YHRgtGMXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIGtleXMgINC90LDQt9Cy0LDQvdC40LUg0YHQstC+0LnRgdGC0LIsINGA0LDQt9C00LXQu9C10L3QvdGL0YUg0L/RgNC+0LHQtdC70L7QvFxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGlzOiBmdW5jdGlvbiAoa2V5cykge1xuXHRcdFx0cmV0dXJuIF9jaGVjayh0aGlzLCBrZXlzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0L7QstC10YDQuNGC0Ywg0L3QsNC70LjRh9C40LUg0YHQstC+0LnRgdGC0LLQsFxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBrZXlzICDQvdCw0LfQstCw0L3QuNC1INGB0LLQvtC50YHRgtCyLCDRgNCw0LfQtNC10LvQtdC90L3Ri9GFINC/0YDQvtCx0LXQu9C+0Lxcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRoYXM6IGZ1bmN0aW9uIChrZXlzKSB7XG5cdFx0XHRyZXR1cm4gX2NoZWNrKHRoaXMsIGtleXMsIHRydWUpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0YHQstC+0LnRgdGC0LLQvlxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBrZXkgICAg0LjQvNGPINGB0LLQvtC50YHRgtCy0LBcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgW2RlZl0gINC30L3QsNGH0LXQvdC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRnZXQ6IGZ1bmN0aW9uIChrZXksIGRlZikge1xuXHRcdFx0dmFyIHJldFZhbCA9IF9ncmVwKHRoaXMsIGtleSk7XG5cdFx0XHRyZXR1cm4gcmV0VmFsID09PSB2b2lkIDAgPyBkZWYgOiByZXRWYWw7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J3QsNC30L3QsNGH0LjRgtGMINGB0LLQvtC50YHRgtCy0L5cblx0XHQgKiBAcGFyYW0gICB7T2JqZWN0fHN0cmluZ30gcHJvcHMgICDRgdC/0LjRgdC+0Log0YHQstC+0LnRgdGC0LJcblx0XHQgKiBAcGFyYW0gICB7Kn0gIFt2YWx1ZV0gICDQt9C90LDRh9C10L3QuNC1XG5cdFx0ICogQHJldHVybiAge2NvbmZpZ31cblx0XHQgKi9cblx0XHRzZXQ6IGZ1bmN0aW9uIChwcm9wcywgdmFsdWUpIHtcblx0XHRcdHZhciBfYXR0cnMgPSBwcm9wcztcblxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdGlmICh0eXBlb2YgcHJvcHMgIT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdF9hdHRycyA9IHt9O1xuXHRcdFx0XHRfYXR0cnNbcHJvcHNdID0gdmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAoX2F0dHJzIGluc3RhbmNlb2YgT2JqZWN0KSB7XG5cdFx0XHRcdGZvciAodmFyIGtleSBpbiBfYXR0cnMpIHtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0XHRcdGlmIChfYXR0cnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuXHRcdFx0XHRcdFx0X2dyZXAodGhpcywga2V5LCB0cnVlLCBfYXR0cnNba2V5XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0LTQsNC70LjRgtGMINGB0LLQvtC50YHRgtCy0L5cblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSAga2V5ICAg0LjQvNGPINGB0LLQvtC50YHRgtCy0LBcblx0XHQgKiBAcmV0dXJucyB7Y29uZmlnfVxuXHRcdCAqL1xuXHRcdHVuc2V0OiBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cywgaSA9IGFyZ3MubGVuZ3RoO1xuXG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdF9ncmVwKHRoaXMsIGFyZ3NbaV0sIHRydWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH07XG5cblxuXHQvKipcblx0ICog0J/QvtC00LzQtdGI0LDRgtGMINC80LXRgtC+0LTRiyDQuiDQvtCx0YrQtdC60YLRg1xuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJvZiBjb25maWdcblx0ICogQHBhcmFtICB7T2JqZWN0fSAgdGFyZ2V0ICDRhtC10LvRjFxuXHQgKiBAcmV0dXJucyB7T2JqZWN0fSAg0LLQvtC30LLRgNCw0YnQsNC10YIg0L/QtdGA0LXQtNCw0L3QvdGL0Lkg0L7QsdGK0LXQutGMXG5cdCAqL1xuXHRjb25maWcuYXBwbHkgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cdFx0dGFyZ2V0LmlzID0gY29uZmlnLmlzO1xuXHRcdHRhcmdldC5oYXMgPSBjb25maWcuaGFzO1xuXHRcdHRhcmdldC5nZXQgPSBjb25maWcuZ2V0O1xuXHRcdHRhcmdldC5zZXQgPSBjb25maWcuc2V0O1xuXHRcdHRhcmdldC51bnNldCA9IGNvbmZpZy51bnNldDtcblx0XHRyZXR1cm5cdHRhcmdldDtcblx0fTtcblxuXG5cdC8vINCh0L7Qt9C00LDQtdC8INCz0LvQvtCx0LDQu9GM0L3Ri9C5INC60L7QvdGE0LjQs1xuXHR2YXIgZ2xvYmFsQ29uZmlnID0gY29uZmlnKHsgX192ZXJzaW9uX186ICcwLjEuMCcgfSksIGtleTtcblx0Zm9yIChrZXkgaW4gZ2xvYmFsQ29uZmlnKSB7XG5cdFx0Y29uZmlnW2tleV0gPSBnbG9iYWxDb25maWdba2V5XTtcblx0fVxuXG5cblx0Ly8g0JLQtdGA0YHQuNGPINC80L7QtNGD0LvRj1xuXHRjb25maWcudmVyc2lvbiA9IFwiMC4xLjBcIjtcblxuXG5cdC8vIEV4cG9ydFxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIChkZWZpbmUuYW1kIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZS5hanMpKSB7XG5cdFx0ZGVmaW5lKCdjb25maWcnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNvbmZpZztcblx0XHR9KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuY29uZmlnID0gd2luZG93Ll9fY29uZmlnX18gPSBjb25maWc7XG5cdH1cbn0pKCk7XG4iLCIvKipcbiAqIEBhdXRob3IgUnViYVhhIDx0cmFzaEBydWJheGEub3JnPlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbihmdW5jdGlvbiAoKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cblx0ZnVuY3Rpb24gX3RoZW4ocHJvbWlzZSwgbWV0aG9kLCBjYWxsYmFjaykge1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cywgcmV0VmFsO1xuXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHJldFZhbCA9IGNhbGxiYWNrLmFwcGx5KHByb21pc2UsIGFyZ3MpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRwcm9taXNlLnJlamVjdChlcnIpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChyZXRWYWwgJiYgdHlwZW9mIHJldFZhbC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0aWYgKHJldFZhbC5kb25lICYmIHJldFZhbC5mYWlsKSB7XG5cdFx0XHRcdFx0XHRyZXRWYWwuX19ub0xvZyA9IHRydWU7XG5cdFx0XHRcdFx0XHRyZXRWYWwuZG9uZShwcm9taXNlLnJlc29sdmUpLmZhaWwocHJvbWlzZS5yZWplY3QpO1xuXHRcdFx0XHRcdFx0cmV0VmFsLl9fbm9Mb2cgPSBmYWxzZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXRWYWwudGhlbihwcm9taXNlLnJlc29sdmUsIHByb21pc2UucmVqZWN0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGFyZ3MgPSBbcmV0VmFsXTtcblx0XHRcdFx0XHRtZXRob2QgPSAncmVzb2x2ZSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cHJvbWlzZVttZXRob2RdLmFwcGx5KHByb21pc2UsIGFyZ3MpO1xuXHRcdH07XG5cdH1cblxuXG5cdC8qKlxuXHQgKiDCq9Ce0LHQtdGJ0LDQvdC40Y/CuyDQv9C+0LTQtNC10YDQttC40LLQsNGO0YIg0LrQsNC6IFvQvdCw0YLQuNCy0L3Ri9C5XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9Qcm9taXNlKVxuXHQgKiDQuNC90YLQtdGA0YTQtdC50YEsINGC0LDQuiDQuCBbJC5EZWZlcnJlZF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2RlZmVycmVkLW9iamVjdC8pLlxuXHQgKlxuXHQgKiBAY2xhc3MgUHJvbWlzZVxuXHQgKiBAY29uc3RydWN0cyBQcm9taXNlXG5cdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIFtleGVjdXRvcl1cblx0ICovXG5cdHZhciBQcm9taXNlID0gZnVuY3Rpb24gKGV4ZWN1dG9yKSB7XG5cdFx0dmFyIF9jb21wbGV0ZWQgPSBmYWxzZTtcblxuXHRcdGZ1bmN0aW9uIF9maW5pc2goc3RhdGUsIHJlc3VsdCkge1xuXHRcdFx0ZGZkLmRvbmUgPVxuXHRcdFx0ZGZkLmZhaWwgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHR9O1xuXG5cdFx0XHRkZmRbc3RhdGUgPyAnZG9uZScgOiAnZmFpbCddID0gZnVuY3Rpb24gKGZuKSB7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRmbihyZXN1bHQpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHR9O1xuXG5cdFx0XHR2YXIgZm4sXG5cdFx0XHRcdGZucyA9IHN0YXRlID8gX2RvbmVGbiA6IF9mYWlsRm4sXG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRuID0gZm5zLmxlbmd0aFxuXHRcdFx0O1xuXG5cdFx0XHRmb3IgKDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRmbiA9IGZuc1tpXTtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdGZuKHJlc3VsdCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Zm5zID0gX2RvbmVGbiA9IF9mYWlsRm4gPSBudWxsO1xuXHRcdH1cblxuXG5cdFx0ZnVuY3Rpb24gX3NldFN0YXRlKHN0YXRlKSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24gKHJlc3VsdCkge1xuXHRcdFx0XHRpZiAoX2NvbXBsZXRlZCkge1xuXHRcdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfY29tcGxldGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRkZmQucmVzb2x2ZSA9XG5cdFx0XHRcdGRmZC5yZWplY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGRmZDtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHRpZiAoc3RhdGUgJiYgcmVzdWx0ICYmIHJlc3VsdC50aGVuICYmIHJlc3VsdC5wZW5kaW5nICE9PSBmYWxzZSkge1xuXHRcdFx0XHRcdC8vINCe0L/QsNGH0LrQuCFcblx0XHRcdFx0XHRyZXN1bHQudGhlbihcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChyZXN1bHQpIHsgX2ZpbmlzaCh0cnVlLCByZXN1bHQpOyB9LFxuXHRcdFx0XHRcdFx0ZnVuY3Rpb24gKHJlc3VsdCkgeyBfZmluaXNoKGZhbHNlLCByZXN1bHQpOyB9XG5cdFx0XHRcdFx0KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfZmluaXNoKHN0YXRlLCByZXN1bHQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGRmZDtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0dmFyXG5cdFx0XHRfZG9uZUZuID0gW10sXG5cdFx0XHRfZmFpbEZuID0gW10sXG5cblx0XHRcdGRmZCA9IHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvtCx0YDQsNCx0L7RgtGH0LjQuiwg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQstGL0LfQstCw0L0sINC60L7Qs9C00LAgwqvQvtCx0LXRidCw0L3QuNC1wrsg0LHRg9C00LXRgiDCq9GA0LDQt9GA0LXRiNC10L3QvsK7XG5cdFx0XHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgZm4gINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0LHQvtGC0YfQuNC6XG5cdFx0XHRcdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHRcdFx0XHQgKiBAbWVtYmVyT2YgUHJvbWlzZSNcblx0XHRcdFx0ICovXG5cdFx0XHRcdGRvbmU6IGZ1bmN0aW9uIGRvbmUoZm4pIHtcblx0XHRcdFx0XHRfZG9uZUZuLnB1c2goZm4pO1xuXHRcdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqINCU0L7QsdCw0LLQu9GP0LXRgiDQvtCx0YDQsNCx0L7RgtGH0LjQuiwg0LrQvtGC0L7RgNGL0Lkg0LHRg9C00LXRgiDQstGL0LfQstCw0L0sINC60L7Qs9C00LAgwqvQvtCx0LXRidCw0L3QuNC1wrsg0LHRg9C00LXRgiDCq9C+0YLQvNC10L3QtdC90L7Cu1xuXHRcdFx0XHQgKiBAcGFyYW0gIHtGdW5jdGlvbn0gIGZuICDRhNGD0L3QutGG0LjRjyDQvtCx0YDQsNCx0L7RgtGH0LjQulxuXHRcdFx0XHQgKiBAcmV0dXJucyB7UHJvbWlzZX1cblx0XHRcdFx0ICogQG1lbWJlck9mIFByb21pc2UjXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRmYWlsOiBmdW5jdGlvbiBmYWlsKGZuKSB7XG5cdFx0XHRcdFx0X2ZhaWxGbi5wdXNoKGZuKTtcblx0XHRcdFx0XHRyZXR1cm4gZGZkO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8qKlxuXHRcdFx0XHQgKiDQlNC+0LHQsNCy0LvRj9C10YIg0YHRgNCw0LfRgyDQtNCy0LAg0L7QsdGA0LDQsdC+0YLRh9C40LrQsFxuXHRcdFx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgW2RvbmVGbl0gICDQsdGD0LTQtdGCINCy0YvQv9C+0LvQvdC10L3Qviwg0LrQvtCz0LTQsCDCq9C+0LHQtdGJ0LDQvdC40LXCuyDQsdGD0LTQtdGCIMKr0YDQsNC30YDQtdGI0LXQvdC+wrtcblx0XHRcdFx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIFtmYWlsRm5dICAg0LjQu9C4INC60L7Qs9C00LAgwqvQvtCx0LXRidCw0L3QuNC1wrsg0LHRg9C00LXRgiDCq9C+0YLQvNC10L3QtdC90L7Cu1xuXHRcdFx0XHQgKiBAcmV0dXJucyB7UHJvbWlzZX1cblx0XHRcdFx0ICogQG1lbWJlck9mIFByb21pc2UjXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHR0aGVuOiBmdW5jdGlvbiB0aGVuKGRvbmVGbiwgZmFpbEZuKSB7XG5cdFx0XHRcdFx0dmFyIHByb21pc2UgPSBQcm9taXNlKCk7XG5cblx0XHRcdFx0XHRkZmQuX19ub0xvZyA9IHRydWU7IC8vINC00LvRjyDQu9C+0LPQs9C10YDQsFxuXG5cdFx0XHRcdFx0ZGZkXG5cdFx0XHRcdFx0XHQuZG9uZShfdGhlbihwcm9taXNlLCAncmVzb2x2ZScsIGRvbmVGbikpXG5cdFx0XHRcdFx0XHQuZmFpbChfdGhlbihwcm9taXNlLCAncmVqZWN0JywgZmFpbEZuKSlcblx0XHRcdFx0XHQ7XG5cblx0XHRcdFx0XHRkZmQuX19ub0xvZyA9IGZhbHNlO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0bm90aWZ5OiBmdW5jdGlvbiAoKSB7IC8vIGpRdWVyeSBzdXBwb3J0XG5cdFx0XHRcdFx0cmV0dXJuIGRmZDtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHRwcm9ncmVzczogZnVuY3Rpb24gKCkgeyAvLyBqUXVlcnkgc3VwcG9ydFxuXHRcdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0cHJvbWlzZTogZnVuY3Rpb24gKCkgeyAvLyBqUXVlcnkgc3VwcG9ydFxuXHRcdFx0XHRcdC8vIGpRdWVyeSBzdXBwb3J0XG5cdFx0XHRcdFx0cmV0dXJuIGRmZDtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICog0JTQvtCx0LDQstC40YLRjCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDCq9C+0LHQtdGJ0LDQvdC40LnCuyDQsiDQvdC10LfQsNCy0LjRgdC40LzQvtGB0YLQuCDQvtGCINCy0YvQv9C+0LvQvdC10L3QuNGPXG5cdFx0XHRcdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gICBmbiAgINGE0YPQvdC60YbQuNGPINC+0LHRgNCw0LHQvtGC0YfQuNC6XG5cdFx0XHRcdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHRcdFx0XHQgKiBAbWVtYmVyT2YgUHJvbWlzZSNcblx0XHRcdFx0ICovXG5cdFx0XHRcdGFsd2F5czogZnVuY3Rpb24gYWx3YXlzKGZuKSB7XG5cdFx0XHRcdFx0ZGZkLmRvbmUoZm4pLmZhaWwoZm4pO1xuXHRcdFx0XHRcdHJldHVybiBkZmQ7XG5cdFx0XHRcdH0sXG5cblxuXHRcdFx0XHQvKipcblx0XHRcdFx0ICogwqvQoNCw0LfRgNC10YjQuNGC0YzCuyDCq9C+0LHQtdGJ0LDQvdC40LXCu1xuXHRcdFx0XHQgKiBAcGFyYW0gICAgeyp9ICByZXN1bHRcblx0XHRcdFx0ICogQHJldHVybnMgIHtQcm9taXNlfVxuXHRcdFx0XHQgKiBAbWV0aG9kXG5cdFx0XHRcdCAqIEBtZW1iZXJPZiBQcm9taXNlI1xuXHRcdFx0XHQgKi9cblx0XHRcdFx0cmVzb2x2ZTogX3NldFN0YXRlKHRydWUpLFxuXG5cblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIMKr0J7RgtC80LXQvdC40YLRjMK7IMKr0L7QsdC10YnQsNC90LjQtcK7XG5cdFx0XHRcdCAqIEBwYXJhbSAgIHsqfSAgcmVzdWx0XG5cdFx0XHRcdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHRcdFx0XHQgKiBAbWV0aG9kXG5cdFx0XHRcdCAqIEBtZW1iZXJPZiBQcm9taXNlI1xuXHRcdFx0XHQgKi9cblx0XHRcdFx0cmVqZWN0OiBfc2V0U3RhdGUoZmFsc2UpXG5cdFx0XHR9XG5cdFx0O1xuXG5cblx0XHQvKipcblx0XHQgKiBAbmFtZSAgUHJvbWlzZSNjYXRjaFxuXHRcdCAqIEBhbGlhcyBmYWlsXG5cdFx0ICogQG1ldGhvZFxuXHRcdCAqL1xuXHRcdGRmZFsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChmbikge1xuXHRcdFx0cmV0dXJuIGRmZC50aGVuKG51bGwsIGZuKTtcblx0XHR9O1xuXG5cblx0XHRkZmQuY29uc3RydWN0b3IgPSBQcm9taXNlO1xuXG5cblx0XHQvLyDQoNCw0LHQvtGC0LXQsNC8INC60LDQuiBuYXRpdmUgUHJvbWlzZXNcblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmICh0eXBlb2YgZXhlY3V0b3IgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGV4ZWN1dG9yKGRmZC5yZXNvbHZlLCBkZmQucmVqZWN0KTtcblx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRkZmQucmVqZWN0KGVycik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRmZDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQlNC+0LbQtNCw0YLRjNGB0Y8gwqvRgNCw0LfRgNC10YjQtdC90LjRj8K7INCy0YHQtdGFINC+0LHQtdGJ0LDQvdC40Llcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgUHJvbWlzZVxuXHQgKiBAcGFyYW0gICAge0FycmF5fSBpdGVyYWJsZSAg0LzQsNGB0YHQuNCyINC30L3QsNGH0LXQvdC40Lkv0L7QsdC10YnQsNC90LjQuVxuXHQgKiBAcmV0dXJucyAge1Byb21pc2V9XG5cdCAqL1xuXHRQcm9taXNlLmFsbCA9IGZ1bmN0aW9uIChpdGVyYWJsZSkge1xuXHRcdHZhciBkZmQgPSBQcm9taXNlKCksXG5cdFx0XHRkLFxuXHRcdFx0aSA9IDAsXG5cdFx0XHRuID0gaXRlcmFibGUubGVuZ3RoLFxuXHRcdFx0cmVtYWluID0gbixcblx0XHRcdHZhbHVlcyA9IFtdLFxuXHRcdFx0X2ZuLFxuXHRcdFx0X2RvbmVGbiA9IGZ1bmN0aW9uIChpLCB2YWwpIHtcblx0XHRcdFx0KGkgPj0gMCkgJiYgKHZhbHVlc1tpXSA9IHZhbCk7XG5cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKC0tcmVtYWluIDw9IDApIHtcblx0XHRcdFx0XHRkZmQucmVzb2x2ZSh2YWx1ZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0X2ZhaWxGbiA9IGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0ZGZkLnJlamVjdChbZXJyXSk7XG5cdFx0XHR9XG5cdFx0O1xuXG5cdFx0aWYgKHJlbWFpbiA9PT0gMCkge1xuXHRcdFx0X2RvbmVGbigpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGZvciAoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdGQgPSBpdGVyYWJsZVtpXTtcblxuXHRcdFx0XHRpZiAoZCAmJiB0eXBlb2YgZC50aGVuID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0X2ZuID0gX2RvbmVGbi5iaW5kKG51bGwsIGkpOyAvLyB0b2RvOiDRgtC10YHRglxuXG5cdFx0XHRcdFx0ZC5fX25vTG9nID0gdHJ1ZTtcblxuXHRcdFx0XHRcdGlmIChkLmRvbmUgJiYgZC5mYWlsKSB7XG5cdFx0XHRcdFx0XHRkLmRvbmUoX2ZuKS5mYWlsKF9mYWlsRm4pO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRkLnRoZW4oX2ZuLCBfZmFpbEZuKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkLl9fbm9Mb2cgPSBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRfZG9uZUZuKGksIGQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRmZDtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQlNC+0LbQtNCw0YLRjNGB0Y8gwqvRgNCw0LfRgNC10YjQtdC90LjRj8K7INCy0YHQtdGFINC+0LHQtdGJ0LDQvdC40Lkg0Lgg0LLQtdGA0L3Rg9GC0Ywg0YDQtdC30YPQu9GM0YLQsNGCINC/0L7RgdC70LXQtNC90LXQs9C+XG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIFByb21pc2Vcblx0ICogQHBhcmFtICAgIHtBcnJheX0gICBpdGVyYWJsZSAgINC80LDRgdGB0LjQsiDQt9C90LDRh9C10L3QuNC5L9C+0LHQtdGJ0LDQvdC40Llcblx0ICogQHJldHVybnMgIHtQcm9taXNlfVxuXHQgKi9cblx0UHJvbWlzZS5yYWNlID0gZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG5cdFx0cmV0dXJuIFByb21pc2UuYWxsKGl0ZXJhYmxlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZXMpIHtcblx0XHRcdHJldHVybiB2YWx1ZXMucG9wKCk7XG5cdFx0fSk7XG5cdH07XG5cblxuXHQvKipcblx0ICog0J/RgNC40LLQtdGB0YLQuCDQt9C90LDRh9C10L3QuNC1INC6IMKr0J7QsdC10YnQsNC90LjRjsK7XG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIFByb21pc2Vcblx0ICogQHBhcmFtICAgIHsqfSAgIHZhbHVlICAgINC/0LXRgNC10LzQtdC90L3QsNGPINC40LvQuCDQvtCx0YrQtdC60YIg0LjQvNC10Y7RidC40Lkg0LzQtdGC0L7QtCB0aGVuXG5cdCAqIEByZXR1cm5zICB7UHJvbWlzZX1cblx0ICovXG5cdFByb21pc2UuY2FzdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdHZhciBwcm9taXNlID0gUHJvbWlzZSgpLnJlc29sdmUodmFsdWUpO1xuXHRcdHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gJ2Z1bmN0aW9uJ1xuXHRcdFx0PyBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0pXG5cdFx0XHQ6IHByb21pc2Vcblx0XHQ7XG5cdH07XG5cblxuXHQvKipcblx0ICog0JLQtdGA0L3Rg9GC0YwgwqvRgNCw0LfRgNC10YjQtdC90L3QvtC1wrsg0L7QsdC10YnQsNC90LjQtVxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZW1iZXJPZiBQcm9taXNlXG5cdCAqIEBwYXJhbSAgICB7Kn0gICB2YWx1ZSAgICDQv9C10YDQtdC80LXQvdC90LDRj1xuXHQgKiBAcmV0dXJucyAge1Byb21pc2V9XG5cdCAqL1xuXHRQcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRyZXR1cm4gKHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBQcm9taXNlKSA/IHZhbHVlIDogUHJvbWlzZSgpLnJlc29sdmUodmFsdWUpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCS0LXRgNC90YPRgtGMIMKr0L7RgtC60LvQvtC90LXQvdC90L7QtcK7INC+0LHQtdGJ0LDQvdC40LVcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgUHJvbWlzZVxuXHQgKiBAcGFyYW0gICAgeyp9ICAgdmFsdWUgICAg0L/QtdGA0LXQvNC10L3QvdCw0Y9cblx0ICogQHJldHVybnMgIHtQcm9taXNlfVxuXHQgKi9cblx0UHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRyZXR1cm4gUHJvbWlzZSgpLnJlamVjdCh2YWx1ZSk7XG5cdH07XG5cblxuXHQvKipcblx0ICog0JTQvtC20LTQsNGC0YzRgdGPIMKr0YDQsNC30YDQtdGI0LXQvdC40Y/CuyDQstGB0LXRhSDQvtCx0LXRidCw0L3QuNC5XG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBtYXAgwqvQmtC70Y7Rh9GMwrsgPT4gwqvQntCx0LXRidCw0L3QuNC1wrtcblx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdCAqL1xuXHRQcm9taXNlLm1hcCA9IGZ1bmN0aW9uIChtYXApIHtcblx0XHR2YXIgYXJyYXkgPSBbXSwga2V5LCBpZHggPSAwLCByZXN1bHRzID0ge307XG5cblx0XHRmb3IgKGtleSBpbiBtYXApIHtcblx0XHRcdGFycmF5LnB1c2gobWFwW2tleV0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBQcm9taXNlLmFsbChhcnJheSkudGhlbihmdW5jdGlvbiAodmFsdWVzKSB7XG5cdFx0XHQvKiBqc2hpbnQgLVcwODggKi9cblx0XHRcdGZvciAoa2V5IGluIG1hcCkge1xuXHRcdFx0XHRyZXN1bHRzW2tleV0gPSB2YWx1ZXNbaWR4KytdO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0cztcblx0XHR9KTtcblx0fTtcblxuXG5cblx0Ly8g0JLQtdGA0YHQuNGPINC80L7QtNGD0LvRj1xuXHRQcm9taXNlLnZlcnNpb24gPSBcIjAuMy4xXCI7XG5cblxuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRpZiAoIXdpbmRvdy5Qcm9taXNlKSB7XG5cdFx0d2luZG93LlByb21pc2UgPSBQcm9taXNlO1xuXHR9XG5cblxuXHQvLyBleHBvcnRzXG5cdGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgKGRlZmluZS5hbWQgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gZGVmaW5lLmFqcykpIHtcblx0XHRkZWZpbmUoJ1Byb21pc2UnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIFByb21pc2U7XG5cdFx0fSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdHdpbmRvdy5EZWZlcnJlZCA9IFByb21pc2U7XG5cdH1cbn0pKCk7XG4iLCJkZWZpbmUoJ01vZGVsLkxpc3QnLCBbXG5cdCd1dGlscy91dGlsJyxcblx0J2ZpbHRlcicsXG5cdCdpbmhlcml0Jyxcblx0J1JQQycsXG5cdCdFbWl0dGVyJ1xuXSwgZnVuY3Rpb24gKFxuXHQvKiogdXRpbCAqL3V0aWwsXG5cdC8qKiBGdW5jdGlvbiAqL2ZpbHRlcixcblx0LyoqIEZ1bmN0aW9uICovaW5oZXJpdCxcblx0LyoqIFJQQyAqL1JQQyxcblx0LyoqIEVtaXR0ZXIgKi9FbWl0dGVyXG4pIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblxuXHQvKipcblx0ICogwqvQntCx0LXRidCw0L3QuNC1wrsg0YEg0YHRgdGL0LvQutC+0Lkg0L3QsCDRgdC/0LjRgdC+0Log0LzQvtC00LXQu9C10LksINC60L7RgtC+0YDRi9C1INCx0YPQtNGD0YIg0LfQsNCz0YDRg9C20LXQvdGLXG5cdCAqIEB0eXBlZGVmICB7T2JqZWN0fSAgTW9kZWxMaXN0UHJvbWlzZVxuXHQgKiBAcHJvcGVydHkge01vZGVsLkxpc3R9IGxpc3Rcblx0ICogQHByb3BlcnR5IHtGdW5jdGlvbn0gdGhlblxuXHQgKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBkb25lXG5cdCAqIEBwcm9wZXJ0eSB7RnVuY3Rpb259IGZhaWxcblx0ICogQHByb3BlcnR5IHtGdW5jdGlvbn0gYWx3YXlzXG5cdCAqL1xuXG5cblxuXHR2YXIgYXJyYXkgPSBbXSxcblxuXHRcdGFycmF5X3B1c2ggPSBhcnJheS5wdXNoLFxuXHRcdGFycmF5X2pvaW4gPSBhcnJheS5qb2luLFxuXHRcdGFycmF5X3NvcnQgPSBhcnJheS5zb3J0LFxuXHRcdGFycmF5X3NsaWNlID0gYXJyYXkuc2xpY2UsXG5cdFx0YXJyYXlfc3BsaWNlID0gYXJyYXkuc3BsaWNlLFxuXHRcdGFycmF5X2luZGV4T2YgPSBhcnJheS5pbmRleE9mLFxuXHRcdGFycmF5X3NvbWUgPSBhcnJheS5zb21lLFxuXHRcdGFycmF5X2V2ZXJ5ID0gYXJyYXkuZXZlcnksXG5cdFx0YXJyYXlfcmVkdWNlID0gYXJyYXkucmVkdWNlLFxuXG5cdFx0X2FsbE1vZGVsRXZlbnRzID0gJ3N5bmMgY2hhbmdlIHJlbW92ZSBkZXN0cm95JyxcblxuXHRcdHN0cmluZ2lmeUpTT04gPSBKU09OLnN0cmluZ2lmeSxcblxuXHRcdF9jb21wYXJlQXR0ciA9IGZ1bmN0aW9uICgvKiBNb2RlbCAqL2EsIC8qIE1vZGVsICoqL2IsIC8qIHN0cmluZyAqL2F0dHIsIC8qIGJvb2xlYW4gKi9kZXNjKSB7XG5cdFx0XHR2YXIgYVZhbCA9IGEuZ2V0KGF0dHIpLFxuXHRcdFx0XHRiVmFsID0gYi5nZXQoYXR0ciksXG5cdFx0XHRcdHJlcyA9IGFWYWwgLSBiVmFsO1xuXG5cdFx0XHRpZiAocmVzICE9PSByZXMpIHtcblx0XHRcdFx0aWYgKGFWYWwgJiYgYVZhbC5sb2NhbGVDb21wYXJlKSB7XG5cdFx0XHRcdFx0cmVzID0gYVZhbC5sb2NhbGVDb21wYXJlKGJWYWwpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlcyA9IChhVmFsID09IGJWYWwpID8gMCA6IChhVmFsID4gYlZhbCA/IDEgOiAtMSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJlcyAqIChkZXNjID8gLTEgOiAxKTtcblx0XHR9XG5cdDtcblxuXG5cdC8qKlxuXHQgKiDQodC/0LjRgdC+0Log0LzQvtC00LXQu9C10LkgKNC60L7Qu9C70LXQutGG0LjRjylcblx0ICogQGNsYXNzIE1vZGVsLkxpc3Rcblx0ICogQGNvbnN0cnVjdHMgTW9kZWwuTGlzdFxuXHQgKiBAbWl4ZXMgIEVtaXR0ZXJcblx0ICogQG1peGVzICBpbmhlcml0XG5cdCAqIEBwYXJhbSAge01vZGVsW119ICAgIFttb2RlbHNdICDQvNCw0YHRgdC40LIg0LzQvtC00LXQu9C10Llcblx0ICogQHBhcmFtICB7Ym9vbGVhbn0gICAgW2xhenldICAgINC70LXQvdC40LLQsNGPINC40L3QuNGG0LjQsNC70LjQt9Cw0YbQuNGPXG5cdCAqL1xuXHRmdW5jdGlvbiBMaXN0KG1vZGVscywgbGF6eSkge1xuXHRcdHRoaXMuX2luZGV4ID0ge307XG5cdFx0dGhpcy5fc2FmZWRTdG9yZSA9IHt9O1xuXHRcdHRoaXMubGVuZ3RoID0gMDtcblxuXHRcdC8vINCc0LXRgtC+0LQg0LTQvtC70LbQtdC9INCx0YvRgtGMINGD0L3QuNC60LDQu9GM0L3Ri9C5INC00LvRjyDQutCw0LbQtNC+0LPQviDRjdC60LfQtdC80L/Qu9GP0YDQsCDQutC70LDRgdGB0LBcblx0XHR0aGlzLl9kZWJvdW5jZVRyaWdnZXJVcGRhdGUgPSB1dGlsLmRlYm91bmNlKGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMudHJpZ2dlcigndXBkYXRlJywgdGhpcyk7XG5cdFx0fSwgMCk7XG5cblx0XHRpZiAobW9kZWxzIGluc3RhbmNlb2YgQXJyYXkgfHwgbW9kZWxzIGluc3RhbmNlb2YgTGlzdCkge1xuXHRcdFx0dGhpcy5zZXQobW9kZWxzLCB0cnVlKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAobGF6eSkge1xuXHRcdFx0dGhpcy5vbiA9IHRoaXMuX2xhenlPbjtcblx0XHRcdHRoaXMuZ2V0ID0gdGhpcy5fbGF6eUdldDtcblx0XHR9XG5cdH1cblxuXG5cdExpc3QuZm4gPSBMaXN0LnByb3RvdHlwZSA9IC8qKiBAbGVuZHMgTW9kZWwuTGlzdCMgKi8ge1xuXHRcdGNvbnN0cnVjdG9yOiBMaXN0LFxuXG5cblx0XHQvKipcblx0XHQgKiDQmtCw0Log0YHQvtGA0YLQuNGA0L7QstCw0YLRjCDQutC+0LvQu9C10LrRhtC40Y4sINC/0L7QtNGA0L7QsdC90LXQtSDRgdC80L7RgtGA0LjRgtC1INC80LXRgtC+0LQgYHNvcnRgXG5cdFx0ICogQHR5cGUge3N0cmluZ3xvYmplY3R8ZnVuY3Rpb259XG5cdFx0ICovXG5cdFx0Y29tcGFyYXRvcjogbnVsbCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHQstGP0LfQsNC90L3QsNGPINC80L7QtNC10LvRjFxuXHRcdCAqIEB0eXBlIHtNb2RlbH1cblx0XHQgKi9cblx0XHRNb2RlbDogbnVsbCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JrQvtC70LjRh9C10YHRgtCy0L4g0LzQvtC00LXQu9C10Lkg0LIg0LrQvtC70LvQtdC60YbQuNC4XG5cdFx0ICogQHR5cGUge251bWJlcn1cblx0XHQgKi9cblx0XHRsZW5ndGg6IDAsXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0LjQstGP0LfQsNC90Ysg0LvQuCDQvNC+0LTQtdC70Lgg0LIg0Y3RgtC+0Lwg0YHQv9C40YHQutC1INC6INCz0LvQvtCx0LDQu9GM0L3QvtC80YMg0YHQv9C40YHQutGDINGN0LrQt9C10L/Qu9GP0YDQvtCyIChNb2RlbC5hbGwpXG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0bG9jYWw6IGZhbHNlLFxuXG5cdFx0LyoqXG5cdFx0ICog0JTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSDQuNC90LTQtdC60YHRi1xuXHRcdCAqIEB0eXBlIHtvYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRfaW5kZXhlczogbnVsbCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JvQtdC90LjQstCw0Y8g0LjQvdC40YbQuNCw0LfQuNGG0LjRjyDRgdC70YPRiNCw0YLQtdC70LXQuSDRgdC+0LHRi9GC0LjQuVxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgIGV2ZW50c1xuXHRcdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuXG5cdFx0ICogQHJldHVybnMge01vZGVsLkxpc3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRfbGF6eU9uOiBmdW5jdGlvbiAoZXZlbnRzLCBmbikge1xuXHRcdFx0dmFyIG9uID0gRW1pdHRlci5mbi5vbixcblx0XHRcdFx0aSA9IHRoaXMubGVuZ3RoO1xuXG5cdFx0XHR0aGlzLm9uID0gb247IC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC80LXRgtC+0LRcblxuXHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHR0aGlzW2ldLm9uKF9hbGxNb2RlbEV2ZW50cywgdGhpcyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBvbi5jYWxsKHRoaXMsIGV2ZW50cywgZm4pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCb0LXQvdC40LLQsNGPINC40L3QuNGG0LjQsNC30LjRhtC40Y8g0LzQtdGC0L7QtNCwINC40L3QtNC10LrRgdCwXG5cdFx0ICogQHBhcmFtICAgeyp9ICAgIGlkXG5cdFx0ICogQHJldHVybnMge01vZGVsfVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0X2xhenlHZXQ6IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0dmFyIGdldCA9IExpc3QuZm4uZ2V0LFxuXHRcdFx0XHRpID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRcdG1vZGVsLFxuXHRcdFx0XHRfaW5kZXggPSB0aGlzLl9pbmRleFxuXHRcdFx0O1xuXG5cdFx0XHR0aGlzLmdldCA9IGdldDsgLy8g0LLQvtC30LLRgNCw0YnQsNC10Lwg0LzQtdGC0L7QtFxuXG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdG1vZGVsID0gdGhpc1tpXTtcblx0XHRcdFx0X2luZGV4W21vZGVsLmlkXSA9IF9pbmRleFttb2RlbC5jaWRdID0gbW9kZWw7XG5cdFx0XHRcdCh0aGlzLl9hZGRUb0luZGV4ICE9PSB2b2lkIDApICYmIHRoaXMuX2FkZFRvSW5kZXgobW9kZWwpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZ2V0LmNhbGwodGhpcywgaWQpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7QtNCz0L7RgtC+0LLQuNGC0Ywg0LzQvtC00LXQu9GMXG5cdFx0ICogQHBhcmFtICAge09iamVjdH0gIGF0dHJzXG5cdFx0ICogQHBhcmFtICAge29wdGlvbnN9IG9wdGlvbnNcblx0XHQgKiBAcmV0dXJucyB7TW9kZWx9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRfcHJlcGFyZU1vZGVsOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcblx0XHRcdHZhciBNb2RlbCA9IHRoaXMuTW9kZWwsXG5cdFx0XHRcdG1vZGVsID0gYXR0cnMsXG5cdFx0XHRcdGFsbCA9IE1vZGVsLmFsbCxcblx0XHRcdFx0aWRcblx0XHRcdDtcblxuXHRcdFx0aWYgKCEoYXR0cnMgaW5zdGFuY2VvZiBNb2RlbCkpIHtcblx0XHRcdFx0Ly8g0L/QvtC/0YDQvtCx0YPQtdC8INC00L7RgdGC0LDRgtGMINC40Lcg0LPQu9C+0LHQsNC70YzQvdC+0Lkg0LrQvtC70LvQtdC60YbQuNC4XG5cdFx0XHRcdGlkID0gYXR0cnMuY2lkIHx8IGF0dHJzW01vZGVsLmZuLmlkQXR0cl07XG5cdFx0XHRcdG1vZGVsID0gdGhpcy5nZXQoaWQpIHx8ICghdGhpcy5sb2NhbCAmJiBhbGwuZ2V0KGlkKSk7XG5cblx0XHRcdFx0aWYgKCFtb2RlbCkge1xuXHRcdFx0XHRcdC8vINCh0L7Qt9C00LDQtdC8INC80L7QtNC10LvRjFxuXHRcdFx0XHRcdG1vZGVsID0gbmV3IE1vZGVsKGF0dHJzKTtcblxuXHRcdFx0XHRcdCF0aGlzLmxvY2FsICYmIGFsbC5zZXQoW21vZGVsXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Ly8g0L/RgNC+0YHRgtC+INC+0LHQvdC+0LLQu9GP0LXQvFxuXHRcdFx0XHRcdG1vZGVsLnNldChhdHRycywgb3B0aW9ucyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1vZGVsO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0LHRgNCw0LHQvtGC0LrQsCDQuCDQtNC10LvQuNCz0LjRgNC+0LLQsNC90LjQtSDRgdC+0LHRi9GC0LjRjyDQvtGCINC80L7QtNC10LvQuFxuXHRcdCAqIEBwYXJhbSAge0VtaXR0ZXIuRXZlbnR9ICBldnRcblx0XHQgKiBAcGFyYW0gIHtNb2RlbH0gIG1vZGVsXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRoYW5kbGVFdmVudDogZnVuY3Rpb24gKGV2dCwgbW9kZWwpIHtcblx0XHRcdHZhciB0eXBlID0gZXZ0LnR5cGU7XG5cblx0XHRcdGlmICh0eXBlID09PSAncmVtb3ZlJyB8fCB0eXBlID09PSAnZGVzdHJveScpIHtcblx0XHRcdFx0dGhpcy5yZW1vdmUobW9kZWwpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7IC8vINCc0LXRgtC+0LQgYHJlbW92ZWAg0YHQsNC8INC40YHQv9GD0YHQutCw0LXRgiDRgdC+0LHRi9GC0LjRj1xuXHRcdFx0XHQobW9kZWwuaWQgIT09IG51bGwpICYmICh0aGlzLl9pbmRleFttb2RlbC5pZF0gPSBtb2RlbCk7IC8vINC/0LXRgNC10LjQvdC00LXQutGB0LjRgNGD0LXQvFxuXG5cdFx0XHRcdGV2dC5saXN0ID0gdGhpcztcblx0XHRcdFx0dGhpcy50cmlnZ2VyKGV2dCwgbW9kZWwpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9jaGFuZ2VkID0gdHlwZSA9PT0gJ2NoYW5nZSc7XG5cblx0XHRcdGlmICh0aGlzLl9jaGFuZ2luZyAhPT0gdHJ1ZSkgeyAvLyDQktGL0YHRgtCw0LLQu9GP0LXRgtGB0Y8g0LIgYHNldGBcblx0XHRcdFx0dGhpcy5fZGVib3VuY2VUcmlnZ2VyVXBkYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/QtdGA0LXQsdC+0YAg0LzQvtC00LXQu9C10Llcblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259IGl0ZXJhdG9yXG5cdFx0ICogQHBhcmFtICAgeyp9ICB0aGlzQXJnXG5cdFx0ICogQHJldHVybnMge01vZGVsLkxpc3R9XG5cdFx0ICovXG5cdFx0ZWFjaDogZnVuY3Rpb24gKGl0ZXJhdG9yLCB0aGlzQXJnKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbiA9IHRoaXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdGl0ZXJhdG9yLmNhbGwodGhpc0FyZywgdGhpc1tpXSwgaSwgdGhpcyk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQktC10YDQvdC10YIg0LzQsNGB0YHQuNCyLCDQv9C+0LvRg9GH0LXQvdC90YvQuSDQv9GA0LXQvtCx0YDQsNC30L7QstCw0L3QuNC10Lwg0LrQsNC20LTQvtC5INC80L7QtNC10LvQuCDQsiDRhNGD0L3QutGG0LjQuCBpdGVyYXRvclxuXHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBpdGVyYXRvclxuXHRcdCAqIEBwYXJhbSAgeyp9IHRoaXNBcmdcblx0XHQgKiBAcmV0dXJuIHtBcnJheX1cblx0XHQgKi9cblx0XHRtYXA6IGZ1bmN0aW9uIChpdGVyYXRvciwgdGhpc0FyZykge1xuXHRcdFx0dmFyIHJldEFyciA9IFtdO1xuXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgbiA9IHRoaXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdHJldEFyci5wdXNoKGl0ZXJhdG9yLmNhbGwodGhpc0FyZywgdGhpc1tpXSwgaSwgdGhpcykpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmV0QXJyO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQvtCy0LXRgNGP0LXRgiwg0YPQtNC+0LLQu9C10YLQstC+0YDRj9C10YIg0LvQuCDRhdC+0YLRjCDQutCw0LrQvtC5LdC90LjQsdGD0LTRjCDRjdC70LXQvNC10L3RgiDQvNCw0YHRgdC40LLQsCDRg9GB0LvQvtCy0LjRjiwg0LfQsNC00LDQvdC90L7QvNGDINCyINC/0LXRgNC10LTQsNCy0LDQtdC80L7QuSDRhNGD0L3QutGG0LjQuC5cblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259IGNhbGxiYWNrXG5cdFx0ICogQHBhcmFtICAgeyp9IFt0aGlzQXJnXVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdHNvbWU6IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc0FyZykge1xuXHRcdFx0cmV0dXJuIGFycmF5X3NvbWUuY2FsbCh0aGlzLCBjYWxsYmFjaywgdGhpc0FyZyB8fCB0aGlzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0L7QstC10YDRj9C10YIsINGD0LTQvtCy0LvQtdGC0LLQvtGA0Y/RjtGCINC70Lgg0LLRgdC1INGN0LvQtdC80LXQvdGC0Ysg0LzQsNGB0YHQuNCy0LAg0YPRgdC70L7QstC40Y4sINC30LDQtNCw0L3QvdC+0LzRgyDQsiDQv9C10YDQtdC00LDQstCw0LXQvNC+0Lkg0YTRg9C90LrRhtC40LguXG5cdFx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSBjYWxsYmFja1xuXHRcdCAqIEBwYXJhbSAgIHsqfSBbdGhpc0FyZ11cblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRldmVyeTogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdFx0XHRyZXR1cm4gYXJyYXlfZXZlcnkuY2FsbCh0aGlzLCBjYWxsYmFjaywgdGhpc0FyZyB8fCB0aGlzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0LjQvNC10L3Rj9C10YIg0YTRg9C90LrRhtC40Y4gYGNhbGxiYWNrYCDQv9C+INC+0YfQtdGA0LXQtNC4INC6INC60LDQttC00L7QvNGDINGN0LvQtdC80LXQvdGC0YMg0LzQsNGB0YHQuNCy0LAg0YHQu9C10LLQsCDQvdCw0L/RgNCw0LLQvixcblx0XHQgKiDRgdC+0YXRgNCw0L3Rj9GPINC/0YDQuCDRjdGC0L7QvCDQv9GA0L7QvNC10LbRg9GC0L7Rh9C90YvQuSDRgNC10LfRg9C70YzRgtCw0YIuXG5cdFx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSBjYWxsYmFja1xuXHRcdCAqIEBwYXJhbSAgIHsqfSBbaW5pdFZhbHVlXVxuXHRcdCAqIEByZXR1cm5zIHsqfVxuXHRcdCAqL1xuXHRcdHJlZHVjZTogZnVuY3Rpb24gKGNhbGxiYWNrLCBpbml0VmFsdWUpIHtcblx0XHRcdHJldHVybiBhcnJheV9yZWR1Y2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0YHRh9C40YLQsNGC0Ywg0YHRg9C80LzRg1xuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9IGF0dHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfVxuXHRcdCAqL1xuXHRcdHN1bTogZnVuY3Rpb24gKGF0dHIpIHtcblx0XHRcdHZhciBzdW0gPSAwO1xuXG5cdFx0XHR0aGlzLmVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG5cdFx0XHRcdHN1bSArPSBtb2RlbC5nZXQoYXR0cik7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIHN1bTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0YHRh9C40YLQsNGC0Ywg0YHRgNC10LTQvdC10LUg0LDRgNC40YTQvNC10YLQuNGH0LXRgdC60L7QtVxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9IGF0dHJcblx0XHQgKiBAcmV0dXJucyB7bnVtYmVyfVxuXHRcdCAqL1xuXHRcdGF2ZzogZnVuY3Rpb24gKGF0dHIpIHtcblx0XHRcdHJldHVybiB0aGlzLnN1bShhdHRyKSAvIHRoaXMubGVuZ3RoO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCS0LXRgNC90LXRgiDQvdC+0LLRg9GOINC60L7Qu9C70LXQutGG0LjRjiwg0YHQvtGB0YLQvtGP0YnRg9GOINC40Lcg0LzQvtC00LXQu9C10LksXG5cdFx0ICog0LTQu9GPINC60L7RgtC+0YDRi9GFINC40YLQtdGA0LDRgtC+0YAg0LLQvtC30LLRgNCw0YnQsNC10YIg0LjRgdGC0LjQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1XG5cdFx0ICogQHBhcmFtICB7RnVuY3Rpb258T2JqZWN0fSBpdGVyYXRvciAgINC40YLQtdGA0LDRgtC+0YAsINC70LjQsdC+INC+0LHRitC10LrRgiBcItC40LzRjyDQsNGC0YLRgNC40LHRg9GC0LBcIiA9PiBcItC30LDRh9C10L3QuNC1XCJcblx0XHQgKiBAcGFyYW0gIHsqfSAgICAgICAgICAgICAgIFt0aGlzQXJnXSAgYHRoaXNgINC00LvRjyDQuNGC0LXRgNCw0YLQvtGA0LBcblx0XHQgKiBAcGFyYW0gIHtib29sZWFufSAgICAgICAgIFtvbmNlXSAgICAg0LLQtdGA0L3Rg9GC0Ywg0L/QtdGA0LLQvtC1INC90LDQudC00LXQvdC90L7QtSDQt9C90LDRh9C10L3QuNC1XG5cdFx0ICogQHJldHVybnMge01vZGVsLkxpc3R8TW9kZWx8dW5kZWZpbmVkfVxuXHRcdCAqL1xuXHRcdGZpbHRlcjogZnVuY3Rpb24gKGl0ZXJhdG9yLCB0aGlzQXJnLCBvbmNlKSB7XG5cdFx0XHR2YXIgbGlzdCA9IG5ldyAodGhpcy5jb25zdHJ1Y3RvcikobnVsbCwgdHJ1ZSksXG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRuID0gdGhpcy5sZW5ndGgsXG5cdFx0XHRcdG1vZGVsLFxuXHRcdFx0XHRsZW5ndGggPSAwLFxuXHRcdFx0XHRpc1doZXJlXG5cdFx0XHQ7XG5cblx0XHRcdGl0ZXJhdG9yID0gZmlsdGVyLmNyZWF0ZUl0ZXJhdG9yKGl0ZXJhdG9yLCB0aGlzQXJnKTtcblx0XHRcdGlzV2hlcmUgPSBpdGVyYXRvci5pc1doZXJlO1xuXG5cdFx0XHRmb3IgKDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRtb2RlbCA9IHRoaXNbaV07XG5cblx0XHRcdFx0aWYgKGlzV2hlcmUgPT09IHRydWUpIHtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vciBlbHNlICovXG5cdFx0XHRcdFx0aWYgKGl0ZXJhdG9yKG1vZGVsLmF0dHJpYnV0ZXMsIG1vZGVsKSkge1xuXHRcdFx0XHRcdFx0bGlzdFtsZW5ndGgrK10gPSBtb2RlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoaXRlcmF0b3IobW9kZWwsIGksIHRoaXMpKSB7XG5cdFx0XHRcdFx0bGlzdFtsZW5ndGgrK10gPSBtb2RlbDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChsZW5ndGggPT09IDEgJiYgb25jZSkge1xuXHRcdFx0XHRcdHJldHVybiBsaXN0WzBdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvbmNlKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0bGlzdC5sZW5ndGggPSBsZW5ndGg7XG5cblx0XHRcdHJldHVybiBsaXN0O1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0L/QtdGA0LLRg9GOINC80L7QtNC10LvRjCDQuNC3INC60L7Qu9C70LXQutGG0LjQuFxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbH1cblx0XHQgKi9cblx0XHRmaXJzdDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXNbMF07XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/QvtC70YPRh9C40YLRjCDQv9C+0YHQu9C10LTQvdC40Y4g0LzQvtC00LXQu9GMINC40Lcg0LrQvtC70LvQtdC60YbQuNC4XG5cdFx0ICogQHJldHVybnMge01vZGVsfVxuXHRcdCAqL1xuXHRcdGxhc3Q6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzW3RoaXMubGVuZ3RoIC0gMV07XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J3QsNC50YLQuCDQvNC+0LTQtdC70YwgKNGB0LwuIGZpbHRlcilcblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb258T2JqZWN0fSAgaXRlcmF0b3Jcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgICAgICAgICAgW3RoaXNBcmddXG5cdFx0ICogQHJldHVybnMge01vZGVsfVxuXHRcdCAqL1xuXHRcdGZpbmQ6IGZ1bmN0aW9uIChpdGVyYXRvciwgdGhpc0FyZykge1xuXHRcdFx0cmV0dXJuIHRoaXMuZmlsdGVyKGl0ZXJhdG9yLCB0aGlzQXJnLCB0cnVlKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC80LDRgdGB0LjQsiDQt9C90LDRh9C10L3QuNC5INC/0L4g0LjQvNC10L3QuCDRgdCy0L7QudGB0YLQstCwXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIGF0dHIgINC40LzRjyDRgdCy0L7QudGB0YLQstCwINC80L7QtNC10LvQuFxuXHRcdCAqIEByZXR1cm5zIHtBcnJheX1cblx0XHQgKi9cblx0XHRwbHVjazogZnVuY3Rpb24gKGF0dHIpIHtcblx0XHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAobW9kZWwpIHtcblx0XHRcdFx0cmV0dXJuIG1vZGVsLmdldChhdHRyKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCS0LXRgNC90LXRgiBgdHJ1ZWAsINC10YHQu9C4INC60L7Qu9C70LXQutGG0LjRjyDRgdC+0LTQtdGA0LbQuNGCINGN0LvQtdC80LXQvdGCIG1vZGVsXG5cdFx0ICogQHBhcmFtICAgeyp9ICBtb2RlbCAgINC80L7QtNC10LvRjCwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LjQu9C4IGNpZFxuXHRcdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0Y29udGFpbnM6IGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0cmV0dXJuICEhdGhpcy5nZXQobW9kZWwpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0YwgaW5kZXgg0LzQvtC00LXQu9C4XG5cdFx0ICogQHBhcmFtICAge01vZGVsfG9iamVjdHxzdHJpbmd8bnVtYmVyfSAgW21vZGVsXSAgINC80L7QtNC10LvRjCwg0L7QsdGK0LXQutGCLCBpZCDQuNC70LggY2lkXG5cdFx0ICogQHJldHVybnMge251bWJlcn1cblx0XHQgKi9cblx0XHRpbmRleE9mOiBmdW5jdGlvbiAobW9kZWwpIHtcblx0XHRcdGlmICghKG1vZGVsIGluc3RhbmNlb2YgT2JqZWN0KSkge1xuXHRcdFx0XHRtb2RlbCA9IHsgaWQ6IG1vZGVsLCBjaWQ6IG1vZGVsIH07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpZHggPSB0aGlzLmxlbmd0aCxcblx0XHRcdFx0X21vZGVsO1xuXG5cdFx0XHR3aGlsZSAoaWR4LS0pIHtcblx0XHRcdFx0X21vZGVsID0gdGhpc1tpZHhdO1xuXG5cdFx0XHRcdGlmIChfbW9kZWwuaWQgPT09IG1vZGVsLmlkIHx8IF9tb2RlbC5jaWQgPT09IG1vZGVsLmNpZCkge1xuXHRcdFx0XHRcdHJldHVybiBpZHg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIC0xO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0L7RgNGC0LjRgNC+0LLQsNGC0Yxcblx0XHQgKiBAcGFyYW0gICB7T2JqZWN0fEZ1bmN0aW9ufSAgYXR0cnMgICAgICAg0LDRgtGC0YDQuNCx0YPRgiwg0L7QsdGK0LXQutGCIHsgYXR0cjogZGVzYyhib29sZWFuKSB9INC40LvQuCDRhNGD0L3QutGG0LjRj1xuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R8Ym9vbGVhbn0gICBbb3B0aW9uc10gICDQstC+0LfQvNC+0LbQvdGL0LUg0L7Qv9GG0LjQuDogc2lsZW50LCByZXZlcnNlLCBjbG9uZVxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbC5MaXN0fVxuXHRcdCAqL1xuXHRcdHNvcnQ6IGZ1bmN0aW9uIChhdHRycywgb3B0aW9ucykge1xuXHRcdFx0aWYgKCFhdHRycykge1xuXHRcdFx0XHRhdHRycyA9IHRoaXMuY29tcGFyYXRvciB8fCB0aGlzLk1vZGVsLmZuLmlkQXR0cjtcblx0XHRcdH1cblxuXG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0XHR0eXBlT2YgPSB0eXBlb2YgYXR0cnMsXG5cdFx0XHRcdGNvbXBhcmF0b3IsXG5cdFx0XHRcdHNpbGVudCxcblx0XHRcdFx0cmV2ZXJzZTtcblxuXG5cdFx0XHRpZiAob3B0aW9ucykge1xuXHRcdFx0XHRzaWxlbnQgPSBvcHRpb25zID09PSB0cnVlIHx8IG9wdGlvbnMuc2lsZW50O1xuXHRcdFx0XHRyZXZlcnNlID0gb3B0aW9ucy5yZXZlcnNlO1xuXG5cdFx0XHRcdGlmIChvcHRpb25zLmNsb25lKSB7XG5cdFx0XHRcdFx0X3RoaXMgPSBfdGhpcy5jbG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXHRcdFx0aWYgKHR5cGVPZiA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0Ly8g0KHQvtGA0YLQuNGA0L7QstC60LAg0L/QviDQsNGC0YLRgNC40LHRg9GC0YNcblx0XHRcdFx0Y29tcGFyYXRvciA9IGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9jb21wYXJlQXR0cihhLCBiLCBhdHRycywgcmV2ZXJzZSk7XG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmICh0eXBlT2YgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINC/0L4g0L3QtdGB0LrQvtC70YzQutC40Lwg0LDRgtGC0YDQuNCx0YPRgtCw0Lxcblx0XHRcdFx0dmFyIGtleXMgPSBPYmplY3Qua2V5cyhhdHRycyksXG5cdFx0XHRcdFx0a2V5c0xlbmd0aCA9IGtleXMubGVuZ3RoO1xuXG5cdFx0XHRcdGNvbXBhcmF0b3IgPSBmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRcdHZhciBpID0gMCxcblx0XHRcdFx0XHRcdHJlcyA9IDA7XG5cblx0XHRcdFx0XHRmb3IgKDsgaSA8IGtleXNMZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0cmVzID0gX2NvbXBhcmVBdHRyKGEsIGIsIGtleXNbaV0sIGF0dHJzW2tleXNbaV1dIF4gcmV2ZXJzZSk7XG5cblx0XHRcdFx0XHRcdGlmIChyZXMgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHJlcztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vINCf0LXRgNC10LTQsNC90LAg0YTRg9C90LrRhtC40Y8g0YHRgNCw0LLQvdC10L3QuNGPXG5cdFx0XHRcdGNvbXBhcmF0b3IgPSBmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRcdHJldHVybiBhdHRycy5jYWxsKHRoaXMsIGEsIGIpICogKHJldmVyc2UgPyAtMSA6IDEpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQodC+0YDRgtC40YDRg9C10Lxcblx0XHRcdGFycmF5X3NvcnQuY2FsbChfdGhpcywgY29tcGFyYXRvcik7XG5cblx0XHRcdCFzaWxlbnQgJiYgX3RoaXMudHJpZ2dlcignc29ydCcsIF90aGlzKTtcblxuXHRcdFx0cmV0dXJuIF90aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LzQvtC00LXQu9GMINC/0L4g0LjQvdC00LXQutGB0YNcblx0XHQgKiBAcGFyYW0gICB7bnVtYmVyfSAgaW5kZXhcblx0XHQgKiBAcmV0dXJucyB7TW9kZWx8dW5kZWZpbmVkfVxuXHRcdCAqL1xuXHRcdGVxOiBmdW5jdGlvbiAoaW5kZXgpIHtcblx0XHRcdHJldHVybiB0aGlzW2luZGV4XTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC80L7QtNC10LvRjCDQv9C+IGlkXG5cdFx0ICogQHBhcmFtICAgeyp9ICBpZCAgINC40LTQtdC90YLQuNGE0LjQutCw0YLQvtGALCBjaWQg0LjQu9C4INC80L7QtNC10LvRjFxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbHx1bmRlZmluZWR9XG5cdFx0ICovXG5cdFx0Z2V0OiBmdW5jdGlvbiAoaWQpIHtcblx0XHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdFx0cmV0dXJuIChpZCA9PSBudWxsKVxuXHRcdFx0XHQ/IHZvaWQgMFxuXHRcdFx0XHQ6IHRoaXMuX2luZGV4W2lkLmNpZCB8fCBpZFt0aGlzLk1vZGVsLmZuLmlkQXR0cl0gfHwgaWRdXG5cdFx0XHQ7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/QvtC70YPRh9C40YLRjCDQvNC+0LTQtdC70Ywg0L/QviBpZCDQtNCw0LbQtSDQtdGB0LvQuCDQtdGRINC90LXRglxuXHRcdCAqIEBwYXJhbSAgIHsqfSAgaWQgICDQuNC00LXQvdGC0LjRhNC40LrQsNGC0L7RgCDQuNC70LggY2lkXG5cdFx0ICogQHJldHVybnMge01vZGVsfVxuXHRcdCAqL1xuXHRcdGdldFNhZmU6IGZ1bmN0aW9uIChpZCkge1xuXHRcdFx0dmFyIG1vZGVsID0gdGhpcy5nZXQoaWQpO1xuXHRcdFx0dmFyIHN0b3JlID0gdGhpcy5Nb2RlbC5hbGwuX3NhZmVkU3RvcmU7XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAobW9kZWwgPT09IHZvaWQgMCkge1xuXHRcdFx0XHRpZCA9IGlkICYmIChpZFt0aGlzLk1vZGVsLmZuLmlkQXR0cl0gfHwgaWQpO1xuXG5cdFx0XHRcdG1vZGVsID0gc3RvcmVbaWRdO1xuXG5cdFx0XHRcdGlmIChtb2RlbCA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0bW9kZWwgPSBuZXcgKHRoaXMuTW9kZWwpKHtpZDogaWR9KTtcblx0XHRcdFx0XHRzdG9yZVtpZF0gPSBtb2RlbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbW9kZWw7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHQvtC30LTQsNGC0Ywg0LzQvtC00LXQu9GMINC4INC00L7QsdCw0LLQuNGC0Ywg0LIg0LrQvtC70LvQtdC60YbQuNGOXG5cdFx0ICogQHBhcmFtICAge09iamVjdH0gIGF0dHJzICDRgdCy0L7QudGB0YLQstCwINC80L7QtNC10LvQuFxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBbb3B0aW9uc11cblx0XHQgKiBAcmV0dXJucyB7TW9kZWx9XG5cdFx0ICovXG5cdFx0Y3JlYXRlOiBmdW5jdGlvbiAoYXR0cnMsIG9wdGlvbnMpIHtcblx0XHRcdHZhciBtb2RlbCA9IHRoaXMuX3ByZXBhcmVNb2RlbChhdHRycyk7XG5cdFx0XHR0aGlzLnNldChbbW9kZWxdLCBvcHRpb25zKTtcblx0XHRcdHJldHVybiBtb2RlbDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQo9GB0YLQsNC90L7QstC40YLRjCDQvdC+0LLRi9C5INGB0L/QuNGB0L7QuiDQvNC+0LTQtdC70LXQuVxuXHRcdCAqIEBwYXJhbSAgIHtNb2RlbFtdfSAgbW9kZWxzICDQvNCw0YHRgdC40LIg0YHQstC+0LnRgdGC0LIg0LjQu9C4INC80L7QtdC00LXQu9C10Llcblx0XHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgIFtvcHRpb25zXSAgINC+0L/RhtC40LggKGNsb25lOiBmYWxzZSwgcmVzZXQ6IGZhbHNlLCBzaWxlbnQ6IGZhbHNlLCBzb3J0OiBib29sZWFufHByZXNldCwgbWVyZ2U6IHRydWUsIHN5bmM6IGZhbHNlKVxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbC5MaXN0fVxuXHRcdCAqL1xuXHRcdHNldDogZnVuY3Rpb24gKG1vZGVscywgb3B0aW9ucykge1xuXHRcdFx0dmFyIGksXG5cdFx0XHRcdG4sXG5cdFx0XHRcdGV2dCA9IG5ldyBFbWl0dGVyLkV2ZW50KCdhZGQnKSxcblx0XHRcdFx0Y2lkLFxuXHRcdFx0XHRtb2RlbCxcblx0XHRcdFx0X21vZGVscywgLy8g0L/RgNC10LTRg9C00YPRidC40Lkg0YHQv9C40YHQvtC6INC80L7QtNC10LvQtdC5XG5cblx0XHRcdFx0X2luZGV4ID0gdGhpcy5faW5kZXgsXG5cdFx0XHRcdGxlbmd0aCA9IHRoaXMubGVuZ3RoLFxuXHRcdFx0XHRuZXdMZW5ndGgsXG5cblx0XHRcdFx0Y2xvbmUgPSBmYWxzZSxcblx0XHRcdFx0bWVyZ2UgPSB0cnVlLFxuXHRcdFx0XHRyZXNldCA9IGZhbHNlLFxuXHRcdFx0XHRzaWxlbnQgPSBmYWxzZSxcblx0XHRcdFx0Y2hhbmdlZCA9IGZhbHNlLFxuXG5cdFx0XHRcdG1vZGVsT3B0aW9ucyA9IHt9LFxuXG5cdFx0XHRcdHNvcnQgPSAhIXRoaXMuY29tcGFyYXRvcixcblx0XHRcdFx0c29ydGVkID0gZmFsc2Vcblx0XHRcdDtcblxuXG5cdFx0XHQvLyDQmtC70L7QvdC40YDRg9C10Lwg0LzQsNGB0YHQuNCyLCDQv9C+0YLQvtC80YMg0YfRgtC+INC00LDQu9GM0YjQtSDQvNGLINCx0YPQtNC10Lwg0LXQs9C+INC80L7QtNC40YTQuNGG0LjRgNC+0LLQsNGC0Yxcblx0XHRcdG1vZGVscyA9IChtb2RlbHMgJiYgbW9kZWxzLnNsaWNlKSA/IG1vZGVscy5zbGljZSgpIDogW107XG5cdFx0XHRuZXdMZW5ndGggPSBtb2RlbHMubGVuZ3RoO1xuXG5cdFx0XHRpZiAob3B0aW9ucykge1xuXHRcdFx0XHRjbG9uZSA9IG9wdGlvbnMuY2xvbmU7XG5cdFx0XHRcdG1lcmdlID0gb3B0aW9ucy5tZXJnZSAhPT0gZmFsc2U7XG5cdFx0XHRcdHJlc2V0ID0gb3B0aW9ucy5yZXNldDtcblx0XHRcdFx0c2lsZW50ID0gb3B0aW9ucy5zaWxlbnQgfHwgb3B0aW9ucyA9PT0gdHJ1ZTtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5zb3J0ICE9PSB2b2lkIDApIHtcblx0XHRcdFx0XHRzb3J0ID0gb3B0aW9ucy5zb3J0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bW9kZWxPcHRpb25zLnN5bmMgPSBvcHRpb25zLnN5bmM7XG5cdFx0XHRcdG1vZGVsT3B0aW9ucy5jbGVhbiA9IG9wdGlvbnMuY2xlYW47XG5cdFx0XHR9XG5cblxuXHRcdFx0aWYgKHJlc2V0KSB7XG5cdFx0XHRcdC8vINCh0LHRgNCw0YHRi9Cy0LDQtdC8INCy0YHQtSDQvNC+0LTQtdC70Lhcblx0XHRcdFx0X21vZGVscyA9IGFycmF5X3NwbGljZS5jYWxsKHRoaXMsIDAsIGxlbmd0aCk7XG5cdFx0XHRcdGkgPSBsZW5ndGg7XG5cblx0XHRcdFx0cmVzZXQgPSBsZW5ndGggPiAwIHx8IG5ld0xlbmd0aCA+IDA7XG5cdFx0XHRcdGNoYW5nZWQgPSByZXNldDtcblxuXHRcdFx0XHQvLyDQntGC0L/QuNGB0YvQstCw0LXQvNGB0Y8g0L7RgiDRgdC+0LHRi9GC0LjQuSDQvNC+0LTQtdC70Lhcblx0XHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHRcdF9tb2RlbHNbaV0ub2ZmKF9hbGxNb2RlbEV2ZW50cywgdGhpcyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyDQodCx0YDQsNGB0YvQstCw0LXQvCBpbmRleCDQuCDQtNC70LjQvdGDXG5cdFx0XHRcdGxlbmd0aCA9IDA7XG5cdFx0XHRcdF9pbmRleCA9IHRoaXMuX2luZGV4ID0ge307XG5cdFx0XHR9XG5cblxuXHRcdFx0Zm9yIChpID0gMCwgbiA9IG5ld0xlbmd0aDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHR0aGlzLl9jaGFuZ2VkID0gZmFsc2U7IC8vINCS0YvRgdGC0LDQstC70Y/QtdGCINCyIGBoYW5kbGVFdmVudGAg0L/RgNC4INC40LfQvNC10L3QtdC90LjQuCDQvNC+0LTQtdC70LXQuSAo0L7Qv9GC0LjQvNC40LfQsNGG0LjRjylcblx0XHRcdFx0dGhpcy5fY2hhbmdpbmcgPSB0cnVlOyAvLyDQn9GA0L7QstC10YDRj9C10YLRgdGPINCyIGBoYW5kbGVFdmVudGAg0L/RgNC4INC40LfQvNC10L3QtdC90LjQuCDQvNC+0LTQtdC70LXQuSAo0L7Qv9GC0LjQvNC40LfQsNGG0LjRjylcblxuXHRcdFx0XHRtb2RlbCA9IHRoaXMuX3ByZXBhcmVNb2RlbChtb2RlbHNbaV0sIG1vZGVsT3B0aW9ucyk7XG5cblx0XHRcdFx0Y2lkID0gbW9kZWwuY2lkO1xuXHRcdFx0XHRjaGFuZ2VkID0gY2hhbmdlZCB8fCB0aGlzLl9jaGFuZ2VkO1xuXHRcdFx0XHRtb2RlbHNbaV0gPSBtb2RlbDtcblxuXHRcdFx0XHQvLyDQn9GA0L7QstC10YDRj9C10Lwg0LIg0LjQvdC00LXQutGB0LVcblx0XHRcdFx0aWYgKF9pbmRleFtjaWRdID09PSB2b2lkIDApIHtcblx0XHRcdFx0XHQvLyDQlNC+0LHQsNCy0Y/Qu9C10Lwg0LIg0LjQvdC00LXQutGBXG5cdFx0XHRcdFx0X2luZGV4W2NpZF0gPSBtb2RlbDtcblx0XHRcdFx0XHQobW9kZWwuaWQgIT09IG51bGwpICYmIChfaW5kZXhbbW9kZWwuaWRdID0gbW9kZWwpO1xuXHRcdFx0XHRcdCh0aGlzLl9hZGRUb0luZGV4ICE9PSB2b2lkIDApICYmIHRoaXMuX2FkZFRvSW5kZXgobW9kZWwpO1xuXG5cdFx0XHRcdFx0Ly8g0JTQvtCx0LDQstC70Y/QtdC8INCyINC60L7Qu9C70LXQutGG0LjRjlxuXHRcdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXNbbGVuZ3RoXSA9IG1vZGVsO1xuXHRcdFx0XHRcdHRoaXMubGVuZ3RoID0gKytsZW5ndGg7XG5cblx0XHRcdFx0XHQvLyDQn9C+0LTQv9C40YHRi9Cy0LDQtdC80YHRjyDQvdCwINGB0L7QsdGL0YLQuNGPXG5cdFx0XHRcdFx0bW9kZWwub24oX2FsbE1vZGVsRXZlbnRzLCB0aGlzKTtcblxuXHRcdFx0XHRcdGlmICghc2lsZW50KSB7XG5cdFx0XHRcdFx0XHQvLyDQodC+0LHRi9GC0LjQtSBcImFkZFwiXG5cdFx0XHRcdFx0XHRldnQubGlzdCA9IHRoaXM7XG5cdFx0XHRcdFx0XHRldnQudGFyZ2V0ID0gbW9kZWw7XG5cdFx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoZXZ0LCBtb2RlbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblxuXHRcdFx0XHQvLyDQodC+0YXRgNCw0L3QuNGC0Ywg0L/QvtGA0Y/QtNC+0Log0LIg0LrQvtGC0L7RgNC+0Lwg0L/QtdGA0LXQtNCw0L3QvdGLINGN0LvQtdC80LXQvdGC0Ytcblx0XHRcdFx0aWYgKHNvcnQgPT09ICdwcmVzZXQnICYmIHRoaXNbaV0gIT09IG1vZGVsKSB7XG5cdFx0XHRcdFx0c29ydGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdHRoaXNbdGhpcy5pbmRleE9mKG1vZGVsKV0gPSB0aGlzW2ldO1xuXHRcdFx0XHRcdHRoaXNbaV0gPSBtb2RlbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdGlmIChtZXJnZSA9PT0gZmFsc2UpIHtcblx0XHRcdFx0Ly8g0J/RgNC+0YXQvtC00LjQvNGB0Y8g0L/QviDQvNC+0LTQtdC70Y/QtdC8INC4INGD0LTQsNC70Y/QtdC8INC60L7RgtC+0YDRi9GFINC90LXRglxuXHRcdFx0XHRpID0gbGVuZ3RoO1xuXG5cdFx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0XHRpZiAobW9kZWxzLmluZGV4T2YodGhpc1tpXSkgPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdHRoaXMucmVtb3ZlKHRoaXNbaV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cblx0XHRcdGlmIChjaGFuZ2VkICYmIHNvcnQgPT09IHRydWUgJiYgIXNvcnRlZCkge1xuXHRcdFx0XHQvLyDQodC+0YDRgtC40YDRg9C10Lwg0LrQvtC70LvQtdC60YbQuNGOLCDQtdGB0LvQuCDQsdGL0LvQuCDQuNC30LzQtdC90LXQvdC40Y9cblx0XHRcdFx0c29ydGVkID0gdHJ1ZTtcblx0XHRcdFx0dGhpcy5zb3J0KG51bGwsIHsgc2lsZW50OiB0cnVlIH0pO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9jaGFuZ2luZyA9IGZhbHNlO1xuXG5cdFx0XHRpZiAoIXNpbGVudCkgeyAvLyDQkdC10Lcg0YHQvtCx0YvRgtC40Llcblx0XHRcdFx0c29ydGVkICYmIHRoaXMudHJpZ2dlcignc29ydCcsIHRoaXMpO1xuXHRcdFx0XHRyZXNldCAmJiB0aGlzLnRyaWdnZXIoeyB0eXBlOiAncmVzZXQnLCBtb2RlbHM6IHRoaXMsIHByZXZpb3VzTW9kZWxzOiBfbW9kZWxzIH0sIHRoaXMpO1xuXG5cdFx0XHRcdGlmIChzb3J0ZWQgfHwgY2hhbmdlZCkge1xuXHRcdFx0XHRcdHRoaXMuX2RlYm91bmNlVHJpZ2dlclVwZGF0ZS5jYW5jZWwoKTtcblx0XHRcdFx0XHR0aGlzLnRyaWdnZXIoJ3VwZGF0ZScsIHRoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblxuXHRcdFx0aWYgKGNsb25lKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgKHRoaXMuY29uc3RydWN0b3IpKG1vZGVscyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQtdC+0LHRgNCw0LfQvtCy0LDRgtGMINCyINC80LDRgdGB0LjQslxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbFtdfVxuXHRcdCAqL1xuXHRcdHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcnJheV9zbGljZS5jYWxsKHRoaXMpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQtdC+0LHRgNCw0LfQvtCy0LDRgtGMINCyIEpTT05cblx0XHQgKiBAcGFyYW0gICB7Ym9vbGVhbn0gIFtyZWZdICDQstC10YDQvdGD0YLRjCDRgdGB0YvQu9C60YMg0L3QsCDQsNGC0YLRgNC40LHRg9GC0Ysg0LzQvtC00LXQu9C4XG5cdFx0ICogQHJldHVybnMge09iamVjdFtdfVxuXHRcdCAqL1xuXHRcdHRvSlNPTjogZnVuY3Rpb24gKHJlZikge1xuXHRcdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0XHRyZXR1cm4gbW9kZWwudG9KU09OKHJlZik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQntCx0YDQtdC30LDRgtGMLCDQstC+0LfQstGA0LDRidCw0LXRgiDQvdC+0LLRg9GOINC60L7Qu9C70LXQutGG0LjRjlxuXHRcdCAqIEBwYXJhbSAgIHtudW1iZXJ9ICBbc3RhcnRdXG5cdFx0ICogQHBhcmFtICAge251bWJlcn0gIFtlbmRdXG5cdFx0ICogQHJldHVybnMge01vZGVsLkxpc3R9XG5cdFx0ICovXG5cdFx0c2xpY2U6IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG5cdFx0XHR2YXIgYXJyYXkgPSBzdGFydCA9PT0gdm9pZCAwID8gdGhpcyA6IGFycmF5X3NsaWNlLmNhbGwodGhpcywgc3RhcnQsIGVuZCA9PT0gdm9pZCAwID8gdGhpcy5sZW5ndGggOiBlbmQpLFxuXHRcdFx0XHRpID0gYXJyYXkubGVuZ3RoLFxuXHRcdFx0XHRuZXdMaXN0ID0gbmV3ICh0aGlzLmNvbnN0cnVjdG9yKShudWxsLCB0cnVlKVxuXHRcdFx0O1xuXG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdG5ld0xpc3RbaV0gPSBhcnJheVtpXTtcblx0XHRcdH1cblxuXHRcdFx0bmV3TGlzdC5sZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cblx0XHRcdHJldHVybiBuZXdMaXN0O1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0LHRgNC+0YHQuNGC0Ywg0LrQvtC70LvQtdC60YPQuNGOXG5cdFx0ICogQHBhcmFtICAge0FycmF5fSAgW21vZGVsc11cblx0XHQgKiBAcGFyYW0gICB7T2JqZWN0fSBbb3B0aW9uc11cblx0XHQgKiBAcmV0dXJucyB7TW9kZWwuTGlzdH1cblx0XHQgKi9cblx0XHRyZXNldDogZnVuY3Rpb24gKG1vZGVscywgb3B0aW9ucykge1xuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRcdGlmIChvcHRpb25zID09PSB0cnVlKSB7XG5cdFx0XHRcdG9wdGlvbnMgPSB7IHNpbGVudDogdHJ1ZSB9O1xuXHRcdFx0fVxuXG5cdFx0XHRvcHRpb25zLnJlc2V0ID0gdHJ1ZTtcblx0XHRcdG9wdGlvbnMuY2xvbmUgPSBmYWxzZTtcblxuXHRcdFx0cmV0dXJuIHRoaXMuc2V0KG1vZGVscywgb3B0aW9ucyk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KPQtNCw0LvQuNGC0Ywg0LzQvtC00LXQu9GMINC40Lcg0LrQvtC70LvQtdC60YbQuNC4XG5cdFx0ICogQHBhcmFtICAge01vZGVsfSAgbW9kZWxcblx0XHQgKiBAcmV0dXJucyB7TW9kZWwuTGlzdH1cblx0XHQgKi9cblx0XHRyZW1vdmU6IGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0dmFyIGV2dCxcblx0XHRcdFx0aWR4ID0gYXJyYXlfaW5kZXhPZi5jYWxsKHRoaXMsIG1vZGVsKTtcblxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdGlmIChpZHggIT09IC0xKSB7XG5cdFx0XHRcdG1vZGVsLm9mZihfYWxsTW9kZWxFdmVudHMsIHRoaXMpO1xuXHRcdFx0XHRhcnJheV9zcGxpY2UuY2FsbCh0aGlzLCBpZHgsIDEpO1xuXG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9pbmRleFttb2RlbC5pZF07XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLl9pbmRleFttb2RlbC5jaWRdO1xuXG5cdFx0XHRcdGV2dCA9IG5ldyBFbWl0dGVyLkV2ZW50KCdyZW1vdmUnKTtcblx0XHRcdFx0ZXZ0Lmxpc3QgPSB0aGlzO1xuXHRcdFx0XHRldnQudGFyZ2V0ID0gbW9kZWw7XG5cblx0XHRcdFx0dGhpcy50cmlnZ2VyKGV2dCwgbW9kZWwpO1xuXG5cdFx0XHRcdGlmICh0aGlzLl9jaGFuZ2luZyAhPT0gdHJ1ZSkgeyAvLyDQktGL0YHRgtCw0LLQu9GP0LXRgtGB0Y8g0LIgYHNldGBcblx0XHRcdFx0XHR0aGlzLl9kZWJvdW5jZVRyaWdnZXJVcGRhdGUoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQodC+0YXRgNCw0L3QuNGC0Ywg0LjQt9C80LXQvdC10L3QuNGPINC10LTQuNC90L7QuSDQv9Cw0YfQutC+0Llcblx0XHQgKiBAcGFyYW0gICB7Kn0gW2F0dHJdXG5cdFx0ICogQHBhcmFtICAgeyp9IFt2YWx1ZV1cblx0XHQgKiBAcGFyYW0gICB7Kn0gW29wdGlvbnNdXG5cdFx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0c2F2ZTogZnVuY3Rpb24gKGF0dHIsIHZhbHVlLCBvcHRpb25zKSB7XG5cdFx0XHRyZXR1cm4gUlBDLmJhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0XHRcdG1vZGVsLnNhdmUoYXR0ciwgdmFsdWUsIG9wdGlvbnMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0uYmluZCh0aGlzKSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KPQtNCw0LvQuNGC0Ywg0LLRgdGOINC60L7Qu9C70LXQutGG0LjRjlxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBbcXVlcnldINC00L7Qv9C+0LvQvdC40YLQtdC70YzQvdGL0LUg0L/QsNGA0LDQvNC10YLRgNGLINC30LDQv9GA0L7RgdCwXG5cdFx0ICogQHJldHJ1bnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0ZHJvcDogZnVuY3Rpb24gKHF1ZXJ5KSB7XG5cdFx0XHRyZXR1cm4gUlBDLmJhdGNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhpcy5lYWNoKGZ1bmN0aW9uIChtb2RlbCkge1xuXHRcdFx0XHRcdG1vZGVsLnJlbW92ZShxdWVyeSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fS5iaW5kKHRoaXMpKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQo9C90LjRh9GC0L7QttC40YLRjCDQutC+0LvQu9C10LrRhtC40Y4g0Lgg0LzQvtC00LXQu9C4INCyINC90LXQuVxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbC5MaXN0fVxuXHRcdCAqL1xuXHRcdGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBpID0gdGhpcy5sZW5ndGg7XG5cblx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0LyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuXHRcdFx0XHR0aGlzW2ldICYmIHRoaXNbaV0uZGVzdHJveSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC40LvQuCDQvtCx0L3QvtCy0LjRgtGMINGB0L/QuNGB0L7QulxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9IFtxdWVyeV0gICDQv9Cw0YDQsNC80LXRgtGA0Ysg0LfQsNC/0YDQvtGB0LBcblx0XHQgKiBAcGFyYW0gICB7T2JqZWN0fSBbb3B0aW9uc10g0L7Qv9GG0LjQuCAocmVzZXQ6IGZhbHNlLCBmb3JjZTogZmFsc2UpXG5cdFx0ICogQHJldHVybnMge01vZGVsTGlzdFByb21pc2V9XG5cdFx0ICovXG5cdFx0ZmV0Y2g6IGZ1bmN0aW9uIChxdWVyeSwgb3B0aW9ucykge1xuXHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0XHRcdHZhciBsaXN0ID0gdGhpcyxcblx0XHRcdFx0TW9kZWwgPSBsaXN0Lk1vZGVsLFxuXHRcdFx0XHRhbGwgPSBNb2RlbC5hbGwsXG5cdFx0XHRcdHByb21pc2UgPSBNb2RlbC5mZXRjaERhdGEocXVlcnksIG51bGwsIG9wdGlvbnMuZm9yY2UpXG5cdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKGFycmF5KSB7XG5cdFx0XHRcdFx0XHQhbGlzdC5sb2NhbCAmJiBhbGwuc2V0KGFycmF5KTsgLy8g0LPQu9C+0LHQsNC70YzQvdGL0Lkg0YHQv9C40YHQvtC6XG5cdFx0XHRcdFx0XHRsaXN0W29wdGlvbnMucmVzZXQgPyAncmVzZXQnIDogJ3NldCddKGFycmF5LCBvcHRpb25zKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIGxpc3Q7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQuZmFpbChmdW5jdGlvbiAoZXJyKSB7XG5cdFx0XHRcdFx0XHRsaXN0LmVtaXQoJ2Vycm9yJywgZXJyKTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0O1xuXG5cdFx0XHRwcm9taXNlLmxpc3QgPSBsaXN0O1xuXG5cdFx0XHRyZXR1cm4gcHJvbWlzZTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQmtC70L7QvdC40YDQvtCy0LDRgtGMINC60L7Qu9C70LXQutGG0LjRjlxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbC5MaXN0fVxuXHRcdCAqL1xuXHRcdGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5zbGljZSgpO1xuXHRcdH1cblx0fTtcblxuXG5cdC8qKlxuXHQgKiBAbmFtZSAgTW9kZWwuTGlzdCNmb3JFYWNoXG5cdCAqIEBhbGlhcyBlYWNoXG5cdCAqIEBtZXRob2Rcblx0ICovXG5cdExpc3QuZm4uZm9yRWFjaCA9IExpc3QuZm4uZWFjaDtcblxuXG5cdC8qKlxuXHQgKiBAbmFtZSAgTW9kZWwuTGlzdCN3aGVyZVxuXHQgKiBAYWxpYXMgZmlsdGVyXG5cdCAqIEBtZXRob2Rcblx0ICovXG5cdExpc3QuZm4ud2hlcmUgPSBMaXN0LmZuLmZpbHRlcjtcblxuXG5cdC8qKlxuXHQgKiBAbmFtZSAgTW9kZWwuTGlzdCNmaW5kV2hlcmVcblx0ICogQGFsaWFzIGZpbmRcblx0ICogQG1ldGhvZFxuXHQgKi9cblx0TGlzdC5mbi5maW5kV2hlcmUgPSBMaXN0LmZuLmZpbmQ7XG5cblxuXHQvLyDQn9C+0LTQvNC10YnQuNCy0LDQtdC8INC80LXRgtC+0LTRiyBFbWl0dGVyJ9CwXG5cdEVtaXR0ZXIuYXBwbHkoTGlzdC5mbik7XG5cblxuXHQvLyDQn9C+0LTQvNC10YnQuNCy0LDQtdC8INC90LDRgdC70LXQtNC+0LLQsNC90LjQtVxuXHRpbmhlcml0LmFwcGx5KExpc3QpO1xuXG5cblx0LyoqXG5cdCAqINCU0L7QsdCw0LLQuNGC0Ywg0LjQvdC00LXQutGBINC00LvRjyDQsdGL0YHRgtGA0L7Qs9C+INC00L7RgdGC0YPQv9CwINC6INC80L7QtNC10LvQuC/QvNC+0LTQtdC70Y/QvFxuXHQgKiBAcGFyYW0gICAge3N0cmluZ30gIGF0dHIgINC40LzRjyDRgdCy0L7QudGB0YLQstCwXG5cdCAqIEBwYXJhbSAgICB7Ym9vbGVhbn0gW3VuaXFdICDRg9C90LjQutCw0LvRjNC90YvQuSDQuNC90LTQtdC60YFcblx0ICogQG1ldGhvZE9mIExpc3Rcblx0ICovXG5cdExpc3QuYWRkSW5kZXggPSBmdW5jdGlvbiAoYXR0ciwgdW5pcSkge1xuXHRcdHZhciBfaW5kZXhlcyA9IHRoaXMuZm4uX2luZGV4ZXM7XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmICghX2luZGV4ZXMpIHtcblx0XHRcdF9pbmRleGVzID0gdGhpcy5mbi5faW5kZXhlcyA9IFtdO1xuXHRcdH1cblxuXHRcdF9pbmRleGVzLnB1c2goe1xuXHRcdFx0YXR0cjogYXR0cixcblx0XHRcdHVuaXE6IHVuaXFcblx0XHR9KTtcblxuXHRcdC8qIGpzaGludCBldmlsOnRydWUgKi9cblx0XHR0aGlzLmZuLl9hZGRUb0luZGV4ID0gRnVuY3Rpb24oJ21vZGVsJywgX2luZGV4ZXMubWFwKGZ1bmN0aW9uIChpbmRleCkge1xuXHRcdFx0dmFyIGF0dHIgPSBzdHJpbmdpZnlKU09OKGluZGV4LmF0dHIpLFxuXHRcdFx0XHR2YWx1ZSA9IGF0dHIuaW5kZXhPZignLicpID4gLTFcblx0XHRcdFx0XHRcdFx0PyAnbW9kZWwuZ2V0KCcgKyBhdHRyICsgJyknXG5cdFx0XHRcdFx0XHRcdDogJ21vZGVsLmF0dHJpYnV0ZXNbJyArIGF0dHIgKyAnXSc7XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAoaW5kZXgudW5pcSkge1xuXHRcdFx0XHRyZXR1cm4gJ3RoaXMuX2luZGV4WycgKyB2YWx1ZSArICddID0gbW9kZWw7Jztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRocm93IFwidG9kbzog0J3Rg9C20L3QviDQtNGD0LzQsNGC0YxcIjtcblx0XHRcdH1cblx0XHR9KS5qb2luKCdcXG4nKSk7XG5cdH07XG5cblx0LyoqXG5cdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LzQsNGB0YHQuNCyINC30L3QsNGH0LXQvdC40Lkg0L/QviDQuNC80LXQvdC4INGB0LLQvtC50YHRgtCy0LAg0LjQtyDQvNCw0YHRgdC40LLQsCDQuNC70Lgg0YHQv9C40YHQutCwINC80L7QtNC10LvQtdC5XG5cdCAqIEBwYXJhbSAgICB7bW9kZWwuTGlzdHxNb2RlbFtdfVx0bGlzdFx00YHQv9C40YHQvtC6INC80L7QtNC10LvQtdC5XG5cdCAqIEBwYXJhbSAgICB7c3RyaW5nfSBwcm9wZXJ0eSDRgdCy0L7QudGB0YLQstC+XG5cdCAqL1xuXHRMaXN0LnBsdWNrID0gZnVuY3Rpb24gKGxpc3QsIHByb3BlcnR5KSB7XG5cblx0XHRyZXR1cm4gTGlzdC5mbi5wbHVjay5jYWxsKGxpc3QsIHByb3BlcnR5KTtcblx0fTtcblxuXHQvLyBFeHBvcnRcblx0TGlzdC52ZXJzaW9uID0gJzAuMTMuMCc7XG5cdHJldHVybiBMaXN0O1xufSk7XG4iLCIvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZGVmaW5lKCdsb2dnZXInLCBbXG5cdCd1dWlkJyxcblx0J3V0aWxzL3V0aWwnLFxuXHQncGVyZm9ybWFuY2UnLFxuXHQnUHJvbWlzZScsXG5cdCdFbWl0dGVyJ1xuXSwgZnVuY3Rpb24gKFxuXHQvKiogdXVpZCAqL3V1aWQsXG5cdC8qKiB1dGlsICovdXRpbCxcblx0LyoqIHBlcmZvcm1hbmNlICovcGVyZm9ybWFuY2UsXG5cdC8qKiBQcm9taXNlICovUHJvbWlzZSxcblx0LyoqIEVtaXR0ZXIgKi9FbWl0dGVyXG4pIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBSX0FVVE9fTEVWRUxTID0gL1xcYihmYWlsfGVycm9yfHdhcm4oaW5nKT98aW5mb3xzdWNjZXNzfGRvbmUpXFxiL2k7XG5cdHZhciBBVVRPX0xFVkVMU19DT0xPUlMgPSB7XG5cdFx0ZmFpbDogJyNjMDAnLFxuXHRcdGVycm9yOiAnI2MwMCcsXG5cdFx0d2FybjogJyNhNmE2MTYnLFxuXHRcdHdhcm5pbmc6ICcjYTZhNjE2Jyxcblx0XHRpbmZvOiAnIzAwZicsXG5cdFx0c3VjY2VzczogJyMwNjAnLFxuXHRcdGRvbmU6ICcjMDYwJ1xuXHR9O1xuXG5cdEVycm9yLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG5hbWU6IHRoaXMubmFtZSxcblx0XHRcdG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcblx0XHRcdHN0YWNrOiB0aGlzLnN0YWNrXG5cdFx0fTtcblx0fTtcblxuXHQvKipcblx0ICogQHR5cGVkZWYgICB7T2JqZWN0fSAgTG9nZ2VyTWV0YVxuXHQgKiBAcHJvcGVydHkgIHtzdHJpbmd9ICBmbiAgICAg0L3QsNC30LLQsNC90LjQtSDQvNC10YLQvtC00LBcblx0ICogQHByb3BlcnR5ICB7c3Ryb25nfSAgZmlsZSAgINC/0YPRgtGMINC6INGE0LDQudC70YNcblx0ICogQHByb3BlcnR5ICB7bnVtYmVyfSAgbGluZVxuXHQgKiBAcHJvcGVydHkgIHtudW1iZXJ9ICBjb2x1bW5cblx0ICovXG5cblxuXHR2YXIgZ2lkID0gMSxcblx0XHRnZXRMaXN0ZW5lcnMgPSBFbWl0dGVyLmdldExpc3RlbmVycyxcblx0XHRlbmNvZGVVUklDb21wb25lbnQgPSB3aW5kb3cuZW5jb2RlVVJJQ29tcG9uZW50LFxuXG5cdFx0UlNQQUNFID0gL1xccysvLFxuXG5cdFx0aW5kZXggPSB7fSxcblx0XHRlbnRyaWVzID0gW11cblx0O1xuXG5cdGZ1bmN0aW9uIF9nZXRQcm9taXNlTmFtZShlbnRyeSwgYWRkZWQpIHtcblx0XHRyZXR1cm4gJ1tbJyArIGVudHJ5LmxhYmVsLnJlcGxhY2UoLyg6cGVuZGluZ3xeXFxbXFxbfFxcXVxcXSQpL2csICcnKSArICc6JyArIGFkZGVkICsgJ11dJztcblx0fVxuXG5cblx0LyoqXG5cdCAqINCT0LvQvtCx0LDQu9GM0L3Ri9C5INC+0LHRitC10LrRgiDQu9C+0LPQuNGA0L7QstCw0L3QuNGPXG5cdCAqIEBjbGFzcyBsb2dnZXJcblx0ICogQGNvbnN0cnVjdHMgbG9nZ2VyXG5cdCAqL1xuXHR2YXIgbG9nZ2VyID0gLyoqIEBsZW5kcyBsb2dnZXIgKi97XG5cdFx0aW5kZXg6IGluZGV4LFxuXHRcdHBhcmVudElkOiAwLFxuXHRcdG1ldGFPZmZzZXQ6IDAsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0YLQsNGC0YPRgSDRgNCw0LHQvtGC0Ysg0LvQvtCz0LXRgNCwXG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICogQG1ldGhvZE9mIGxvZ2dlclxuXHRcdCAqL1xuXHRcdGRpc2FibGVkOiBmYWxzZSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JzQsNGB0YHQuNCyINC30LDQv9C40YHQtdC5XG5cdFx0ICogQHR5cGUge2xvZ2dlci5FbnRyeVtdfVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRlbnRyaWVzOiBlbnRyaWVzLFxuXG5cblx0XHQvKipcblx0XHQgKiDQmNGB0L/QvtC70YzQt9C+0LLQsNGC0YwgVVVJRCDQuNC00LXRgtC40YTQuNC60LDRgtC+0YAg0LIg0LrQsNGH0LXRgdGC0LLQtSBpZCDQt9Cw0L/QuNGB0Lhcblx0XHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0dXNlVVVJRDogZmFsc2UsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCT0LXQvdC10YDQsNGG0LjRjyBVVUlEXG5cdFx0ICogQG5hbWUgbG9nZ2VyLnV1aWRcblx0XHQgKiBAbWV0aG9kXG5cdFx0ICogQHN0YXRpY1xuXHRcdCAqIEByZXR1cm5zICB7c3RyaW5nfVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHR1dWlkOiB1dWlkLFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C10YDQtdGF0LLQsNGCINC+0YjQuNCx0L7QuiDRgSBgd2luZG93YFxuXHRcdCAqIEBwYXJhbSAge1dpbmRvd30gIHdpbmRvd1xuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRjYXRjaFVuY2F1Z2h0RXhjZXB0aW9uOiBmdW5jdGlvbiAod2luZG93KSB7XG5cdFx0XHR3aW5kb3cub25lcnJvciA9IGZ1bmN0aW9uIHdpbmRvd09uRXJyb3IobWVzc2FnZSwgdXJsLCBsaW5lLCBjb2x1bW4sIGVycikge1xuXHRcdFx0XHRsb2dnZXIuYWRkKCdlcnJvcicsIHtcblx0XHRcdFx0XHR0eXBlOiBlcnIgJiYgZXJyLnR5cGUsXG5cdFx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZSxcblx0XHRcdFx0XHR1cmw6IHVybCxcblx0XHRcdFx0XHRsaW5lOiBsaW5lLFxuXHRcdFx0XHRcdGNvbHVtbjogY29sdW1uLFxuXHRcdFx0XHRcdHN0YWNrOiBlcnIgJiYgZXJyLnN0YWNrLnRvU3RyaW5nKClcblx0XHRcdFx0fSk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH07XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JTQvtCx0LDQstC40YLRjCDQu9C+0LMt0LfQsNC/0LjRgdGMXG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSAgbGFiZWwgINC80LXRgtC60LBcblx0XHQgKiBAcGFyYW0gIHsqfSAgICAgICBhcmdzICAg0LDRgNCz0YPQvNC10L3RgtGLINC00LvRjyDQu9C+0LPQuNGA0L7QstCw0L3QuNGPXG5cdFx0ICogQHBhcmFtICB7Kn0gICAgICAgW3BhcmVudElkXVxuXHRcdCAqIEBwYXJhbSAge0xvZ2dlck1ldGF9IFttZXRhXVxuXHRcdCAqIEByZXR1cm4ge2xvZ2dlci5FbnRyeX1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0YWRkOiBmdW5jdGlvbiAobGFiZWwsIGFyZ3MsIHBhcmVudElkLCBtZXRhKSB7XG5cdFx0XHRpZiAobG9nZ2VyLmRpc2FibGVkKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0fVxuXG5cdFx0XHRsb2dnZXIubWV0YU9mZnNldCA9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcy5hZGRFbnRyeSgnbG9nJywgbGFiZWwsIGFyZ3MsIHBhcmVudElkLCBtZXRhKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQpNGD0L3QutGG0LjRjyDRhNC40YLRgNCw0YbQuNC4INCw0YDQs9GD0LzQtdC90YLQvtCyXG5cdFx0ICogQHBhcmFtICB7Kn0gIGFyZ3Ncblx0XHQgKiBAcmV0dXJuIHsqfVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRmaWx0ZXJBcmd1bWVudHM6IGZ1bmN0aW9uIChhcmdzKSB7XG5cdFx0XHRyZXR1cm4gYXJncztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQodC+0LfQtNCw0YLRjCBzY29wZVxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gbGFiZWxcblx0XHQgKiBAcGFyYW0gIHsqfSBhcmdzXG5cdFx0ICogQHBhcmFtICB7TG9nZ2VyTWV0YXxudW1iZXJ9IFttZXRhXSAg0YfQuNGB0LvQvtC8INC80L7QttC90L4g0L/QtdGA0LXQtNCw0YLRjCDRgdC80LXRidC10L3QuNC1IChtZXRhT2Zmc2V0KSDQv9C+IHN0YWNrXG5cdFx0ICogQHBhcmFtICB7bnVtYmVyfSBbcGFyZW50SWRdXG5cdFx0ICogQHJldHVybiB7bG9nZ2VyLkVudHJ5fVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRzY29wZTogZnVuY3Rpb24gKGxhYmVsLCBhcmdzLCBtZXRhLCBwYXJlbnRJZCkge1xuXHRcdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0XHRpZiAobWV0YSA9PSBudWxsKSB7XG5cdFx0XHRcdG1ldGEgPSAtMjtcblx0XHRcdH1cblxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdGlmIChtZXRhID49IC05OSkge1xuXHRcdFx0XHRtZXRhID0gbG9nZ2VyLm1ldGEobWV0YSk7XG5cdFx0XHR9XG5cblx0XHRcdGxvZ2dlci5tZXRhT2Zmc2V0ID0gMTtcblx0XHRcdHJldHVybiB0aGlzLmFkZEVudHJ5KCdzY29wZScsIGxhYmVsLCBhcmdzLCBwYXJlbnRJZCwgbWV0YSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JTQvtCx0LDQstC40YLRjCDQt9Cw0L/QuNGB0Yxcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfEVudHJ5fSAgdHlwZSAgICAgICAg0YLQuNC/INC30LDQv9C40YHQuCAoc2NvcGUsIGxvZylcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSAgICAgICAgW2xhYmVsXSAgICAg0LzQtdGC0LrQsFxuXHRcdCAqIEBwYXJhbSAgIHsqfSAgICAgICAgICAgICBbYXJnc10gICAgICDQsNGA0LPRg9C80LXQvdGC0Ytcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgICAgICAgW3BhcmVudElkXSAgaWQg0YDQvtC00LjRgtC10LvRj1xuXHRcdCAqIEBwYXJhbSAgIHtMb2dnZXJNZXRhfSAgICBbbWV0YV1cblx0XHQgKiBAcmV0dXJuICB7bG9nZ2VyLkVudHJ5fVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRhZGRFbnRyeTogZnVuY3Rpb24gKHR5cGUsIGxhYmVsLCBhcmdzLCBwYXJlbnRJZCwgbWV0YSkge1xuXHRcdFx0bG9nZ2VyLm1ldGFPZmZzZXQgKz0gMTtcblxuXHRcdFx0dmFyIGVudHJ5ID0gdHlwZSBpbnN0YW5jZW9mIEVudHJ5ID8gdHlwZSA6IG5ldyBFbnRyeSh0eXBlLCBsYWJlbCwgYXJncywgcGFyZW50SWQgfHwgdGhpcy5wYXJlbnRJZCwgbWV0YSk7XG5cblx0XHRcdGluZGV4W2VudHJ5LmlkXSA9IGVudHJ5O1xuXHRcdFx0ZW50cnkuaWR4ID0gZW50cmllcy5wdXNoKGVudHJ5KSAtIDE7XG5cblx0XHRcdHRoaXMuX2VtaXQoKTtcblxuXHRcdFx0cmV0dXJuIGVudHJ5O1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0YwgwqvRgNC+0LTQuNGC0LXQu9GM0YHQutGD0Y7CuyDQt9Cw0L/QuNGB0Yxcblx0XHQgKiBAcGFyYW0gICB7Kn0gaWRcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSBsYWJlbFxuXHRcdCAqIEByZXR1cm5zIHsqfVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRjbG9zZXN0OiBmdW5jdGlvbiAoaWQsIGxhYmVsKSB7XG5cdFx0XHR2YXIgZW50cnk7XG5cblx0XHRcdGlkID0gaWQuaWQgfHwgaWQ7XG5cblx0XHRcdHdoaWxlICgoZW50cnkgPSBpbmRleFtpZF0pICYmIGlkKSB7XG5cdFx0XHRcdGlkID0gZW50cnkucGFyZW50SWQ7XG5cblx0XHRcdFx0aWYgKGVudHJ5LmxhYmVsID09PSBsYWJlbCkge1xuXHRcdFx0XHRcdHJldHVybiBlbnRyeTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC70L7Qsy3RhtC10L/QvtGH0YMg0L/QviBpZCDQt9Cw0L/QuNGB0Lhcblx0XHQgKiBAcGFyYW0gICB7bnVtYmVyfSAgaWRcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSAgW2dsdWVdXG5cdFx0ICogQHJldHVybnMge0FycmF5fVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRjaGFpbjogZnVuY3Rpb24gKGlkLCBnbHVlKSB7XG5cdFx0XHR2YXIgbG9nID0gW10sIGVudHJ5O1xuXG5cdFx0XHR3aGlsZSAoKGVudHJ5ID0gaW5kZXhbaWRdKSAmJiBpZCkge1xuXHRcdFx0XHRpZCA9IGVudHJ5LnBhcmVudElkO1xuXHRcdFx0XHRsb2cucHVzaChlbnRyeSk7XG5cdFx0XHR9XG5cblx0XHRcdGxvZy5yZXZlcnNlKCk7XG5cblx0XHRcdGlmIChnbHVlKSB7XG5cdFx0XHRcdGxvZyA9IGxvZy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdFx0XHRcdFx0cmV0dXJuICdbJyArIGVudHJ5LmlkICsgJ10gJyArIGVudHJ5LmxhYmVsO1xuXHRcdFx0XHR9KS5qb2luKGdsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gbG9nO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LvQvtCzLXNjb3BlXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIG5hbWUgICBzY29wZS3QvdCw0LfQstCw0L3QuNC1XG5cdFx0ICogQHBhcmFtICAgeyp9ICAgICAgIGFyZ3MgICDQsNGA0LPRg9C80LXQvdGC0Ytcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgW3BhcmVudElkXVxuXHRcdCAqIEBwYXJhbSAgIHtMb2dnZXJNZXRhfSAgW21ldGFdXG5cdFx0ICogQHJldHVybnMge09iamVjdH1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0Z2V0U2NvcGU6IGZ1bmN0aW9uIChuYW1lLCBhcmdzLCBwYXJlbnRJZCwgbWV0YSkge1xuXHRcdFx0bG9nZ2VyLm1ldGFPZmZzZXQgKz0gMTtcblx0XHRcdHJldHVybiB0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgPyB0aGlzLmFkZEVudHJ5KCdzY29wZScsIG5hbWUsIGFyZ3MsIHBhcmVudElkLCBtZXRhKSA6IG5hbWU7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7QsdC10YDQvdGD0YLRjCDRhNGD0L3RhtC40Y4g0LjQu9C4IFByb21pc2Ug0LIg0LvQvtCzLXNjb3BlXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gICAgIG5hbWUgIHNjb3BlLdC90LDQt9Cy0LDQvdC40LVcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgICAgYXJncyAg0LzQtdGC0L7QtCDQuNC70Lgg0LDRgNCz0YPQvNC10L3RgtGLXG5cdFx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIFtmbl0gINC80LXRgtC+0LRcblx0XHQgKiBAcGFyYW0gICB7bnVtYmVyfSAgICAgW3BhcmVudElkXVxuXHRcdCAqIEBwYXJhbSAgIHtMb2dnZXJNZXRhfSBbbWV0YV1cblx0XHQgKiBAcmV0dXJucyB7RnVuY3Rpb258UHJvbWlzZX1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0d3JhcDogZnVuY3Rpb24gKG5hbWUsIGFyZ3MsIGZuLCBwYXJlbnRJZCwgbWV0YSkge1xuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0Zm4gPSBuYW1lO1xuXHRcdFx0XHRuYW1lID0gaW5kZXhbbG9nZ2VyLnBhcmVudElkXTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKGZuID09PSB2b2lkIDApIHtcblx0XHRcdFx0Zm4gPSBhcmdzO1xuXHRcdFx0XHRhcmdzID0gdm9pZCAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZm4gJiYgIWZuLl9fbG9nZ2VyX18gJiYgIXRoaXMuZGlzYWJsZWQpIHtcblx0XHRcdFx0bG9nZ2VyLm1ldGFPZmZzZXQgKz0gMTtcblxuXHRcdFx0XHRtZXRhID0gbWV0YSB8fCBsb2dnZXIubWV0YSgpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHR2YXIgd3JhcHBlciA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHRcdHZhciBlbnRyeSA9IGxvZ2dlci5nZXRTY29wZShuYW1lLCBhcmdzLCBwYXJlbnRJZCwgbWV0YSksXG5cdFx0XHRcdFx0XHRcdF9wYXJlbnRJZCA9IGxvZ2dlci5wYXJlbnRJZCxcblx0XHRcdFx0XHRcdFx0cmV0VmFsO1xuXG5cdFx0XHRcdFx0XHRsb2dnZXIucGFyZW50SWQgPSBlbnRyeS5pZDtcblx0XHRcdFx0XHRcdGxvZ2dlci5tZXRhT2Zmc2V0ICs9IDE7XG5cblx0XHRcdFx0XHRcdHJldFZhbCA9IGxvZ2dlci53cmFwKGVudHJ5LCBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpKTtcblxuXHRcdFx0XHRcdFx0bG9nZ2VyLnBhcmVudElkID0gX3BhcmVudElkO1xuXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmV0VmFsO1xuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRmbi5fX2xvZ2dlcl9fID0gdHJ1ZTtcblx0XHRcdFx0XHR3cmFwcGVyLl9fbG9nZ2VyX18gPSB0cnVlO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHdyYXBwZXI7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZm4udGhlbikge1xuXHRcdFx0XHRcdGxvZ2dlci5nZXRTY29wZShuYW1lLCBhcmdzLCBudWxsLCBtZXRhKS53cmFwKGZuKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRsb2dnZXIubWV0YU9mZnNldCA9IDA7XG5cblx0XHRcdHJldHVybiBmbjtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQktGL0L/QvtC70L3QuNGC0Ywg0LzQtdGC0L7QtCDQsiDQu9C+0LMt0LrQvtC90LXQutGB0YLQtVxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9IGxhYmVsXG5cdFx0ICogQHBhcmFtICAgeyp9IGFyZ3Ncblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuXG5cdFx0ICogQHJldHVybnMgeyp9XG5cdFx0ICogQG1ldGhvZE9mIGxvZ2dlclxuXHRcdCAqL1xuXHRcdGNhbGw6IGZ1bmN0aW9uIChsYWJlbCwgYXJncywgZm4pIHtcblx0XHRcdGxvZ2dlci5tZXRhT2Zmc2V0ICs9IDE7XG5cdFx0XHRyZXR1cm4gdGhpcy53cmFwKGxhYmVsLCBhcmdzLCBmbikoKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQodCx0YDQvtGB0LjRgtGMINC70L7Qs1xuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRyZXNldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0Z2lkID0gMTtcblxuXHRcdFx0dGhpcy5pbmRleCA9IGluZGV4ID0ge307XG5cdFx0XHR0aGlzLmVudHJpZXMgPSBlbnRyaWVzID0gW107XG5cdFx0XHR0aGlzLnBhcmVudElkID0gMDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQktGL0LLQvtC0INC70L7Qs9CwINCyINC60L7QvdGB0L7Qu9GMXG5cdFx0ICogQHBhcmFtICAge2Jvb2xlYW59IFtyZXRdICDQstC10YDQvdGD0YLRjCDQu9C+0LMg0YHRgtGA0L7QutC+0Llcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0cHJpbnQ6IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovZnVuY3Rpb24gKHJldCkge1xuXHRcdFx0dmFyIGdyb3VwcyA9IHt9LFxuXHRcdFx0XHRyZXRMb2cgPSAnJztcblxuXG5cdFx0XHRlbnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG5cdFx0XHRcdHZhciBpZCA9IGVudHJ5LnBhcmVudElkO1xuXHRcdFx0XHQoZ3JvdXBzW2lkXSA9IGdyb3Vwc1tpZF0gfHwgW10pLnB1c2goZW50cnkpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGZ1bmN0aW9uIF90aW1lKG1zKSB7XG5cdFx0XHRcdHJldHVybiBuZXcgRGF0ZShtcykudG9JU09TdHJpbmcoKS5zbGljZSgxMSwgLTEpO1xuXHRcdFx0fVxuXG5cdFx0XHQoZnVuY3Rpb24gX3ByaW50KGlkLCBpbmRlbnQpIHtcblx0XHRcdFx0dmFyIGVudHJpZXMgPSBncm91cHNbaWRdIHx8IFtdLFxuXHRcdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRcdG4gPSBlbnRyaWVzLmxlbmd0aCxcblx0XHRcdFx0XHRlbnRyeSxcblx0XHRcdFx0XHRsb2csXG5cdFx0XHRcdFx0YXJnc1xuXHRcdFx0XHQ7XG5cblx0XHRcdFx0Zm9yICg7IGkgPCBuOyBpKyspIHtcblx0XHRcdFx0XHRlbnRyeSA9IGVudHJpZXNbaV07XG5cdFx0XHRcdFx0YXJncyA9IGVudHJ5LmFyZ3M7XG5cdFx0XHRcdFx0bG9nID0gKCdbJyArIF90aW1lKGVudHJ5LnRzKSArICddICcgKyBlbnRyeS5sYWJlbCk7XG5cblx0XHRcdFx0XHRpZiAocmV0KSB7XG5cdFx0XHRcdFx0XHRsb2cgKz0gYXJncyA/ICc6ICcgKyBKU09OLnN0cmluZ2lmeShhcmdzKSA6ICcnO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdFx0aWYgKGdyb3Vwc1tlbnRyeS5pZF0pIHtcblx0XHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdFx0XHRpZiAocmV0KSB7XG5cdFx0XHRcdFx0XHRcdHJldExvZyArPSBpbmRlbnQgKyBsb2cgKyAnXFxuJztcblx0XHRcdFx0XHRcdFx0X3ByaW50KGVudHJ5LmlkLCAnICAnICsgaW5kZW50KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRpZiAoUl9BVVRPX0xFVkVMUy50ZXN0KGxvZykpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgc3R5bGVzID0gJ2NvbG9yOiAnICsgQVVUT19MRVZFTFNfQ09MT1JTW1JlZ0V4cC5sYXN0TWF0Y2gudG9Mb3dlckNhc2UoKV07XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5ncm91cCgnJWMnICsgbG9nLCBzdHlsZXMpO1xuXHRcdFx0XHRcdFx0XHRcdGFyZ3MgJiYgY29uc29sZS5sb2coJyVjW2RldGFpbHNdICcsIHN0eWxlcywgYXJncyk7XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5ncm91cChsb2cpO1xuXHRcdFx0XHRcdFx0XHRcdGFyZ3MgJiYgY29uc29sZS5sb2coJ1tkZXRhaWxzXSAnLCBhcmdzKTtcblx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdF9wcmludChlbnRyeS5pZCk7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUuZ3JvdXBFbmQoKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAocmV0KSB7XG5cdFx0XHRcdFx0XHRyZXRMb2cgKz0gaW5kZW50ICsgbG9nICsgJ1xcbic7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKFJfQVVUT19MRVZFTFMudGVzdChsb2cpKSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnJWMnICsgbG9nLCAnY29sb3I6ICcgKyBBVVRPX0xFVkVMU19DT0xPUlNbUmVnRXhwLmxhc3RNYXRjaC50b0xvd2VyQ2FzZSgpXSwgYXJncyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2cobG9nLCBhcmdzKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pKDAsICcnKTtcblxuXG5cdFx0XHRyZXR1cm4gcmV0ICYmIHJldExvZztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LTQv9C40YHQsNGC0YzRgdGPINC90LAg0LTQvtCx0LDQstC70LXQvdC40LUg0LfQsNC/0LjRgdC4XG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gICBsYWJlbHNcblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuXG5cdFx0ICogQHJldHVybnMge2xvZ2dlcn1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0b246IGZ1bmN0aW9uIChsYWJlbHMsIGZuKSB7XG5cdFx0XHRsYWJlbHMgPSBsYWJlbHMudHJpbSgpLnNwbGl0KFJTUEFDRSk7XG5cblx0XHRcdHZhciBpID0gbGFiZWxzLmxlbmd0aCwgbGFiZWw7XG5cblx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0bGFiZWwgPSBsYWJlbHNbaV0uc3BsaXQoJzonKTtcblx0XHRcdFx0Z2V0TGlzdGVuZXJzKHRoaXMsIGxhYmVsWzFdIHx8IGxhYmVsWzBdKS5wdXNoKHtcblx0XHRcdFx0XHRmbjogZm4sXG5cdFx0XHRcdFx0bGFiZWw6IGxhYmVsWzFdIHx8IGxhYmVsWzBdLFxuXHRcdFx0XHRcdHBhcmVudDogbGFiZWxbMV0gJiYgbGFiZWxbMF1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0YLQv9C40YHQsNGC0YzRgdGPINC+0YIg0LTQvtCx0LDQstC70LXQvdC40LUg0LfQsNC/0LjRgdC4XG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gICBsYWJlbHNcblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuXG5cdFx0ICogQHJldHVybnMge2xvZ2dlcn1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0b2ZmOiBmdW5jdGlvbiAobGFiZWxzLCBmbikge1xuXHRcdFx0bGFiZWxzID0gbGFiZWxzLnRyaW0oKS5zcGxpdChSU1BBQ0UpO1xuXG5cdFx0XHR2YXIgaSA9IGxhYmVscy5sZW5ndGgsIGxhYmVsLCBsaXN0LCBqLCBoYW5kbGU7XG5cblx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0bGFiZWwgPSBsYWJlbHNbaV0uc3BsaXQoJzonKTtcblx0XHRcdFx0bGlzdCA9IGdldExpc3RlbmVycyh0aGlzLCBsYWJlbFsxXSB8fCBsYWJlbFswXSk7XG5cdFx0XHRcdGogPSBsaXN0Lmxlbmd0aDtcblxuXHRcdFx0XHR3aGlsZSAoai0tKSB7XG5cdFx0XHRcdFx0aGFuZGxlID0gbGlzdFtqXTtcblxuXHRcdFx0XHRcdGlmIChoYW5kbGUuZm4gPT09IGZuICYmIChoYW5kbGUucGFyZW50ID09PSAobGFiZWxbMV0gJiYgbGFiZWxbMF0pKSkge1xuXHRcdFx0XHRcdFx0bGlzdC5zcGxpY2UoaiwgMSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCY0YHQv9GD0YHQutCw0LXQvCDRgdC+0LHRi9GC0LjRj1xuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQG1ldGhvZE9mIGxvZ2dlclxuXHRcdCAqL1xuXHRcdF9lbWl0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgZW50cnksXG5cdFx0XHRcdHBhcmVudEVudHJ5LFxuXHRcdFx0XHRsaXN0LFxuXHRcdFx0XHRlID0gZW50cmllcy5sZW5ndGgsXG5cdFx0XHRcdGksXG5cdFx0XHRcdGhhbmRsZVxuXHRcdFx0O1xuXG5cdFx0XHR3aGlsZSAoZS0tKSB7XG5cdFx0XHRcdGVudHJ5ID0gZW50cmllc1tlXTtcblxuXHRcdFx0XHRpZiAoIWVudHJ5LmVtaXR0ZWQpIHtcblx0XHRcdFx0XHRlbnRyeS5lbWl0dGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRsaXN0ID0gZ2V0TGlzdGVuZXJzKHRoaXMsIGVudHJ5LmxhYmVsKTtcblx0XHRcdFx0XHRpID0gbGlzdC5sZW5ndGg7XG5cblx0XHRcdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdFx0XHRoYW5kbGUgPSBsaXN0W2ldO1xuXG5cdFx0XHRcdFx0XHRpZiAoaGFuZGxlLnBhcmVudCkge1xuXHRcdFx0XHRcdFx0XHRwYXJlbnRFbnRyeSA9IHRoaXMuY2xvc2VzdChlbnRyeS5pZCwgaGFuZGxlLnBhcmVudCk7XG5cblx0XHRcdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0XHRcdFx0aWYgKHBhcmVudEVudHJ5KSB7XG5cdFx0XHRcdFx0XHRcdFx0aGFuZGxlLmZuKHBhcmVudEVudHJ5LCBlbnRyeSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRoYW5kbGUuZm4oZW50cnkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdGxhc3Q6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBlbnRyaWVzW2VudHJpZXMubGVuZ3RoIC0gMV07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0YLQtdC60YPRidGD0Y4g0LzQtdGC0LAg0LjQvdGE0L7RgNC80LDRhtC40Y5cblx0XHQgKiBAcGFyYW0gIHtudW1iZXJ9IFtvZmZzZXRdXG5cdFx0ICogQHJldHVybiB7TG9nZ2VyTWV0YX1cblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0bWV0YTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtmbjogJ3Vua25vd24nLCBmaWxlOiAndW5rbm93bicsIGxpbmU6IDAsIGNvbHVtbjogMH07XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCg0LDQt9C+0LHRgNCw0YLRjCDRgdGC0YDQvtGH0LrRgyDQuNC3INGB0YLQtdC60LBcblx0XHQgKiBAcmV0dXJuIHtMb2dnZXJNZXRhfVxuXHRcdCAqIEBtZXRob2RPZiBsb2dnZXJcblx0XHQgKi9cblx0XHRwYXJzZVN0YWNrUm93OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdHZhbHVlICs9ICcnO1xuXG5cdFx0XHR2YXIgbWF0Y2ggPSB2YWx1ZS5tYXRjaCgvYXRcXHMrKFteXFxzXSspKD86Lio/KVxcKCgoPzpodHRwfGZpbGV8XFwvKVteKV0rOlxcZCspXFwpLyksXG5cdFx0XHRcdGZpbGU7XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdG1hdGNoID0gdmFsdWUubWF0Y2goL2F0XFxzKyguKykvKTtcblxuXHRcdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSB2YWx1ZS5tYXRjaCgvXiguKj8pKD86XFwvPCkqQCguKj8pJC8pIHx8IHZhbHVlLm1hdGNoKC9eKCkoaHR0cHM/OlxcL1xcLy4rKS8pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1hdGNoWzBdID0gJzxhbm9ueW1vdXM+Jztcblx0XHRcdFx0XHRtYXRjaC51bnNoaWZ0KCcnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHRcdFx0aWYgKG1hdGNoKSB7XG5cdFx0XHRcdGZpbGUgPSBtYXRjaFsyXS5tYXRjaCgvXiguKj8pOihcXGQrKSg/OjooXFxkKykpPyQvKSB8fCBbXTtcblx0XHRcdFx0bWF0Y2ggPSB7XG5cdFx0XHRcdFx0Zm46IChtYXRjaFsxXSB8fCAnPGFub255bW91cz4nKS50cmltKCksXG5cdFx0XHRcdFx0ZmlsZTogZmlsZVsxXSxcblx0XHRcdFx0XHRsaW5lOiBmaWxlWzJdfDAsXG5cdFx0XHRcdFx0Y29sdW1uOiBmaWxlWzNdfDBcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRtYXRjaCA9IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQodC10YDQuNCw0LvQuNC30L7QstCw0YLRjCDQu9C+0LNcblx0XHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdFx0ICogQG1ldGhvZE9mIGxvZ2dlclxuXHRcdCAqL1xuXHRcdHNlcmlhbGl6ZTogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KGVudHJpZXMpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0YLQv9GA0LDQstC40YLRjCDQvdCwINC/0L7Rh9GC0YNcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gZW1haWxcblx0XHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdFx0ICovXG5cdFx0bWFpbFRvOiAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyBmdW5jdGlvbiAoZW1haWwpIHtcblx0XHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcblx0XHRcdGVsLmhyZWYgPSAnbWFpbHRvOicgKyBlbWFpbFxuXHRcdFx0XHRcdCsgJz9zdWJqZWN0PScgKyBlbmNvZGVVUklDb21wb25lbnQoJ1tsb2dnZXJdICcgKyBuZXcgRGF0ZSgpKVxuXHRcdFx0XHRcdCsgJyZib2R5PScgKyBlbmNvZGVVUklDb21wb25lbnQodGhpcy5zZXJpYWxpemUoKSk7XG5cdFx0XHRlbC5pbm5lckhUTUwgPSAnc2VuZCc7XG5cdFx0XHRlbC5jbGljaygpO1xuXHRcdH1cblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQntC/0LjRgdCw0L3QuNC1INC30LDQv9C40YHQuCDQu9C+0LPQsFxuXHQgKiBAY2xhc3MgIGxvZ2dlci5FbnRyeVxuXHQgKiBAbWV0aG9kT2YgbG9nZ2VyXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gIHR5cGVcblx0ICogQHBhcmFtICB7c3RyaW5nfSAgW2xhYmVsXVxuXHQgKiBAcGFyYW0gIHsqfSAgICAgICBbYXJnc11cblx0ICogQHBhcmFtICB7Kn0gICAgICAgW3BhcmVudElkXVxuXHQgKi9cblx0ZnVuY3Rpb24gRW50cnkodHlwZSwgbGFiZWwsIGFyZ3MsIHBhcmVudElkLCBtZXRhKSB7XG5cdFx0LyoqXG5cdFx0ICog0JjQtNC10YLQuNGE0LjQutCw0YLQvtGAINC30LDQv9C40YHQuFxuXHRcdCAqIEBtZW1iZXIgeyp9IGxvZ2dlci5FbnRyeSNpZFxuXHRcdCAqL1xuXHRcdHRoaXMuaWQgPSAoYXJncyAmJiBhcmdzLnV1aWQpIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovKGxvZ2dlci51c2VVVUlEID8gdXVpZCgpIDogZ2lkKyspO1xuXG5cblx0XHQvKipcblx0XHQgKiDQntGC0L3QvtGB0LjRgtC10LvRjNC90L7QtSDQstGA0LXQvNGPINC00L7QsdCw0LLQu9C10L3QuNGPXG5cdFx0ICogQG1lbWJlciB7bnVtYmVyfSBsb2dnZXIuRW50cnkjdHNcblx0XHQgKi9cblx0XHR0aGlzLnRzID0gcGVyZm9ybWFuY2Uubm93KCk7XG5cblxuXHRcdC8qKlxuXHRcdCAqINCi0LjQvyDQt9Cw0L/QuNGB0Lhcblx0XHQgKiBAbWVtYmVyIHtzdHJpbmd9IGxvZ2dlci5FbnRyeSN0eXBlXG5cdFx0ICovXG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblxuXG5cdFx0LyoqXG5cdFx0ICog0JzQtdGC0LrQsCDQt9Cw0L/QuNGB0Lhcblx0XHQgKiBAbWVtYmVyIHtzdHJpbmd9IGxvZ2dlci5FbnRyeSNsYWJlbFxuXHRcdCAqL1xuXHRcdHRoaXMubGFiZWwgPSBsYWJlbCArICcnO1xuXG5cblx0XHR0cnkge1xuXHRcdFx0YXJncyA9IHV0aWwuY2xvbmVKU09OKGxvZ2dlci5maWx0ZXJBcmd1bWVudHMoYXJncykpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0YXJncyA9IGVycjtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCAqINCQ0YDQs9GD0LzQtdGA0YLRiyDQu9C+0LPQuNGA0L7QstCw0L3QuNGPXG5cdFx0ICogQG1lbWJlciB7Kn0gbG9nZ2VyLkVudHJ5I2FyZ3Ncblx0XHQgKi9cblx0XHR0aGlzLmFyZ3MgPSBhcmdzO1xuXG5cblx0XHQvKipcblx0XHQgKiBJZCDRgNC+0LTQuNGC0LXQu9GM0YHQutC+0Lkg0LfQsNC/0LjRgdC4XG5cdFx0ICogQG1lbWJlciB7Kn0gbG9nZ2VyLkVudHJ5I3BhcmVudElkXG5cdFx0ICovXG5cdFx0dGhpcy5wYXJlbnRJZCA9IHBhcmVudElkO1xuXG5cblx0XHQvKipcblx0XHQgKiDQodC/0LjRgdC+0LogaWQg0YHQstGP0LfQsNC90L3Ri9GFINC30LDQv9C40YHQtdC5XG5cdFx0ICogQG1lbWJlciB7QXJyYXl9IGxvZ2dlci5FbnRyeSNsaW5rZWRcblx0XHQgKi9cblx0XHR0aGlzLmxpbmtlZCA9IFtdO1xuXG5cblx0XHQvKipcblx0XHQgKiDQnNC10YLQsCDQuNC90YTQvtGA0LzQsNGG0LjRjyAo0YHRgtGA0L7QutCwLCDRhNCw0LnQuywg0LzQtdGC0L7QtCDQuCDRgi7Qvy4pXG5cdFx0ICogQHR5cGUge0xvZ2dlck1ldGF9XG5cdFx0ICovXG5cdFx0bG9nZ2VyLm1ldGFPZmZzZXQgKz0gMTtcblx0XHR0aGlzLm1ldGEgPSBtZXRhIHx8IGxvZ2dlci5tZXRhKCk7XG5cdFx0bG9nZ2VyLm1ldGFPZmZzZXQgPSAwO1xuXHR9XG5cblxuXHRFbnRyeS5mbiA9IEVudHJ5LnByb3RvdHlwZSA9IC8qKiBAbGVuZHMgbG9nZ2VyLkVudHJ5LnByb3RvdHlwZSAqLyB7XG5cdFx0Y29uc3RydWN0b3I6IEVudHJ5LFxuXG5cblx0XHQvKipcblx0XHQgKiDQlNC+0LHQsNCy0LjRgtGMINGB0LLRj9C30LDQvdC90YPRjiDQt9Cw0L/QuNGB0Yxcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9ICBsYWJlbFxuXHRcdCAqIEBwYXJhbSAgeyp9ICAgICAgIFthcmdzXVxuXHRcdCAqIEByZXR1cm4ge2xvZ2dlci5FbnRyeX1cblx0XHQgKi9cblx0XHRhZGQ6IGZ1bmN0aW9uIChsYWJlbCwgYXJncykge1xuXHRcdFx0cmV0dXJuIGxvZ2dlci5hZGQobGFiZWwsIGFyZ3MsIHRoaXMuaWQsIHRoaXMubWV0YSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JLRi9C/0L7Qu9C90LjRgtGMINC80LXRgtC+0LQg0LIg0LvQvtCzLdC60L7QvdC10LrRgdGC0LVcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd8RnVuY3Rpb259ICAgbGFiZWxcblx0XHQgKiBAcGFyYW0gIHsqfSAgICAgICAgYXJnc1xuXHRcdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuXHRcdCAqIEByZXR1cm4geyp9XG5cdFx0ICovXG5cdFx0Y2FsbDogZnVuY3Rpb24gKGxhYmVsLCBhcmdzLCBmbikge1xuXHRcdFx0aWYgKHR5cGVvZiBsYWJlbCA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR2YXIgcGFyZW50SWQgPSBsb2dnZXIucGFyZW50SWQsXG5cdFx0XHRcdFx0cmV0VmFsO1xuXG5cdFx0XHRcdGxvZ2dlci5wYXJlbnRJZCA9IHRoaXMuaWQ7XG5cdFx0XHRcdHJldFZhbCA9IHRoaXMud3JhcChhcmdzID8gbGFiZWwuYXBwbHkobnVsbCwgYXJncykgOiBsYWJlbCgpKTtcblx0XHRcdFx0bG9nZ2VyLnBhcmVudElkID0gcGFyZW50SWQ7XG5cblx0XHRcdFx0cmV0dXJuIHJldFZhbDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGxvZ2dlci53cmFwKGxhYmVsLCBhcmdzLCBmbiwgdGhpcy5pZCwgdGhpcy5tZXRhKSgpO1xuXHRcdH0sXG5cblxuXHRcdHdyYXA6IGZ1bmN0aW9uIChvYmopIHtcblx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHJldHVybiBsb2dnZXIud3JhcCh0aGlzLCBvYmopO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAob2JqICYmICFvYmouX19sb2dnZXJfXyAmJiBvYmoudGhlbikge1xuXHRcdFx0XHR2YXIgdGhlbiA9IG9iai50aGVuLFxuXHRcdFx0XHRcdGRvbmUgPSBvYmouZG9uZSxcblx0XHRcdFx0XHRmYWlsID0gb2JqLmZhaWwsXG5cdFx0XHRcdFx0YWx3YXlzID0gb2JqLmFsd2F5cyxcblx0XHRcdFx0XHRsb2dTY29wZSA9IHRoaXM7XG5cblxuXHRcdFx0XHRvYmouX19sb2dnZXJfXyA9IGxvZ1Njb3BlO1xuXG5cblx0XHRcdFx0LyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuXHRcdFx0XHRkb25lICYmIChvYmouZG9uZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHZhciBub0xvZyA9IG9iai5fX25vTG9nLFxuXHRcdFx0XHRcdFx0bWV0YSA9IGxvZ2dlci5tZXRhKC0xIC0gKG9iai5tZXRhT2Zmc2V0fDApKTtcblxuXHRcdFx0XHRcdHJldHVybiBkb25lLmNhbGwob2JqLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHQobm9Mb2dcblx0XHRcdFx0XHRcdFx0PyBvYmouX19sb2dnZXJfX1xuXHRcdFx0XHRcdFx0XHQ6IGxvZ2dlci5hZGRFbnRyeSgnc2NvcGUnLCBfZ2V0UHJvbWlzZU5hbWUobG9nU2NvcGUsICdkb25lJyksIG51bGwsIG9iai5fX2xvZ2dlcl9fLmlkLCBtZXRhKVxuXHRcdFx0XHRcdFx0KS5jYWxsKGNhbGxiYWNrLCBhcmd1bWVudHMpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdC8qIGpzaGludCBleHByOnRydWUgKi9cblx0XHRcdFx0ZmFpbCAmJiAob2JqLmZhaWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcblx0XHRcdFx0XHR2YXIgbm9Mb2cgPSBvYmouX19ub0xvZyxcblx0XHRcdFx0XHRcdG1ldGEgPSBsb2dnZXIubWV0YSgtMSAtIChvYmoubWV0YU9mZnNldHwwKSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gZmFpbC5jYWxsKG9iaiwgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0KG5vTG9nXG5cdFx0XHRcdFx0XHRcdD8gb2JqLl9fbG9nZ2VyX19cblx0XHRcdFx0XHRcdFx0OiBsb2dnZXIuYWRkRW50cnkoJ3Njb3BlJywgX2dldFByb21pc2VOYW1lKGxvZ1Njb3BlLCAnZmFpbCcpLCBudWxsLCBvYmouX19sb2dnZXJfXy5pZCwgbWV0YSlcblx0XHRcdFx0XHRcdCkuY2FsbChjYWxsYmFjaywgYXJndW1lbnRzKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0XHQvKiBqc2hpbnQgZXhwcjp0cnVlICovXG5cdFx0XHRcdGFsd2F5cyAmJiAob2JqLmFsd2F5cyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHZhciBtZXRhID0gbG9nZ2VyLm1ldGEoLTEgLSAob2JqLm1ldGFPZmZzZXR8MCkpLFxuXHRcdFx0XHRcdFx0cmV0VmFsO1xuXG5cdFx0XHRcdFx0b2JqLl9fbm9Mb2cgPSB0cnVlO1xuXG5cdFx0XHRcdFx0cmV0VmFsID0gYWx3YXlzLmNhbGwob2JqLCBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRsb2dnZXJcblx0XHRcdFx0XHRcdFx0LmFkZEVudHJ5KCdzY29wZScsIF9nZXRQcm9taXNlTmFtZShsb2dTY29wZSwgJ2Fsd2F5cycpLCBudWxsLCBvYmouX19sb2dnZXJfXy5pZCwgbWV0YSlcblx0XHRcdFx0XHRcdFx0XHQuY2FsbChjYWxsYmFjaywgYXJndW1lbnRzKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdG9iai5fX25vTG9nID0gZmFsc2U7XG5cblx0XHRcdFx0XHRyZXR1cm4gcmV0VmFsO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdG9ialsnY2F0Y2gnXSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuXHRcdFx0XHRcdHJldHVybiBvYmoudGhlbihudWxsLCBjYWxsYmFjaywgdHJ1ZSk7XG5cdFx0XHRcdH07XG5cblxuXHRcdFx0XHRvYmoudGhlbiA9IGZ1bmN0aW9uIChvblJlc29sdmVkLCBvblJlamVjdGVkLCBpc0NhdGNoKSB7XG5cdFx0XHRcdFx0aWYgKG9iai5fX25vTG9nKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhlbi5jYWxsKG9iaiwgb25SZXNvbHZlZCwgb25SZWplY3RlZCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIG1ldGEgPSBsb2dnZXIubWV0YSgtMSAtIChvYmoubWV0YU9mZnNldHwwKSAtICEhaXNDYXRjaCksXG5cdFx0XHRcdFx0XHRsYWJlbCA9IGlzQ2F0Y2ggPyAnY2F0Y2gnIDogJ3RoZW4nLFxuXHRcdFx0XHRcdFx0c2NvcGUgPSBuZXcgRW50cnkoJ3Njb3BlJywgJycsIG51bGwsIGxvZ1Njb3BlLmlkLCBtZXRhKTtcblxuXHRcdFx0XHRcdGZ1bmN0aW9uIHJlc29sdmVkKCkge1xuXHRcdFx0XHRcdFx0c2NvcGUubGFiZWwgPSBfZ2V0UHJvbWlzZU5hbWUobG9nU2NvcGUsIGxhYmVsICsgJzpyZXNvbHZlZCcpO1xuXHRcdFx0XHRcdFx0bG9nZ2VyLmFkZEVudHJ5KHNjb3BlKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlLmNhbGwob25SZXNvbHZlZCwgYXJndW1lbnRzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmdW5jdGlvbiByZWplY3RlZCgpIHtcblx0XHRcdFx0XHRcdHNjb3BlLmxhYmVsID0gX2dldFByb21pc2VOYW1lKGxvZ1Njb3BlLCBsYWJlbCArICc6cmVqZWN0ZWQnKTtcblx0XHRcdFx0XHRcdGxvZ2dlci5hZGRFbnRyeShzY29wZSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBzY29wZS5jYWxsKG9uUmVqZWN0ZWQsIGFyZ3VtZW50cyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIHNjb3BlLndyYXAodGhlbi5jYWxsKG9iaiwgb25SZXNvbHZlZCA/IHJlc29sdmVkIDogbnVsbCwgb25SZWplY3RlZCA/IHJlamVjdGVkIDogbnVsbCkpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0L7Qt9C00LDRgtGMINGB0LLRj9C30LDQvdC90YvQuSBzY29wZVxuXHRcdCAqIEBwYXJhbSAge3N0cmluZ30gbGFiZWxcblx0XHQgKiBAcGFyYW0gIHsqfSBbYXJnc11cblx0XHQgKiBAcGFyYW0gIHsqfSBbbWV0YV1cblx0XHQgKi9cblx0XHRzY29wZTogZnVuY3Rpb24gKGxhYmVsLCBhcmdzLCBtZXRhKSB7XG5cdFx0XHRyZXR1cm4gbG9nZ2VyLnNjb3BlKGxhYmVsLCBhcmdzLCBtZXRhIHx8IC0zLCB0aGlzLmlkKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINGG0LXQv9C+0YfQutGDINC30LDQv9C40YHQtdC5XG5cdFx0ICogQHBhcmFtICB7c3RyaW5nfSBbZ2x1ZV1cblx0XHQgKiBAcmV0dXJucyB7QXJyYXl8c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGNoYWluOiBmdW5jdGlvbiAoZ2x1ZSkge1xuXHRcdFx0cmV0dXJuIGxvZ2dlci5jaGFpbih0aGlzLmlkLCBnbHVlKTtcblx0XHR9LFxuXG5cblx0XHRwbHVjazogZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0cmV0dXJuIHRoaXMuY2hhaW4oKS5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG5cdFx0XHRcdHJldHVybiBlbnRyeVtrZXldO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/QvtC70YPRh9C40YLRjCDRgNC+0LTQuNGC0LXQu9GPXG5cdFx0ICogQHJldHVybiB7bG9nZ2VyLkVudHJ5fVxuXHRcdCAqL1xuXHRcdHBhcmVudDogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGluZGV4W3RoaXMucGFyZW50SWRdO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0YwgSlNPTi3QvtCx0YrQtdC60YJcblx0XHQgKiBAcmV0dXJucyB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRvSlNPTjogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0aWQ6IHRoaXMuaWQsXG5cdFx0XHRcdGRlcGVuZElkOiB0aGlzLmRlcGVuZElkLFxuXHRcdFx0XHRsaW5rZWQ6IHRoaXMubGlua2VkLFxuXHRcdFx0XHR0eXBlOiB0aGlzLnR5cGUsXG5cdFx0XHRcdGxhYmVsOiB0aGlzLmxhYmVsLFxuXHRcdFx0XHRhcmdzOiB0aGlzLmFyZ3MsXG5cdFx0XHRcdG1ldGE6IHRoaXMubWV0YVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG5cblxuXHRGdW5jdGlvbi5wcm90b3R5cGUubG9nZ2VyID0gZnVuY3Rpb24gKGxhYmVsLCBhcmdzKSB7XG5cdFx0cmV0dXJuIGxvZ2dlci53cmFwKGxhYmVsLCBhcmdzLCB0aGlzLCBudWxsLCBsb2dnZXIubWV0YSgtMSkpO1xuXHR9O1xuXG5cblx0Ly8gRXhwb3J0IEVudHJ5XG5cdGxvZ2dlci5FbnRyeSA9IEVudHJ5O1xuXG5cblx0LyoqXG5cdCAqINCb0L7Qs9C40YDRg9C10LzRi9C5IHNldFRpbWVvdXRcblx0ICogQHBhcmFtICB7c3RyaW5nfSAgICBuYW1lXG5cdCAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgY2FsbGJhY2tcblx0ICogQHBhcmFtICB7bnVtYmVyfSAgICBtc1xuXHQgKi9cblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0d2luZG93LnNldFRpbWVvdXRMb2cgPSBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIG1zKSB7fTtcblxuXG5cdC8qKlxuXHQgKiDQm9C+0LPQuNGA0YPQtdC80YvQuSBzZXRJbnRlcnZhbExvZ1xuXHQgKiBAcGFyYW0gIHtzdHJpbmd9ICAgIG5hbWVcblx0ICogQHBhcmFtICB7ZnVuY3Rpb259ICBjYWxsYmFja1xuXHQgKiBAcGFyYW0gIHtudW1iZXJ9ICAgIG1zXG5cdCAqL1xuXHQvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuXHR3aW5kb3cuc2V0SW50ZXJ2YWxMb2cgPSBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIG1zKSB7fTtcblxuXG5cdC8vWydzZXRUaW1lb3V0JywgJ3NldEludGVydmFsJ10uZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuXHQvL1x0dmFyIG1ldGhvZCA9IHdpbmRvd1tuYW1lXTtcblx0Ly9cblx0Ly9cdHdpbmRvd1tuYW1lICsgJ0xvZyddID0gZnVuY3Rpb24gKGxhYmVsLCBjYWxsYmFjaywgbXMpIHtcblx0Ly9cdFx0aWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuXHQvL1x0XHRcdG1zID0gY2FsbGJhY2s7XG5cdC8vXHRcdFx0Y2FsbGJhY2sgPSBsYWJlbDtcblx0Ly9cdFx0XHRsYWJlbCA9IG5hbWU7XG5cdC8vXHRcdH1cblx0Ly9cblx0Ly9cdFx0dmFyIHNjb3BlID0gbG9nZ2VyLnNjb3BlKCd+JyArIGxhYmVsKTtcblx0Ly9cdFx0cmV0dXJuIG1ldGhvZChmdW5jdGlvbiAoKSB7XG5cdC8vXHRcdFx0c2NvcGUuY2FsbChjYWxsYmFjayk7XG5cdC8vXHRcdH0sIG1zKTtcblx0Ly9cdH07XG5cdC8vfSk7XG5cblxuXG5cdFByb21pc2UuTG9nID0gZnVuY3Rpb24gKG5hbWUsIGV4ZWN1dG9yKSB7XG5cdFx0aWYgKGV4ZWN1dG9yKSB7XG5cdFx0XHRuYW1lID0gJ1tbJyArIG5hbWUgKyAnXV0nO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGV4ZWN1dG9yID0gbmFtZTtcblx0XHRcdG5hbWUgPSAnW1twcm9taXNlXV0nO1xuXHRcdH1cblxuXHRcdHJldHVybiBsb2dnZXIuc2NvcGUobmFtZSwgbnVsbCwgLTIpLmNhbGwoZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGV4ZWN1dG9yKTtcblx0XHR9KTtcblx0fTtcblxuXG5cdC8vIEV4cG9ydFxuXHRsb2dnZXIudmVyc2lvbiA9ICcwLjguMCc7XG5cblx0LyoganNoaW50IGJvc3M6dHJ1ZSAqL1xuXHRyZXR1cm4gKHdpbmRvdy5vY3RvbG9nID0gd2luZG93LmxvZ2dlciA9IGxvZ2dlcik7XG59KTtcbiIsImRlZmluZSgnbWFpbC9hY3Rpb25zL1Bhc3N3b3JkUmVjb3ZlcnknLCBmdW5jdGlvbiAocmVxdWlyZSkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0dmFyIEFjdGlvbiA9IHJlcXVpcmUoJ0FjdGlvbicpLFxuXHRcdFByb21pc2UgPSByZXF1aXJlKCdQcm9taXNlJyksXG5cdFx0UlBDID0gcmVxdWlyZSgnUlBDJyksXG5cdFx0dXRpbHMgPSByZXF1aXJlKCd1dGlscy91dGlsJyk7XG5cblx0LyoqXG5cdCAqINCU0LXQudGB0YLQstC40LUgXCLQktC+0YHRgdGC0LDQvdC+0LLQu9C10L3QuNC1INGC0LXQu9C10YTQvtC90LBcIlxuXHQgKiBAY2xhc3MgbWFpbC5QYXNzd29yZFJlY292ZXJ5XG5cdCAqIEBjb25zdHJ1Y3RzIG1haWwuUGFzc3dvcmRSZWNvdmVyeVxuXHQgKiBAZXh0ZW5kcyBBY3Rpb25cblx0ICovXG5cdHZhciBQYXNzd29yZFJlY292ZXJ5ID0gQWN0aW9uLmV4dGVuZCgvKiogQGxlbmRzIG1haWwuUGFzc3dvcmRSZWNvdmVyeSMgKi97XG5cblx0XHQvKipcblx0XHQgKiBAdHlwZWRlZiB7T2JqZWN0fSBQYXNzd29yZFJlY292ZXJ5UGFyYW1zIC0g0LLRhdC+0LTQvdGL0LUg0L/QsNGA0LDQvNC10YLRgNGLINC00LXQudGB0YLQstC40Y9cblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ30gcGhhc2UgLSDRjdGC0LDQvyDQstC+0YHRgdGC0LDQvdC+0LLQu9C10L3QuNGPINC/0LDRgNC+0LvRjyAo0L7Qv9GG0LjQuCwg0L7RgtC/0YDQsNCy0LrQsCDRgtC+0LrQtdC90LAsINC/0YDQvtCy0LXRgNC60LAg0YLQvtC60LXQvdCwKVxuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBlbWFpbCAtINCw0LTRgNC10YEsINC00LvRjyDQutC+0YLQvtGA0L7Qs9C+INC80Ysg0LLQvtGB0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdC8XG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd9IGJ5IC0g0YTQsNC60YLQvtGAINC90LAg0L7RgdC90L7QstCw0L3QuNC4INC60L7RgtC+0YDQvtCz0L4g0LHRg9C00LXRgiDRgdCz0LXQvdC10YDQuNGA0L7QstCw0L0g0YLQvtC60LXQvVxuXHRcdCAqIEBwcm9wZXJ0eSB7bnVtYmVyfG51bGx9IGFkZHJlc3MgLSDQvdC+0LzQtdGAINGC0LXQu9C10YTQvtC90LAg0LIg0YTQvtGA0LzQsNGC0LUgNzEyMzEyMzEyMzEzXG5cdFx0ICogQHByb3BlcnR5IHtudW1iZXJ8bnVsbH0gaW5kZXggLSDQv9C+0YDRj9C00LrQvtCy0YvQuSDQvdC+0LzQtdGAINGC0LXQu9C10YTQvtC90LAg0YHRgNC10LTQuCDRgtC10LvQtdGE0L7QvdC+0LIg0LTQu9GPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IHRva2VuIC0g0YLQvtC60LXQvSwg0LrQvtGC0L7RgNGL0Lkg0L3QtdC+0LHRhdC+0LTQuNC80L4g0L/QvtC00LLRgtGA0LXQtNC40YLRjCDQtNC70Y8g0LLQvtGB0YHRgtCw0L3QvtCy0LvQtdC90LjRj1xuXHRcdCAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IHZhbHVlIC0g0LfQvdCw0YfQtdC90LjQtSwg0LrQvtGC0L7RgNGL0Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GMINC/0L7QtNGC0LLQtdGA0LbQtNCw0LXRgiDRgtC+0LrQtdC9XG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gY2FwdGNoYSAtINC30L3QsNGH0LXQvdC40LUg0LrQsNC/0YfQuCwg0LXRgdC70LggdG9rZW4vc2VuZCDQtdC1INC30LDRgtGA0LXQsdC+0LLQsNC7XG5cdFx0ICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gcmVzdG9yZVRva2VuIC0g0YLQvtC60LXQvSDQtNC70Y8g0LLQvtGB0YHRgtCw0L3QvtCy0LvQtdC90LjRjyDQv9GA0L7QsNC70Y9cblx0XHQgKiBAcHJvcGVydHkge3N0cmluZ3xudWxsfSBwYXNzd29yZCAtINC90L7QstGL0Lkg0L/QsNGA0L7Qu9GMINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuXHRcdCAqL1xuXG5cdFx0LyoqXG5cdFx0ICog0KHRgtGA0YPQutGC0YPRgNCwINGC0L7QutC10L3QsCDQtNC70Y8g0L7RgtC/0YDQsNCy0LrQuCBTTVNcblx0XHQgKi9cblx0XHRyZWdUb2tlbjoge1xuXHRcdFx0dGFyZ2V0OiAndXNlci9wYXNzd29yZC9yZXN0b3JlJyxcblx0XHRcdGZvcm1hdDogJ2RlZmF1bHQnXG5cdFx0fSxcblxuXHRcdHVybHM6IHtcblx0XHRcdG9wdGlvbnM6ICd1c2VyL3Bhc3N3b3JkL3Jlc3RvcmUnLFxuXHRcdFx0c2VuZDogJ3Rva2Vucy9zZW5kJyxcblx0XHRcdGNoZWNrOiAndG9rZW5zL2NoZWNrJyxcblx0XHRcdGNoYW5nZVBhc3N3b3JkOiAndXNlci9wYXNzd29yZC9yZXN0b3JlL2NvbmZpcm0nXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCe0L/QuNGB0LDQvdC40LUg0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9GFINC/0L7Qu9C10Lkg0LTQu9GPINC60LDQttC00L7Qs9C+INC80LXRgtC+0LTQsFxuXHRcdCAqL1xuXHRcdHJlcXVpcmVkOiB7XG5cdFx0XHRnZXRPcHRpb25zOiBbJ2VtYWlsJ10sXG5cdFx0XHRzZW5kVG9rZW46IFsnYnknLCAndG9rZW4nXSxcblx0XHRcdGNoZWNrVG9rZW46IFsnYnknLCAndG9rZW4nLCAndmFsdWUnXSxcblx0XHRcdGNoYW5nZVBhc3N3b3JkOiBbJ3Jlc3RvcmVUb2tlbicsICdwYXNzd29yZCddXG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCc0LXRgtC+0LQg0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdGCINC+0YLQstC10YIg0L7RgiDRgdC10YDQstC10YDQsCDQuCDQstC+0LfQstGA0LDRidCw0LXRgiDQtdCz0L4g0LIg0L3Rg9C20L3QviDRhNC+0YDQvNCw0YLQtVxuXHRcdCAqIEBwYXJhbSB7b2JqZWN0fSByZXMgLSDQvtGC0LLQtdGCXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcmV0dXJucyB7b2JqZWN0fVxuXHRcdCAqL1xuXHRcdF9wcm9jZXNzUmVzcG9uc2U6IGZ1bmN0aW9uIChyZXMpIHtcblx0XHRcdHJldHVybiByZXMuYm9keTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICog0JzQtdGC0L7QtCDQv9C+0LvRg9GH0LDQtdGCINC+0L/RhtC40Lgg0LLQvtGB0YLQsNC90L7QstC70LXQvdC40Y8g0L/QsNGA0L7Qu9GPXG5cdFx0ICogQHBhcmFtIHtQYXNzd29yZFJlY292ZXJ5UGFyYW1zfSBwYXJhbXNcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9nZXRPcHRpb25zOiBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdFx0XHRyZXR1cm4gUlBDLmNhbGwodGhpcy51cmxzLm9wdGlvbnMsIHsgZW1haWw6IHBhcmFtcy5lbWFpbCB9KS50aGVuKHRoaXMuX3Byb2Nlc3NSZXNwb25zZS5iaW5kKHRoaXMpKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICog0JzQtdGC0L7QtCDQvtGC0L/RgNCw0LLQu9GP0LXRgiDRgtC+0LrQtdC9INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjiDQvdCwINGC0LXQu9C10YTQvtC9XG5cdFx0ICogQHBhcmFtIHtQYXNzd29yZFJlY292ZXJ5UGFyYW1zfSBwYXJhbXNcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9zZW5kVG9rZW46IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0XHRcdHZhciByZWdUb2tlbiA9IHRoaXMucmVnVG9rZW47XG5cdFx0XHR2YXIgb3B0aW9ucztcblxuXHRcdFx0cmVnVG9rZW4udHJhbnNwb3J0ID0gcGFyYW1zLmJ5O1xuXHRcdFx0cmVnVG9rZW4uaWQgPSBwYXJhbXMudG9rZW47XG5cdFx0XHRyZWdUb2tlbi5hZGRyZXNzID0gcGFyYW1zLmFkZHJlc3M7XG5cdFx0XHRyZWdUb2tlbi5pbmRleCA9IHBhcmFtcy5pbmRleDtcblxuXHRcdFx0b3B0aW9ucyA9IHtcblx0XHRcdFx0ZW1haWw6IHBhcmFtcy5lbWFpbCxcblx0XHRcdFx0Y2FwY2hhOiBwYXJhbXMuY2FwdGNoYSxcblx0XHRcdFx0cmVnX3Rva2VuOiBKU09OLnN0cmluZ2lmeShyZWdUb2tlbilcblx0XHRcdH07XG5cblx0XHRcdGlmIChwYXJhbXMucmVkaXJlY3RVcmkpIHtcblx0XHRcdFx0b3B0aW9ucy5yZWRpcmVjdF91cmkgPSBwYXJhbXMucmVkaXJlY3RVcmk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBSUEMuY2FsbCh0aGlzLnVybHMuc2VuZCwgb3B0aW9ucykudGhlbih0aGlzLl9wcm9jZXNzUmVzcG9uc2UuYmluZCh0aGlzKSk7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCc0LXRgtC+0LQg0L/RgNC+0LLQtdGA0Y/QtdGCINGC0L7QutC10L0g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPXG5cdFx0ICogQHBhcmFtIHtQYXNzd29yZFJlY292ZXJ5UGFyYW1zfSBwYXJhbXNcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9jaGVja1Rva2VuOiBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdFx0XHR2YXIgcmVnVG9rZW4gPSB0aGlzLnJlZ1Rva2VuO1xuXG5cdFx0XHRyZWdUb2tlbi50cmFuc3BvcnQgPSBwYXJhbXMuYnk7XG5cdFx0XHRyZWdUb2tlbi5pZCA9IHBhcmFtcy50b2tlbjtcblx0XHRcdHJlZ1Rva2VuLnZhbHVlID0gcGFyYW1zLnZhbHVlO1xuXG5cdFx0XHRpZiAocGFyYW1zLmNhcHRjaGEpIHtcblx0XHRcdFx0cmVnVG9rZW4uY2FwdGNoYSA9IHBhcmFtcy5jYXB0Y2hhO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gUlBDLmNhbGwodGhpcy51cmxzLmNoZWNrLCB7XG5cdFx0XHRcdGVtYWlsOiBwYXJhbXMuZW1haWwsXG5cdFx0XHRcdHJlZ190b2tlbjogSlNPTi5zdHJpbmdpZnkocmVnVG9rZW4pXG5cdFx0XHR9KS50aGVuKHRoaXMuX3Byb2Nlc3NSZXNwb25zZS5iaW5kKHRoaXMpKTtcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICog0JzQtdGC0L7QtCDQvNC10L3Rj9GC0LUg0L/QsNGA0L7Qu9GMINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRj1xuXHRcdCAqIEBwYXJhbSB7UGFzc3dvcmRSZWNvdmVyeVBhcmFtc30gcGFyYW1zXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRfY2hhbmdlUGFzc3dvcmQ6IGZ1bmN0aW9uIChwYXJhbXMpIHtcblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRlbWFpbDogcGFyYW1zLmVtYWlsLFxuXHRcdFx0XHRyZWdfdG9rZW5fY2hlY2s6IHBhcmFtcy5yZXN0b3JlVG9rZW4sXG5cdFx0XHRcdHBhc3N3b3JkOiBwYXJhbXMucGFzc3dvcmRcblx0XHRcdH07XG5cblx0XHRcdGlmIChwYXJhbXMucmVkaXJlY3RVcmkpIHtcblx0XHRcdFx0b3B0aW9ucy5yZWRpcmVjdF91cmkgPSBwYXJhbXMucmVkaXJlY3RVcmk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBSUEMuY2FsbCh0aGlzLnVybHMuY2hhbmdlUGFzc3dvcmQsIG9wdGlvbnMpLnRoZW4odGhpcy5fcHJvY2Vzc1Jlc3BvbnNlLmJpbmQodGhpcykpO1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDQnNC10YLQvtC0INCy0LDQu9C40LTQuNGA0YPQtdGCINC/0LXRgNC10LTQsNC90L3Ri9C1INC/0LDRgNCw0LzQtdGC0YDRi1xuXHRcdCAqIEBwYXJhbSBwYXJhbXNcblx0XHQgKiBAcmV0dXJuIHtPYmplY3R8bnVsbH0gLSDQtdGB0LvQuCDQtdGB0YLRjCDQvtGI0LjQsdC60LgsINGC0L4g0LLQtdGA0L3QtdGCINGB0L/QuNC+0YHQuiB7ZW1haWw6ICdyZXF1aXJlZCcgLi4uIH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF92YWxpZGF0ZTogZnVuY3Rpb24gKHBhcmFtcykge1xuXHRcdFx0dmFyIGVycm9ycyA9IHt9LFxuXHRcdFx0XHRyZXF1aXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5yZXF1aXJlZFtwYXJhbXMubWV0aG9kXSkpIHx8IFtdO1xuXG5cdFx0XHRyZXF1aXJlZCA9IHJlcXVpcmVkLmZpbHRlcihmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdHJldHVybiAhcGFyYW1zLmhhc093blByb3BlcnR5KGtleSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0aWYgKCFyZXF1aXJlZC5sZW5ndGgpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdHJlcXVpcmVkLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdFx0XHRlcnJvcnNba2V5XSA9ICdyZXF1aXJlZCc7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGVycm9ycztcblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICog0JvQvtCz0LjQutCwINC00LXQudGB0YLQstC40Y8gXCLQktC+0YHRgdGC0LDQvdC+0LLQuNGC0YxcIlxuXHRcdCAqIEBwYXJhbSB7UGFzc3dvcmRSZWNvdmVyeVBhcmFtc30gcGFyYW1zXG5cdFx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0b3BlcmF0aW9uOiBmdW5jdGlvbiBvcGVyYXRpb24ocGFyYW1zKSB7XG5cdFx0XHR2YXIgZXJyb3JzLFxuXHRcdFx0XHRtZXRob2Q7XG5cblx0XHRcdGlmICghcGFyYW1zLm1ldGhvZCkge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3Qoe21ldGhvZDogJ3JlcXVpcmVkJ30pO1xuXHRcdFx0fVxuXG5cdFx0XHRtZXRob2QgPSB0aGlzWydfJyArIHBhcmFtcy5tZXRob2RdO1xuXG5cdFx0XHRpZiAodHlwZW9mIG1ldGhvZCAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3Qoe21ldGhvZDogJ2ludmFsaWQnfSk7XG5cdFx0XHR9XG5cblx0XHRcdGVycm9ycyA9IHRoaXMuX3ZhbGlkYXRlKHBhcmFtcyk7XG5cblx0XHRcdGlmIChlcnJvcnMpIHtcblx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9ycyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtZXRob2QuY2FsbCh0aGlzLCBwYXJhbXMpO1xuXHRcdH1cblxuXHR9KTtcblxuXHQvKipcblx0ICog0K3RgtCw0L/RiyDQstC+0YHRgdGC0LDQvdC+0LLQu9C10L3QuNGPINC/0LDRgNC+0LvRj1xuXHQgKiBAdHlwZSB7e09QVElPTlM6IG51bWJlciwgU0VORDogbnVtYmVyLCBDSEVDSzogbnVtYmVyfX1cblx0ICovXG5cdFBhc3N3b3JkUmVjb3ZlcnkubWV0aG9kcyA9ICB7XG5cdFx0T1BUSU9OUzogJ2dldE9wdGlvbnMnLCAvLyDQv9C+0LvRg9GH0LjRgtGMINC+0L/RhtC40Lgg0LLQvtGB0YHRgtCw0L3QvtCy0LvQtdC90LjRj1xuXHRcdFNFTkQ6ICdzZW5kVG9rZW4nLCAvLyDQvtGC0L/RgNCw0LLQuNGC0Ywg0YLQvtC60LXQvVxuXHRcdENIRUNLOiAnY2hlY2tUb2tlbicsIC8vINC/0YDQvtCy0LXRgNC40YLRjCDQvtGC0L/RgNCw0LLQu9C10L3QvdGL0Lkg0YLQvtC60LXQvVxuXHRcdENIQU5HRV9QQVNTV09SRDogJ2NoYW5nZVBhc3N3b3JkJyAvLyDQuNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFxuXHR9O1xuXG5cdC8qKlxuXHQgKiDQktC40LTRiyDRgtGA0LDQvdGB0L/QvtGA0YLQsCwg0YfQtdGA0LXQtyDQutC+0YLQvtGA0YvQtSDQvNC+0LbQvdC+INC00L7RgdGC0LDQstC40YLRjCDQuCDQv9GA0L7QstC10YDQuNGC0Ywg0YLQvtC60LXQvVxuXHQgKiBAdHlwZSB7e1BIT05FOiBzdHJpbmd9fVxuXHQgKi9cblx0UGFzc3dvcmRSZWNvdmVyeS50cmFuc3BvcnRzID0ge1xuXHRcdFBIT05FOiAncGhvbmUnXG5cdH07XG5cblx0Ly8gRXhwb3J0XG5cdEFjdGlvbi5yZWdpc3RlcignbWFpbC5QYXNzd29yZFJlY292ZXJ5JywgUGFzc3dvcmRSZWNvdmVyeSk7XG5cdFBhc3N3b3JkUmVjb3ZlcnkudmVyc2lvbiA9ICcwLjIuMic7XG5cdHJldHVybiBQYXNzd29yZFJlY292ZXJ5O1xufSk7XG4iLCJkZWZpbmUoJ0FjdGlvbicsIFtcblx0J2xvZ2dlcicsXG5cdCdpbmhlcml0Jyxcblx0J1Byb21pc2UnLFxuXHQnRW1pdHRlcicsXG5cdCdNb2RlbCcsXG5cdCdNb2RlbC5MaXN0J1xuXSwgZnVuY3Rpb24gKFxuXHQvKiogbG9nZ2VyICovbG9nZ2VyLFxuXHQvKiogaW5oZXJpdCAqL2luaGVyaXQsXG5cdC8qKiBQcm9taXNlICovUHJvbWlzZSxcblx0LyoqIEVtaXR0ZXIgKi9FbWl0dGVyLFxuXHQvKiogTW9kZWwgKi9Nb2RlbCxcblx0LyoqIE1vZGVsLkxpc3QgKi9MaXN0XG4pIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cblx0Ly8g0J/QvtC70YPRh9C40YLRjCDQv9Cw0YDQsNC80LXRgtGA0Ysg0LTQu9GPINC70L7Qs9C40YDQvtCy0LDQvdC40Y9cblx0dmFyIF9nZXRMb2dQYXJhbXMgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHR2YXIgaSxcblx0XHRcdHJlc3VsdCA9IHZhbHVlO1xuXG5cdFx0aWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRpZiAodmFsdWUudG9Mb2dKU09OKSB7XG5cdFx0XHRcdHJlc3VsdCA9IHZhbHVlLnRvTG9nSlNPTigpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBNb2RlbCkge1xuXHRcdFx0XHRyZXN1bHQgPSB2YWx1ZS5pZDtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgTGlzdCkge1xuXHRcdFx0XHRyZXN1bHQgPSB2YWx1ZS5wbHVjaygnaWQnKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdGkgPSB2YWx1ZS5sZW5ndGg7XG5cdFx0XHRcdHJlc3VsdCA9IFtdO1xuXG5cdFx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0XHRyZXN1bHRbaV0gPSBfZ2V0TG9nUGFyYW1zKHZhbHVlW2ldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0XHRPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0XHRcdFx0cmVzdWx0W2tleV0gPSBfZ2V0TG9nUGFyYW1zKHZhbHVlW2tleV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9O1xuXG5cblxuXHQvKipcblx0ICog0JTQtdC50YHRgtCy0LjQtS5cblx0ICogQGFic3RyYWN0XG5cdCAqIEBjbGFzcyBBY3Rpb25cblx0ICogQGNvbnN0cnVjdHMgQWN0aW9uXG5cdCAqIEBleHRlbmRzIEVtaXR0ZXJcblx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdCAqL1xuXHR2YXIgQWN0aW9uID0gaW5oZXJpdChFbWl0dGVyLCAvKiogQGxlbmRzIEFjdGlvbiMgKi97XG5cdFx0LyoqXG5cdFx0ICog0JjQvNGPINC00LXQudGB0YLQstC40Y9cblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdG5hbWU6ICdhYnN0cmFjdCcsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCa0L7QvdGB0YLRgNGD0LrRgtC+0YBcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9ICBwYXJhbXMgICDQv9Cw0YDQsNC80LXRgtGA0Ytcblx0XHQgKiBAcGFyYW0gIHtPYmplY3R9ICBvcHRpb25zICDQvtC/0YbQuNC4XG5cdFx0ICogQGNvbnN0cnVjdG9yXG5cdFx0ICovXG5cdFx0Y29uc3RydWN0b3I6IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMpIHtcblx0XHRcdC8qKlxuXHRcdFx0ICog0J/QsNGA0LDQvNC10YLRgNGLXG5cdFx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLnBhcmFtcyA9IHBhcmFtcztcblxuXG5cdFx0XHQvKipcblx0XHRcdCAqINCe0L/RhtC40Lhcblx0XHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiDQn9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C1INC00LDQvdC90YvQtVxuXHRcdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLl9kYXRhO1xuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICog0KHRgtCw0YLRg9GBINC60L7QvNCw0L3QtNGLIMKr0LIg0YDQsNCx0L7RgtC14omgXG5cdFx0XHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5wZW5kaW5nID0gZmFsc2U7XG5cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiDQodGC0LDRgtGD0YEg0LLRi9C/0L7Qu9C90LXQvdC40Y8g0LTQtdC50YHRgtCy0LjRj1xuXHRcdFx0ICogQHR5cGUgeyp9XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuc3RhdHVzO1xuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICog0J7RiNC40LHQutCwINC/0YDQuCDQstGL0L/QvtC70L3QtdC90LjQuFxuXHRcdFx0ICogQHR5cGUgeyp9XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMuZXJyb3IgPSBudWxsO1xuXG5cblx0XHRcdC8qKlxuXHRcdFx0ICog0KDQtdC30YPQu9GM0YLQsNGCINGD0YHQv9C10YjQvdC+0LPQviDQstGL0L/QvtC70L3QtdC90LjRj1xuXHRcdFx0ICogQHR5cGUgeyp9XG5cdFx0XHQgKi9cblx0XHRcdHRoaXMucmVzdWx0ID0gbnVsbDtcblxuXG5cdFx0XHRyZXR1cm4gb3B0aW9ucy5sb2dTY29wZS5jYWxsKHRoaXMuX2V4ZWN1dGUuYmluZCh0aGlzKSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JLRi9C/0L7Qu9C90LjRgtGMINC00LXQudGB0YLQstC40LVcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEByZXR1cm4ge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0X2V4ZWN1dGU6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXMsXG5cdFx0XHRcdHBhcmFtcyA9IF90aGlzLnBhcmFtcyxcblx0XHRcdFx0b3B0aW9ucyA9IF90aGlzLm9wdGlvbnMsXG5cdFx0XHRcdGxvZ1Njb3BlID0gb3B0aW9ucy5sb2dTY29wZTtcblxuXG5cdFx0XHQvLyDCq9Cf0L7QtdGF0LDQu9C4IcK7XG5cdFx0XHRfdGhpcy5wZW5kaW5nID0gdHJ1ZTtcblxuXHRcdFx0KCFvcHRpb25zLnNpbGVudCkgJiYgQWN0aW9uLnRyaWdnZXIoJ3N0YXJ0JywgW190aGlzLCBwYXJhbXMsIG9wdGlvbnNdKTtcblxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdFx0XHRcdC8vINCR0LXQt9C+0L/QsNGB0L3QvtC1INCy0YvQv9C+0LvQvdC10L3QuNC1INCy0L3Rg9GC0YDQuCBgUHJvbWlzZWBcblx0XHRcdFx0cmVzb2x2ZShfdGhpcy5wcmVwYXJlKHBhcmFtcywgb3B0aW9ucykpO1xuXHRcdFx0fS5sb2dnZXIoX3RoaXMubmFtZSArICcucHJlcGFyZScpKS50aGVuKFxuXHRcdFx0XHQvLyDQlNCw0L3QvdGL0LUg0YPRgdC/0LXRiNC90L4g0L/QvtC00LPQvtGC0L7QstC70LXQvdGLXG5cdFx0XHRcdGZ1bmN0aW9uIChkYXRhKSB7XG5cdFx0XHRcdFx0aWYgKGRhdGEgPT09IG51bGwpIHtcblx0XHRcdFx0XHRcdC8vINC90YPQttC90L4g0LLRi9GF0L7QtNC40YLRjFxuXHRcdFx0XHRcdFx0bG9nU2NvcGUuYWRkKCdvcGVyYXRpb246ZXhpdCcpO1xuXHRcdFx0XHRcdFx0X3RoaXMuX3Jlc29sdmUoJ2RvbmUnLCBkYXRhKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkYXRhID09PSB2b2lkIDApIHtcblx0XHRcdFx0XHRcdC8vINC40YHQv9C+0LvRjNC30YPQtdC8INC40YHRhdC+0LTQvdGL0LUg0LTQsNC90L3Ri9C1XG5cdFx0XHRcdFx0XHRkYXRhID0gcGFyYW1zO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdF90aGlzLl9kYXRhID0gZGF0YTtcblxuXHRcdFx0XHRcdC8vIMKr0J7Qv9C10YDQsNGG0LjRjyHCu1xuXHRcdFx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuXHRcdFx0XHRcdFx0X3RoaXMudHJpZ2dlcignb3BlcmF0aW9uJywgW2RhdGEsIHBhcmFtcywgb3B0aW9uc10pO1xuXHRcdFx0XHRcdFx0cmVzb2x2ZShfdGhpcy5vcGVyYXRpb24oZGF0YSwgcGFyYW1zLCBvcHRpb25zKSk7XG5cdFx0XHRcdFx0fS5sb2dnZXIoX3RoaXMubmFtZSArICcub3BlcmF0aW9uJykpLnRoZW4oXG5cdFx0XHRcdFx0XHQvLyDQrdGC0L4g0YPRgdC/0LXRhSFcblx0XHRcdFx0XHRcdGZ1bmN0aW9uIChyZXN1bHQpIHtcblx0XHRcdFx0XHRcdFx0bG9nU2NvcGUuYWRkKCdvcGVyYXRpb246ZG9uZScpO1xuXHRcdFx0XHRcdFx0XHRfdGhpcy5fcmVzb2x2ZSgnZG9uZScsIHJlc3VsdCk7XG5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIF90aGlzO1xuXHRcdFx0XHRcdFx0fSxcblxuXHRcdFx0XHRcdFx0Ly8g0J7RiNC40LHQutCwLCDQvdGD0LbQvdC+INC+0YLQutCw0YLRi9Cy0LDRgtGMXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0bG9nU2NvcGUuYWRkKCdvcGVyYXRpb246ZmFpbCcsIGVycm9yKTtcblxuXHRcdFx0XHRcdFx0XHRfdGhpcy5yb2xsYmFjaygpO1xuXHRcdFx0XHRcdFx0XHRfdGhpcy5fcmVzb2x2ZSgnZmFpbCcsIGVycm9yKTtcblxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoX3RoaXMpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8g0J7RiNC40LHQutCwINC/0YDQuCDQv9C+0LTQs9C+0YLQvtCy0LrQtSDQtNCw0L3QvdGL0YVcblx0XHRcdFx0ZnVuY3Rpb24gKGVycm9yKSB7XG5cdFx0XHRcdFx0bG9nU2NvcGUuYWRkKCdwcmVwYXJlOmZhaWwnLCBlcnJvcik7XG5cdFx0XHRcdFx0X3RoaXMuX3Jlc29sdmUoJ2ZhaWwnLCBlcnJvcik7XG5cblx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoX3RoaXMpO1xuXHRcdFx0XHR9XG5cdFx0XHQpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0YLQvNC10L3QsCDQtNC10LnRgdGC0LLQuNGPXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqIEByZXR1cm4ge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0dW5kbzogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdFx0YXJncyA9IFtfdGhpcy5fZGF0YSwgX3RoaXMucGFyYW1zLCBfdGhpcy5vcHRpb25zXSxcblx0XHRcdFx0cHJvbWlzZSA9IF90aGlzLl91bmRvUHJvbWlzZSxcblx0XHRcdFx0bG9nU2NvcGU7XG5cblx0XHRcdGlmICghcHJvbWlzZSkge1xuXHRcdFx0XHRsb2dTY29wZSA9IGxvZ2dlci5zY29wZSgnW1snICsgX3RoaXMubmFtZSArICcudW5kb11dJyk7XG5cblx0XHRcdFx0X3RoaXMuX3VuZG9Qcm9taXNlID0gcHJvbWlzZSA9IG5ldyBQcm9taXNlKGxvZ1Njb3BlLndyYXAoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdFx0XHRfdGhpcy50cmlnZ2VyLmFwcGx5KF90aGlzLCBbJ3VuZG8nXS5jb25jYXQoYXJncykpO1xuXHRcdFx0XHRcdCghX3RoaXMub3B0aW9ucy5zaWxlbnQpICYmIEFjdGlvbi50cmlnZ2VyLmFwcGx5KF90aGlzLCBbJ3VuZG8nLCBfdGhpc10uY29uY2F0KGFyZ3MpKTtcblxuXHRcdFx0XHRcdHJlc29sdmUoX3RoaXMudW5kb09wZXJhdGlvbi5hcHBseShfdGhpcywgYXJncykpO1xuXHRcdFx0XHR9KSk7XG5cblx0XHRcdFx0cHJvbWlzZS50aGVuKFxuXHRcdFx0XHRcdF90aGlzLl9yZXNvbHZlVW5kby5iaW5kKF90aGlzLCBsb2dTY29wZSwgdHJ1ZSksXG5cdFx0XHRcdFx0X3RoaXMuX3Jlc29sdmVVbmRvLmJpbmQoX3RoaXMsIGxvZ1Njb3BlLCBmYWxzZSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J/QvtC00LPQvtGC0L7QstC40YLRjCDQtNCw0L3QvdGL0LUg0LTQu9GPINCy0YvQv9C+0LvQvdC10L3QuNGPINC00LXQudGB0YLQstC40Y8uXG5cdFx0ICog0JXRgdC70Lgg0LLQtdGA0L3Rg9GC0YwgYG51bGxgLCDQtNC10LnRgdGC0LLQuNC1INGB0YDQsNC30YMg0L/QtdGA0LXQudC00LXRgiDQsiDRgdC+0YHRgtC+0Y/QvdC40LUgYHJlc29sdmVkYCDQsdC10Lcg0LLRi9C/0L7Qu9C90LXQvdC40Y8gYG9wZXJhdGlvbmAuXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIHBhcmFtc1xuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIG9wdGlvbnNcblx0XHQgKi9cblx0XHRwcmVwYXJlOiBmdW5jdGlvbiAocGFyYW1zLCBvcHRpb25zKSB7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JLRi9C/0L7Qu9C90Y/QtdC80LDRjyDQvtC/0LXRgNCw0YbQuNGPLCDQtdGB0LvQuCBgcHJlcGFyZWAg0L3QtSDQstC10YDQvdGD0LsgYG51bGxgXG5cdFx0ICogQHByb3RlY3RlZFxuXHRcdCAqIEBwYXJhbSAgeyp9ICAgICAgIGRhdGEgINC00LDQvdC90YvQtSDQv9C+0LTQs9C+0YLQvtCy0LvQtdC90L3Ri9C1INCyIGBwcmVwYXJlYCAo0LjQu9C4INGC0LXQttC1IGBwYXJhbXNgKVxuXHRcdCAqIEBwYXJhbSAge29iamVjdH0gIHBhcmFtc1xuXHRcdCAqIEBwYXJhbSAge29iamVjdH0gIG9wdGlvbnNcblx0XHQgKi9cblx0XHRvcGVyYXRpb246IGZ1bmN0aW9uIChkYXRhLCBwYXJhbXMsIG9wdGlvbnMpIHtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQntCx0YDQsNGC0L3QsNGPINC+0L/QtdGA0LDRhtC40Y9cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHBhcmFtICB7Kn0gICAgICAgZGF0YVxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIHBhcmFtc1xuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIG9wdGlvbnNcblx0XHQgKi9cblx0XHR1bmRvT3BlcmF0aW9uOiBmdW5jdGlvbiAoZGF0YSwgcGFyYW1zLCBvcHRpb25zKSB7XG5cdFx0XHRsb2dnZXIuYWRkKCdOT1RfSU1QTEVNRU5URUQnKTtcblx0XHRcdHRocm93ICdOT1RfSU1QTEVNRU5URUQnO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0L/RgNC10LTQsNGG0LjRjyDQvtGC0LrQsNGC0LrQuCDQuNC30LzQtdC90LXQvdC40Llcblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICogQHBhcmFtICB7Kn0gICAgICAgZGF0YVxuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIHBhcmFtc1xuXHRcdCAqIEBwYXJhbSAge09iamVjdH0gIG9wdGlvbnNcblx0XHQgKi9cblx0XHRyb2xsYmFja09wZXJhdGlvbjogZnVuY3Rpb24gKGRhdGEsIHBhcmFtcywgb3B0aW9ucykge1xuXHRcdFx0bG9nZ2VyLmFkZCgnTk9UX0lNUExFTUVOVEVEJyk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7RgtC60LDRgtGL0LLQsNC10Lwg0LTQtdC50YHRgtCy0LjQtSDQv9GA0Lgg0L7RiNC40LHQutC1ICjQvdC1INC/0YPRgtCw0YLRjCDRgSBgdW5kb2ApXG5cdFx0ICogQHB1YmxpY1xuXHRcdCAqL1xuXHRcdHJvbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0XHRvcHRpb25zID0gX3RoaXMub3B0aW9ucztcblxuXHRcdFx0b3B0aW9ucy5sb2dTY29wZS5jYWxsKCdbWycgKyBfdGhpcy5uYW1lICsgJy5yb2xsYmFja11dJywgZnVuY3Rpb24gKCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdF90aGlzLnJvbGxiYWNrT3BlcmF0aW9uKF90aGlzLl9kYXRhLCBfdGhpcy5wYXJhbXMsIG9wdGlvbnMpO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRsb2dnZXIuYWRkKCdlcnJvcicsIGVycik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCg0LDQt9GA0LXRiNC40YLRjCDQtNC10LnRgdGC0LLQuNC1XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0gIHtzdHJpbmd9IHN0YXR1c1xuXHRcdCAqIEBwYXJhbSAgeyp9ICAgICAgcmVzdWx0XG5cdFx0ICovXG5cdFx0X3Jlc29sdmU6IGZ1bmN0aW9uIChzdGF0dXMsIHJlc3VsdCkge1xuXHRcdFx0dGhpcy5wZW5kaW5nID0gZmFsc2U7XG5cdFx0XHR0aGlzLnN0YXR1cyA9IHN0YXR1cztcblx0XHRcdHRoaXNbc3RhdHVzID09ICdkb25lJyA/ICdyZXN1bHQnIDogJ2Vycm9yJ10gPSByZXN1bHQ7XG5cblx0XHRcdHRoaXMudHJpZ2dlcihzdGF0dXMsIHJlc3VsdCk7XG5cdFx0XHR0aGlzLnRyaWdnZXIoJ2NvbXBsZXRlJywgW3RoaXMsIHN0YXR1cywgcmVzdWx0XSk7XG5cblx0XHRcdGlmICghdGhpcy5vcHRpb25zLnNpbGVudCkge1xuXHRcdFx0XHRBY3Rpb24udHJpZ2dlcihzdGF0dXMsIFt0aGlzLCByZXN1bHRdKTtcblx0XHRcdFx0QWN0aW9uLnRyaWdnZXIoJ2NvbXBsZXRlJywgW3RoaXMsIHN0YXR1cywgcmVzdWx0XSk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KDQsNC30YDQtdGI0LjRgtGMINCw0L3QvdGD0LvRj9GG0LjRjiDQtNC10LnRgdGC0LLQuNGPXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKiBAcGFyYW0gIHtsb2dnZXIuRW50cnl9IHVuZG9Mb2dTY29wZVxuXHRcdCAqIEBwYXJhbSAge2Jvb2xlYW59ICAgICAgc3RhdHVzXG5cdFx0ICogQHBhcmFtICB7Kn0gICAgICAgICAgICByZXN1bHRcblx0XHQgKi9cblx0XHRfcmVzb2x2ZVVuZG86IGZ1bmN0aW9uICh1bmRvTG9nU2NvcGUsIHN0YXR1cywgcmVzdWx0KSB7XG5cdFx0XHR2YXIgYXJncyA9IFt0aGlzLCBzdGF0dXMsIHJlc3VsdF07XG5cblx0XHRcdHVuZG9Mb2dTY29wZS5hZGQoJ3VuZG86JyArIChzdGF0dXMgPyAnZG9uZScgOiAnZmFpbCcpLCBzdGF0dXMgPyB2b2lkIDAgOiByZXN1bHQpO1xuXG5cdFx0XHR0aGlzLnRyaWdnZXIoJ3VuZG86Y29tcGxldGUnLCBhcmdzKTtcblx0XHRcdCghdGhpcy5vcHRpb25zLnNpbGVudCkgJiYgQWN0aW9uLnRyaWdnZXIoJ3VuZG86Y29tcGxldGUnLCBhcmdzKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQmNC30LvRg9GH0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjRj1xuXHRcdCAqIEBvdmVycmlkZVxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG5cdFx0ICogQHBhcmFtIHtBcnJheX0gIGFyZ3Ncblx0XHQgKi9cblx0XHRlbWl0OiBmdW5jdGlvbiAodHlwZSwgYXJncykge1xuXHRcdFx0dmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cblx0XHRcdGlmIChvcHRpb25zWydvbicgKyB0eXBlXSkge1xuXHRcdFx0XHRvcHRpb25zWydvbicgKyB0eXBlXS5hcHBseSh0aGlzLCBhcmdzKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIEVtaXR0ZXIuZm4uZW1pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdH1cblx0fSk7XG5cblxuXHQvLyDQn9C+0LTQvNC10YjQuNCy0LDQtdC8INGB0L7QsdGL0YLQuNGPXG5cdEVtaXR0ZXIuYXBwbHkoQWN0aW9uKTtcblxuXG5cdC8qKlxuXHQgKiDQoNC10LPQuNGB0YLRgNCw0YbQuNGPINC00LXQudGB0YLQstC40Y9cblx0ICogQHN0YXRpY1xuXHQgKiBAcGFyYW0gIHtzdHJpbmd9ICBuYW1lICAgICAgINC90LDQt9Cy0LDQvdC40LUg0LTQtdC50YHRgtCy0LjRj1xuXHQgKiBAcGFyYW0gIHtBY3Rpb259ICBOZXdBY3Rpb24gINC60LvQsNGB0YEg0LTQtdC50YHRgtCy0LjRj1xuXHQgKiBAbWVtYmVyT2YgQWN0aW9uXG5cdCAqL1xuXHRBY3Rpb24ucmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZSwgTmV3QWN0aW9uKSB7XG5cdFx0dGhpc1tuYW1lXSA9IE5ld0FjdGlvbjtcblxuXHRcdC8vINCt0LrRgdC/0L7RgNGC0LjRgNGD0LXQvCDQuNC80Y8g0LTQtdC50YHRgtCy0LjRj1xuXHRcdE5ld0FjdGlvbi5wcm90b3R5cGUubmFtZSA9IG5hbWU7XG5cblx0XHQvLyDQodGC0LDRgtC40YfQtdGB0LrQuNC5INC80LXRgtC+0LQg0LTQu9GPINCy0YvQv9C+0LvQvdC10L3QuNGPINC00LXQudGB0YLQstC40Y9cblx0XHROZXdBY3Rpb24uZXhlY3V0ZSA9IGZ1bmN0aW9uIChwYXJhbXMsIG9wdGlvbnMpIHtcblx0XHRcdHJldHVybiBBY3Rpb24uZXhlY3V0ZShuYW1lLCBwYXJhbXMsIG9wdGlvbnMpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4gTmV3QWN0aW9uO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCS0YvQv9C+0LvQvdC40YLRjCDQtNC10LnRgdGC0LLQuNC1LlxuXHQgKiBAc3RhdGljXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBuYW1lXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBbcGFyYW1zXVxuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgW29wdGlvbnNdXG5cdCAqIEByZXR1cm4gIHtQcm9taXNlfVxuXHQgKiBAbWVtYmVyT2YgQWN0aW9uXG5cdCAqL1xuXHRBY3Rpb24uZXhlY3V0ZSA9IGZ1bmN0aW9uIChuYW1lLCBwYXJhbXMsIG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdC8qKiBAdHlwZSB7QWN0aW9ufSovXG5cdFx0dmFyIFRhcmdldCA9IHRoaXNbbmFtZV0sXG5cdFx0XHRsb2dTY29wZSA9IChvcHRpb25zLmxvZ1Njb3BlIHx8IGxvZ2dlcikuc2NvcGUoJ1tbQWN0aW9uOicgKyBuYW1lICsgJ11dJywgX2dldExvZ1BhcmFtcyhwYXJhbXMpKSxcblx0XHRcdGVycm9yID0gJ0FDVElPTl9OT1RfRk9VTkQ6JyArIG5hbWU7XG5cblx0XHRpZiAoIVRhcmdldCkge1xuXHRcdFx0bG9nU2NvcGUuYWRkKGVycm9yKTtcblx0XHR9XG5cblx0XHRvcHRpb25zLmxvZ1Njb3BlID0gbG9nU2NvcGU7XG5cblx0XHRyZXR1cm4gVGFyZ2V0ID8gbmV3IFRhcmdldChwYXJhbXMsIG9wdGlvbnMpIDogUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCR0YDQvtGB0LDQtdC8INGB0L7QsdGL0YLQuNC1INGBINC+0LbQuNC00LDQvdC40LXQvCBQcm9taXNlLFxuXHQgKiDQtNC70Y8g0LLRi9C30L7QstCwIFVJICjQtNC40LDQu9C+0LPQvtCyLCDRhNC+0YDQvCkg0LIg0L/RgNC+0YbQtdGB0YHQtSDQstGL0L/QvtC70L3QtdC90LjRjyDQtNC10LnRgdGC0LLQuNGPLlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9ICB0eXBlXG5cdCAqIEBwYXJhbSAgeyp9ICAgICAgIFthcmdzXVxuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0QWN0aW9uLndhaXRGb3IgPSBmdW5jdGlvbiB3YWl0Rm9yKHR5cGUsIGFyZ3MpIHtcblx0XHR2YXIgZXZ0ID0gbmV3IEVtaXR0ZXIuRXZlbnQodHlwZSksXG5cdFx0XHRwcm9taXNlO1xuXG5cdFx0Ly8g0LfQsNGJ0LjRidCw0LXQvNGB0Y8g0L7RgiDQutGA0LjQstC+0LPQviDQsNGA0LPRg9C80LXQvdGC0LA7INC90LUg0LzQtdC90Y/QtdC8INCw0YDQs9GD0LzQtdC90YLRizsg0L/QtdGA0LLRi9C8INC/0LDRgNCw0LzQtdGC0YDQvtC8IC0g0YLQtdC60YPRidC40Lkg0Y3QutC30LXQvNC/0LvRj9GAIEFjdGlvblxuXHRcdEFjdGlvbi50cmlnZ2VyKGV2dCwgW10uY29uY2F0KHRoaXMsIGFyZ3MpKTtcblxuXHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdGlmIChldnQucmVzdWx0ICE9IG51bGwpIHtcblx0XHRcdGlmIChldnQucmVzdWx0LnRoZW4pIHsgLy8g0LXRgdC70Lgg0L/RgNC40LXRhdCw0LsgUHJvbWlzZSAo0LjQu9C4INGH0YLQviDRgtC+INC/0L7RhdC+0LbQtdC1KSAtINCy0L7Qt9Cy0YDQsNGJ0LDQtdC8INC10LPQvlxuXHRcdFx0XHRwcm9taXNlID0gZXZ0LnJlc3VsdDtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHByb21pc2UgPSBQcm9taXNlLmNhc3QoZXZ0LnJlc3VsdCk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgeyAvLyDQtdGB0LvQuCDQvdC10YIgLSDQstGB0ZEg0L/RgNC+0L/QsNC70L4sINC+0YLQutCw0LfQsNGC0YwhXG5cdFx0XHRwcm9taXNlID0gUHJvbWlzZS5yZWplY3QoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZTtcblx0fTtcblxuXG5cdC8vIEV4cG9ydFxuXHRBY3Rpb24udmVyc2lvbiA9ICcwLjIuMCc7XG5cdHJldHVybiBBY3Rpb247XG59KTtcbiIsImRlZmluZSgnTW9kZWwnLCBbXG5cdCdpbmhlcml0Jyxcblx0J2xvZ2dlcicsXG5cdCdyZXF1ZXN0Jyxcblx0J1Byb21pc2UnLFxuXHQnRW1pdHRlcicsXG5cdCdNb2RlbC5MaXN0Jyxcblx0J2NvbmZpZydcbl0sIGZ1bmN0aW9uIChcblx0LyoqIGZ1bmN0aW9uICovaW5oZXJpdCxcblx0LyoqIGxvZ2dlciAqL2xvZ2dlcixcblx0LyoqIHJlcXVlc3QgKi9yZXF1ZXN0LFxuXHQvKiogUHJvbWlzZSAqL1Byb21pc2UsXG5cdC8qKiBFbWl0dGVyICovRW1pdHRlcixcblx0LyoqIE1vZGVsLkxpc3QgKi9MaXN0LFxuXHQvKiogY29uZmlnICovY29uZmlnXG4pIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0dmFyIEV2ZW50ID0gRW1pdHRlci5FdmVudDtcblx0dmFyIF90b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXHR2YXIgX3N0cmluZ2lmeUpTT04gPSBKU09OLnN0cmluZ2lmeTtcblx0dmFyIF90eXBlID0gZnVuY3Rpb24gKHZhbCkge1xuXHRcdHJldHVybiB2YWwgPT09IG51bGwgPyAnbnVsbCcgOiBfdG9TdHJpbmcuY2FsbCh2YWwpLnRvTG93ZXJDYXNlKCkuc2xpY2UoOCwgLTEpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCb0L7QutCw0LvRjNC90YvQuSDQuNC00LXQvdGC0LjRhNC40LrRgtC+0YAg0LzQvtC00LXQu9C4XG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR2YXIgY2lkID0gMTtcblxuXG5cdC8qKlxuXHQgKiDQkdGL0YHRgtGA0L7QtSDQutC70L7QvdC40YDQvtCy0LDQvdC40LVcblx0ICogQHBhcmFtICAgeyp9ICBvYmpcblx0ICogQHBhcmFtICAge2Jvb2xlYW59IFtpc09iamVjdF1cblx0ICogQHJldHVybnMgeyp9XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBfY2xvbmUob2JqLCBpc09iamVjdCkge1xuXHRcdHZhciBpLCBrZXksXG5cdFx0XHRyZXMgPSBvYmo7XG5cblx0XHRpZiAoaXNPYmplY3QgIT09IHRydWUgJiYgb2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcblx0XHRcdGkgPSBvYmoubGVuZ3RoO1xuXHRcdFx0cmVzID0gW107XG5cdFx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHRcdHJlc1tpXSA9IF9jbG9uZShvYmpbaV0pO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAoaXNPYmplY3QgPT09IHRydWUgfHwgb2JqIGluc3RhbmNlb2YgT2JqZWN0KSB7XG5cdFx0XHRpZiAob2JqLnRvSlNPTiAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdHJlcyA9IG9iai50b0pTT04oKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlcyA9IHt9O1xuXHRcdFx0XHRmb3IgKGtleSBpbiBvYmopIHtcblx0XHRcdFx0XHRyZXNba2V5XSA9IF9jbG9uZShvYmpba2V5XSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzO1xuXHR9XG5cblx0Ly8g0KPRgdGC0LDQvdC+0LLQutCw0LjQt9C90LDRh9Cw0LvRjNC90YvRhSDQsNGC0YLRgNC40LHRg9GC0L7QslxuXHR2YXIgX3NldEluaXRpYWxBdHRyID0gZnVuY3Rpb24gKG1vZGVsLCBkZWZhdWx0cywgdGFyZ2V0LCBhYnNLZXksIGxvY2FsS2V5LCB2YWx1ZSkge1xuXHRcdGlmIChtb2RlbC5zY2hlbWVbYWJzS2V5XSA9PT0gJ3NldCcpIHtcblx0XHRcdHRhcmdldFtsb2NhbEtleV0gPSBfY2xvbmUoZGVmYXVsdHMsIHRydWUpO1xuXG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcblx0XHRcdFx0X3NldEluaXRpYWxBdHRyKFxuXHRcdFx0XHRcdG1vZGVsLFxuXHRcdFx0XHRcdGRlZmF1bHRzW2xvY2FsS2V5XSxcblx0XHRcdFx0XHR0YXJnZXRbbG9jYWxLZXldLFxuXHRcdFx0XHRcdGFic0tleSArICcuJyArIGxvY2FsS2V5LFxuXHRcdFx0XHRcdGtleSxcblx0XHRcdFx0XHR2YWx1ZVtrZXldXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmIChtb2RlbC5uZXN0ZWQuaGFzT3duUHJvcGVydHkoYWJzS2V5KSkge1xuXHRcdFx0dGFyZ2V0W2xvY2FsS2V5XSA9IG5ldyBtb2RlbC5uZXN0ZWRbYWJzS2V5XSh2YWx1ZSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhcmdldFtsb2NhbEtleV0gPSB2YWx1ZTtcblx0XHR9XG5cdH07XG5cblx0Ly8g0KPRgdGC0LDQvdC+0LLQutCwINCw0YLRgtGA0LjQsdGD0YLQvtCyINGB0L7Qs9C70LDRgdC90L4g0YHRhdC10LzQtVxuXHR2YXIgX3NldEF0dHIgPSBmdW5jdGlvbiAobW9kZWwsIGFic0tleSwgYXR0ciwgbmV3VmFsdWUsIGNoYW5nZWQsIGNoYW5nZXMpIHtcblx0XHR2YXIgaWR4ID0gYWJzS2V5Lmxhc3RJbmRleE9mKCcuJyksXG5cdFx0XHRhdHRyaWJ1dGVzID0gbW9kZWwuYXR0cmlidXRlcyxcblx0XHRcdF9hdHRyaWJ1dGVzID0gbW9kZWwuX2F0dHJpYnV0ZXMsXG5cdFx0XHR2YWx1ZSA9IGF0dHJpYnV0ZXNbYXR0cl07XG5cblx0XHRpZiAoaWR4ICE9PSAtMSkge1xuXHRcdFx0YXR0ciA9IGFic0tleS5zdWJzdHIoaWR4ICsgMSk7XG5cdFx0XHR2YWx1ZSA9IG1vZGVsLmdldChhYnNLZXkpO1xuXHRcdH1cblxuXHRcdGlmIChtb2RlbC5uZXN0ZWRbYWJzS2V5XSAhPT0gdm9pZCAwKSB7XG5cdFx0XHQvLyDQntCx0L3QvtCy0LvQtdC90LjQtSDQstC70L7QttC10L3QvdC+0Lkg0LzQvtC00LXQu9C4INC40LvQuCDRgdC/0LjRgdC60LBcblx0XHRcdG1vZGVsLmdldChhYnNLZXkpLnNldChuZXdWYWx1ZSwge3Jlc2V0OiB0cnVlfSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKG1vZGVsLnNjaGVtZVthYnNLZXldID09PSAnc2V0Jykge1xuXHRcdFx0Zm9yICh2YXIga2V5IGluIG5ld1ZhbHVlKSB7XG5cdFx0XHRcdF9zZXRBdHRyKG1vZGVsLCBhYnNLZXkgKyAnLicgKyBrZXksIGtleSwgbmV3VmFsdWVba2V5XSwgY2hhbmdlZCwgY2hhbmdlcyk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKF9ub3RFcXVhbCh2YWx1ZSwgbmV3VmFsdWUpKSB7XG5cdFx0XHRpZiAoYWJzS2V5ICE9PSBhdHRyKSB7XG5cdFx0XHRcdHZhciBjaGFpbiA9IGFic0tleS5zcGxpdCgnLicpLFxuXHRcdFx0XHRcdGxlbmd0aCA9IGNoYWluLmxlbmd0aCxcblx0XHRcdFx0XHRpID0gMCxcblx0XHRcdFx0XHRuID0gbGVuZ3RoIC0gMSxcblx0XHRcdFx0XHRwYXJ0LFxuXHRcdFx0XHRcdGRvdHRlZEtleTtcblxuXHRcdFx0XHRmb3IgKDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHRcdHBhcnQgPSBjaGFpbltpXTtcblxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzW3BhcnRdID09PSB2b2lkIDApIHtcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXNbcGFydF0gPSB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoX2F0dHJpYnV0ZXNbcGFydF0gPT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0X2F0dHJpYnV0ZXNbcGFydF0gPSB7fTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoY2hhbmdlZFtwYXJ0XSA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0XHRjaGFuZ2VkW3BhcnRdID0ge307XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0YXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNbcGFydF07XG5cdFx0XHRcdFx0X2F0dHJpYnV0ZXMgPSBfYXR0cmlidXRlc1twYXJ0XTtcblx0XHRcdFx0XHRjaGFuZ2VkID0gY2hhbmdlZFtwYXJ0XTtcblxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVzLnNldCAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0XHQvLyDQnNC+0LTQtdC70Ywg0LjQu9C4INCh0L/QuNGB0L7QulxuXHRcdFx0XHRcdFx0YXR0cmlidXRlcy5zZXQoY2hhaW4uc2xpY2UoaSArIDEpLmpvaW4oJy4nKSwgbmV3VmFsdWUsIHtyZXNldDogdHJ1ZX0pO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGRvdHRlZEtleSA9IGRvdHRlZEtleSA9PT0gdm9pZCAwID8gcGFydCA6IGRvdHRlZEtleSArICcuJyArIHBhcnQ7XG5cblx0XHRcdFx0XHRpZiAoY2hhbmdlcy5ieUtleVtkb3R0ZWRLZXldID09PSB2b2lkIDApIHtcblx0XHRcdFx0XHRcdGNoYW5nZXMuYnlLZXlbZG90dGVkS2V5XSA9IGF0dHJpYnV0ZXM7XG5cdFx0XHRcdFx0XHRjaGFuZ2VzLnB1c2goZG90dGVkS2V5KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0X2F0dHJpYnV0ZXNbYXR0cl0gPSB2YWx1ZTtcblx0XHRcdGNoYW5nZWRbYXR0cl0gPSBuZXdWYWx1ZTtcblx0XHRcdGF0dHJpYnV0ZXNbYXR0cl0gPSBuZXdWYWx1ZTtcblxuXHRcdFx0Y2hhbmdlcy5wdXNoKGFic0tleSk7XG5cdFx0XHRjaGFuZ2VzLmJ5S2V5W2Fic0tleV0gPSBuZXdWYWx1ZTtcblx0XHR9XG5cdH07XG5cblx0ZnVuY3Rpb24gX3NldE5lc3RlZENoYW5nZXMoLyoqIEFycmF5ICovbmVzdGVuZENoYW5nZXMsIC8qKiBBcnJheSAqL2NoYW5nZXMsIC8qKiBPYmplY3QgKi9jaGFuZ2VkKSB7XG5cdFx0dmFyIGkgPSBuZXN0ZW5kQ2hhbmdlcy5sZW5ndGg7XG5cblx0XHR3aGlsZSAoaS0tKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG5lc3RlbmRDaGFuZ2VzW2ldO1xuXHRcdFx0dmFyIGF0dHIgPSBpdGVtLmF0dHI7XG5cblx0XHRcdGNoYW5nZXMucHVzaChhdHRyKTtcblx0XHRcdGNoYW5nZXMuYnlLZXlbYXR0cl0gPSBpdGVtLmNoYW5nZXM7XG5cblx0XHRcdGlmIChhdHRyLmluZGV4T2YoJy4nKSA+IC0xKSB7XG5cdFx0XHRcdHZhciBjaGFpbiA9IGF0dHIuc3BsaXQoJy4nKTtcblx0XHRcdFx0dmFyIGVuZElkeCA9IGNoYWluLmxlbmd0aCAtIDE7XG5cdFx0XHRcdHZhciBfY2hhbmdlZCA9IGNoYW5nZWQ7XG5cblx0XHRcdFx0Zm9yICh2YXIgYyA9IDA7IGMgPCBlbmRJZHg7IGMrKykge1xuXHRcdFx0XHRcdGlmIChfY2hhbmdlZFtjaGFpbltjXV0gPT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0X2NoYW5nZWQgPSBfY2hhbmdlZFtjaGFpbltjXV0gPSB7fTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0X2NoYW5nZWQgPSBfY2hhbmdlZFtjaGFpbltjXV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0X2NoYW5nZWRbY2hhaW5bZW5kSWR4XV0gPSBpdGVtLmNoYW5nZWQ7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjaGFuZ2VkW2F0dHJdID0gaXRlbS5jaGFuZ2VkO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaW5uZXJDaGFuZ2VzID0gaXRlbS5jaGFuZ2VzO1xuXHRcdFx0Zm9yICh2YXIgaiA9IDAsIGpuID0gaW5uZXJDaGFuZ2VzLmxlbmd0aDsgaiA8IGpuOyBqKyspIHtcblx0XHRcdFx0dmFyIGlubmVyQXR0ciA9IGF0dHIgKyAnLicgKyBpbm5lckNoYW5nZXNbal07XG5cdFx0XHRcdGNoYW5nZXMucHVzaChpbm5lckF0dHIpO1xuXHRcdFx0XHRjaGFuZ2VzLmJ5S2V5W2lubmVyQXR0cl0gPSBpbm5lckNoYW5nZXMuYnlLZXlbaW5uZXJDaGFuZ2VzW2pdXTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICog0JHRi9GB0YLRgNC+0LUg0YHRgNCw0LLQvdC10L3QuNC1INC00LLRg9GFINC/0LXRgNC10LzQtdC90L3Ri9GFXG5cdCAqIEBwYXJhbSAgIHsqfSAgYWN0dWFsXG5cdCAqIEBwYXJhbSAgIHsqfSAgZXhwZWN0ZWRcblx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBfbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCkge1xuXHRcdGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIGV4cGVjdGVkVHlwZSA9IHR5cGVvZiBleHBlY3RlZDtcblxuXHRcdGlmIChleHBlY3RlZFR5cGUgPT09ICdzdHJpbmcnIHx8IGV4cGVjdGVkVHlwZSA9PT0gJ251bWJlcicgfHwgZXhwZWN0ZWRUeXBlID09PSAnYm9vbGVhbicpIHtcblx0XHRcdHJldHVybiBhY3R1YWwgIT0gZXhwZWN0ZWQ7XG5cdFx0fVxuXG5cdFx0Ly8g0JAg0YLQtdC/0LXRgNGMINC00LXRgtCw0LvRjNC90L4g0YDQsNGB0LzQvtGC0YDQuNC8XG5cdFx0dmFyIGlkeCwgYWN0dWFsVHlwZSA9IHR5cGVvZiBhY3R1YWw7XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChhY3R1YWxUeXBlID09PSBleHBlY3RlZFR5cGUpIHtcblx0XHRcdGlmIChhY3R1YWwgPT09IG51bGwpIHtcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAoZXhwZWN0ZWQgaW5zdGFuY2VvZiBBcnJheSkge1xuXHRcdFx0XHRpZHggPSBleHBlY3RlZC5sZW5ndGg7XG5cblx0XHRcdFx0aWYgKGFjdHVhbC5sZW5ndGggIT09IGlkeCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2hpbGUgKGlkeC0tKSB7XG5cdFx0XHRcdFx0aWYgKF9ub3RFcXVhbChhY3R1YWxbaWR4XSwgZXhwZWN0ZWRbaWR4XSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoZXhwZWN0ZWQgaW5zdGFuY2VvZiBPYmplY3QpIHtcblx0XHRcdFx0dmFyIGtleSxcblx0XHRcdFx0XHRrZXlzID0gT2JqZWN0LmtleXMoZXhwZWN0ZWQpXG5cdFx0XHRcdDtcblxuXHRcdFx0XHRpZHggPSBrZXlzLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAoT2JqZWN0LmtleXMoYWN0dWFsKS5sZW5ndGggIT09IGlkeCkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2hpbGUgKGlkeC0tKSB7XG5cdFx0XHRcdFx0a2V5ID0ga2V5c1tpZHhdO1xuXG5cdFx0XHRcdFx0aWYgKF9ub3RFcXVhbChhY3R1YWxba2V5XSwgZXhwZWN0ZWRba2V5XSkpIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXG5cdC8qKlxuXHQgKiDQodC+0LfQtNCw0LXRgtGMINCz0LXRgtGC0LXRgCDQtNC70Y8g0LDRgtGA0LjQsdGD0YLQvtCyXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgYXR0cnMgICAg0L3QsNC30LLQsNC90LjQtSDRgdCy0L7RgdGC0LLQsFxuXHQgKiBAcGFyYW0gICB7Ym9vbGVhbn0gIHJldEJvb2wgINCy0LXRgNC90YPRgtGMINCx0YPQu9C10LLQviDQt9C90LDRh9C10L3QuNC1XG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn1cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIF9jcmVhdGVHZXR0ZXIoYXR0cnMsIHJldEJvb2wpIHtcblx0XHR2YXIgY29kZSA9IChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLiQsXG5cdFx0XHRcdHNjaGVtZSA9IHRoaXMuc2NoZW1lLFxuXHRcdFx0XHRuZXN0ZWQgPSB0aGlzLm5lc3RlZCxcblx0XHRcdFx0cmV0VmFsID0gYXR0cmlidXRlc1tuYW1lID0gKHRoaXMuc2hvcnRjdXRzW25hbWVdIHx8IG5hbWUpXSxcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHRsZW5ndGhcblx0XHRcdDtcblxuXHRcdFx0KHRoaXMuX19iZWZvcmVHZXRfXyAhPT0gbnVsbCkgJiYgdGhpcy5fX2JlZm9yZUdldF9fKHRoaXMsIG5hbWUpO1xuXG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0aWYgKHJldFZhbCA9PT0gdm9pZCAwICYmIG5hbWUuaW5kZXhPZignLicpICE9PSAtMSkge1xuXHRcdFx0XHRuYW1lID0gbmFtZS5zcGxpdCgnLicpO1xuXHRcdFx0XHRrZXkgPSBuYW1lWzBdO1xuXHRcdFx0XHRsZW5ndGggPSBuYW1lLmxlbmd0aDtcblxuXHRcdFx0XHRpZiAobmVzdGVkW2tleV0gIT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdC8vINCS0LvQvtC20LXQvdC90LDRjyDQvNC+0LTQtdC70Yxcblx0XHRcdFx0XHRyZXRWYWwgPSBhdHRyaWJ1dGVzW2tleV07XG5cblx0XHRcdFx0XHRpZiAoc2NoZW1lW2tleV0gPT09ICdtb2RlbC5saXN0Jykge1xuXHRcdFx0XHRcdFx0cmV0VmFsID0gbGVuZ3RoID09PSAyXG5cdFx0XHRcdFx0XHRcdFx0PyByZXRWYWxbbmFtZVsxXV1cblx0XHRcdFx0XHRcdFx0XHQ6IHJldFZhbFtuYW1lWzFdXS5nZXQobmFtZS5zbGljZSgyKS5qb2luKCcuJykpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXRWYWwgPSByZXRWYWwuZ2V0KGxlbmd0aCA9PT0gMiA/IG5hbWVbMV0gOiBuYW1lLnNsaWNlKDEpLmpvaW4oJy4nKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKGxlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRcdHJldFZhbCA9IGF0dHJpYnV0ZXNba2V5XSAmJiBhdHRyaWJ1dGVzW2tleV1bbmFtZVsxXV07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIG4gPSBsZW5ndGggLSAxOyBpIDwgbjsgaSsrKSB7XG5cdFx0XHRcdFx0XHRrZXkgPSBuYW1lW2ldO1xuXHRcdFx0XHRcdFx0YXR0cmlidXRlcyA9IGF0dHJpYnV0ZXNba2V5XTtcblxuXHRcdFx0XHRcdFx0LyoganNoaW50IGVxbnVsbDp0cnVlICovXG5cdFx0XHRcdFx0XHRpZiAoYXR0cmlidXRlcyA9PSBudWxsKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoYXR0cmlidXRlcy5nZXQgIT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0XHRpZiAoYXR0cmlidXRlcy5Nb2RlbCAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0VmFsID0gYXR0cmlidXRlc1tuYW1lW2kgKyAxXV07XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoaSArIDIgPD0gbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0VmFsID0gcmV0VmFsLmdldChuYW1lLnNsaWNlKGkgKyAyKS5qb2luKCcuJykpO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdHJldHVybiByZXRWYWw7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGF0dHJpYnV0ZXMuZ2V0KG5hbWUuc2xpY2UoaSArIDEpLmpvaW4oJy4nKSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXRWYWwgPSBhdHRyaWJ1dGVzW25hbWVbbl1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByZXRWYWw7XG5cdFx0fSkudG9TdHJpbmcoKTtcblxuXHRcdGlmIChyZXRCb29sKSB7XG5cdFx0XHRjb2RlID0gY29kZVxuXHRcdFx0XHQucmVwbGFjZSgvKHJldHVybilcXHMrKC4rLFxccyopPyhcXHcrKS9nLCBmdW5jdGlvbiAoXywgcmV0LCBpbmN1dCwgcmV0VmFsKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJldCArICcgJyArIChpbmN1dCB8fCAnJykgKyAnISEnICsgcmV0VmFsO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQucmVwbGFjZSgvKHJldHVybikoLio/KSg7fH0pLywgZnVuY3Rpb24gKF8sIHJldCwgaW5jdXQsIGVuZCkge1xuXHRcdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cdFx0XHRcdFx0cmV0dXJuIHJldCArIChpbmN1dCA/IGluY3V0ICsgJywnIDogJycpICsgJyBmYWxzZScgKyBlbmQ7XG5cdFx0XHRcdH0pXG5cdFx0XHQ7XG5cdFx0fVxuXG5cdFx0LyoganNoaW50IGV2aWw6dHJ1ZSAqL1xuXHRcdHJldHVybiBGdW5jdGlvbigncmV0dXJuICcgKyBjb2RlLnJlcGxhY2UoJ3RoaXMuJCcsICd0aGlzLicgKyBhdHRycykpKCk7XG5cdH1cblxuXG5cdGZ1bmN0aW9uIF9lbWl0Q2hhbmdlRXZlbnRzKC8qKiBzdHJpbmcgKi90eXBlLCAvKiogTW9kZWwgKi9tb2RlbCwgLyoqIEFycmF5ICovY2hhbmdlcywgLyoqIE9iamVjdCAqL2NoYW5nZWQpIHtcblx0XHR2YXIgaSA9IGNoYW5nZXMubGVuZ3RoO1xuXHRcdHZhciBldnQgPSBuZXcgRXZlbnQodHlwZSk7IC8vINC00LvRjyDCq9GB0LrQvtGA0L7RgdGC0LjCuyDQuNGB0L/QvtC70YzQt9GD0LXQvCDQtdC00LjQvdGL0Lkg0L7QsdGK0LXQutGCXG5cblx0XHRldnQudGFyZ2V0ID0gbW9kZWw7XG5cdFx0ZXZ0LmNoYW5nZXMgPSBjaGFuZ2VzO1xuXHRcdGV2dC5hbGxDaGFuZ2VkID0gY2hhbmdlZDtcblxuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdHZhciBhdHRyID0gY2hhbmdlc1tpXTtcblxuXHRcdFx0ZXZ0LmF0dHIgPSBhdHRyO1xuXHRcdFx0ZXZ0LnR5cGUgPSB0eXBlICsgJzonICsgYXR0cjtcblx0XHRcdGV2dC5jaGFuZ2VkID0gY2hhbmdlcy5ieUtleVthdHRyXTtcblxuXHRcdFx0bW9kZWwuZW1pdChldnQudHlwZSwgW2V2dCwgbW9kZWxdKTtcblx0XHR9XG5cblx0XHRldnQudHlwZSA9IHR5cGU7XG5cdFx0ZXZ0LmF0dHIgPSB2b2lkIDA7XG5cdFx0ZXZ0LmNoYW5nZWQgPSBjaGFuZ2VkO1xuXG5cdFx0bW9kZWwuZW1pdChldnQudHlwZSwgW2V2dCwgbW9kZWxdKTtcblx0fVxuXG5cblx0LyoqXG5cdCAqINCc0L7QtNC10LvRjFxuXHQgKiBAY2xhc3MgTW9kZWxcblx0ICogQGNvbnN0cnVjdHMgTW9kZWxcblx0ICogQG1peGVzIEVtaXR0ZXJcblx0ICogQHBhcmFtICB7T2JqZWN0fSAgW2F0dHJzXSAg0YHQstC+0LnRgdGC0LLQsFxuXHQgKi9cblx0ZnVuY3Rpb24gTW9kZWwoYXR0cnMpIHtcblx0XHR2YXIga2V5LFxuXHRcdFx0dmFsdWVWYWxpZGF0b3IgPSB0aGlzLnZhbHVlVmFsaWRhdG9yLFxuXHRcdFx0dmFsdWUsXG5cdFx0XHRhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzID0ge30sXG5cdFx0XHRkZWZhdWx0cyA9IHRoaXMuZGVmYXVsdHNcblx0XHQ7XG5cblxuXHRcdHRoaXMuY2lkID0gJ2MnICsgY2lkKys7XG5cdFx0dGhpcy5jaGFuZ2VkID0ge307IC8vINCV0YHQu9C4INGN0YLQviDQvdC1INGB0LTQtdC70LDRgtGMLCDQsdGD0LTQtdGCINGA0LDQsdC+0YLQsNGC0Ywg0YEg0L7QsdGJ0LjQvCDQvtCx0YrQtdC60YLQvtC8INCyINC/0YDQvtGC0L7RgtC40L/QtVxuXHRcdHRoaXMuX2F0dHJpYnV0ZXMgPSB7fTtcblxuXG5cdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0YHQstC+0LnRgdGC0LLQsCDQvNC+0LTQtdC70Lhcblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChhdHRycykge1xuXHRcdFx0Zm9yIChrZXkgaW4gYXR0cnMpIHtcblx0XHRcdFx0dmFsdWUgPSBhdHRyc1trZXldO1xuXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdGlmICh2YWx1ZVZhbGlkYXRvciAhPT0gbnVsbCkge1xuXHRcdFx0XHRcdHZhbHVlID0gdmFsdWVWYWxpZGF0b3IodmFsdWUsIGtleSwgYXR0cnMsIHRoaXMpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X3NldEluaXRpYWxBdHRyKHRoaXMsIGRlZmF1bHRzW2tleV0sIGF0dHJpYnV0ZXMsIGtleSwga2V5LCB2YWx1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0XHQvLyDQl9Cw0L/QvtC70L3Rj9C10Lwg0YHQstC+0LnRgdGC0LLQsNC80Lgg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cblx0XHRmb3IgKGtleSBpbiBkZWZhdWx0cykge1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdGlmICghYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG5cdFx0XHRcdHZhbHVlID0gZGVmYXVsdHNba2V5XTtcblxuXHRcdFx0XHQvKiBqc2hpbnQgZXFudWxsOnRydWUgKi9cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKCh2YWx1ZSAhPT0gbnVsbCkgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBfY2xvbmUodmFsdWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YXR0cmlidXRlc1trZXldID0gdmFsdWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cblx0XHQvLyDQmNC00LXRgtC40YTQuNC60LDRgtC+0YAg0LzQvtC00LXQu9C4XG5cdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRpZiAoYXR0cmlidXRlc1t0aGlzLmlkQXR0cl0gIT09IHZvaWQgMCkge1xuXHRcdFx0dGhpcy5pZCA9IGF0dHJpYnV0ZXNbdGhpcy5pZEF0dHJdO1xuXHRcdH1cblxuXHRcdC8vINCQ0LrRgtC40LLQsNGG0LjRjyDQstC70L7QttC10L3QvdGL0YUg0LzQvtC00LXQu9C10Llcblx0XHRpZiAodGhpcy5fYWN0aXZhdGVOZXN0ZWQgIT09IHZvaWQgMCkge1xuXHRcdFx0dGhpcy5fYWN0aXZhdGVOZXN0ZWQoYXR0cmlidXRlcyk7XG5cdFx0fVxuXG5cdFx0Ly8g0J7QsdC90L7QstC70LXQvdC40LUg0LPQtdGC0YLQtdGA0L7QslxuXHRcdGlmICh0aGlzLl91cGRhdGVHZXR0ZXJzICE9PSB2b2lkIDApIHtcblx0XHRcdHRoaXMuX3VwZGF0ZUdldHRlcnMoYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cdFx0fVxuXHR9XG5cblxuXHRNb2RlbC5mbiA9IE1vZGVsLnByb3RvdHlwZSA9IC8qKiBAbGVuZHMgTW9kZWwjICove1xuXHRcdGNvbnN0cnVjdG9yOiBNb2RlbCxcblxuXHRcdF9fYmVmb3JlR2V0X186IG51bGwsXG5cblx0XHQvKipcblx0XHQgKiDQndCw0LfQstCw0L3QuNC1INC60LvQsNGB0YHQsFxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Y2xhc3NOYW1lOiAnTW9kZWwnLFxuXG5cblx0XHQvKipcblx0XHQgKiDQm9C+0LrQsNC70YzQvdGL0Lkg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LzQvtC00LXQu9C4XG5cdFx0ICogQHR5cGUgIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0Y2lkOiBudWxsLFxuXG5cdFx0LyoqXG5cdFx0ICog0JjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAg0LzQvtC00LXQu9C4IChQSylcblx0XHQgKiBAdHlwZSB7Kn1cblx0XHQgKi9cblx0XHRpZDogbnVsbCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JjQvNGPINGB0LLQvtC50YHRgtCy0LAt0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YDQsCAoUEspXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHRpZEF0dHI6ICdpZCcsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCY0L3QtNC10LrRgSDQstC70L7QttC10L3QvdGL0YUg0LzQvtC00LXQu9C10Lkv0YHQv9C40YHQutC+0LJcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0bmVzdGVkOiB7fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHRhdC10LzQsCDQvNC+0LTQtdC70LggKNGB0L7Qt9C00LDQtdGC0YHRjyDQvdCwINC+0YHQvdC+0LLQtSBgZGVmYXVsdHNgINC/0YDQuCBgZXh0ZW5kYClcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0c2NoZW1lOiB7fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KHQstC+0LnRgdGC0LLQsCDQv9C+INGD0LzQvtC70YfQsNC90LjRjlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0ZGVmYXVsdHM6IHt9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQnNCw0YHRgdC40LIg0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9GFINGB0LLQvtC50YHRgtCyINC+0YIg0YHQtdGA0LLQtdGALCDQtdGB0LvQuCDQuNGFINC90LUg0LHRg9C00LXRgiwg0YLQviDQt9Cw0L/QvtC90LjRgtGMINC40LcgYGRlZmF1bHRzYFxuXHRcdCAqIEB0eXBlIHtzdHJpbmdbXX1cblx0XHQgKi9cblx0XHRyZXF1aXJlZDogW10sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCU0L7RgdGC0YPQvyDQuiDRgdCy0L7QudGB0YLQstCw0Lwg0YfQtdGA0LXQtyDQs9C10YLQtdGA0YssINC70LjQsdC+INC+0L/RgNC10LTQtdC70LjRgtGMINC+0LHRitC10LrRgiBcItCz0LXRgtGC0LXRgFwiID0+IFwi0YHQstC+0LnRgdGC0LLQvlwiXG5cdFx0ICogQHR5cGUge2Jvb2xlYW58T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGdldHRlcnM6IGZhbHNlLFxuXG5cblx0XHQvKipcblx0XHQgKiDQotGA0LjQs9C10YDRiyDQvdCwIGFkZC91cGRhdGUvc2F2ZS9yZW1vdmUsINCwINGC0LDQuiDQttC1IGJlZm9yZWFkZCDQuCDRgi7QtC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHRyaWdnZXJzOiB7fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JLQsNC70LjQtNCw0YLQvtGAINC30L3QsNGH0LXQvdC40Y8g0LDRgtGC0YDQuNCx0YPRgtCwXG5cdFx0ICogQHR5cGUge0Z1bmN0aW9ufG51bGx9XG5cdFx0ICovXG5cdFx0dmFsdWVWYWxpZGF0b3I6IG51bGwsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCh0L/QuNGB0L7QuiDQuNC30LzQtdC90LXQvdC90L3Ri9GFINGB0YLQstC+0LnRgdGC0LIg0LjRhSDQvdC+0LLRi9GFINC30L3QsNGH0LXQvdC40Llcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdGNoYW5nZWQ6IHt9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQktGB0LXQs9C00LAg0L7RgtC/0YDQsNCy0LvRj9GC0Ywg0L/QvtC70L3Ri9C5INGB0L/QuNGB0L7QuiDQsNGC0YDQuNCx0YPRgtC+0LIg0L/RgNC4INGB0L7RhdGA0LDQvdC10L3QuNC4XG5cdFx0ICogQHR5cGUge2Jvb2xlYW59XG5cdFx0ICovXG5cdFx0YWx3YXlzU2VuZEFsbEF0dHJpYnV0ZXM6IGZhbHNlLFxuXG5cblx0XHQvKipcblx0XHQgKiDQodC/0LjRgdC+0Log0LjQt9C80LXQvdC10L3QvdC90YvRhSDRgdGC0LLQvtC50YHRgtCyINC40YUg0YHRgtCw0YDRi9GFINC30L3QsNGH0LXQvdC40Llcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0X2F0dHJpYnV0ZXM6IHt9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQmtC+0YDQvtGC0LrQuNC5INC00L7RgdGC0YPQvyDQuiDRgdCy0L7QudGB0YLQstCw0Lxcblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuXHRcdHNob3J0Y3V0czoge30sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0LHRitC10LrRgiDQvtGC0LLQtdGH0LDRjtGJ0LjQuSDQt9CwINC30LDQv9GA0L7RgdGLINC6INGB0LXRgNCy0LXRgNGDXG5cdFx0ICogQHR5cGUge3JlcXVlc3R9XG5cdFx0ICovXG5cdFx0cmVxdWVzdDogcmVxdWVzdCxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7QsdGK0LXQutGCINC+0YLQstC10YfQsNGO0YnQuNC5INC30LAg0YXRgNCw0L3QtdC90LjQtSDQtNCw0L3QvdGL0YUgKNC60LXRiClcblx0XHQgKiBAdHlwZSB7U3RvcmFnZX1cblx0XHQgKi9cblx0XHRzdG9yYWdlOiBudWxsLFxuXG5cblx0XHQvKipcblx0XHQgKiBVUkwg0L/QvtC70YPRh9C10L3QuNGPL9GB0L7RhdGA0LDQvdC10L3QuNGPL9GD0LTQsNC70LXQvdC40Y8g0LzQvtC00LXQu9C4XG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHR1cmw6IFwiXCIsXG5cblxuXHRcdC8qKlxuXHRcdCAqIFVSTCDQv9C+0LvRg9GH0LXQvdC40Y8g0YHQv9C40YHQutCwINC80L7QtNC10LvQtdC5ICjQutC+0LvQu9C10LrRhtC40LgpXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHRmaW5kVXJsOiBcIlwiLFxuXG5cblx0XHQvKipcblx0XHQgKiBVUkwg0L/QvtC70YPRh9C10L3QuNGPINC+0LTQvdC+0Lkg0LzQvtC00LXQu9C4XG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKi9cblx0XHRmaW5kT25lVXJsOiBcIlwiLFxuXG5cblx0XHQvKipcblx0XHQgKiBVUkwg0YHQvtC30LTQsNC90LjRjyDQvNC+0LTQtdC70Lhcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGFkZFVybDogXCJcIixcblxuXG5cdFx0LyoqXG5cdFx0ICogVVJMINGB0L7RhdGA0LDQvdC10L3QuNGPINC80L7QtNC10LvQuFxuXHRcdCAqIEB0eXBlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0c2F2ZVVybDogXCJcIixcblxuXG5cdFx0LyoqXG5cdFx0ICogVVJMINGD0LTQsNC70LXQvdC40Y9cblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdHJlbW92ZVVybDogXCJcIixcblxuXHRcdC8qKlxuXHRcdCAqINCY0LTRg9GCINC40LfQvNC10L3QtdC90LjRjyDQvNC+0LTQtdC70LggKHNldClcblx0XHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9jaGFuZ2luZzogZmFsc2UsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQvtCy0LXRgNC40YLRjCDQt9C90LDRh9C10L3QuNC1INGB0LLQvtC50YHRgtCy0LAg0L3QsCDQuNGB0YLQuNC90L3QvtGB0YLRjFxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBuYW1lXG5cdFx0ICogQHJldHVybnMge2Jvb2xlYW59XG5cdFx0ICogQG1ldGhvZCBNb2RlbCNpc1xuXHRcdCAqL1xuXHRcdGlzOiBfY3JlYXRlR2V0dGVyKCdhdHRyaWJ1dGVzJywgdHJ1ZSksXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LfQvdCw0YfQtdC90LjQtSDRgdCy0L7QudGB0YLQstCwXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIG5hbWVcblx0XHQgKiBAcmV0dXJucyB7Kn1cblx0XHQgKiBAbWV0aG9kIE1vZGVsI2dldFxuXHRcdCAqL1xuXHRcdGdldDogX2NyZWF0ZUdldHRlcignYXR0cmlidXRlcycpLFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC/0YDQtdC00YvQtNGD0YnQuNC1INC30L3QsNGH0LXQvdC40LUg0YHQstC+0LnRgdGC0LLQsFxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBuYW1lXG5cdFx0ICogQHJldHVybnMgeyp9XG5cdFx0ICogQG1ldGhvZCBNb2RlbCNwcmV2aW91c1xuXHRcdCAqL1xuXHRcdHByZXZpb3VzOiBfY3JlYXRlR2V0dGVyKCdfYXR0cmlidXRlcycpLFxuXG5cblx0XHQvKipcblx0XHQgKiDQktGL0LfQstCw0YLRjCDRgtGA0LjQs9C10YBcblx0XHQgKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWVcblx0XHQgKiBAcGFyYW0gIHsqfSBbYXJnc11cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9jYWxsVHJpZ2dlcjogZnVuY3Rpb24gKG5hbWUsIGFyZ3MpIHtcblx0XHRcdHZhciB0cmlnZ2VyID0gdGhpcy50cmlnZ2Vyc1tuYW1lXTtcblx0XHRcdHRyaWdnZXIgJiYgdHJpZ2dlci5jYWxsKHRoaXMsIGFyZ3MpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0LHRgNCw0LHQvtGC0LrQsCDRgdC+0LHRi9GC0LjRjyDQstC+0LbQttC10L3Ri9GFINC80L7QtNC10LvQtdC5XG5cdFx0ICogdG9kbzog0J3Rg9C20L3QviDQtNC+0YDQsNCx0L7RgtCw0YLRjCDRgdC+0LHRi9GC0LjRjyDQtNC70Y8g0LLRgdC10Lkg0YbQtdC/0L7Rh9C60Lhcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0clxuXHRcdCAqIEBwYXJhbSB7T2JqZWN0fSBldnRcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdF9uZXN0ZWRIYW5kbGVFdmVudDogZnVuY3Rpb24gKGF0dHIsIGV2dCkge1xuXHRcdFx0dmFyIHR5cGUgPSBldnQudHlwZTtcblx0XHRcdHZhciBldnRDaGFuZ2VkID0gZXZ0LmNoYW5nZWQgfHwgZXZ0LnRhcmdldDtcblx0XHRcdHZhciBldnRDaGFuZ2VzID0gZXZ0LmNoYW5nZXM7XG5cblx0XHRcdGlmICh0eXBlID09PSAndXBkYXRlJykge1xuXHRcdFx0XHR0eXBlID0gJ2NoYW5nZSc7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChldnRDaGFuZ2VzID09PSB2b2lkIDApIHtcblx0XHRcdFx0ZXZ0Q2hhbmdlcyA9IFthdHRyXTtcblx0XHRcdFx0ZXZ0Q2hhbmdlcy5ieUtleSA9IHt9O1xuXHRcdFx0XHRldnRDaGFuZ2VzLmJ5S2V5W2F0dHJdID0gZXZ0Q2hhbmdlZDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMuX2NoYW5naW5nICYmIHR5cGUgPT09ICdjaGFuZ2UnKSB7XG5cdFx0XHRcdGlmICh0aGlzLl9uZXN0ZWRDaGFuZ2VzID09PSB2b2lkIDApIHtcblx0XHRcdFx0XHR0aGlzLl9uZXN0ZWRDaGFuZ2VzID0gW107XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0aGlzLl9uZXN0ZWRDaGFuZ2VzLnB1c2goe1xuXHRcdFx0XHRcdGF0dHI6IGF0dHIsXG5cdFx0XHRcdFx0Y2hhbmdlZDogZXZ0Q2hhbmdlZCxcblx0XHRcdFx0XHRjaGFuZ2VzOiBldnRDaGFuZ2VzXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIGlmICh0eXBlID09PSAnYWRkJyB8fCB0eXBlID09PSAncmVtb3ZlJykge1xuXHRcdFx0XHR2YXIgbmV4dEV2dCA9IG5ldyBFdmVudCh7XG5cdFx0XHRcdFx0dHlwZTogdHlwZSArICc6JyArIGF0dHIsXG5cdFx0XHRcdFx0YXR0cjogYXR0cixcblx0XHRcdFx0XHRsaXN0OiBldnQubGlzdCxcblx0XHRcdFx0XHR0YXJnZXQ6IGV2dC50YXJnZXRcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dGhpcy5lbWl0KG5leHRFdnQudHlwZSwgW25leHRFdnQsIHRoaXNdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBhbGxDaGFuZ2VkID0ge307XG5cdFx0XHRcdHZhciBjaGFuZ2VzID0gW107XG5cblx0XHRcdFx0Y2hhbmdlcy5ieUtleSA9IHt9O1xuXG5cdFx0XHRcdF9zZXROZXN0ZWRDaGFuZ2VzKFt7XG5cdFx0XHRcdFx0YXR0cjogYXR0cixcblx0XHRcdFx0XHRjaGFuZ2VkOiBldnRDaGFuZ2VkLFxuXHRcdFx0XHRcdGNoYW5nZXM6IGV2dENoYW5nZXNcblx0XHRcdFx0fV0sIGNoYW5nZXMsIGFsbENoYW5nZWQpO1xuXG5cdFx0XHRcdF9lbWl0Q2hhbmdlRXZlbnRzKHR5cGUsIHRoaXMsIGNoYW5nZXMsIGFsbENoYW5nZWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0YHRgtCw0L3QvtCy0LjRgtGMINGB0LLQvtC50YHRgtCy0LAg0LjQu9C4INGB0LLQvtC50YHRgtCy0L5cblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfE9iamVjdH0gIGF0dHIgINC90LDQt9Cy0LDQvdC40LUg0LjQu9C4INC+0LHRitC10LrRgiDRgdCy0L7QudGB0YLQslxuXHRcdCAqIEBwYXJhbSAgIHsqfE9iamVjdH0gICAgICAgW25ld1ZhbHVlXSAg0LfQvdCw0YfQtdC90LjQtSDQuNC70Lgg0L7Qv9GG0LjQuFxuXHRcdCAqIEBwYXJhbSAgIHtib29sZWFufE9iamVjdH0gW29wdGlvbnNdINC+0L/RhtC40LggKHNpbGVudCwgY2xlYW4sIHN5bmMpXG5cdFx0ICogQHJldHVybnMge01vZGVsfVxuXHRcdCAqL1xuXHRcdHNldDogZnVuY3Rpb24gKGF0dHIsIG5ld1ZhbHVlLCBvcHRpb25zKSB7XG5cdFx0XHR2YXIgYXR0cnMsXG5cdFx0XHRcdGNoYW5nZXMgPSBbXSxcblx0XHRcdFx0c2lsZW50LCAvLyDQvdC1INC40YHQv9GD0YHQutCw0YLRjCDRgdC+0LHRi9GC0LjQuSDQv9GA0Lgg0LjQt9C80LXQvdC10L3QuNC4XG5cdFx0XHRcdHN5bmMsIC8vINGA0LXQttC40Lwg0YHQuNC90YXRgNC+0L3QuNC30LDRhtC40LggKNC90LDQv9GA0LzQuNC10YAg0L3QsNC00L4g0L/RgNC+0LLQtdGA0LjRgtGMIHJlcXVpcmVkKVxuXHRcdFx0XHRjaGFuZ2VkID0gdGhpcy5jaGFuZ2VkLFxuXHRcdFx0XHR2YWx1ZVZhbGlkYXRvciA9IHRoaXMudmFsdWVWYWxpZGF0b3Jcblx0XHRcdDtcblxuXHRcdFx0Y2hhbmdlcy5ieUtleSA9IHt9O1xuXHRcdFx0dGhpcy5fY2hhbmdpbmcgPSB0cnVlO1xuXG5cdFx0XHQvLyDQn9C+0LvRg9GH0LXQvCDRgdCy0L7QudGB0YLQstCwXG5cdFx0XHRpZiAodHlwZW9mIGF0dHIgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGF0dHJzID0gYXR0cjtcblx0XHRcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwgbmV3VmFsdWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQoYXR0cnMgPSB7fSlbYXR0cl0gPSBuZXdWYWx1ZTtcblx0XHRcdH1cblxuXG5cdFx0XHQvLyDQntC/0YbQuNC4XG5cdFx0XHRpZiAob3B0aW9ucyBpbnN0YW5jZW9mIE9iamVjdCkge1xuXHRcdFx0XHRzeW5jID0gb3B0aW9ucy5zeW5jO1xuXHRcdFx0XHRzaWxlbnQgPSBvcHRpb25zLnNpbGVudDtcblxuXHRcdFx0XHRpZiAob3B0aW9ucy5jbGVhbikge1xuXHRcdFx0XHRcdC8vINGD0YHRgtCw0L3QvtCy0LjRgtGMINGB0LLQvtC50YHRgtCy0LAg0Lgg0L3QtSDQvtGB0YLQsNCy0LjRgtGMINGB0LvQtdC00LAg0L7QsSDRjdGC0LjRhSDQuNC30LzQtdC90LXQvdC40Y/RhVxuXHRcdFx0XHRcdGNoYW5nZWQgPSB7fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHNpbGVudCA9IChvcHRpb25zID09PSB0cnVlKTtcblx0XHRcdH1cblxuXG5cdFx0XHQvLyDQndCw0LfQvdCw0YfQsNC10Lwg0LjQtNC10L3RgtC40YTQuNC60LDRgtC+0YAgKFBLKSwg0LXRgdC70Lgg0LXQs9C+INC/0LXRgNC10LTQsNC70Lhcblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAoYXR0cnNbdGhpcy5pZEF0dHJdICE9PSB2b2lkIDApIHtcblx0XHRcdFx0dGhpcy5pZCA9IGF0dHJzW3RoaXMuaWRBdHRyXTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHN5bmMpIHtcblx0XHRcdFx0dGhpcy5fc2V0UmVxdWlyZWQgJiYgdGhpcy5fc2V0UmVxdWlyZWQoYXR0cnMpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQn9C10YDQtdCx0LXRgNCw0LXQvCDQuCDQuNC30LzQtdC90Y/QtdC8INGB0LLQvtC50YHRgtCy0LBcblx0XHRcdGZvciAoYXR0ciBpbiBhdHRycykge1xuXHRcdFx0XHRuZXdWYWx1ZSA9IGF0dHJzW2F0dHJdOyAvLyDQndC+0LLQvtC1INC30L3QsNGH0LXQvdC40LVcblx0XHRcdFx0YXR0ciA9ICh0aGlzLnNob3J0Y3V0c1thdHRyXSB8fCBhdHRyKTtcblxuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0XHRpZiAodmFsdWVWYWxpZGF0b3IgIT09IG51bGwpIHtcblx0XHRcdFx0XHRuZXdWYWx1ZSA9IHZhbHVlVmFsaWRhdG9yKG5ld1ZhbHVlLCBhdHRyLCBhdHRycywgdGhpcyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRfc2V0QXR0cih0aGlzLCBhdHRyLCBhdHRyLCBuZXdWYWx1ZSwgY2hhbmdlZCwgY2hhbmdlcyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0aGlzLl9uZXN0ZWRDaGFuZ2VzICE9PSB2b2lkIDApIHtcblx0XHRcdFx0X3NldE5lc3RlZENoYW5nZXModGhpcy5fbmVzdGVkQ2hhbmdlcywgY2hhbmdlcywgY2hhbmdlZCk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICgodGhpcy5fdXBkYXRlR2V0dGVycyAhPT0gdm9pZCAwKSAmJiAoY2hhbmdlcy5sZW5ndGggPiAwKSkge1xuXHRcdFx0XHQvLyDQntCx0L3QvtCy0LjQvCDQs9C10YLRgtC10YDRi1xuXHRcdFx0XHR0aGlzLl91cGRhdGVHZXR0ZXJzKGNoYW5nZWQsIGF0dHJzKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JXRgdC70Lgg0LXRgdGC0Ywg0LjQt9C80LXQvdC10L3QuNGPINC4INC90LUgwqvRgtC40YjQuNC90LDCu1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdGlmICgoY2hhbmdlcy5sZW5ndGggPiAwKSAmJiAhc2lsZW50KSB7XG5cdFx0XHRcdF9lbWl0Q2hhbmdlRXZlbnRzKCdjaGFuZ2UnLCB0aGlzLCBjaGFuZ2VzLCBjaGFuZ2VkKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fY2hhbmdpbmcgPSBmYWxzZTtcblx0XHRcdHRoaXMuX25lc3RlZENoYW5nZXMgPSB2b2lkIDA7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0LLQtdC70LjRh9C40YLRjCDQsNGC0YDQuNCx0YPRgiDQvdCwIGB2YWx1ZWBcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSAgYXR0clxuXHRcdCAqIEBwYXJhbSAgIHtudW1iZXJ9ICBbdmFsdWVdXG5cdFx0ICogQHBhcmFtICAge29iamVjdH0gIFtvcHRpb25zXVxuXHRcdCAqIEByZXR1cm5zIHtNb2RlbH1cblx0XHQgKi9cblx0XHRpbmNyZW1lbnQ6IGZ1bmN0aW9uIChhdHRyLCB2YWx1ZSwgb3B0aW9ucykge1xuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMSB8fCB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuXHRcdFx0XHRvcHRpb25zID0gdmFsdWU7XG5cdFx0XHRcdHZhbHVlID0gMTtcblx0XHRcdH1cblxuXHRcdFx0dmFsdWUgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuXG5cdFx0XHRyZXR1cm4gTnVtYmVyLmlzTmFOKHZhbHVlKSA/IHRoaXMgOiB0aGlzLnNldChhdHRyLCB0aGlzLmdldChhdHRyKSArIHZhbHVlLCBvcHRpb25zKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LvRg9GH0LjRgtGMINC+0LHRitC10LrRgiDRgdCy0L7QudGB0YLQsiAo0LrQu9C+0L0g0LDRgtGC0YDQuNCx0YPRgtC+0LIpXG5cdFx0ICogQHBhcmFtICAge2Jvb2xlYW59ICBbcmVmXSAg0LLQtdGA0L3Rg9GC0Ywg0YHRgdGL0LvQutGDINC90LAg0LDRgtGC0YDQuNCx0YPRgtGLXG5cdFx0ICogQHJldHVybnMge09iamVjdH1cblx0XHQgKi9cblx0XHR0b0pTT046IGZ1bmN0aW9uIChyZWYpIHtcblx0XHRcdHZhciBhdHRycyA9IHRoaXMuYXR0cmlidXRlcztcblx0XHRcdHJldHVybiByZWYgPyBhdHRycyA6IF9jbG9uZShhdHRycywgdHJ1ZSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0K/QstGP0LvQtdGC0YHRjyDQu9C4INC80L7QtNC10LvRjCDCq9C90L7QstC+0LnCuz9cblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRpc05ldzogZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuaWQgPT09IG51bGw7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7Rh9C10YDQtdC00Ywg0LTQtdC50YHRgtCy0LjQuVxuXHRcdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuXG5cdFx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0cXVldWU6IGZ1bmN0aW9uIChmbikge1xuXHRcdFx0dmFyIG1ldGEgPSBsb2dnZXIubWV0YSgtMiksXG5cdFx0XHRcdG1vZGVsID0gdGhpcyxcblx0XHRcdFx0Y2FsbCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0XHRcdGlmIChtb2RlbC5yZW1vdmVkKSB7XG5cdFx0XHRcdFx0XHQvLyBAdG9kbzog0JHQtdC30YPQvNC90L4g0YHQv9C+0YDQvdC+0LUg0LzQtdGB0YLQviwg0LrQsNC6INC4INCy0LXRgdGMIGByZW1vdmVkYFxuXHRcdFx0XHRcdFx0dmFyIGVyciA9IG5ldyBFcnJvcignTU9ERUxfUkVNT1ZFRCcpO1xuXHRcdFx0XHRcdFx0ZXJyLm1vZGVsID0gbW9kZWw7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gZm4obW9kZWwsIG1ldGEpO1xuXHRcdFx0XHR9XG5cdFx0XHQ7XG5cblx0XHRcdGlmICghdGhpcy5fcXVldWUpIHtcblx0XHRcdFx0dGhpcy5fcXVldWUgPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKCk7IH0pO1xuXHRcdFx0XHQvL3RoaXMuX3F1ZXVlLl9fbG9nZ2VyX18ubWV0YSA9IG1ldGE7XG5cdFx0XHR9XG5cblxuXHRcdFx0dGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS50aGVuKGNhbGwsIGNhbGwpO1xuXHRcdFx0Ly90aGlzLl9xdWV1ZS5fX2xvZ2dlcl9fLm1ldGEgPSBtZXRhO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5fcXVldWU7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0JLRi9C30YvQstCw0LXRgtGB0Y8g0L/RgNC4IGZpbmRPbmUsINC10YHQu9C4INCy0LXRgNC90YPRgtGMIGBmYWxzZWAg0LHRg9C00LXRgiDQvtGC0L/RgNCw0LLQu9C10L0g0LfQsNC/0YDQvtGBINC90LAg0YHQtdGA0LXQstC10YBcblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKiBAcHJvdGVjdGVkXG5cdFx0ICovXG5cdFx0aXNEYXRhRnVsbHk6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCY0LfQvNC10L3QtdC90LAg0LvQuCDQvNC+0LTQtdC70Yw/XG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gIFtuYW1lXVxuXHRcdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGhhc0NoYW5nZWQ6IGZ1bmN0aW9uIChuYW1lKSB7XG5cdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0aWYgKG5hbWUpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY2hhbmdlZFtuYW1lXTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIga2V5IGluIHRoaXMuY2hhbmdlZCkge1xuXHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0XHRpZiAodGhpcy5jaGFuZ2VkLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcy5pc05ldygpO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCe0LHQvdC+0LLQuNGC0Ywg0LjQvdGE0L7RgNC80LDRhtC40Y4g0L4g0LzQvtC00LXQu9C4XG5cdFx0ICogQHBhcmFtICAge09iamVjdH0gIFtwYXJhbXNdICDQtNC+0L8uINC/0LDRgNCw0LzQtdGC0YDRi1xuXHRcdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHRcdCAqL1xuXHRcdGZldGNoOiBmdW5jdGlvbiAocGFyYW1zKSB7XG5cdFx0XHRwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cdFx0XHRwYXJhbXNbdGhpcy5pZEF0dHJdID0gdGhpcy5pZDtcblx0XHRcdHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLmZpbmRPbmUocGFyYW1zKTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0LXQtNCy0LDRgNC40YLQtdC70YzQvdCw0Y8g0L7QsdGA0LDQsdC+0YLQutCwINC+0YLQstC10YLQsCDRgdC10YDQstC10YDQsFxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBib2R5ICDRgtC10LvQviDQvtGC0LLQtdGC0LBcblx0XHQgKiBAcGFyYW0gICB7cmVxdWVzdC5SZXF1ZXN0fSByZXEgINC+0LHRitC10LrRgiDQt9Cw0L/RgNC+0YHQsFxuXHRcdCAqIEByZXR1cm5zIHtPYmplY3R9XG5cdFx0ICovXG5cdFx0cGFyc2U6IGZ1bmN0aW9uIChib2R5LCByZXEpIHtcblx0XHRcdHJldHVybiBib2R5O1xuXHRcdH0sXG5cblx0XHQvKipcblx0XHQgKiDQn9C+0LTQs9C+0YLQvtCy0LrQsCDQtNCw0L3QvdGL0YUg0LzQvtC00LXQu9C4INC/0LXRgNC10LQg0L7RgtC/0YDQsNCy0LrQvtC5INC90LAg0YHQtdGA0LLQtdGAXG5cdFx0ICogQHBhcmFtICAge1N0cmluZ30gbWV0aG9kINC80LXRgtC+0LQg0YHQvtGF0YDQsNC90LXQvdC40Y8gYWRkINC40LvQuCBzYXZlXG5cdFx0ICogQHBhcmFtICAge09iamVjdH0gYXR0cnMg0YHQstC+0LnRgdGC0LLQsCDQvNC+0LTQtdC70Lhcblx0XHQgKiBAcmV0dXJucyB7T2JqZWN0fSDRgdCy0L7QudGB0YLQstCwINC80L7QtNC10LvQuCwg0L/QvtC00LPQvtGC0L7QstC70LXQvdC90YvQtSDQtNC70Y8g0L/QtdGA0LXQtNCw0YfQuCDQsiDQt9Cw0L/RgNC+0YFcblx0XHQgKi9cblx0XHRwcmVwYXJlU2VuZERhdGE6IGZ1bmN0aW9uIChtZXRob2QsIGF0dHJzKSB7XG5cdFx0XHRyZXR1cm4gYXR0cnM7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCh0L7RhdGA0LDQvdC40YLRjCDQvNC+0LTQtdC70Yxcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfE9iamVjdH0gICBbYXR0cl0gICAg0YHQstC+0LnRgdGC0LLQviwg0LrQvtGC0L7RgNC+0LUg0L3Rg9C20L3QviDRg9GB0YLQsNC90L7QstC40YLRjCDQv9C10YDQtdC0INGB0L7RhdGA0LDQvdC10L3QuNC10Lxcblx0XHQgKiBAcGFyYW0gICB7Kn0gICAgICAgICAgICAgICBbdmFsdWVdICAg0LfQvdCw0YfQtdC90LjQtVxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R8Ym9vbGVhbn0gIFtvcHRpb25zXSDQvtC/0YbQuNC4XG5cdFx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0c2F2ZTogZnVuY3Rpb24gc2F2ZShhdHRyLCB2YWx1ZSwgb3B0aW9ucykge1xuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblxuXHRcdFx0aWYgKGF0dHIpIHtcblx0XHRcdFx0Ly8g0KPRgdGC0LDQvdCw0LLQu9C40LLQsNC10Lwg0LDRgtGC0YDQuNCx0YPRgtGLLCDQtdGB0LvQuCDQv9C10YDQtdC00LDQvdC90YsgKNC00L4g0YHQvtGF0YDQsNC90LXQvdC40Y8pXG5cdFx0XHRcdHRoaXMuc2V0KGF0dHIsIHZhbHVlLCBvcHRpb25zKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXMucXVldWUoZnVuY3Rpb24gKC8qKiBNb2RlbCAqL21vZGVsLCAvKiogTG9nZ2VyTWV0YSAqL21ldGEpIHtcblx0XHRcdFx0aWYgKG1vZGVsLmhhc0NoYW5nZWQoKSkge1xuXHRcdFx0XHRcdHZhciBpc05ldyA9IG1vZGVsLmlzTmV3KCksXG5cdFx0XHRcdFx0XHRhdHRycyA9IG1vZGVsW2lzTmV3IHx8IG1vZGVsLmFsd2F5c1NlbmRBbGxBdHRyaWJ1dGVzID8gJ2F0dHJpYnV0ZXMnIDogJ2NoYW5nZWQnXSxcblx0XHRcdFx0XHRcdG1ldGhvZCA9IG1vZGVsLmFkZFVybCAmJiBpc05ldyA/ICdhZGQnIDogJ3NhdmUnLFxuXHRcdFx0XHRcdFx0dXJsID0gbW9kZWwuY29uc3RydWN0b3IudXJsKG1ldGhvZCwgbW9kZWwuYXR0cmlidXRlcyksXG5cdFx0XHRcdFx0XHRjYWNoZUNoYW5nZWQgPSBtb2RlbC5jaGFuZ2VkXG5cdFx0XHRcdFx0O1xuXG5cdFx0XHRcdFx0bW9kZWwuX2NhbGxUcmlnZ2VyKGlzTmV3ID8gJ2JlZm9yZWFkZCcgOiAnYmVmb3JldXBkYXRlJywgYXR0cnMpO1xuXHRcdFx0XHRcdG1vZGVsLl9jYWxsVHJpZ2dlcignYmVmb3Jlc2F2ZScsIGF0dHJzKTtcblxuXHRcdFx0XHRcdC8vINCU0LvRjyDQv9C+0LTQtNC10YDQttC60Lggc2F2ZVVybFxuXHRcdFx0XHRcdGlmICghaXNOZXcpIHtcblx0XHRcdFx0XHRcdGF0dHJzW21vZGVsLmlkQXR0cl0gPSBtb2RlbC5pZDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdC8INC00LDQvdC90YvQtVxuXHRcdFx0XHRcdGF0dHJzID0gbW9kZWwucHJlcGFyZVNlbmREYXRhKG1ldGhvZCwgYXR0cnMpO1xuXG5cdFx0XHRcdFx0Ly8g0KHQsdGA0LDRgdGL0LLQsNC10Lwg0LjQt9C80LXQvdC10L3QuNGPXG5cdFx0XHRcdFx0bW9kZWwuY2hhbmdlZCA9IHt9O1xuXG5cdFx0XHRcdFx0Ly8g0J7QsdC90L7QstC70Y/QtdC8INC00LDQvdC90YvQtSDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcblx0XHRcdFx0XHRtb2RlbC5zdG9yYWdlICYmIG1vZGVsLnN0b3JhZ2UudXBkYXRlKG1vZGVsLnRvSlNPTigpKTtcblxuXHRcdFx0XHRcdC8vINCe0YLQv9GA0LDQstC70Y/QtdC8INC30LDQv9GA0L7RgVxuXHRcdFx0XHRcdHJldHVybiBtb2RlbC5yZXF1ZXN0LnBvc3QoXG5cdFx0XHRcdFx0XHR1cmwsXG5cdFx0XHRcdFx0XHRhdHRycyxcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bG9nZ2VyOiBtb2RlbC5jbGFzc05hbWUgKyAnLnNhdmUnLFxuXHRcdFx0XHRcdFx0XHRsb2dnZXJNZXRhOiBtZXRhXG5cdFx0XHRcdFx0XHR9KS50aGVuKGZ1bmN0aW9uIChyZXEpIHtcblx0XHRcdFx0XHRcdFx0dmFyIGJvZHkgPSBtb2RlbC5wYXJzZShyZXEuYm9keSwgcmVxKTtcblxuXHRcdFx0XHRcdFx0XHRib2R5ICYmIG1vZGVsLnNldChib2R5LCB7IGNsZWFuOiB0cnVlLCBzeW5jOiB0cnVlIH0pO1xuXHRcdFx0XHRcdFx0XHRtb2RlbC5jb25zdHJ1Y3Rvci5hbGwuc2V0KFttb2RlbF0pO1xuXHRcdFx0XHRcdFx0XHRtb2RlbC50cmlnZ2VyKCdzeW5jJywgbW9kZWwpO1xuXG5cdFx0XHRcdFx0XHRcdG1vZGVsLl9jYWxsVHJpZ2dlcihpc05ldyA/ICdhZGQnIDogJ3VwZGF0ZScsIGF0dHJzKTtcblx0XHRcdFx0XHRcdFx0bW9kZWwuX2NhbGxUcmlnZ2VyKCdzYXZlJywgYXR0cnMpO1xuXG5cdFx0XHRcdFx0XHRcdHJldHVybiBtb2RlbDtcblx0XHRcdFx0XHRcdH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdFx0XHQvLyDQn9GA0Lgg0L3QtdGD0LTQsNGH0LUg0LLQvtC30LLRgNCw0YnQsNC10Lwg0L/QvtC70Y8g0L3QsCDQvNC10YHRgtC+XG5cdFx0XHRcdFx0XHRcdG1vZGVsLmNoYW5nZWQgPSBjYWNoZUNoYW5nZWQ7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gbW9kZWw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCj0LTQsNC70LjRgtGMINC80L7QtNC10LvRjFxuXHRcdCAqIEBwYXJhbSAgIHtPYmplY3R9ICAgW3F1ZXJ5XSAg0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQtSBHRVQt0L/QsNGA0LDQvNC10YLRgNGLXG5cdFx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdFx0ICovXG5cdFx0cmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUocXVlcnkpIHtcblx0XHRcdHJldHVybiB0aGlzLnF1ZXVlKGZ1bmN0aW9uICgvKiogTW9kZWwgKi9tb2RlbCwgLyoqIExvZ2dlck1ldGEgKi9tZXRhKSB7XG5cdFx0XHRcdHF1ZXJ5ID0gcXVlcnkgfHwge307XG5cdFx0XHRcdHF1ZXJ5W21vZGVsLmlkQXR0cl0gPSBtb2RlbC5pZDtcblxuXHRcdFx0XHRxdWVyeSA9IG1vZGVsLnByZXBhcmVTZW5kRGF0YSgncmVtb3ZlJywgcXVlcnkpO1xuXHRcdFx0XHRtb2RlbC5fY2FsbFRyaWdnZXIoJ2JlZm9yZXJlbW92ZScsIHF1ZXJ5KTtcblxuXHRcdFx0XHRyZXR1cm4gbW9kZWwucmVxdWVzdC5jYWxsKFxuXHRcdFx0XHRcdG1vZGVsLmNvbnN0cnVjdG9yLnVybCgncmVtb3ZlJywgbW9kZWwpLFxuXHRcdFx0XHRcdHF1ZXJ5LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdGxvZ2dlcjogbW9kZWwuY2xhc3NOYW1lICsgJy5yZW1vdmUnLFxuXHRcdFx0XHRcdFx0bG9nZ2VyTWV0YTogbWV0YSxcblx0XHRcdFx0XHRcdHR5cGU6ICdERUxFVEUnXG5cdFx0XHRcdFx0fSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0XHRtb2RlbC5yZW1vdmVkID0gdHJ1ZTsgLy8g0L/QvtC80LXRh9Cw0LXQvCDQvtCx0YrQtdC60YIg0LrQsNC6INGD0LTQsNC70LXQvdC90YvQuVxuXHRcdFx0XHRcdFx0bW9kZWwudHJpZ2dlcih7IHR5cGU6ICdyZW1vdmUnLCBtb2RlbDogbW9kZWwgfSwgbW9kZWwpO1xuXHRcdFx0XHRcdFx0bW9kZWwuZGVzdHJveSgpO1xuXHRcdFx0XHRcdFx0bW9kZWwuX2NhbGxUcmlnZ2VyKCdyZW1vdmUnLCBxdWVyeSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQo9C90LjRh9GC0L7QttC40YLRjCDQvNC+0LTQtdC70Yxcblx0XHQgKiBAcmV0dXJucyB7TW9kZWx9XG5cdFx0ICovXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIG1vZGVsID0gdGhpcztcblxuXHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdGlmICghbW9kZWwuZGVzdHJveWVkKSB7XG5cdFx0XHRcdG1vZGVsLmRlc3Ryb3llZCA9IHRydWU7XG5cblx0XHRcdFx0Ly8g0KPQtNCw0LvRj9C10Lwg0LTQsNC90L3Ri9C1INC40Lcg0YXRgNCw0L3QuNC70LjRidCwXG5cdFx0XHRcdG1vZGVsLnN0b3JhZ2UgJiYgbW9kZWwuc3RvcmFnZS5yZW1vdmUobW9kZWwuaWQpO1xuXHRcdFx0XHRtb2RlbC50cmlnZ2VyKHt0eXBlOiAnZGVzdHJveScsIG1vZGVsOiBtb2RlbH0sIG1vZGVsKTtcblxuXHRcdFx0XHRtb2RlbC5vZmYoKTsgLy8g0Lgg0L7RgtC/0LjRgdGL0LLQsNC10Lwg0LLRgdC10YUg0YHQu9GD0YjQsNGC0LXQu9C10LlcblxuXHRcdFx0XHQvKiBqc2hpbnQgZXhwcjp0cnVlICovXG5cdFx0XHRcdChtb2RlbC5fZGVhY3RpdmF0ZU5lc3RlZCAhPT0gdm9pZCAwKSAmJiBtb2RlbC5fZGVhY3RpdmF0ZU5lc3RlZCh0aGlzLmF0dHJpYnV0ZXMpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCc0LXRgtC+0LQg0LTQu9GPINGD0YHRgtCw0L3QvtCy0LrQuCDQuNC70Lgg0L/QvtC70YPRh9C10L3QuNGPINC80LXRgtCwINC40L3RhNC+0YDQvNCw0YbQuNC4INC+INC80L7QtNC10LvQuFxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gW3Byb3BlcnR5XSDQuNC80Y8g0YHQstC+0LnRgdGC0LLQsCAo0YEg0L/QvtC00LTQtdGA0LbQutC+0Lkg0YLQvtGH0LXRh9C90L7QuSDQvdC+0YLQsNGG0LjQuCkg0LjQu9C4INC+0LHRjNC10LrRgiDRgdCy0L7QudGB0YLQstC+OtC30L3QsNGH0LXQvdC40LVcblx0XHQgKiBAcGFyYW0geyp9IFt2YWx1ZV0g0LfQvdCw0YfQtdC90LjQtSDQtNC70Y8g0YPRgdGC0LDQvdC+0LLQutC4XG5cdFx0ICogQHJldHVybnMgeyp9XG5cdFx0ICovXG5cdFx0bWV0YTogZnVuY3Rpb24gKHByb3BlcnR5LCB2YWx1ZSkge1xuXHRcdFx0dmFyIF9tZXRhID0gdGhpcy5fbWV0YSxcblx0XHRcdFx0YXJnc0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cblx0XHRcdGlmIChfbWV0YSA9PT0gdm9pZCAwIHx8IHByb3BlcnR5ID09PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX21ldGEgPSBfbWV0YSA9IGNvbmZpZyh7fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRpZiAoYXJnc0xlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gX21ldGE7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChhcmdzTGVuZ3RoID09PSAyKSB7XG5cdFx0XHRcdF9tZXRhLnNldChwcm9wZXJ0eSwgdmFsdWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoYXJnc0xlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIHByb3BlcnR5ID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRcdF9tZXRhLnNldChwcm9wZXJ0eSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIF9tZXRhLmdldChwcm9wZXJ0eSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdC8qKlxuXHRcdCAqINCQ0L3Rg9C70LjRgNC+0LLQsNGC0Ywg0LrQtdGIXG5cdFx0ICogQHJldHVybiB7TW9kZWx9XG5cdFx0ICovXG5cdFx0ZXhwaXJlOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHR0aGlzLmV4cGlyZWQgPSB0cnVlO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fVxuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDQvdC40LUg0YDQsNGB0YjQuNGA0LXQvdC90L7QuSDQvNC+0LTQtdC70Lhcblx0ICogQG1lbWJlck9mIE1vZGVsXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9IG1ldGhvZHNcblx0ICogQHJldHVybnMge01vZGVsfVxuXHQgKi9cblx0TW9kZWwuZXh0ZW5kID0gZnVuY3Rpb24gKG1ldGhvZHMpIHtcblx0XHR2YXIgTW9kZWxFeHQgPSBpbmhlcml0KHRoaXMsIG1ldGhvZHMpLFxuXHRcdFx0cHJvdG90eXBlID0gTW9kZWxFeHQuZm4sXG5cdFx0XHRzY2hlbWUgPSAocHJvdG90eXBlLnNjaGVtZSA9IHt9KSxcblx0XHRcdG5lc3RlZCA9IChwcm90b3R5cGUubmVzdGVkID0ge30pLFxuXHRcdFx0ZGVmYXVsdHMgPSBwcm90b3R5cGUuZGVmYXVsdHMsXG5cdFx0XHRyZXF1aXJlZCA9IHByb3RvdHlwZS5yZXF1aXJlZCxcblx0XHRcdGdldHRlcnMgPSBwcm90b3R5cGUuZ2V0dGVycztcblxuXHRcdC8vINCa0L7Qu9C70LXQutGG0LjRj1xuXHRcdGlmIChtZXRob2RzLkxpc3QpIHtcblx0XHRcdE1vZGVsRXh0Lkxpc3QgPSBtZXRob2RzLkxpc3Q7XG5cdFx0XHRNb2RlbEV4dC5MaXN0LnByb3RvdHlwZS5Nb2RlbCA9IE1vZGVsRXh0O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRNb2RlbEV4dC5MaXN0ID0gTW9kZWxFeHQuTGlzdC5leHRlbmQoe01vZGVsOiBNb2RlbEV4dH0pO1xuXHRcdH1cblxuXHRcdC8vINCT0LvQvtCx0LDQu9GM0L3QsNGPINC60L7Qu9C70LXQutGG0LjRjyDQsiDRgNCw0LzQutCw0YUg0LzQvtC00LXQu9C4XG5cdFx0TW9kZWxFeHQuYWxsID0gbmV3IChNb2RlbEV4dC5MaXN0KTtcblx0XHRNb2RlbEV4dC5hbGwubG9jYWwgPSB0cnVlO1xuXG5cdFx0Ly8g0JPQtdC90LXRgNC40YDRg9C10Lwg0YHRhdC10LzRg1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKGRlZmF1bHRzKSB7XG5cdFx0XHQoZnVuY3Rpb24gX3dhbGtlcihhdHRycywgcHJlZml4KSB7XG5cdFx0XHRcdHZhciBrZXlzID0gT2JqZWN0LmtleXMoYXR0cnMpO1xuXG5cdFx0XHRcdGlmIChrZXlzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHByZWZpeCA9IHByZWZpeCA/IHByZWZpeCArICcuJyA6ICcnO1xuXG5cdFx0XHRcdFx0a2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdHZhciB2YWx1ZSA9IGF0dHJzW2tleV07XG5cblx0XHRcdFx0XHRcdGtleSA9IHByZWZpeCArIGtleTtcblxuXHRcdFx0XHRcdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG5cdFx0XHRcdFx0XHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIE1vZGVsKSB7XG5cdFx0XHRcdFx0XHRcdFx0bmVzdGVkW2tleV0gPSB2YWx1ZS5jb25zdHJ1Y3Rvcjtcblx0XHRcdFx0XHRcdFx0XHRzY2hlbWVba2V5XSA9ICdtb2RlbCc7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0ZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBMaXN0KSB7XG5cdFx0XHRcdFx0XHRcdFx0bmVzdGVkW2tleV0gPSB2YWx1ZS5jb25zdHJ1Y3Rvcjtcblx0XHRcdFx0XHRcdFx0XHRzY2hlbWVba2V5XSA9ICdtb2RlbC5saXN0Jztcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG5cdFx0XHRcdFx0XHRcdFx0c2NoZW1lW2tleV0gPSAnYXJyYXknO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdHNjaGVtZVtrZXldID0gJ3NldCc7XG5cdFx0XHRcdFx0XHRcdFx0X3dhbGtlcih2YWx1ZSwga2V5KTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHNjaGVtZVtrZXldID0gX3R5cGUodmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNjaGVtZVtwcmVmaXhdID0gX3R5cGUoYXR0cnMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KShkZWZhdWx0cyk7XG5cdFx0fVxuXG5cdFx0Ly8g0JPQtdC90LXRgNC40YDRg9C10Lwg0LzQtdGC0L7QtCDRg9GB0YLQsNC90L7QstC60Lgg0L7QsdGP0LfQsNGC0LXQu9GM0L3Ri9GFINC/0LDRgNCw0LzQtdGC0YDQvtCyXG5cdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRpZiAocmVxdWlyZWQubGVuZ3RoKSB7XG5cdFx0XHQvKiBqc2hpbnQgZXZpbDp0cnVlICovXG5cdFx0XHRwcm90b3R5cGUuX3NldFJlcXVpcmVkID0gRnVuY3Rpb24oJ19jbG9uZScsICdyZXR1cm4gZnVuY3Rpb24gX3NldFJlcXVpcmVkKGF0dHJzKSB7XFxuJyArIHJlcXVpcmVkLm1hcChmdW5jdGlvbiAobmFtZSkge1xuXHRcdFx0XHRyZXR1cm4gbmFtZS5zcGxpdCgnLicpLnJlZHVjZShmdW5jdGlvbiAocHJldiwgcGFydCwgaWR4LCBwYXJ0cykge1xuXHRcdFx0XHRcdHZhciBjaGFpbiA9IHBhcnRzLnNsaWNlKDAsIGlkeCArIDEpLmpvaW4oJy4nKTtcblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0cHJldixcblx0XHRcdFx0XHRcdCdpZiAoYXR0cnMuJyArIGNoYWluICsgJyA9PT0gdm9pZCAwKScsXG5cdFx0XHRcdFx0XHQnICBhdHRycy4nICsgY2hhaW4gKyAnID0gJyArIChjaGFpbiA9PT0gbmFtZSA/ICdfY2xvbmUodGhpcy5kZWZhdWx0cy4nICsgY2hhaW4gKyAnKScgOiAne30nKVxuXHRcdFx0XHRcdF0uam9pbignXFxuJyk7XG5cdFx0XHRcdH0sICcnKTtcblx0XHRcdH0pLmpvaW4oJ1xcbicpICsgJ1xcbn0nKShfY2xvbmUpO1xuXHRcdH1cblxuXHRcdC8vINCT0LXQvdC10YDQuNGA0YPQtdC8INCw0LrRgtC40LLQsNGC0L7RgCDQstC70L7QttC10L3QvdGL0YUg0LzQvtC00LXQu9C10Llcblx0XHR2YXIgX25lc3RlZEtleXMgPSBPYmplY3Qua2V5cyhuZXN0ZWQpO1xuXG5cdFx0aWYgKF9uZXN0ZWRLZXlzLmxlbmd0aCkge1xuXHRcdFx0dmFyIF9hY3RpdmF0ZUNvZGUgPSBbXTtcblx0XHRcdHZhciBfZGVhY3RpdmF0ZUNvZGUgPSBbXTtcblxuXHRcdFx0X25lc3RlZEtleXMuZm9yRWFjaChmdW5jdGlvbiAoYWJzS2V5KSB7XG5cdFx0XHRcdHZhciBhdHRyID0gJ2F0dHJzW1wiJyArIGFic0tleS5yZXBsYWNlKC9cXC4vZywgJ1wiXVtcIicpICsgJ1wiXSc7XG5cdFx0XHRcdHZhciBldmVudHMgPSAoc2NoZW1lW2Fic0tleV0gPT09ICdtb2RlbCcgPyAnY2hhbmdlJyA6ICd1cGRhdGUnKSArICcgYWRkIHJlbW92ZSBkZXN0cm95IHJlc2V0JztcblxuXHRcdFx0XHRfYWN0aXZhdGVDb2RlLnB1c2goXG5cdFx0XHRcdFx0J3ZhciBfdGhpcyA9IHRoaXM7Jyxcblx0XHRcdFx0XHQndmFyIENsYXNzID0gdGhpcy5uZXN0ZWRbXCInICsgYWJzS2V5ICsgJ1wiXTsnLFxuXHRcdFx0XHRcdCd2YXIgaXNMaXN0ID0gdGhpcy5zY2hlbWVbXCInICsgYWJzS2V5ICsgJ1wiXSA9PSBcIm1vZGVsLmxpc3RcIjsnLFxuXHRcdFx0XHRcdCd2YXIgY2FsbGJhY2sgPSB0aGlzW1wiX25lc3RlZDonICsgYWJzS2V5ICsgJ1wiXSA9IGZ1bmN0aW9uIChldnQpIHsnLFxuXHRcdFx0XHRcdCcgIF90aGlzLl9uZXN0ZWRIYW5kbGVFdmVudChcIicgKyBhYnNLZXkgKyAnXCIsIGV2dCk7Jyxcblx0XHRcdFx0XHQnfTsnLFxuXHRcdFx0XHRcdGF0dHIgKyAnID0gKENsYXNzLm1hcCA/IENsYXNzLm1hcCgnICsgYXR0ciArICcpIDogbmV3IENsYXNzKCcgKyBhdHRyICsgJykpLm9uKFwiJyArIGV2ZW50cyArICdcIiwgY2FsbGJhY2spOydcblx0XHRcdFx0KTtcblxuXHRcdFx0XHRfZGVhY3RpdmF0ZUNvZGUucHVzaChcblx0XHRcdFx0XHRhdHRyICsgJy5vZmYoXCInICsgZXZlbnRzICsgJ1wiLCB0aGlzW1wiX25lc3RlZDonICsgYWJzS2V5ICsgJ1wiXSk7J1xuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdC8qIGpzaGludCBldmlsOnRydWUgKi9cblx0XHRcdHByb3RvdHlwZS5fYWN0aXZhdGVOZXN0ZWQgPSBGdW5jdGlvbignYXR0cnMnLCBfYWN0aXZhdGVDb2RlLmpvaW4oJ1xcbicpKTtcblx0XHRcdHByb3RvdHlwZS5fZGVhY3RpdmF0ZU5lc3RlZCA9IEZ1bmN0aW9uKCdhdHRycycsIF9kZWFjdGl2YXRlQ29kZS5qb2luKCdcXG4nKSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb3RvdHlwZS5fYWN0aXZhdGVOZXN0ZWQgPSB2b2lkIDA7XG5cdFx0XHRwcm90b3R5cGUuX2RlYWN0aXZhdGVOZXN0ZWQgPSB2b2lkIDA7XG5cdFx0fVxuXG5cdFx0Ly8g0JPQtdC90LXRgNC40YDRg9C10Lwg0LPQtdGC0YLQtdGA0Ytcblx0XHRpZiAoZ2V0dGVycykge1xuXHRcdFx0aWYgKGdldHRlcnMgPT09IHRydWUpIHtcblx0XHRcdFx0Z2V0dGVycyA9IHt9O1xuXG5cdFx0XHRcdE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uIChhdHRyKSB7XG5cdFx0XHRcdFx0Z2V0dGVyc1thdHRyXSA9IG51bGw7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQk9C10L3QtdGA0LjRgNGD0LXQvCDQvNC10YLQvtC0INC+0LHQvdC+0LLQu9C10L3QuNGPINCz0LXRgtGC0LXRgNC+0LJcblx0XHRcdC8qIGpzaGludCBldmlsOnRydWUgKi9cblx0XHRcdHByb3RvdHlwZS5fdXBkYXRlR2V0dGVycyA9IEZ1bmN0aW9uKE9iamVjdC5rZXlzKGdldHRlcnMpLm1hcChmdW5jdGlvbiAobmFtZSwgZ2V0dGVyKSB7XG5cdFx0XHRcdGdldHRlciA9IGdldHRlcnNbbmFtZV07XG5cblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKHByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuXHRcdFx0XHRcdHRocm93IFwiVW5hYmxlIHRvIGNyZWF0ZSBhIGdldHRlciBgXCIgKyBuYW1lICsgXCJgLCB0aGlzIGtleSBpcyBhbHJlYWR5IGluIHVzZVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBnZXR0ZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRwcm90b3R5cGVbJ19fZ2V0dGVyX18nICsgbmFtZV0gPSBnZXR0ZXI7XG5cdFx0XHRcdFx0Z2V0dGVyID0gJ3RoaXMuX19nZXR0ZXJfXycgKyBuYW1lICsgJygpJztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgcHJvdG90eXBlW2dldHRlcl0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRnZXR0ZXIgPSAndGhpcy4nICsgZ2V0dGVyICsgJygpJztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChnZXR0ZXIgPT09IG51bGwgfHwgdHlwZW9mIGdldHRlciA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRnZXR0ZXIgPSAndGhpcy5nZXQoJyArIF9zdHJpbmdpZnlKU09OKGdldHRlciB8fCBuYW1lKSArICcpJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAndGhpcy4nICsgbmFtZSArICcgPSAnICsgZ2V0dGVyO1xuXHRcdFx0fSkuam9pbignXFxuJykpO1xuXHRcdH1cblxuXHRcdHJldHVyblx0TW9kZWxFeHQ7XG5cdH07XG5cblxuXHQvKipcblx0ICog0JrQu9Cw0YHRgSDQutC+0LvQu9C10LrRhtC40Lhcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyT2YgTW9kZWxcblx0ICogQHR5cGUge01vZGVsLkxpc3R9XG5cdCAqL1xuXHRNb2RlbC5MaXN0ID0gTGlzdDtcblx0TW9kZWwuTGlzdC5mbi5Nb2RlbCA9IE1vZGVsOyAvLyDQodC/0L7RgNC90L4sINC30L3QsNGOLlxuXG5cblx0LyoqXG5cdCAqINCT0LvQvtCx0LDQu9GM0L3QsNGPINC60L7Qu9C70LXQutGG0LjRjyDQtNC70Y8g0LzQvtC00LXQu9C4XG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlck9mIE1vZGVsXG5cdCAqIEB0eXBlIHtNb2RlbC5MaXN0fVxuXHQgKi9cblx0TW9kZWwuYWxsID0gbmV3IExpc3Q7XG5cdE1vZGVsLmFsbC5sb2NhbCA9IHRydWU7XG5cblxuXHQvKipcblx0ICog0KPRgdGC0LDQvdC+0LLQuNGC0Ywg0LzQvtC00LXQu9C4INCyINCz0LvQvtCx0LDQu9GM0L3QvtC5INC60L7Qu9C10LrQutGG0LjQuFxuXHQgKiBAbWVtYmVyT2YgTW9kZWxcblx0ICogQHBhcmFtICAge01vZGVsW119ICAgbW9kZWxzXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9ICAgIG9wdGlvbnNcblx0ICogQHJldHVybnMgeyp9XG5cdCAqL1xuXHRNb2RlbC5zZXQgPSBmdW5jdGlvbiAobW9kZWxzLCBvcHRpb25zKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWxsLnNldChtb2RlbHMsIG9wdGlvbnMpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0LzQvtC00LXQu9GMINC40Lcg0LPQu9C+0LHQsNC70YzQvdC+0Lkg0LrQvtC70LvQtdC60YbQuNC4XG5cdCAqIEBtZW1iZXJPZiBNb2RlbFxuXHQgKiBAcGFyYW0gICB7c3RyaW5nfG51bWJlcn0gIGlkXG5cdCAqIEByZXR1cm5zIHtNb2RlbHx1bmRlZmluZWR9XG5cdCAqL1xuXHRNb2RlbC5nZXQgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHRyZXR1cm4gdGhpcy5hbGwuZ2V0KGlkKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQn9C+0LvRg9GH0LjRgtGMINC80L7QtNC10LvRjCDQuNC3INCz0LvQvtCx0LDQu9GM0L3QvtC5INC60L7Qu9C70LXQutGG0LjQuCDQtNCw0LbQtSDQtdGB0LvQuCDQtdGRINC90LXRglxuXHQgKiBAbWVtYmVyT2YgTW9kZWxcblx0ICogQHBhcmFtICAge3N0cmluZ3xudW1iZXJ9ICBpZFxuXHQgKiBAcmV0dXJucyB7TW9kZWx9XG5cdCAqL1xuXHRNb2RlbC5nZXRTYWZlID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWxsLmdldFNhZmUoaWQpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDQvdC40LUgbW9jayDQtNC70Y8g0LzQvtC00LXQu9C4XG5cdCAqIEBtZW1iZXJPZiBNb2RlbFxuXHQgKiBAcGFyYW0gIHtPYmplY3R9ICBtb2Nrc1xuXHQgKi9cblx0TW9kZWwubW9jayA9IGZ1bmN0aW9uIChtb2Nrcykge1xuXHRcdGZvciAodmFyIG1ldGhvZCBpbiBtb2Nrcykge1xuXHRcdFx0dmFyIHVybCxcblx0XHRcdFx0dmFyaWFudHMgPSBbXS5jb25jYXQobW9ja3NbbWV0aG9kXSksXG5cdFx0XHRcdGkgPSAwLFxuXHRcdFx0XHRuID0gdmFyaWFudHMubGVuZ3RoLFxuXHRcdFx0XHRxdWVyeVxuXHRcdFx0O1xuXG5cdFx0XHRmb3IgKDsgaSA8IG47IGkrKykge1xuXHRcdFx0XHR1cmwgPSB0aGlzLnVybChtZXRob2QsIHZhcmlhbnRzW2ldLnF1ZXJ5IHx8IHt9KTtcblx0XHRcdFx0cXVlcnkgPSBtZXRob2QgPT0gJ2FkZCcgPyBuZXcgdGhpcyh2YXJpYW50c1tpXS5xdWVyeSkudG9KU09OKCkgOiB2YXJpYW50c1tpXS5xdWVyeTtcblxuXHRcdFx0XHR0aGlzLmZuLnJlcXVlc3QubW9jayh7XG5cdFx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdFx0b25jZTogdmFyaWFudHNbaV0ub25jZSxcblx0XHRcdFx0XHR0eXBlOiAvXmZpbmQvLnRlc3QobWV0aG9kKSA/ICdHRVQnIDogKC9yZW1vdmUvLnRlc3QobWV0aG9kKSAmJiAhdGhpcy5mbi5yZXF1ZXN0LnNldHVwKCdlbXVsYXRlSFRUUCcpID8gJ0RFTEVURScgOiAnUE9TVCcpLFxuXHRcdFx0XHRcdGRhdGE6IC9eKGFkZHxzYXZlfHJlbW92ZSkkLy50ZXN0KG1ldGhvZCkgPyB0aGlzLmZuLnByZXBhcmVTZW5kRGF0YShtZXRob2QsIHF1ZXJ5KSA6IHF1ZXJ5LFxuXHRcdFx0XHRcdHN0YXR1czogdmFyaWFudHNbaV0uc3RhdHVzLFxuXHRcdFx0XHRcdGJvZHk6IHZhcmlhbnRzW2ldLmJvZHksXG5cdFx0XHRcdFx0cmVzcG9uc2VUZXh0OiB2YXJpYW50c1tpXS5yZXN1bHRcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCh0YTQvtGA0LzQuNGA0L7QstCw0YLRjCBVUkxcblx0ICogQG1lbWJlck9mIE1vZGVsXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBuYW1lXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9ICBbcGFyYW1zXVxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfVxuXHQgKi9cblx0TW9kZWwudXJsID0gZnVuY3Rpb24gKG5hbWUsIHBhcmFtcykge1xuXHRcdHZhciB1cmwgPSB0aGlzLmZuW25hbWUgKyAnVXJsJ10gfHwgdGhpcy5mbi51cmw7XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmICh0eXBlb2YgdXJsID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR1cmwgPSB1cmwocGFyYW1zKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gU3RyaW5nKHVybCkucmVwbGFjZSgvOihbYS16X10rKS9nLCBmdW5jdGlvbiAoXywgbmFtZSkge1xuXHRcdFx0cmV0dXJuIHBhcmFtc1tuYW1lXSB8fCAnJztcblx0XHR9KS5yZXBsYWNlKC8oW14kXFwvXSlcXC8rL2csICckMS8nKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQn9C+0LvRg9GH0LjRgtGMINC00LDQvdC90YvQtSDQvtGCINGB0LXRgNCy0LXRgNCwLCDQu9C40LHQviDQuNC3INC60LXRiNCwXG5cdCAqIEBtZW1iZXJPZiBNb2RlbFxuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgIHF1ZXJ5XG5cdCAqIEBwYXJhbSAgIHtib29sZWFufSAgW3NpbmdsZV1cblx0ICogQHBhcmFtICAge2Jvb2xlYW59ICBbZm9yY2VdXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHQgKi9cblx0TW9kZWwuZmV0Y2hEYXRhID0gZnVuY3Rpb24gKHF1ZXJ5LCBzaW5nbGUsIGZvcmNlKSB7XG5cdFx0dmFyIG1ldGEgPSBsb2dnZXIubWV0YSgtMiksXG5cdFx0XHRYTW9kZWwgPSB0aGlzLFxuXHRcdFx0c3RvcmFnZSA9IFhNb2RlbC5mbi5zdG9yYWdlLFxuXHRcdFx0bWV0aG9kID0gc2luZ2xlID8gJ2ZpbmRPbmUnIDogJ2ZpbmQnLFxuXHRcdFx0cHJvbWlzZSxcblxuXHRcdFx0ZmluZFJlcSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Ly8g0KTQvtGA0LzQuNGA0YPQtdC8IHVybFxuXHRcdFx0XHR2YXIgdXJsID0gWE1vZGVsLnVybChtZXRob2QsIHF1ZXJ5KTtcblxuXHRcdFx0XHQvLyDQkiDRgdGC0L7RgNC+0LTQttC1INC90LjRh9C10LPQviwg0LLRi9C/0L7Qu9C90Y/QtdC8INC30LDQv9GA0L7RgVxuXHRcdFx0XHRyZXR1cm4gWE1vZGVsLmZuLnJlcXVlc3QuZ2V0KFxuXHRcdFx0XHRcdHVybCxcblx0XHRcdFx0XHRxdWVyeSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsb2dnZXI6IFhNb2RlbC5mbi5jbGFzc05hbWUgKyAnLicgKyBtZXRob2QsXG5cdFx0XHRcdFx0XHRsb2dnZXJNZXRhOiBtZXRhLFxuXHRcdFx0XHRcdFx0ZGF0YVR5cGU6ICdqc29uJ1xuXHRcdFx0XHRcdH0pLnRoZW4oZnVuY3Rpb24gKHJlcSkge1xuXHRcdFx0XHRcdFx0Ly8g0JTQsNC90L3Ri9C1INC/0L7Qu9GD0YfQtdC90YssINGB0L7RhdGA0LDQvdGP0LXQvCDQsiDRhdGA0LDQvdC40LvQuNGJ0LVcblx0XHRcdFx0XHRcdHZhciBib2R5ID0gWE1vZGVsLmZuLnBhcnNlKHJlcS5ib2R5LCByZXEpO1xuXHRcdFx0XHRcdFx0c3RvcmFnZSAmJiBzdG9yYWdlLnNhdmUobWV0aG9kLCBxdWVyeSwgYm9keSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gYm9keTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHQ7XG5cblx0XHRxdWVyeSA9IHF1ZXJ5IHx8IHt9O1xuXG5cdFx0aWYgKHN0b3JhZ2UgJiYgIWZvcmNlKSB7XG5cdFx0XHQvLyDQn9GA0L7QsdGD0LXQvCDQv9C+0LvRg9GH0LjRgtGMINC00LDQvdC90YvQtSDQuNC3INGF0YDQsNC90LjQu9C40YnQsFxuXHRcdFx0cHJvbWlzZSA9IGxvZ2dlci53cmFwKCdbWycgKyBYTW9kZWwuZm4uY2xhc3NOYW1lICsgJy5zdG9yYWdlLicgKyBtZXRob2QgKyAnXV0nLCBxdWVyeSwgc3RvcmFnZVttZXRob2RdKHF1ZXJ5KSlbJ2NhdGNoJ10oZmluZFJlcSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHByb21pc2UgPSBmaW5kUmVxKCk7XG5cdFx0fVxuXG5cdFx0LyoganNoaW50IGV4cHI6dHJ1ZSAqL1xuXHRcdHByb21pc2UuX19sb2dnZXJfXyAmJiAocHJvbWlzZS5fX2xvZ2dlcl9fLm1ldGEgPSBtZXRhKTtcblx0XHRwcm9taXNlLl9fbm9Mb2cgPSB0cnVlO1xuXG5cdFx0cmV0dXJuIHByb21pc2U7XG5cdH07XG5cblxuXHQvKipcblx0ICog0J/QvtC70YPRh9C40YLRjCDQutC+0LvQu9C10LrRhtC40Y5cblx0ICogQG1lbWJlck9mIE1vZGVsXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R9ICAgW3F1ZXJ5XSAgINC30LDQv9GA0L7RgVxuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgIFtvcHRpb25zXSDQvtC/0YbQuNC4XG5cdCAqIEByZXR1cm5zIHtNb2RlbExpc3RQcm9taXNlfVxuXHQgKi9cblx0TW9kZWwuZmluZCA9IGZ1bmN0aW9uIGZpbmQocXVlcnksIG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gKG5ldyB0aGlzLkxpc3QpLmZldGNoKHF1ZXJ5LCBvcHRpb25zKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQn9C+0LvRg9GH0LjRgtGMINC80L7QtNC10LvRjFxuXHQgKiBAbWVtYmVyT2YgTW9kZWxcblx0ICogQHBhcmFtICAge09iamVjdHxzdHJpbmd9ICAgcXVlcnkgICDQt9Cw0L/RgNC+0YEg0LjQu9C4IGlkXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHQgKi9cblx0TW9kZWwuZmluZE9uZSA9IGZ1bmN0aW9uIGZpbmRPbmUocXVlcnkpIHtcblx0XHR2YXIgWE1vZGVsID0gdGhpcyxcblx0XHRcdGlkQXR0ciA9IFhNb2RlbC5mbi5pZEF0dHIsXG5cdFx0XHRoYXNPbmUgPSAhIShYTW9kZWwuZm4uZmluZE9uZVVybCB8fCBYTW9kZWwuZm4udXJsKSxcblx0XHRcdG1vZGVsLFxuXHRcdFx0aWQsXG5cdFx0XHRwcm9taXNlLFxuXHRcdFx0cXVlcnlLZXlcblx0XHQ7XG5cblx0XHQvKiBqc2hpbnQgZXFudWxsOnRydWUgKi9cblx0XHRpZiAoKHF1ZXJ5ICE9IG51bGwpICYmICEocXVlcnkgaW5zdGFuY2VvZiBPYmplY3QpKSB7XG5cdFx0XHRpZCA9IHF1ZXJ5O1xuXHRcdFx0KHF1ZXJ5ID0ge30pW2lkQXR0cl0gPSBpZDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cXVlcnkgPSBxdWVyeSB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqLyB7fTtcblx0XHR9XG5cblx0XHQvLyDQn9GA0L7QsdGD0LXQvCDQv9C+0LvRg9GH0LjRgtGMINC80L7QtNC10LvRjCDQuNC3INCz0LvQvtCx0LDQu9GM0L3QvtC5INC60L7Qu9C70LXQutGG0LjQuCDQuNC70Lgg0LfQsNGA0LXQt9C10YDQstC40YDQvtCy0LDRgtGMINC10LPQviDQsiDQtNC70LrQsNC70YzQvdC+0Lwg0YXRgNCw0L3QuNC70LjQttC1LlxuXHRcdGlkID0gcXVlcnlbaWRBdHRyXTtcblx0XHRxdWVyeUtleSA9IF9zdHJpbmdpZnlKU09OKHF1ZXJ5KTtcblx0XHRtb2RlbCA9IFhNb2RlbC5hbGwuZ2V0KGlkKTtcblxuXHRcdGlmIChtb2RlbCAmJiAhbW9kZWwuZXhwaXJlZCAmJiBtb2RlbC5pc0RhdGFGdWxseShxdWVyeSkpIHtcblx0XHRcdHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUobW9kZWwpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vINCV0YHQu9C4INC90LXRgiBgZmluZE9uZVVybGAg0YLQviDQtNC10LvQsNC10Lwg0LfQsNC/0YDQvtGBINCx0LXQtyDQv9Cw0YDQsNC80LXRgtGA0L7Qsixcblx0XHRcdC8vINC/0L7RgdC70LUg0YfQtdCz0L4g0LjQtyDQutC+0LvQu9C10LrRhtC40Lgg0L/QvtC70YPRh9C10Lwg0LzQvtC00LXQu9GMXG5cdFx0XHRwcm9taXNlID0gdGhpcy5mZXRjaERhdGEoaGFzT25lID8gcXVlcnkgOiB7fSwgaGFzT25lKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAoYXR0cnMpIHtcblx0XHRcdFx0XHR2YXIgZXJyO1xuXG5cdFx0XHRcdFx0aWYgKCFoYXNPbmUgfHwgaWQgPT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0YXR0cnMgPSAoaWQgPT0gbnVsbClcblx0XHRcdFx0XHRcdFx0XHRcdD8gKChhdHRycyBpbnN0YW5jZW9mIEFycmF5KSA/IGF0dHJzWzBdIDogYXR0cnMpXG5cdFx0XHRcdFx0XHRcdFx0XHQ6IGF0dHJzLmZpbHRlcihmdW5jdGlvbiAoYXR0cnMpIHsgcmV0dXJuIGF0dHJzW2lkQXR0cl0gPT0gaWQ7IH0pWzBdXG5cdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKGF0dHJzKSB7XG5cdFx0XHRcdFx0XHQvLyDQn9C+0LvRg9GH0LDQtdC8IFwic2FmZVwiINC80L7QtNC10LvRjFxuXHRcdFx0XHRcdFx0bW9kZWwgPSBYTW9kZWwuYWxsLmdldFNhZmUoYXR0cnNbaWRBdHRyXSk7XG5cblx0XHRcdFx0XHRcdG1vZGVsLmV4cGlyZWQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdG1vZGVsLnNldChhdHRycywge2NsZWFuOiB0cnVlLCBxdWVyeTogcXVlcnksIHN5bmM6IHRydWV9KTtcblxuXHRcdFx0XHRcdFx0WE1vZGVsLmFsbC5zZXQoW21vZGVsXSk7XG5cblx0XHRcdFx0XHRcdHJldHVybiBtb2RlbDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdNT0RFTF9OT1RfRk9VTkQnKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KVxuXHRcdFx0O1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDRgtGMINC4INGB0L7RhdGA0LDQvdC40YLRjCDQvNC+0LTQtdC70Yxcblx0ICogQHBhcmFtICAge09iamVjdH0gIGF0dHJzXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfVxuXHQgKi9cblx0TW9kZWwuc2F2ZSA9IGZ1bmN0aW9uIChhdHRycykge1xuXHRcdHZhciBtb2RlbCA9IG5ldyB0aGlzKGF0dHJzKTtcblx0XHRyZXR1cm4gbW9kZWwuc2F2ZSgpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCc0LDQv9C40L3QsyDQtNCw0L3QvdGL0YUg0LIg0LzQvtC00LXQu9GMINC40LvQuCDQutC+0LvQu9C10LrRhtC40Y5cblx0ICogQG1lbWJlck9mIE1vZGVsXG5cdCAqIEBwYXJhbSAgIHtPYmplY3R8T2JqZWN0W119IGRhdGFcblx0ICogQHJldHVybnMge01vZGVsfE1vZGVsLkxpc3R9XG5cdCAqL1xuXHRNb2RlbC5tYXAgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdHZhciByZXN1bHQgPSB0aGlzLmFsbC5zZXQoW10uY29uY2F0KGRhdGEpLCB7Y2xvbmU6IHRydWV9KTtcblx0XHRyZXR1cm4gKGRhdGEgaW5zdGFuY2VvZiBBcnJheSkgPyByZXN1bHQgOiByZXN1bHRbMF07XG5cdH07XG5cblxuXHQvKipcblx0ICog0J3QsNCx0LvRjtC00LDRgtGMINC30LAg0LjQt9C80LXQvdC10L3QuNGP0LzQuCDQvNC+0LTQtdC70LggKNGC0L7Qu9GM0LrQviDQtNC70Y8g0LHRgNCw0YPQt9C10YDQvtCyINGBINC/0L7QtNC00LXRgNC00LrQvtC5IE9iamVjdC5vYnNlcnZlKVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbGV2ZWwgINGD0YDQvtCy0LXQvdGMOiBgbG9nYCwgYGluZm9gLCBgd2FybmAg0LjQu9C4IGBlcnJvcmBcblx0ICogQHBhcmFtIHtNb2RlbHxNb2RlbC5MaXN0fEFycmF5fGZ1bmN0aW9ufSB0YXJnZXQgINGG0LXQu9GMINC90LDQsdC70Y7QtNC10L3QuNGPLCDQtdGB0LvQuCDQv9C10YDQtdC00LDQvdCwINGE0YPQvdC60YbQuNGPLCDRgtC+INGB0LvQtdC00LjQvCDQt9CwIGBhbGxgXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjYWxsYmFja10gICDQpNGD0L3QutGG0LjRjywg0LLRi9C30YvQstCw0LXQvNCw0Y8g0L/RgNC4INCy0L7Qt9C90LjQutC90L7QstC10L3QuNC4INC40LfQvNC10L3QtdC90LjQuSDQsiDQvtCx0YrQtdC60YLQtVxuXHQgKi9cblx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0TW9kZWwub2JzZXJ2ZSA9IGZ1bmN0aW9uIChsZXZlbCwgdGFyZ2V0LCBjYWxsYmFjaykge1xuXHRcdGlmICghY2FsbGJhY2spIHtcblx0XHRcdGlmICh0YXJnZXQgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuXHRcdFx0XHRjYWxsYmFjayA9IHRhcmdldDtcblx0XHRcdH1cblxuXHRcdFx0dGFyZ2V0ID0gdGhpcy5hbGw7XG5cdFx0fVxuXG5cdFx0aWYgKCEodGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkgfHwgdGFyZ2V0IGluc3RhbmNlb2YgTGlzdCkpIHtcblx0XHRcdHRhcmdldCA9IFt0YXJnZXRdO1xuXHRcdH1cblxuXHRcdGxldmVsID0gbGV2ZWwgfHwgJ2xvZyc7XG5cblx0XHR2YXIgb2JzZXJ2ZXIgPSBmdW5jdGlvbiAoY2hhaW4sIGNoYW5nZXMpIHtcblx0XHRcdGNoYW5nZXMuZm9yRWFjaChmdW5jdGlvbiAoY2hhbmdlKSB7XG5cdFx0XHRcdHZhciBhdHRyID0gY2hhbmdlLm5hbWUsXG5cdFx0XHRcdFx0bmV3VmFsdWUgPSBjaGFpbiA9PT0gJycgP1xuXHRcdFx0XHRcdFx0XHRcdHRoaXNbYXR0cl0gOlxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuZ2V0KChjaGFpbi5pbmRleE9mKCcuJykgPiAwID8gY2hhaW4uc3Vic3RyKGNoYWluLmluZGV4T2YoJy4nKSArIDEpICsgJy4nIDogJycpICsgYXR0cik7XG5cblx0XHRcdFx0Y29uc29sZVtsZXZlbF0odGhpcy5jbGFzc05hbWUgK1xuXHRcdFx0XHRcdCcoJyArIHRoaXMuaWQgKyAnKScgK1xuXHRcdFx0XHRcdChjaGFpbiA/ICcuJyArIGNoYWluIDogJycpICtcblx0XHRcdFx0XHQnLnsnICsgYXR0ciArICd9IGlzICcgK1xuXHRcdFx0XHRcdChjaGFuZ2UudHlwZSA9PT0gJ2FkZCcgPyAnYWRkZWQnIDogJ3VwZGF0ZWQnKSArXG5cdFx0XHRcdFx0JzogeycgKyBjaGFuZ2Uub2xkVmFsdWUgKyAnfSDihpIgeycgKyBuZXdWYWx1ZSArICd9J1xuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyk7XG5cblx0XHRcdC8qIGpzaGludCBleHByOnRydWUgKi9cblx0XHRcdGNhbGxiYWNrICYmIGNhbGxiYWNrKHRoaXMsIGxldmVsLCB0eXBlLCBjaGFuZ2VzKTtcblxuXHRcdFx0aWYgKGxldmVsID09PSAnZXJyb3InKSB7XG5cdFx0XHRcdC8qIGpzaGludCAtVzA4NyAqL1xuXHRcdFx0XHRkZWJ1Z2dlcjtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dGFyZ2V0LmZvckVhY2goZnVuY3Rpb24gKG1vZGVsKSB7XG5cdFx0XHRPYmplY3Qub2JzZXJ2ZShtb2RlbCwgb2JzZXJ2ZXIuYmluZChtb2RlbCwgJycpKTtcblxuXHRcdFx0KGZ1bmN0aW9uIF9uZXh0KGNoYWluLCBhdHRycykge1xuXHRcdFx0XHRpZiAoYXR0cnMgaW5zdGFuY2VvZiBPYmplY3QgJiYgIWF0dHJzLnNldCkge1xuXHRcdFx0XHRcdE9iamVjdC5vYnNlcnZlKGF0dHJzLCBvYnNlcnZlci5iaW5kKG1vZGVsLCBjaGFpbi5qb2luKCcuJykpKTtcblxuXHRcdFx0XHRcdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdFx0XHRcdF9uZXh0KGNoYWluLmNvbmNhdChrZXkpLCBhdHRyc1trZXldKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkoWydhdHRyaWJ1dGVzJ10sIG1vZGVsLmF0dHJpYnV0ZXMpO1xuXHRcdH0pO1xuXHR9O1xuXG5cblx0Ly8g0J/QvtC00LzQtdGI0LjQstCw0LXQvCBFbWl0dGVyXG5cdEVtaXR0ZXIuYXBwbHkoTW9kZWwuZm4pO1xuXG5cdC8vIEV4cG9ydFxuXHRNb2RlbC52ZXJzaW9uID0gJzAuMTQuMCc7XG5cdHJldHVybiBNb2RlbDtcbn0pO1xuIiwiZGVmaW5lKCdSUEMnLCBbXG5cdCdsb2dnZXInLFxuXHQncmVxdWVzdCcsXG5cdCdFbWl0dGVyJyxcblx0J1Byb21pc2UnLFxuXHQndXRpbHMvdXRpbCdcbl0sIGZ1bmN0aW9uIChcblx0LyoqIGxvZ2dlciAqL2xvZ2dlcixcblx0LyoqIHJlcXVlc3QgKi9yZXF1ZXN0LFxuXHQvKiogRW1pdHRlciAqL0VtaXR0ZXIsXG5cdC8qKiBQcm9taXNlICovUHJvbWlzZSxcblx0LyoqIHV0aWwgKi91dGlsXG4pIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblxuXHR2YXIgUl9VUkxfVkVSU0lPTiA9IC9eXFwvP3ZcXGQrLyxcblx0XHRSX1VSTF9MQVNUX1NMQVNIID0gL1xcLyQvLFxuXHRcdFJfVVJMX0ZJUlNUX1NMQVNIID0gL15cXC8vLFxuXHRcdFJfVVJMXzJ4U0xBU0ggPSAvXFwvezIsfS9nLFxuXHRcdFJfVVJMX05PX0ZJUlNUXzJ4U0xBU0ggPSAvKFteJFxcL10pXFwvKy9nLFxuXG5cdFx0X3N0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5LFxuXHRcdF9jbG9uZU9iamVjdCA9IHV0aWwuY2xvbmVPYmplY3Rcblx0O1xuXG5cblx0LyoqXG5cdCAqINCe0LHRitC10LrRgiDQtNC70Y8g0YDQsNCx0L7RgtGLINGBIEFQSS5cblx0ICog0JTQu9GPINC/0L7QtNC60LvRjtGH0LXQvdC40Y8g0LTQvtC/0L7Qu9C90LjRgtC10LvRjNC90YvQuSDQstC+0LfQvNC+0LbQvdC+0YHRgtC10LksINGC0LDQutC40YUg0LrQsNC6INC+0LHRgNCw0LHQvtGC0LrQsCBTREMg0Lgg0YIu0L8uINC90YPQttC90L4gW9C40YUg0L/QvtC00LrQu9GO0YfQuNGC0YxdKHN0YXR1c2VzLykgO11cblx0ICogQGNsYXNzICBSUENcblx0ICogQG1peGVzICBFbWl0dGVyXG5cdCAqL1xuXHR2YXIgUlBDID0ge1xuXHRcdFx0YWxsOiBQcm9taXNlLmFsbCxcblx0XHRcdHJlcXVlc3Q6IHJlcXVlc3QsXG5cdFx0XHRQcm9taXNlOiBQcm9taXNlLFxuXHRcdFx0ZXJyb3JIYW5kbGVyOiBbXVxuXHRcdH0sXG5cblx0XHRfc2V0dGluZ3MgPSB7XG5cdFx0XHR2ZXJzaW9uOiAxLFxuXHRcdFx0c2RjVXJsOiAnLy9hdXRoLm1haWwucnUvc2RjJyxcblx0XHRcdGJhc2VVcmw6ICcvL2FwaS5tYWlsLnJ1LycsXG5cdFx0XHR0aW1lb3V0OiAxMDAwMCxcblx0XHRcdGVtYWlsOiAnJyxcblx0XHRcdHRva2VuOiAnJyxcblx0XHRcdGh0bWxlbmNvZGVkOiBmYWxzZSxcblx0XHRcdHRva2VuUmV0cmllczogMixcblx0XHRcdGVtdWxhdGVIVFRQOiB0cnVlLFxuXHRcdFx0c2Vzc2lvbjogJydcblx0XHR9LFxuXG5cdFx0X2hhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cblxuXHQvKipcblx0ICog0KLRgNCw0L3RgdC70Y/RhtC40Y8g0LrQvtC00L7QsiDQvtGC0LLQtdGC0LAg0LIg0LjQvNC10L3QsCDRgdGC0LDRgtGD0YHQvtCyIEFQSS5cblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKi9cblx0UlBDLmNvZGVzID0ge1xuXHRcdDEwMjogJ3Byb2Nlc3NpbmcnLFxuXHRcdDIwMDogJ29rJyxcblx0XHQyMDI6ICdhY2NlcHRlZCcsXG5cdFx0MjAzOiAnbm9uX2F1dGhvcml0YXRpdmUnLFxuXHRcdDIwNjogJ3BhcnRpYWwnLFxuXHRcdDMwMTogJ21vdmUnLFxuXHRcdDMwNDogJ25vdG1vZGlmaWVkJyxcblx0XHQ0MDA6ICdpbnZhbGlkJyxcblx0XHQ0MDI6ICdwYXltZW50X3JlcXVpcmVkJyxcblx0XHQ0MDM6ICdkZW5pZWQnLFxuXHRcdDQwNDogJ25vdGZvdW5kJyxcblx0XHQ0MDY6ICd1bmFjY2VwdGFibGUnLFxuXHRcdDQwODogJ3RpbWVvdXQnLFxuXHRcdDQwOTogJ2NvbmZsaWN0Jyxcblx0XHQ0MTc6ICdleHBlY3RhdGlvbl9mYWlsZWQnLFxuXHRcdDQyMjogJ3VucHJvY2Vzc2FibGUnLFxuXHRcdDQyMzogJ2xvY2tlZCcsXG5cdFx0NDI0OiAnZmFpbGVkX2RlcGVuZGVuY3knLFxuXHRcdDQyNjogJ3VwZ3JhZGVfcmVxdWlyZWQnLFxuXHRcdDQyOTogJ21hbnlfcmVxdWVzdHMnLFxuXHRcdDQ0OTogJ3JldHJ5X3dpdGgnLFxuXHRcdDQ1MTogJ3VuYXZhaWxhYmxlX2Zvcl9sZWdhbF9yZWFzb25zJyxcblx0XHQ1MDA6ICdmYWlsJyxcblx0XHQ1MDE6ICdub3RfaW1wbGVtZW50ZWQnLFxuXHRcdDUwMzogJ3VuYXZhbGlhYmxlJyxcblx0XHQ1MDc6ICdpbnN1ZmZpY2llbnQnXG5cdH07XG5cblxuXHQvKipcblx0ICog0KLRgNCw0L3RgdC70Y/RhtC40Y8g0YHRgtCw0YLRg9GB0L7QsiDQsiDQutC+0LTRiyDQvtGC0LLQtdGC0LAgQVBJLlxuXHQgKiBAdHlwZSB7T2JqZWN0fVxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqL1xuXHRSUEMuc3RhdHVzZXMgPSB7fTtcblx0Zm9yICh2YXIgY29kZSBpbiBSUEMuY29kZXMpIHtcblx0XHRSUEMuc3RhdHVzZXNbUlBDLmNvZGVzW2NvZGVdXSA9IGNvZGU7XG5cdH1cblxuXG5cdC8vINCU0LXQu9Cw0LXQvCDQuNC3INCy0YXQvtC00L3Ri9GFINC00LDQvdC90YvRhSDQtNC70Y8gUlBDLm1vY2sg0L7QsdGK0LXQutGCINC00LvRjyAkLm1vY2tqYXhcblx0ZnVuY3Rpb24gX21ha2VNb2NrU2V0dGluZ3MocGF0aCwgc2V0dGluZ3MpIHtcblx0XHRpZiAodHlwZW9mIHBhdGggPT09ICdvYmplY3QnKSB7XG5cdFx0XHRzZXR0aW5ncyA9IHBhdGg7XG5cdFx0XHRwYXRoID0gc2V0dGluZ3MudXJsO1xuXHRcdH1cblxuXHRcdHNldHRpbmdzID0gc2V0dGluZ3MgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8ge307XG5cdFx0dmFyIGRhdGEgPSBzZXR0aW5ncy5kYXRhIHx8IHt9O1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHVybDogUlBDLm5vcm1hbGl6ZVVybChwYXRoKSxcblx0XHRcdG9uY2U6IHNldHRpbmdzLm9uY2UsXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuXHRcdFx0dHlwZTogc2V0dGluZ3MudHlwZSxcblx0XHRcdGhlYWRlcnM6IHNldHRpbmdzLmhlYWRlcnMgfHwge30sXG5cdFx0XHRyZXNwb25zZVRpbWU6IHNldHRpbmdzLnJlc3BvbnNlVGltZSB8fCAxNSxcblx0XHRcdGRhdGE6IGRhdGEsXG5cdFx0XHRyZXNwb25zZVRleHQ6IF9zdHJpbmdpZnkoc2V0dGluZ3MucmVzcG9uc2VUZXh0IHx8IHtcblx0XHRcdFx0Ym9keTogc2V0dGluZ3MuYm9keSB8fCAnJyxcblx0XHRcdFx0c3RhdHVzOiBzZXR0aW5ncy5zdGF0dXMgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gMjAwLFxuXHRcdFx0XHRlbWFpbDogc2V0dGluZ3MuZW1haWwgfHwgJycsXG5cdFx0XHRcdGh0bWxlbmNvZGVkOiBzZXR0aW5ncy5odG1sZW5jb2RlZCB8fCAnJyxcblx0XHRcdFx0bGFzdF9tb2RpZmllZDogc2V0dGluZ3MubGFzdF9tb2RpZmllZCB8fCAnJ1xuXHRcdFx0fSksXG5cdFx0XHRyZXNwb25zZTogc2V0dGluZ3MucmVzcG9uc2Vcblx0XHR9O1xuXHR9XG5cblxuXHQvLyDQodC+0LfQtNCw0LXQvCDQvtCx0YrQtdC60YIg0LfQsNC/0YDQvtGB0LAsINGD0LrQsNC30LDQvdC90L7Qs9C+INGC0LjQv9CwIChQT1NUL0dFVClcblx0ZnVuY3Rpb24gX2NhbGwocGF0aCwgZGF0YSwgb3B0aW9ucywgdHlwZSkge1xuXHRcdG9wdGlvbnMgPSBfY2xvbmVPYmplY3Qob3B0aW9ucyk7XG5cdFx0b3B0aW9ucy50eXBlID0gdHlwZTtcblx0XHRvcHRpb25zLmxvZ2dlck1ldGEgPSBvcHRpb25zLmxvZ2dlck1ldGEgfHwgbG9nZ2VyLm1ldGEoLTIpO1xuXG5cdFx0cmV0dXJuIFJQQy5jYWxsKHBhdGgsIGRhdGEsIG9wdGlvbnMpO1xuXHR9XG5cblxuXHQvKipcblx0ICog0JzQtdGC0L7QtCDQtNC70Y8g0YPRgdGC0LDQvdC+0LLQutC4L9C/0L7Qu9GD0YfQtdC90LjRjyDQvdCw0YHRgtGA0L7QtdC6LlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZXRob2Rcblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKiBAcGFyYW0gIHtPYmplY3R8c3RyaW5nfSAgW29wdGlvbnNdICDQnNC+0LbQtdGCINCx0YvRgtGMINC60LDQuiDQvtCx0YrQtdC60YLQvtC8INC90LDRgdGC0YDQvtC10LosINGC0LDQuiDQuCDRgdGC0YDQvtC60L7QstGL0Lwg0LrQu9GO0YfQvtC8XG5cdCAqIEBwYXJhbSAgeyp9ICBbdmFsdWVdICDQmNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8g0YLQvtC70YzQutC+INC00LvRjyDRg9GB0YLQsNC90L7QstC60Lgg0LfQvdCw0YfQtdC90LjRj1xuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICovXG5cdFJQQy5zZXR1cCA9IGZ1bmN0aW9uIChvcHRpb25zLCB2YWx1ZSkge1xuXHRcdGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHsgLy8gZ2V0IGFsbCBzZXR0aW5nc1xuXHRcdFx0cmV0dXJuIF9zZXR0aW5ncztcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHsgLy8gc2V0IHNldHRpbmdcblx0XHRcdFx0X3NldHRpbmdzW29wdGlvbnNdID0gdmFsdWU7XG5cdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnc3RyaW5nJykgeyAvLyBnZXQgc2V0dGluZywgb3B0aW9ucyAtIGlzIGEga2V5XG5cdFx0XHRcdHJldHVybiBfc2V0dGluZ3Nbb3B0aW9uc107XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykgeyAvLyBzZXQgYnVuZGxlIG9mIHNldHRpbmdzXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cblx0XHRcdFx0XHRpZiAoX2hhc093bi5jYWxsKG9wdGlvbnMsIGtleSkpIHtcblx0XHRcdFx0XHRcdF9zZXR0aW5nc1trZXldID0gb3B0aW9uc1trZXldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICog0J3QvtGA0LzQsNC70LjQt9Cw0YbQuNGPINC/0YPRgtC4XG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICBwYXRoICDQstGL0LfRi9Cy0LDQtdC80YvQuSDQvNC10YLQvtC0XG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9XG5cdCAqL1xuXHRSUEMubm9ybWFsaXplVXJsID0gZnVuY3Rpb24gKHBhdGgpIHtcblx0XHR2YXIgYmFzZVVybCA9IF9zZXR0aW5ncy5iYXNlVXJsO1xuXHRcdHZhciB1cmwgPSBTdHJpbmcocGF0aCB8fCBcIlwiKTtcblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKFJfVVJMX0ZJUlNUX1NMQVNILnRlc3QodXJsKSkge1xuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoUl9VUkxfTk9fRklSU1RfMnhTTEFTSCwgJyQxLycpO1xuXHRcdH0gZWxzZSBpZiAodXJsLmluZGV4T2YoYmFzZVVybCkgPT09IC0xKSB7XG5cdFx0XHRpZiAoX3NldHRpbmdzLnZlcnNpb24gJiYgIVJfVVJMX1ZFUlNJT04udGVzdCh1cmwpKSB7XG5cdFx0XHRcdHVybCA9ICcvdicgKyBfc2V0dGluZ3MudmVyc2lvbiArICcvJyArIHVybDtcblx0XHRcdH1cblxuXHRcdFx0Ly8g0JLRi9GA0LXQt9Cw0LXQvCDQstGB0LUg0L/QvtCy0YLQvtGA0Y/RjtGJ0LjQtdGB0Y8g0YHQu9C10YjQuCwg0LrRgNC+0LzQtSDQv9C10YDQstGL0YUg0LTQstGD0YVcblx0XHRcdHVybCA9IGJhc2VVcmwucmVwbGFjZShSX1VSTF9MQVNUX1NMQVNILCBcIlwiKSArIChcIi9cIiArIHVybCkucmVwbGFjZShSX1VSTF8yeFNMQVNILCBcIi9cIik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fTtcblxuXHQvKipcblx0ICog0JzQtdGC0L7QtCDQtNC70Y8g0L/QvtC70YPRh9C10L3QuNGPIFVSTCDQutC+0L3RhtCwIEFQSVxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZXRob2Rcblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IG1ldGhvZCAg0L3QsNC30LLQsNC90LjQtSDQvNC10YLQvtC00LAg0LjQu9C4INCw0LHRgdC+0LvRjtGC0L3Ri9C5INC10YHQu9C4INC90LDRh9C40L3QsNC10YLRgdGPINGBIFwiL1wiINC40LvQuCBcIi8vXCJcblx0ICogQHBhcmFtICB7b2JqZWN0fSBbZGF0YV0gINC00LDQvdC90YvQtSDQt9Cw0L/RgNC+0YHQsFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9XG5cdCAqL1xuXHRSUEMudXJsID0gZnVuY3Rpb24gKG1ldGhvZCwgZGF0YSkge1xuXHRcdHJldHVybiBSUEMubm9ybWFsaXplVXJsKG1ldGhvZCk7XG5cdH07XG5cblx0LyoqXG5cdCAqINCc0LXRgtC+0LQg0L/RgNC+0LLQtdGA0Y/QtdGCINCw0LrRgtC40LLQvdCwINC70Lgg0LTQu9GPINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQsdC10LfQvtC/0LDRgdC90LDRjyDRgdC10YHRgdC40Y8gKNGB0LwuIFvQkNCy0YLQvtGA0LjQt9Cw0YbQuNGPXShodHRwOi8vYXBpLnRvcm5hZG8uZGV2Lm1haWwucnUvYXV0aCkpXG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0UlBDLmhhc1Nlc3Npb24gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICEhX3NldHRpbmdzLnNlc3Npb247XG5cdH07XG5cblx0LyoqXG5cdCAqINCc0LXRgtC+0LQg0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0YLQvtC60LXQvdCwXG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59XG5cdCAqL1xuXHRSUEMuaGFzVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuICEhX3NldHRpbmdzLnRva2VuO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCc0LXRgtC+0LQsINGB0LHRgNCw0YHRi9Cy0YvRjtGJ0LjQuSDRgtC+0LrQtdC9XG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqL1xuXHRSUEMucmVzZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcblx0XHRfc2V0dGluZ3MudG9rZW4gPSAnJztcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQn9C+0LvRg9GH0LXQvdC40LUg0YLQvtC60LXQvdCwLiDQkiDRgdC70YPRh9Cw0LUg0YPRgdC/0LXRiNC90L7Qs9C+INCy0YvQv9C+0LvQvdC10L3QuNGPINGD0YHRgtCw0L3QsNCy0LvQuNCy0LDQtdGCINC/0L7Qu9GD0YfQtdC90L3Ri9C5INGC0L7QutC10L0uXG5cdCAqIEBzdGF0aWNcblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKiBAcmV0dXJuIHtQcm9taXNlfVxuXHQgKi9cblx0UlBDLnRva2VuID0gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBSUEMuY2FsbCgndG9rZW5zJykudGhlbihmdW5jdGlvbiAoLyogUlBDLlJlcXVlc3QgKi9yZXEpIHtcblx0XHRcdC8qIGpzaGludCBleHByOnRydWUgKi9cblx0XHRcdHJldHVybiAoX3NldHRpbmdzLnRva2VuID0gcmVxLmdldCgnYm9keS50b2tlbicpKTtcblx0XHR9KTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQo9C90LjQstC10YDRgdCw0LvRjNC90YvQuSDQvNC10YLQvtC0INC00LvRjyDQvtGC0L/RgNCw0LLQutC4INC30LDQv9GA0L7RgdCwINC6IEFQSS5cblx0ICog0JIg0YHQu9GD0YfQsNC1INC+0YLQstC10YLQsCB4aHIuaXMoJ2RlbmllZDp0b2tlbicpINC30LDQv9GA0LDRiNC40LLQsNC10YIg0YLQvtC60LXQvS5cblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiBSUENcblx0ICogQHBhcmFtICB7c3RyaW5nfSAgICAgICAgbWV0aG9kINC80LXRgtC+0LQgQVBJXG5cdCAqIEBwYXJhbSAge09iamVjdH0gICAgICAgIFtkYXRhXSDQtNCw0L3QvdGL0LUg0LfQsNC/0YDQvtGB0LBcblx0ICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgW29wdGlvbnNdINC90LDRgdGC0YDQvtC50LrQuCDQtNC70Y8gcmVxdWVzdFxuXHQgKiBAcmV0dXJuIHtSUEMuUmVxdWVzdH1cblx0ICovXG5cdFJQQy5jYWxsID0gZnVuY3Rpb24gY2FsbChtZXRob2QsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRvcHRpb25zID0gX2Nsb25lT2JqZWN0KG9wdGlvbnMpO1xuXHRcdG9wdGlvbnMudGltZW91dCA9IG9wdGlvbnMudGltZW91dCB8fCBfc2V0dGluZ3MudGltZW91dDtcblx0XHRvcHRpb25zLlJlcXVlc3QgPSBSUENSZXF1ZXN0O1xuXHRcdG9wdGlvbnMuZGF0YVR5cGUgPSAnanNvbic7XG5cdFx0b3B0aW9ucy50eXBlID0gb3B0aW9ucy50eXBlID8gb3B0aW9ucy50eXBlLnRvVXBwZXJDYXNlKCkgOiAnUE9TVCc7XG5cdFx0b3B0aW9ucy5sb2dnZXJNZXRhID0gb3B0aW9ucy5sb2dnZXJNZXRhIHx8IGxvZ2dlci5tZXRhKC0xKTtcblxuXHRcdGRhdGEgID0gX2Nsb25lT2JqZWN0KGRhdGEgfHwge30pO1xuXG5cdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRpZiAoIWRhdGEuZW1haWwgJiYgX3NldHRpbmdzLmVtYWlsKSB7XG5cdFx0XHRkYXRhLmVtYWlsID0gX3NldHRpbmdzLmVtYWlsO1xuXHRcdH1cblxuXHRcdC8qIGpzaGludCBlcW51bGw6dHJ1ZSAqL1xuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKF9zZXR0aW5ncy5odG1sZW5jb2RlZCAhPSBudWxsKSB7XG5cdFx0XHRkYXRhLmh0bWxlbmNvZGVkID0gX3NldHRpbmdzLmh0bWxlbmNvZGVkO1xuXHRcdH1cblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKF9zZXR0aW5ncy50b2tlbikge1xuXHRcdFx0ZGF0YS50b2tlbiA9IF9zZXR0aW5ncy50b2tlbjtcblx0XHR9XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChfc2V0dGluZ3MuZW11bGF0ZUhUVFAgPT09IHRydWUgJiYgb3B0aW9ucy50eXBlICE9ICdHRVQnICYmIG9wdGlvbnMudHlwZSAhPSAnUE9TVCcpIHtcblx0XHRcdG9wdGlvbnMudHlwZSA9ICdQT1NUJztcblx0XHR9XG5cblx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdGlmIChfc2V0dGluZ3Muc2Vzc2lvbikge1xuXHRcdFx0ZGF0YS5zZXNzaW9uID0gX3NldHRpbmdzLnNlc3Npb247XG5cdFx0fVxuXG5cdFx0b3B0aW9ucy5sb2dnZXIgPSBvcHRpb25zLmxvZ2dlciB8fCBtZXRob2Q7XG5cblx0XHRyZXR1cm4gcmVxdWVzdChSUEMudXJsKG1ldGhvZCwgZGF0YSksIFJQQy5zZXJpYWxpemUoZGF0YSksIG9wdGlvbnMpO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiDQnNC10YLQvtC0INGB0LXRgNC40LDQu9C40LfQsNGG0LjQuCDQtNCw0L3QvdGL0YUsINC/0LXRgNC10LQg0L7RgtC/0YDQsNCy0LrQvtC5XG5cdCAqINC80L7QttC10YIg0LHRi9GC0Ywg0L/QtdGA0LXQvtC/0YDQtdC00LXQu9C10L1cblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiBSUENcblx0ICogQHBhcmFtIHsqfSBkYXRhIC0g0LTQsNC90YvQtVxuXHQgKiBAcmV0dXJucyB7Kn1cblx0ICovXG5cdFJQQy5zZXJpYWxpemUgPSBmdW5jdGlvbiAoZGF0YSkge1xuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiDQnNC10YLQvtC00LAg0LTQu9GPINGB0L7QstC10YDRiNC10L3QuNGPIEdFVCDQt9Cw0YDQvtGB0LBcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiBSUENcblx0ICogQHBhcmFtICAgIHtzdHJpbmd9ICAgICAgICBwYXRoICAgICAgINC80LXRgtC+0LQgQVBJXG5cdCAqIEBwYXJhbSAgICB7T2JqZWN0fSAgICAgICAgW2RhdGFdICAgICDQtNCw0L3QvdGL0LUg0LfQsNC/0YDQvtGB0LBcblx0ICogQHBhcmFtICAgIHtPYmplY3R9ICAgICAgICBbb3B0aW9uc10gINC+0L/RhtC40Lhcblx0ICogQHJldHVybnMgIHtSUEMuUmVxdWVzdH1cblx0ICovXG5cdFJQQy5nZXQgPSBmdW5jdGlvbiBnZXQocGF0aCwgZGF0YSwgb3B0aW9ucykge1xuXHRcdHJldHVybiBfY2FsbChwYXRoLCBkYXRhLCBvcHRpb25zLCAnR0VUJyk7XG5cdH07XG5cblxuXHQvKipcblx0ICog0JzQtdGC0L7QtNCwINC00LvRjyDRgdC+0LLQtdGA0YjQtdC90LjRjyBQT1NUINC30LDRgNC+0YHQsFxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZXRob2Rcblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKiBAcGFyYW0gICAge3N0cmluZ30gICAgICAgIHBhdGggICAgICAg0LzQtdGC0L7QtCBBUElcblx0ICogQHBhcmFtICAgIHtPYmplY3R9ICAgICAgICBbZGF0YV0gICAgINC00LDQvdC90YvQtSDQt9Cw0L/RgNC+0YHQsFxuXHQgKiBAcGFyYW0gICAge09iamVjdH0gICAgICAgIFtvcHRpb25zXSAg0L7Qv9GG0LjQuFxuXHQgKiBAcmV0dXJucyAge1JQQy5SZXF1ZXN0fVxuXHQgKi9cblx0UlBDLnBvc3QgPSBmdW5jdGlvbiBwb3N0KHBhdGgsIGRhdGEsIG9wdGlvbnMpIHtcblx0XHRyZXR1cm4gX2NhbGwocGF0aCwgZGF0YSwgb3B0aW9ucywgJ1BPU1QnKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQktGL0L/QvtC70L3QuNGC0Ywg0LTQtdC50YHRgtCy0LjRjyDCq9C/0LDRh9C60L7QucK7ICAgICoqKtCt0LrRgdC/0LXRgNC40LzQtdC90YLQsNC70YzQvdGL0Lkg0LzQtdGC0L7QtCoqKlxuXHQgKiBAc3RhdGljXG5cdCAqIEBtZXRob2Rcblx0ICogQG1lbWJlcm9mIFJQQ1xuXHQgKiBAcGFyYW1cdHtGdW5jdGlvbn0gZXhlY3V0b3Jcblx0ICogQHJldHVybnMge1Byb21pc2V9XG5cdCAqL1xuXHRSUEMuYmF0Y2ggPSBmdW5jdGlvbiAoZXhlY3V0b3IpIHtcblx0XHRyZXR1cm4gcmVxdWVzdC5iYXRjaChleGVjdXRvciwgdGhpcy51cmwoJ2JhdGNoJykpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCt0LzRg9C70Y/RhtC40Y8gWEhSXG5cdCAqIEBzdGF0aWNcblx0ICogQG1ldGhvZFxuXHQgKiBAbWVtYmVyb2YgUlBDXG5cdCAqIEBwYXJhbSAgICB7c3RyaW5nfSAgIHBhdGggICAgICAgINCY0LzRjyDQvNC10YLQvtC00LAgQVBJXG5cdCAqIEBwYXJhbSAgICB7T2JqZWN0fSAgIFtzZXR0aW5nc10gINCg0LXQt9GD0LvRjNGC0LDRgiDQt9Cw0L/RgNC+0YHQsFxuXHQgKiBAcmV0dXJuICAge251bWJlcn0gICAgICAgICAgICAgICBpZCDQvNC+0LrQsFxuXHQgKi9cblx0UlBDLm1vY2sgPSBmdW5jdGlvbiAocGF0aCwgc2V0dGluZ3MpIHtcblx0XHRyZXR1cm4gcmVxdWVzdC5tb2NrKF9tYWtlTW9ja1NldHRpbmdzKHBhdGgsIHNldHRpbmdzKSk7XG5cdH07XG5cblxuXHQvKipcblx0ICog0KDQsNC30L7QstCw0Y8g0Y3QvNGD0LvRj9GG0LjRjyBYSFJcblx0ICogQHN0YXRpY1xuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJvZiBSUEMubW9ja1xuXHQgKiBAcGFyYW0gICAge3N0cmluZ30gIHBhdGggICAgICAgINCY0LzRjyDQvNC10YLQvtC00LAgQVBJXG5cdCAqIEBwYXJhbSAgICB7T2JqZWN0fSAgW3NldHRpbmdzXSAg0KDQtdC30YPQu9GM0YLQsNGCINC30LDQv9GA0L7RgdCwXG5cdCAqIEByZXR1cm5zICB7bnVtYmVyfSAgICAgICAgICAgICAgaWQg0LzQvtC60LBcblx0ICovXG5cdFJQQy5tb2NrLm9uY2UgPSBmdW5jdGlvbiAocGF0aCwgc2V0dGluZ3MpIHtcblx0XHRyZXR1cm4gcmVxdWVzdC5tb2NrLm9uY2UoX21ha2VNb2NrU2V0dGluZ3MocGF0aCwgc2V0dGluZ3MpKTtcblx0fTtcblxuXG5cdC8qKlxuXHQgKiDQntCx0YrQtdC60YIg0LfQsNC/0YDQvtGB0LAgUlBDXG5cdCAqIEBjbGFzcyBSZXF1ZXN0XG5cdCAqIEBtZW1iZXJPZiBSUENcblx0ICogQGNvbnN0cnVjdHMgUlBDLlJlcXVlc3Rcblx0ICogQGV4dGVuZHMgcmVxdWVzdC5SZXF1ZXN0XG5cdCAqL1xuXHR2YXIgUlBDUmVxdWVzdCA9IGZ1bmN0aW9uICgpIHtcblx0XHQvKipcblx0XHQgKiDQktGA0LXQvNGPINC40LfQvNC10L3QtdC90LjRjywg0LDQvdCw0LvQvtCzIElmLU1vZGlmaWVkLVNpbmNlIEhUVFAg0LfQsNCz0L7Qu9C+0LLQutCwLlxuXHRcdCAqIEB0eXBlIHtudW1iZXJ9XG5cdFx0ICogQG5hbWUgbGFzdE1vZGlmaWVkXG5cdFx0ICogQG1lbWJlcm9mIFJQQy5SZXF1ZXN0I1xuXHRcdCAqL1xuXHRcdHRoaXMubGFzdE1vZGlmaWVkID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqINCk0LvQsNCzLCDRg9C60LDQt9GL0LLQsNGO0YnQuNC5INC90LAg0LLQutC70Y7Rh9C10L3QvdC+0LUv0L7RgtC60LvRjtGH0LXQvdC90L7QtSBodG1sZW5jb2RlXG5cdFx0ICog0LrQvtC90LLQtdGA0YLQuNGA0L7QstCw0L3QuNC1INC30L3QsNGH0LXQvdC40Lkg0L/QvtC70LXQuSDQsiDQvtGC0LLQtdGC0LUgQVBJLlxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqIEBuYW1lIGh0bWxlbmNvZGVkXG5cdFx0ICogQG1lbWJlcm9mIFJQQy5SZXF1ZXN0I1xuXHRcdCAqL1xuXHRcdHRoaXMuaHRtbGVuY29kZWQgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogZW1haWwg0YPRh9C10YLQutC4LCDQvdCw0LQg0LrQvtGC0L7RgNC+0Lkg0L/RgNC+0LjQt9Cy0L7QtNC40YLRgdGPINC00LXQudGB0YLQstC40LVcblx0XHQgKiBAdHlwZSB7c3RyaW5nfVxuXHRcdCAqIEBuYW1lIGVtYWlsXG5cdFx0ICogQG1lbWJlcm9mIFJQQy5SZXF1ZXN0I1xuXHRcdCAqL1xuXHRcdHRoaXMuZW1haWwgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICog0JjQvNGPINGB0YLQsNGC0YPRgdCwINC+0YLQstC10YLQsCBBUEkuXG5cdFx0ICogQHR5cGUge3N0cmluZ31cblx0XHQgKiBAbmFtZSBzdGF0dXNOYW1lXG5cdFx0ICogQG1lbWJlcm9mIFJQQy5SZXF1ZXN0I1xuXHRcdCAqL1xuXHRcdHRoaXMuc3RhdHVzTmFtZSA9IG51bGw7XG5cblx0XHRyZXR1cm4gcmVxdWVzdC5SZXF1ZXN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdH07XG5cblx0Ly8gRXh0ZW5kXG5cdFJQQ1JlcXVlc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShyZXF1ZXN0LlJlcXVlc3QucHJvdG90eXBlLCB7XG5cdFx0Y29uc3RydWN0b3I6IHt2YWx1ZTogUlBDUmVxdWVzdH1cblx0fSk7XG5cblxuXHQvKipcblx0ICog0JfQsNCy0LXRgNGI0LjRgtGMINC30LDQv9GA0L7RgVxuXHQgKiBAbmFtZSBSUEMuUmVxdWVzdCNlbmRcblx0ICogQG1ldGhvZFxuXHQgKiBAcGFyYW0gIHtzdHJpbmd8Ym9vbGVhbn0gZXJyXG5cdCAqIEBwYXJhbSAge09iamVjdH0gYXBpXG5cdCAqIEByZXR1cm4geyp9XG5cdCAqL1xuXHRSUENSZXF1ZXN0LnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoZXJyLCBhcGkpIHtcblx0XHQvLyDRgdC+0YXRgNCw0L3Rj9C10Lwg0YDQtdCw0LvRjNC90YvQuSDRgdGC0LDRgtGD0YFcblx0XHR0aGlzLmh0dHBTdGF0dXMgPSB0aGlzLnN0YXR1cztcblx0XHRcblx0XHRpZiAoIWVyciAmJiAhdGhpcy5hYm9ydGVkKSB7XG5cdFx0XHQvLyDQktGB0ZEg0L7QuiwgQVBJINC+0YLQstC10YLQuNC70L4g0LrQvtGA0YDQtdGC0L3Qviwg0L3QuNC60LDQutC40YUgaHR0cCDQvtGI0LjQsdC+0Lpcblx0XHRcdGZvciAodmFyIGtleSBpbiBhcGkpIHtcblx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0aWYgKF9oYXNPd24uY2FsbChhcGksIGtleSkpIHtcblx0XHRcdFx0XHR0aGlzW3V0aWwudG9DYW1lbENhc2Uoa2V5KV0gPSBhcGlba2V5XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyDQn9GA0LXQvtCx0YDQsNC30YPQtdC8INC60L7QtCDQsiDQvdCw0LfQstCw0L3QuNC1INGB0YLQsNGC0YPRgdCwXG5cdFx0XHR0aGlzLnN0YXR1c05hbWUgPSBSUEMuY29kZXNbYXBpLnN0YXR1c107XG5cblx0XHRcdC8vINC10YHQu9C4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjiDQsdGL0LvQsCDQstGL0YHRgtCw0LLQu9C10L3QsCDQsdC10LfQvtC/0LDRgdC90LDRjyDRgdC10YHRgdC40Y8sINGC0L4g0YHQvtGF0YDQsNC90LjRgtGMINC10LVcblx0XHRcdGlmIChhcGkuc2Vzc2lvbikge1xuXHRcdFx0XHRfc2V0dGluZ3Muc2Vzc2lvbiA9IGFwaS5zZXNzaW9uO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyDQkiDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LzQtdGC0L7QtCDQv9C10YDQtdC00LDQtdC8INC40LzQtdC90L3QviDQvtGC0LLQtdGCIGFwaS5ib2R5XG5cdFx0XHRhcGkgPSBhcGkuYm9keTtcblx0XHRcdGVyciA9IGVyciB8fCAhdGhpcy5pc09LKCk7IC8vIHRvZG86INC/0YDQvtCy0LXRgNC40YLRjCDQstGB0ZEg0Y3RgtC+XG5cdFx0fVxuXG5cdFx0Ly8g0LLRi9C30YvQstCw0LXQvCDRgNC+0LTQuNGC0LXQu9GM0YHQutC40Lkg0LzQtdGC0L7QtFxuXHRcdHJldHVybiByZXF1ZXN0LlJlcXVlc3QuZm4uZW5kLmNhbGwodGhpcywgZXJyLCBhcGkpO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCf0YDQvtCy0LXRgNC40YLRjCDRgdCy0L7QudGB0YLQstC+INC90LAg0LjRgdGC0LjQvdC90L7RgdGC0Yxcblx0ICogQHBhcmFtICB7c3RyaW5nfSAga2V5c1xuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKiBAbWV0aG9kIFJQQy5SZXF1ZXN0I2lzXG5cdCAqL1xuXHRSUENSZXF1ZXN0LnByb3RvdHlwZS5pcyA9IGZ1bmN0aW9uIChrZXlzKSB7XG5cdFx0dmFyIFJfU1RBVFVTID0gL1xcYihcXHcrKSg/OjooXFx3KykpP1xcYi9nLCAvLyDQndC1INC60LXRiNC40YDRg9C10LwgUmVnRXhwLCDQsCDRgtC+IMKr0LrRgNC40LLQvsK7INCx0YPQtNC10YIg0YDQsNCx0L7RgtCwIGV4ZWNcblx0XHRcdGtleSxcblx0XHRcdHZhbCxcblx0XHRcdG1hdGNoZXM7XG5cblx0XHR3aGlsZSAoISEobWF0Y2hlcyA9IFJfU1RBVFVTLmV4ZWMoa2V5cykpKSB7XG5cdFx0XHRrZXkgPSBtYXRjaGVzWzFdOyAvLyDRgdGC0LDRgtGD0YFcblx0XHRcdHZhbCA9IG1hdGNoZXNbMl07IC8vINC30L3QsNGH0LXQvdC40LVcblxuXHRcdFx0aWYgKFJQQy5zdGF0dXNlc1trZXldID09IHRoaXMuc3RhdHVzICYmICghdmFsIHx8IHRoaXMuYm9keSA9PSB2YWwpKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiByZXF1ZXN0LlJlcXVlc3QuZm4uaXMuY2FsbCh0aGlzLCBrZXlzKTtcblx0fTtcblxuXG5cblx0Ly8g0JTQvtGB0YLRg9C/INC6IFJQQ1JlcXVlc3Rcblx0UlBDLlJlcXVlc3QgPSBSUENSZXF1ZXN0O1xuXG5cblx0Ly8g0J/QvtC00LzQtdGI0LjQstCw0LXQvCBFbWl0dGVyXG5cdEVtaXR0ZXIuYXBwbHkoUlBDKTtcblxuXG5cdC8vINCe0LHRgNCw0LHQvtGC0LrQsCDQvtGI0LjQsdC+0Lpcblx0cmVxdWVzdC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXZ0LCByZXEpIHtcblx0XHR2YXIgaSA9IFJQQy5lcnJvckhhbmRsZXIubGVuZ3RoLFxuXHRcdFx0aGFuZGxlLFxuXHRcdFx0cmVzdWx0O1xuXG5cdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0aGFuZGxlID0gUlBDLmVycm9ySGFuZGxlcltpXTtcblxuXHRcdFx0aWYgKHJlcS5pcyhoYW5kbGUuc3RhdHVzKSkge1xuXHRcdFx0XHRyZXN1bHQgPSBoYW5kbGUucHJvY2VzcyhyZXEpO1xuXG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdGlmIChyZXN1bHQpIHtcblx0XHRcdFx0XHRldnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRyZXR1cm4gcmVxLnJldHJ5KHJlc3VsdCwgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cblx0LyoqXG5cdCAqINCh0L7Qt9C00LDRgtGMIGBSUEMuUmVxdWVzdGAg0LjQtyBYSFJcblx0ICogQHBhcmFtICB7c3RyaW5nfSB1cmxcblx0ICogQHBhcmFtICB7T2JqZWN0fSBkYXRhXG5cdCAqIEBwYXJhbSAge09iamVjdHxYTUxIdHRwUmVxdWVzdH0geGhyXG5cdCAqIEByZXR1cm4ge1JQQy5SZXF1ZXN0fVxuXHQgKiBAbWVtYmVyT2YgUlBDXG5cdCAqL1xuXHRSUEMuZnJvbSA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIHhocikge1xuXHRcdHZhciByZXEgPSByZXF1ZXN0LmZyb20uYXBwbHkocmVxdWVzdCwgYXJndW1lbnRzKTtcblxuXHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0aWYgKHJlcS5pc09LKCkpIHtcblx0XHRcdHJlcS5zdGF0dXMgPSByZXEuZ2V0KCdib2R5LnN0YXR1cycpO1xuXHRcdFx0cmVxLmJvZHkgPSByZXEuZ2V0KCdib2R5LmJvZHknKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVxO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCY0L3RgtC10LPRgNCw0YbQuNGPINC/0YDQvtC40LfQstC+0LvRjNC90L7Qs9C+INGE0YPQvdC60YbQuNC+0L3QsNC70LAg0LIg0YDQsNCx0L7Rh9C40Lkg0L/RgNC+0YbQtdGB0YEg0L7RgtC/0YDQsNCy0LrQuCDQuCDQvtCx0YDQsNCx0L7RgtC60Lgg0LfQsNC/0YDQvtGB0LAg0LogQVBJXG5cdCAqIEBwYXJhbSAge09iamVjdH0gICAgb3B0aW9ucyAgICDQvtC/0YbQuNC4INC30LDQv9GA0L7RgdCwXG5cdCAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgdHJhbnNwb3J0ICDRhNGD0L3QutGG0LjRjyDQvtGC0L/RgNCw0LLQutC4INC30LDQv9GA0L7RgdCwXG5cdCAqIEByZXR1cm4ge1JQQy5SZXF1ZXN0fVxuXHQgKiBAbWV0aG9kXG5cdCAqIEBtZW1iZXJPZiBSUENcblx0ICovXG5cdFJQQy53b3JrZmxvdyA9IHJlcXVlc3Qud29ya2Zsb3c7XG5cblxuXHQvLyBFeHBvcnRcblx0UlBDLnZlcnNpb24gPSAnMC4xMC4xJztcblx0cmV0dXJuIFJQQztcbn0pO1xuIiwiLyoqXG4gKiBAYXV0aG9yIFJ1YmFYYSA8dHJhc2hAcnViYXhhLm9yZz5cbiAqIEBsaWNlbnNlIE1JVFxuICovXG4oZnVuY3Rpb24gKCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgUkRBU0ggPSAvLS9nLFxuXHRcdFJTUEFDRSA9IC9cXHMrLyxcblxuXHRcdHJfY2FtZWxDYXNlID0gLy0oLikvZyxcblx0XHRjYW1lbENhc2UgPSBmdW5jdGlvbiAoXywgY2hyKSB7XG5cdFx0XHRyZXR1cm4gY2hyLnRvVXBwZXJDYXNlKCk7XG5cdFx0fSxcblxuXHRcdGhhc093biA9ICh7fSkuaGFzT3duUHJvcGVydHksXG5cdFx0ZW1wdHlBcnJheSA9IFtdXG5cdDtcblxuXG5cblx0LyoqXG5cdCAqINCf0L7Qu9GD0YfQuNGC0Ywg0YHQv9C40YHQvtC6INGB0LvRg9GI0LDRgtC10LvQtdC5XG5cdCAqIEBwYXJhbSAgICB7T2JqZWN0fSAgdGFyZ2V0XG5cdCAqIEBwYXJhbSAgICB7c3RyaW5nfSAgbmFtZVxuXHQgKiBAcmV0dXJucyAge0FycmF5fVxuXHQgKiBAbWVtYmVyT2YgRW1pdHRlclxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKHRhcmdldCwgbmFtZSkge1xuXHRcdHZhciBsaXN0ID0gdGFyZ2V0Ll9fZW1MaXN0O1xuXG5cdFx0bmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKFJEQVNILCAnJyk7XG5cblx0XHRpZiAobGlzdCA9PT0gdm9pZCAwKSB7XG5cdFx0XHRsaXN0ID0gdGFyZ2V0Ll9fZW1MaXN0ID0ge307XG5cdFx0XHRsaXN0W25hbWVdID0gW107XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGxpc3RbbmFtZV0gPT09IHZvaWQgMCkge1xuXHRcdFx0bGlzdFtuYW1lXSA9IFtdO1xuXHRcdH1cblxuXHRcdHJldHVybiBsaXN0W25hbWVdO1xuXHR9XG5cblxuXG5cdC8qKlxuXHQgKiDQmNC30LvRg9GH0LDRgtC10LvRjCDRgdC+0LHRi9GC0LjQuVxuXHQgKiBAY2xhc3MgRW1pdHRlclxuXHQgKiBAY29uc3RydWN0cyBFbWl0dGVyXG5cdCAqL1xuXHR2YXIgRW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcblx0fTtcblx0RW1pdHRlci5mbiA9IEVtaXR0ZXIucHJvdG90eXBlID0gLyoqIEBsZW5kcyBFbWl0dGVyIyAqLyB7XG5cdFx0Y29uc3RydWN0b3I6IEVtaXR0ZXIsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0YDQuNC60YDQtdC/0LjRgtGMINC+0LHRgNCw0LHQvtGC0YfQuNC6INC00LvRjyDQvtC00L3QvtCz0L4g0LjQu9C4INC90LXRgdC60L7Qu9GM0LrQuNGFINGB0L7QsdGL0YLQuNC5LCDQv9C+0LTQtNC10YDQttC40LLQsNC10YLRgdGPIGBoYW5kbGVFdmVudGBcblx0XHQgKiBAcGFyYW0gICB7c3RyaW5nfSAgICBldmVudHMgINC+0LTQvdC+INC40LvQuCDQvdC10YHQutC+0LvRjNC60L4g0YHQvtCx0YvRgtC40LksINGA0LDQt9C00LXQu9C10L3QvdGL0YUg0L/RgNC+0LHQtdC70L7QvFxuXHRcdCAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gIGZuICAgICAg0YTRg9C90LrRhtC40Y8g0L7QsdGA0LDQsdC+0YLRh9C40Lpcblx0XHQgKiBAcmV0dXJucyB7RW1pdHRlcn1cblx0XHQgKi9cblx0XHRvbjogZnVuY3Rpb24gKGV2ZW50cywgZm4pIHtcblx0XHRcdGV2ZW50cyA9IGV2ZW50cy5zcGxpdChSU1BBQ0UpO1xuXG5cdFx0XHR2YXIgbiA9IGV2ZW50cy5sZW5ndGgsIGxpc3Q7XG5cblx0XHRcdHdoaWxlIChuLS0pIHtcblx0XHRcdFx0bGlzdCA9IGdldExpc3RlbmVycyh0aGlzLCBldmVudHNbbl0pO1xuXHRcdFx0XHRsaXN0LnB1c2goZm4pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQo9C00LDQu9C40YLRjCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDQtNC70Y8g0L7QtNC90L7Qs9C+INC40LvQuCDQvdC10YHQutC+0LvRjNC60LjRhSDRgdC+0LHRi9GC0LjQuVxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICAgIFtldmVudHNdICDQvtC00L3QviDQuNC70Lgg0L3QtdGB0LrQvtC70YzQutC+INGB0L7QsdGL0YLQuNC5LCDRgNCw0LfQtNC10LvQtdC90L3Ri9GFINC/0YDQvtCx0LXQu9C+0Lxcblx0XHQgKiBAcGFyYW0gICB7RnVuY3Rpb259ICBbZm5dICAgICAg0YTRg9C90LrRhtC40Y8g0L7QsdGA0LDQsdC+0YLRh9C40LosINC10YHQu9C4INC90LUg0L/QtdGA0LXQtNCw0YLRjCwg0LHRg9C00YPRgiDQvtGC0LLRj9C30LDQvdGLINCy0YHQtSDQvtCx0YDQsNCx0L7RgtGH0LjQutC4XG5cdFx0ICogQHJldHVybnMge0VtaXR0ZXJ9XG5cdFx0ICovXG5cdFx0b2ZmOiBmdW5jdGlvbiAoZXZlbnRzLCBmbikge1xuXHRcdFx0aWYgKGV2ZW50cyA9PT0gdm9pZCAwKSB7XG5cdFx0XHRcdHRoaXMuX19lbUxpc3QgPSBldmVudHM7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ZXZlbnRzID0gZXZlbnRzLnNwbGl0KFJTUEFDRSk7XG5cblx0XHRcdFx0dmFyIG4gPSBldmVudHMubGVuZ3RoO1xuXG5cdFx0XHRcdHdoaWxlIChuLS0pIHtcblx0XHRcdFx0XHR2YXIgbGlzdCA9IGdldExpc3RlbmVycyh0aGlzLCBldmVudHNbbl0pLCBpID0gbGlzdC5sZW5ndGgsIGlkeCA9IC0xO1xuXG5cdFx0XHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdGxpc3Quc3BsaWNlKDAsIDFlNSk7IC8vIGRpcnR5IGhhY2tcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKGxpc3QuaW5kZXhPZikge1xuXHRcdFx0XHRcdFx0XHRpZHggPSBsaXN0LmluZGV4T2YoZm4pO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHsgLy8gb2xkIGJyb3dzZXJzXG5cdFx0XHRcdFx0XHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdFx0XHRcdFx0XHQvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuXHRcdFx0XHRcdFx0XHRcdGlmIChsaXN0W2ldID09PSBmbikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWR4ID0gaTtcblx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAoaWR4ICE9PSAtMSkge1xuXHRcdFx0XHRcdFx0XHRsaXN0LnNwbGljZShpZHgsIDEpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQn9GA0LjQutGA0LXQv9C40YLRjCDQvtCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjywg0LrQvtGC0L7RgNGL0Lkg0LLRi9C/0L7Qu9C90Y/QtdGC0YHRjyDQtdC00LjQvdC+0LbQtNGLXG5cdFx0ICogQHBhcmFtICAge3N0cmluZ30gICAgZXZlbnRzICDRgdC+0LHRi9GC0LjQtSDQuNC70Lgg0YHQv9C40YHQvtC6XG5cdFx0ICogQHBhcmFtICAge0Z1bmN0aW9ufSAgZm4gICAgICDRhNGD0L3QutGG0LjRjyDQvtCx0YDQsNCx0L7RgtGH0LjQulxuXHRcdCAqIEByZXR1cm5zIHtFbWl0dGVyfVxuXHRcdCAqL1xuXHRcdG9uZTogZnVuY3Rpb24gKGV2ZW50cywgZm4pIHtcblx0XHRcdHZhciBwcm94eSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dGhpcy5vZmYoZXZlbnRzLCBwcm94eSk7XG5cdFx0XHRcdHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0fTtcblxuXHRcdFx0cmV0dXJuIHRoaXMub24oZXZlbnRzLCBwcm94eSk7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0KDQsNGB0L/RgNC+0YHRgtGA0LDQvdC40YLRjCDRgdC+0LHRi9GC0LjQtVxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICB0eXBlICAgINGC0LjQvyDRgdC+0LHRi9GC0LjRj1xuXHRcdCAqIEBwYXJhbSAgIHtBcnJheX0gICBbYXJnc10gINCw0YDQs9GD0LzQtdC90YIg0LjQu9C4INC80LDRgdGB0LjQsiDQsNGA0LPRg9C80LXQvdGC0L7QslxuXHRcdCAqIEByZXR1cm5zIHsqfVxuXHRcdCAqL1xuXHRcdGVtaXQ6IGZ1bmN0aW9uICh0eXBlLCBhcmdzKSB7XG5cdFx0XHR2YXIgbGlzdCA9IGdldExpc3RlbmVycyh0aGlzLCB0eXBlKSxcblx0XHRcdFx0aSA9IGxpc3QubGVuZ3RoLFxuXHRcdFx0XHRmbixcblx0XHRcdFx0Y3R4LFxuXHRcdFx0XHR0bXAsXG5cdFx0XHRcdHJldFZhbCxcblx0XHRcdFx0YXJnc0xlbmd0aFxuXHRcdFx0O1xuXG5cdFx0XHR0eXBlID0gJ29uJyArIHR5cGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eXBlLnN1YnN0cigxKTtcblxuXHRcdFx0aWYgKHR5cGUuaW5kZXhPZignLScpID4gLTEpIHtcblx0XHRcdFx0dHlwZSA9IHR5cGUucmVwbGFjZShyX2NhbWVsQ2FzZSwgY2FtZWxDYXNlKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzW3R5cGVdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdHJldFZhbCA9IHRoaXNbdHlwZV0uYXBwbHkodGhpcywgW10uY29uY2F0KGFyZ3MpKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGkgPiAwKSB7XG5cdFx0XHRcdGFyZ3MgPSBhcmdzID09PSB2b2lkIDAgPyBlbXB0eUFycmF5IDogW10uY29uY2F0KGFyZ3MpO1xuXHRcdFx0XHRhcmdzTGVuZ3RoID0gYXJncy5sZW5ndGg7XG5cblx0XHRcdFx0d2hpbGUgKGktLSkge1xuXHRcdFx0XHRcdGZuID0gbGlzdFtpXTtcblx0XHRcdFx0XHRjdHggPSB0aGlzO1xuXG5cdFx0XHRcdFx0LyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cblx0XHRcdFx0XHRpZiAoZm4gIT09IHZvaWQgMCkge1xuXHRcdFx0XHRcdFx0aWYgKGZuLmhhbmRsZUV2ZW50ICE9PSB2b2lkIDApIHtcblx0XHRcdFx0XHRcdFx0Y3R4ID0gZm47XG5cdFx0XHRcdFx0XHRcdGZuID0gZm4uaGFuZGxlRXZlbnQ7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChhcmdzTGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdFx0XHRcdHRtcCA9IGZuLmNhbGwoY3R4KTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2UgaWYgKGFyZ3NMZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gZm4uY2FsbChjdHgsIGFyZ3NbMF0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYXJnc0xlbmd0aCA9PT0gMikge1xuXHRcdFx0XHRcdFx0XHR0bXAgPSBmbi5jYWxsKGN0eCwgYXJnc1swXSwgYXJnc1sxXSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0dG1wID0gZm4uYXBwbHkoY3R4LCBhcmdzKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHRtcCAhPT0gdm9pZCAwKSB7XG5cdFx0XHRcdFx0XHRcdHJldFZhbCA9IHRtcDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHJldFZhbDtcblx0XHR9LFxuXG5cblx0XHQvKipcblx0XHQgKiDQoNCw0YHQv9GA0L7RgdGC0YDQsNC90LjRgtGMIGBFbWl0dGVyLkV2ZW50YFxuXHRcdCAqIEBwYXJhbSAgIHtzdHJpbmd9ICB0eXBlICAgINGC0LjQvyDRgdC+0LHRi9GC0LjRj1xuXHRcdCAqIEBwYXJhbSAgIHtBcnJheX0gICBbYXJnc10gINCw0YDQs9GD0LzQtdC90YIg0LjQu9C4INC80LDRgdGB0LjQsiDQsNGA0LPRg9C80LXQvdGC0L7QslxuXHRcdCAqIEBwYXJhbSAgIHsqfSAgIFtkZXRhaWxzXSAg0LTQtdGC0LDQu9C4INC+0LHRitC10LrRgtCwINGB0L7QsdGL0YLQuNGPXG5cdFx0ICogQHJldHVybnMge0VtaXR0ZXJ9XG5cdFx0ICovXG5cdFx0dHJpZ2dlcjogZnVuY3Rpb24gKHR5cGUsIGFyZ3MsIGRldGFpbHMpIHtcblx0XHRcdHZhciBldnQgPSBuZXcgRXZlbnQodHlwZSk7XG5cblx0XHRcdGV2dC50YXJnZXQgPSBldnQudGFyZ2V0IHx8IHRoaXM7XG5cdFx0XHRldnQuZGV0YWlscyA9IGRldGFpbHM7XG5cdFx0XHRldnQucmVzdWx0ID0gdGhpcy5lbWl0KHR5cGUudHlwZSB8fCB0eXBlLCBbZXZ0XS5jb25jYXQoYXJncykpO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9XG5cdH07XG5cblxuXG5cdC8qKlxuXHQgKiDQodC+0LHRi9GC0LjQtVxuXHQgKiBAY2xhc3MgRW1pdHRlci5FdmVudFxuXHQgKiBAY29uc3RydWN0cyBFbWl0dGVyLkV2ZW50XG5cdCAqIEBwYXJhbSAgIHtzdHJpbmd8T2JqZWN0fEV2ZW50fSAgdHlwZSAg0YLQuNC/INGB0L7QsdGL0YLQuNGPXG5cdCAqIEByZXR1cm5zIHtFbWl0dGVyLkV2ZW50fVxuXHQgKi9cblx0ZnVuY3Rpb24gRXZlbnQodHlwZSkge1xuXHRcdGlmICh0eXBlIGluc3RhbmNlb2YgRXZlbnQpIHtcblx0XHRcdHJldHVybiB0eXBlO1xuXHRcdH1cblxuXHRcdGlmICh0eXBlLnR5cGUpIHtcblx0XHRcdGZvciAodmFyIGtleSBpbiB0eXBlKSB7XG5cdFx0XHRcdC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG5cdFx0XHRcdGlmIChoYXNPd24uY2FsbCh0eXBlLCBrZXkpKSB7XG5cdFx0XHRcdFx0dGhpc1trZXldID0gdHlwZVtrZXldO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHR5cGUgPSB0eXBlLnR5cGU7XG5cdFx0fVxuXG5cdFx0dGhpcy50eXBlID0gdHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoUkRBU0gsICcnKTtcblx0fVxuXG5cdEV2ZW50LmZuID0gRXZlbnQucHJvdG90eXBlID0gLyoqIEBsZW5kcyBFbWl0dGVyLkV2ZW50IyAqLyB7XG5cdFx0Y29uc3RydWN0b3I6IEV2ZW50LFxuXG5cblx0XHQvKipcblx0XHQgKiDQlNC10LnRgdGC0LLQuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOINC+0YLQvNC10L3QtdC90L7QvFxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGRlZmF1bHRQcmV2ZW50ZWQ6IGZhbHNlLFxuXG5cblx0XHQvKipcblx0XHQgKiDQkmPQv9C70YvRgtC40LUg0YHQvtCx0YvRgtC40Y8g0L7RgtC80LXQvdC10L3QvlxuXHRcdCAqIEB0eXBlIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdHByb3BhZ2F0aW9uU3RvcHBlZDogZmFsc2UsXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qt9Cy0L7Qu9GP0LXRgiDQvtC/0YDQtdC00LXQu9C40YLRjCwg0LHRi9C70L4g0LvQuCDQvtGC0LzQtdC90LXQvdC+INC00LXQudGB0YLQstC40LUg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y5cblx0XHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0XHQgKi9cblx0XHRpc0RlZmF1bHRQcmV2ZW50ZWQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQ7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7RgtC80LXQvdC40YLRjCDQtNC10LnRgdGC0LLQuNC1INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOXG5cdFx0ICovXG5cdFx0cHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcblx0XHRcdHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG5cdFx0fSxcblxuXG5cdFx0LyoqXG5cdFx0ICog0J7RgdGC0LDQvdC+0LLQuNGC0Ywg0L/RgNC+0LTQstC40LbQtdC90LjQtSDRgdC+0LHRi9GC0LjRj1xuXHRcdCAqL1xuXHRcdHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQgPSB0cnVlO1xuXHRcdH0sXG5cblxuXHRcdC8qKlxuXHRcdCAqINCf0L7Qt9Cy0L7Qu9GP0LXRgiDQvtC/0YDQtdC00LXQu9C40YLRjCwg0LHRi9C70L4g0LvQuCDQvtGC0LzQtdC90LXQvdC+INC/0YDQvtC00LLQuNC20LXQvdC40LUg0YHQvtCx0YvRgtC40Y9cblx0XHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHRcdCAqL1xuXHRcdGlzUHJvcGFnYXRpb25TdG9wcGVkOiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ7XG5cdFx0fVxuXHR9O1xuXG5cblx0LyoqXG5cdCAqINCf0L7QtNC80LXRiNCw0YLRjCDQvNC10YLQvtC00Ysg0Log0L7QsdGK0LXQutGC0YNcblx0ICogQHN0YXRpY1xuXHQgKiBAbWVtYmVyb2YgRW1pdHRlclxuXHQgKiBAcGFyYW0gICB7T2JqZWN0fSAgdGFyZ2V0ICAgINGG0LXQu9GMXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9XG5cdCAqL1xuXHRFbWl0dGVyLmFwcGx5ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXHRcdHRhcmdldC5vbiA9IEVtaXR0ZXIuZm4ub247XG5cdFx0dGFyZ2V0Lm9mZiA9IEVtaXR0ZXIuZm4ub2ZmO1xuXHRcdHRhcmdldC5vbmUgPSBFbWl0dGVyLmZuLm9uZTtcblx0XHR0YXJnZXQuZW1pdCA9IEVtaXR0ZXIuZm4uZW1pdDtcblx0XHR0YXJnZXQudHJpZ2dlciA9IEVtaXR0ZXIuZm4udHJpZ2dlcjtcblx0XHRyZXR1cm4gdGFyZ2V0O1xuXHR9O1xuXG5cblx0Ly8g0JLQtdGA0YHQuNGPINC80L7QtNGD0LvRj1xuXHRFbWl0dGVyLnZlcnNpb24gPSBcIjAuNC4wXCI7XG5cblxuXHQvLyBleHBvcnRzXG5cdEVtaXR0ZXIuRXZlbnQgPSBFdmVudDtcblx0RW1pdHRlci5nZXRMaXN0ZW5lcnMgPSBnZXRMaXN0ZW5lcnM7XG5cblxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIChkZWZpbmUuYW1kIHx8IC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovIGRlZmluZS5hanMpKSB7XG5cdFx0ZGVmaW5lKCdFbWl0dGVyJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBFbWl0dGVyO1xuXHRcdH0pO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdG1vZHVsZS5leHBvcnRzID0gRW1pdHRlcjtcblx0fSBlbHNlIHtcblx0XHR3aW5kb3cuRW1pdHRlciA9IEVtaXR0ZXI7XG5cdH1cbn0pKCk7XG4iXSwic291cmNlUm9vdCI6IiJ9