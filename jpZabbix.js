jpZabbix = function(options) {

	config = {};
	// initialize options
	Object.assign(config, {
		// default settings
		url: 'http://localhost/zabbix/api_jsonrpc.php',
		user: 'Admin',
		password: 'zabbix'
	}, options);

	// initialize variables
	var rpcid = 0;
	var authid = null;
	var apiversion = null;
	var errormsg = null;


	function createPostData(method, params) {

		// check method option
		if (method === null || typeof method === 'undefined') {
			return false;
		}

		// check params option
		if (params === null || typeof params === 'undefined') {
			params = {};
		}

		// default params
		params = Object.assign(params, {
			limit: config.limit
		});

		// create sending data
		var data = {
			jsonrpc: '2.0',
			id: ++rpcid,
			auth: authid,
			method: method,
			params: params
		};

		return JSON.stringify(data);
	}

	this.api = function(method, params) {
		
		return new Promise(function(resolve, reject) {

			var req = new XMLHttpRequest();
			req.open('POST', config.url);
			req.setRequestHeader("Content-Type", "application/json");
			if (config.basicAuth) {req.setRequestHeader("Authorization", "Basic " + btoa(config.user+":"+config.password));};
			if (config.timeout) {req.timeout = config.timeout;};

			req.onload = function() {
				// This is called even on 404 etc
				// so check the status
				if (req.status == 200) {
					// Resolve the promise with the response text
					var zabbixResult = JSON.parse(req.response);
					//console.log(result, req.status, req.statusText);
					if (zabbixResult.result) {
						resolve(zabbixResult.result);
					} else {
						reject(zabbixResult.error);
					};
				} else {
					reject({'code':req.status, 'data':req.statusText, 'message':req.statusText});
				}
			};

			// Handle network errors
			req.onerror = function() {
			  reject({'code':req.status, 'data':req.responseText, 'message':req.statusText});
			};

			// Make the request
			var postData = createPostData(method, params)
			
			if (postData) {
				req.send(postData)
			} else {
				reject({code:-32600, data:'Invalid Request', message:"The received JSON is not a valid JSON-RPC Request."})
			};
		});
	}

	this.setAuth = function(token) {
		
		if (config.basicAuth) {return false}
		
		delete config.user;
		delete config.password;
		
		authid = token;
		
		return true;
	};

	function clearAuth() {
		authid = null;
		
		return true;
	};

	this.init = function() {
		rpcid = 0;
		authid = null;
		apiversion = null;
		errormsg = null;

		return this.getApiVersion().then(this.login());
	}

	this.setOptions = function(addoptions) {

		Object.assign(config, addoptions);
		
		return true;
		
	}

	function setApiVersion(version) {
		
		apiversion = version;
		
		return true;
	};

	this.logout = function() {
		if (!authid) {return false};
		
		return this.api(method, []).then(clearAuth)
	};
	
	this.login = function() {
		
		if (config.basicAuth || authid) {return false;};
		
		rpcid = 0;
		
		switch (apiversion) {
		default:
			var method = 'user.login';
			break;
		};
		
		return this.api(method, {user:config.user, password:config.password}).then(this.setAuth)
	};

	this.getApiVersion = function() {

		return this.api('apiinfo.version',[]).then(setApiVersion)
		
	}
	
	this.getConfig = function() {
		return config;
	};
};
