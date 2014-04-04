// ==UserScript==
// @name         FinoRandom
// @description  Mother of god... no se puede procrastinar a gusto con un random tan poco random ¿y que cojones hago mirando el random? estudia hijo de puta
// @namespace    http://userscripts.org/users/68563/scripts
// @downloadURL  https://userscripts.org/scripts/source/446003.user.js
// @updateURL    https://userscripts.org/scripts/source/446003.meta.js
// @version      0.1
// @include      http://finofilipino.org*
// @exclude      */photoset_iframe/*
// ==/UserScript==
/*! FinoRandom (C) 2014 Elías Grande Cásedas | GNU-GPL | gnu.org/licenses */
(function(){
////////////

// ----------------------
// --- Some constants ---
// ----------------------

var RANDOM_PATH       = '/random';
var RANDOM_URL        = 'http://finofilipino.org' + RANDOM_PATH;
var STORAGE_ID        = 'FinoRandom.user.js';
var CSS_PREFIX        = 'FinoRandom_user_js_';
var RANDOM_LINK_QUERY = 'a[href="/random"]';
var MAX_URL_COUNT     = 40;
var MAX_REQUEST_TRIES = 10;

// -----------------------
// --- Interface style ---
// -----------------------

var AFTER_CLICK_STYLE =
	'cursor:'+'default;'+
	'text-decoration:'+'none;';

var CSS =
	// config link
	RANDOM_LINK_QUERY+'{'+
		'position:'+'relative;'+
	'}'+
	RANDOM_LINK_QUERY+' *{'+
		'margin:'+'0;'+
		'padding:'+'0;'+
		'float:'+'none;'+
		'text-align:'+'left;'+
	'}'+
	'.'+CSS_PREFIX+'linkconfig_wrapper{'+
		'position:'+'absolute;'+
		'top:'+'-500px;'+
		'left:'+'0;'+
		'z-index:'+'9000;'+
		'width:'+'300px;'+
		'height:'+'1px;'+
		'display:'+'none;'+
	'}'+
	'.'+CSS_PREFIX+'linkconfig_join{'+
		'height:'+'20px;'+
		'position:'+'absolute;'+
		'top:'+'-10px;'+
		'left:'+'0;'+
		'right:'+'0;'+
		'display:'+'none;'+
	'}'+
	RANDOM_LINK_QUERY+':hover .'+CSS_PREFIX+'linkconfig_wrapper,'+
	RANDOM_LINK_QUERY+':hover .'+CSS_PREFIX+'linkconfig_join{'+
		'display:'+'block;'+
	'}'+
	'.'+CSS_PREFIX+'linkconfig_wrapper b{'+
		'position:'+'relative;'+
		'top:'+'457px;'+
		'left:'+'3px;'+
		'display:'+'inline-block;'+
		'background:'+'#111;'+
		'opacity:'+'0.8;'+
		'border-radius:'+'10px;'+
		'padding:'+'5px 10px;'+
		'font-size:'+'0.7em;'+
		'line-height:'+'23px;'+
		'text-decoration:'+'underline;'+
	'}'+
	'.'+CSS_PREFIX+'linkconfig_wrapper b:hover{'+
		'color:'+'yellow;'+
	'}'+
	// config form
	'#'+CSS_PREFIX+'configform_wrapper,'+
	'.'+CSS_PREFIX+'bg{'+
		'position:'+'fixed;'+
		'top:'+'0;'+
		'bottom:'+'0;'+
		'left:'+'0;'+
		'right:'+'0;'+
		'vertical-align:'+'center;'+
	'}'+
	'.'+CSS_PREFIX+'bg{'+
		'position:'+'fixed;'+
		'background:'+'#000;'+
		'opacity:'+'0.95;'+
		'z-index:'+'9000;'+
	'}'+
	'.'+CSS_PREFIX+'box{'+
		'font-family:'+'sans-serif;'+
		'color:'+'#FFF;'+
		'position:'+'relative;'+
		'margin:'+'-190px 0 0 0;'+
		'top:'+'50%;'+
		'z-index:'+'9001;'+
	'}'+
	'.'+CSS_PREFIX+'title{'+
		'font-size:'+'1.5em;'+
		'line-height:'+'40px;'+
		'margin:'+'0;'+
	'}'+
	'.'+CSS_PREFIX+'field{'+
		'line-height:'+'25px;'+
		'margin:'+'25px 0 20px 0;'+
	'}'+
	'.'+CSS_PREFIX+'box input{'+
		'text-align:'+'center;'+
		'padding:'+'5px 2px;'+
		'font-size:'+'1em;'+
		'border:'+'1px solid #CCC;'+
		'border-radius:'+'3px;'+
		'margin:'+'1px;'+
	'}'+
	'.'+CSS_PREFIX+'box input:focus{'+
		'border:'+'2px solid #33F;'+
		'margin:'+'0;'+
		'border-radius:'+'3px;'+
	'}'+
	'.'+CSS_PREFIX+'field i{'+
		'color:'+'#AAF;'+
	'}'+
	'.'+CSS_PREFIX+'field a{'+
		'text-decoration:'+'none;'+
		'display:'+'inline-block;'+
		'line-height:'+'22px;'+
		'padding:'+'5px 10px;'+
		'margin:'+'15px 5px;'+
		'background:'+'#AAF;'+
		'color:'+'#001;'+
		'border:'+'1px solid #77C;'+
		'border-radius:'+'3px;'+
	'}'+
	'.'+CSS_PREFIX+'field a:hover{'+
		'background:'+'#AFA;'+
		'color:'+'#010;'+
		'border:'+'2px solid #7C7 !important;'+
		'margin:'+'14px 4px;'+
	'}'+
	'.'+CSS_PREFIX+'field a:focus{'+
		'border:'+'2px solid #33F;'+
		'margin:'+'14px 4px;'+
	'}';

var LOADING_IMAGE_HTML =
	'<img style="display:inline-block;width:16px;height:16px;margin:0 0 -1px'+
	' 10px" alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAFZiV////32Gft'+
	'LV0v///73BvaiuqJ2kniH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWphe'+
	'GxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbEx'+
	'wroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5'+
	'OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQ'+
	'oAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoK'+
	'wJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYum'+
	'CYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAA'+
	'AAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAA'+
	'Ah+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc'+
	'2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu'+
	'2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABA'+
	'AAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkA'+
	'AAOwAAAAAAAAAAAA==" />';

var CONFIG_LINK_HTML =
	'<b class="'+CSS_PREFIX+'linkconfig_wrapper" title="">'+
    	'<b id="'+CSS_PREFIX+'linkconfig">Configurar FinoRandom.user.js</b>'+
	'</b>'+
	'<b class="'+CSS_PREFIX+'linkconfig_join" title=""></b>';

var CONFIG_BOX_HTML =
	'<div id="'+CSS_PREFIX+'configform_wrapper">'+
		'<div class="'+CSS_PREFIX+'bg"></div>'+
		'<div class="'+CSS_PREFIX+'box">'+
			'<div class="'+CSS_PREFIX+'title">'+
				'Configuración de FinoRandom.user.js'+
			'</div>'+
			'<div class="'+CSS_PREFIX+'field">'+
				'Cantidad de URLs que recuerda<br/>'+
				'<i>Al llegar al máximo va olvidando las viejas</i>'+
			'</div>'+
			'<input type="text" value="" size="4" />'+
			'<div class="'+CSS_PREFIX+'field">'+
				'Número de intentos (peticiones máximas)<br/>'+
				'<i>Para no spamear demasiado el server</i>'+
			'</div>'+
			'<input type="text" value="" size="4" />'+
			'<div class="'+CSS_PREFIX+'field">'+
				'<a href="#Aceptar">Aceptar</a>'+
				'<a href="#Cancelar">Cancelar</a>'+
				'<a href="#Olvidar+URLS">Olvidar URLS</a>'+
			'</div>'+
		'</div>'+
	'</div>';

// ------------------------
// --- Common use stuff ---
// ------------------------

var win = window, doc;
try { if (unsafeWindow) win = unsafeWindow; } catch(e) {}
doc = win.document;

var querySelector = doc.querySelector.bind(doc);
var querySelectorAll = doc.querySelectorAll.bind(doc);

var addEventListener = function(obj, eventName, callback) {
	obj.addEventListener(eventName, callback, false);
};

var cancelEvent = function(e) {
	if (!e) e = win.event;
	if (e.stopPropagation) e.stopPropagation();
	if (e.cancelBubble != null) e.cancelBubble = true;
	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
};

var calledChecker = function() {
	return {
		_val : false,
		called : function() {
			var val = this._val;
			this._val = true;
			return val;
		}
	};
};

var onDOMContentLoaded = function(callback) {
	var actualCallback = function() {
		if (!this.called()) callback();
	}
	.bind(calledChecker());
	addEventListener(doc, "DOMContentLoaded", actualCallback);
};

var location = function(url) {
	if (arguments.length>0) win.location = url;
	return win.location;
};

var storage = function(id, data) {
	var ls = win.localStorage;
	if (arguments.length>1) {
		if (data === null) ls.removeItem(id);
		else               ls.setItem(id, JSON.stringify(data));
	}
	else {
		data = ls.getItem(id);
		if (data !== null) data = JSON.parse(data);
	}
	return data;
};

// 1 arg  (string) : add style block to head
// 2 args (DOMobj, string) : add css to DOMobj
// 1 arg  (DOMobj) : return DOMobj style attribute
var css = function(obj, css) {
	if (typeof(obj) === 'string') {
		// add style block to head
		var el = doc.createElement('style');
		el.setAttribute('type','text/css');
		if (el.styleSheet)
			el.styleSheet.cssText = obj;
		else
			el.appendChild(doc.createTextNode(obj));
		var head = doc.getElementsByTagName("head")[0];
		head.appendChild(el);
		return obj;
	}
	var str = obj.getAttribute('style');
	if (!str) str = '';
	if (css) {
		// add css to given obj
		str = [str,css].join(
			/\S.*\;\s*$/.test(str) ? '' : ';');
		obj.setAttribute('style',str);
	}
	return str;
};

// ---------------------------
// --- Visited random urls ---
// ---------------------------

var visited = {
	data : {
		maxlen   : MAX_URL_COUNT,
		maxtries : MAX_REQUEST_TRIES,
		urls     : []
	},
	remainingtries : MAX_REQUEST_TRIES,
	load : function() {
		var data = storage(STORAGE_ID);
		if (data) for (var i in this.data) if (i in data)
			this.data[i] = data[i];
		this.remainingtries = this.data.maxtries;
		return this;
	},
	clean : function() {
		this.data.urls = [];
		this.save();
	},
	set : function(maxlen, maxtries) {
		if (!maxlen || /\D/.test(maxlen+'') || maxlen*1 < 0)
			throw new Error('Has puesto "'+maxlen+'" como número máximo '+
				'de URLs, WTF?, necesito un número mayor o igual que 0.');
		if (!maxtries || /\D/.test(maxtries+'') || maxtries*1 < 3)
			throw new Error('Has puesto "'+maxtries+'" como número máximo '+
				'de intentos, WTF?, necesito un número mayor o igual que 3.');
		this.data.maxlen   = maxlen*1;
		this.data.maxtries = maxtries*1;
		this.save();
	},
	save : function() {
		storage(STORAGE_ID, this.data);
		return this;
	},
	test : function(url) {
		if (--this.remainingtries < 1)
			return false;
		for (var i in this.data.urls)
			if (url === this.data.urls[i])
				return true;
		this.data.urls.unshift(url);
		this.data.urls = this.data.urls.slice(0,this.data.maxlen);
		this.save();
		return false;
	}
}

// -------------------
// --- Config form ---
// -------------------

var configForm = {
	created : false,
	create : function() {
		this.created = true;
		var el = doc.createElement('div');
		el.innerHTML = CONFIG_BOX_HTML;
		doc.querySelector("body").appendChild(el);
		this.form = el.querySelector('#'+CSS_PREFIX+'configform_wrapper');
		var inputs = this.form.querySelectorAll('input');
		this.inputMaxlen   = inputs[0];
		this.inputMaxtries = inputs[1];
		var buttons = this.form.querySelectorAll('a');
		this.buttonAccept = buttons[0];
		this.buttonCancel = buttons[1];
		this.buttonClean  = buttons[2];
		addEventListener(this.form, 'click', this.close.bind(this));
		addEventListener(this.inputMaxlen, 'click', cancelEvent);
		addEventListener(this.inputMaxtries, 'click', cancelEvent);
		addEventListener(this.buttonAccept, 'click',
			this.onAccept.bind(this));
		addEventListener(this.buttonCancel, 'click',
			this.onCancel.bind(this));
		addEventListener(this.buttonClean,  'click',
			this.onClean.bind(this));
	},
	open : function(e) {
		cancelEvent(e);
		if (this.created) this.form.setAttribute('style','');
		else this.create();
		this.inputMaxlen.value   = visited.data.maxlen;
		this.inputMaxtries.value = visited.data.maxtries;
		this.inputMaxlen.select();
	},
	close : function(e) {
		cancelEvent(e);
		try {this.form.setAttribute('style','display:none');}
		catch(e){}
	},
	onAccept : function(e){
		cancelEvent(e);
		try {
			visited.set(this.inputMaxlen.value, this.inputMaxtries.value);
			alert('Todo ok, info guardada');
			this.close(e);
		}
		catch (err) {
			alert (err);
		}
	},
	onCancel : function(e){
		cancelEvent(e);
		this.inputMaxlen.value   = visited.data.maxlen;
		this.inputMaxtries.value = visited.data.maxtries;
		this.close(e);
	},
	onClean  : function(e){
		cancelEvent(e);
		visited.clean();
		alert('Todo ok, historial de randoms eliminado');
		this.close(e);
	}
};

// ---------------------------
// --- Request random urls ---
// ---------------------------

var requestRandomUrl = function(callback) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState === 4) {
			if (this.called()) return;
			try {
				var url = httpRequest.responseText
					.match(/\<meta[^\>]*\sproperty\s*\=\s*\"og\:url\"[^\>]*\>/)
					.pop()
					.match(/\scontent\s*\=\s*\"([^\"]+)\"/)
					.pop();
				callback(null, url);
			}
			catch (err) {
				callback(err, null);
			}
		}
	}
	.bind(calledChecker());
	httpRequest.open('GET', RANDOM_URL, true);
	httpRequest.send(null);
};

var requestNewRandomUrl = function(callback) {
	requestRandomUrl(function(err, url) {
		if (err) return callback(err, null);
		if (visited.test(url))
			requestNewRandomUrl(callback);
		else
			callback(null, url);
	});
};

// -----------------------------------------------------
// --- Go go go, alter the motherfucking random link ---
// -----------------------------------------------------v

var onDOMContentLoadedHandler = function() {
	var randomLink = doc.querySelector(RANDOM_LINK_QUERY);
	if (!randomLink) return;
	css(CSS);
	visited.load();
	randomLink.innerHTML += CONFIG_LINK_HTML;
	addEventListener(
		doc.getElementById(CSS_PREFIX+'linkconfig'),
		'click', configForm.open.bind(configForm)
	);
	var handler = function(e) {
		cancelEvent(e);
		if (this.called()) return;
		randomLink.innerHTML += LOADING_IMAGE_HTML;
		css (randomLink, AFTER_CLICK_STYLE);
		requestNewRandomUrl(function(err,url) {
			if (err) location(RANDOM_URL);
			else     location(url);
		});
	}
	.bind(calledChecker());
	addEventListener(randomLink, 'click', handler);
};

onDOMContentLoaded(onDOMContentLoadedHandler);

/////
})();