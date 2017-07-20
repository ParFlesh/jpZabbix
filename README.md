# jpZabbix
Promised based Javascript Library for Zabbix Api

## Usage

### Include
```html
<script type="text/javascript" src="https://parflesh.github.io/jpZabbix/jpZabbix.js"></script>
```

#### Method 1
User and password
```javascript
var server = new jpZabbix({'url':'http://localhost/zabbix/api_jsonrpc.php','user':'Admin','password':'zabbix'}) \\Create instance
server.init() \\ Initialize instance
server.api('host.get',{}).then(success,failure) \\ Make API call and send results to success function or error to failure function
```

#### Method 2
zabbix user authentication token
```javascript
var server = new jpZabbix({'url':'http://localhost/zabbix/api_jsonrpc.php'}) \\Create instance
server.setAuth(token)
server.api('host.get',{}).then(success,failure) \\ Make API call and send results to success function or error to failure function
```
