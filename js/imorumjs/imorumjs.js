// Non Browser Support
this.window = this;

// Pre-register imorumjs namespace
window.imorumjs = {};

// HTTPRequest
$s = imorumjs.sys = {};

$s.selectHttpRequest = function selectHttpRequest() {
	if (window.XMLHttpRequest) // Gecko
		return new XMLHttpRequest();
	else if (window.ActiveXObject) // IE
		return new ActiveXObject("MsXml2.XmlHttp");
}

$s.request = function request(caller, type, url, callback) {
	var httpReq = imorumjs.sys.selectHttpRequest();
	httpReq.open(type, url, false);
	httpReq.send(null);
	if (httpReq.status == 200 || httpReq.status == 304) {
		if (callback)
			callback.call(caller, url, httpReq.responseText);
	} else {
		alert('Request error: ' + httpReq.statusText + ' (' + httpReq.status
				+ ')');
	}
}

$s.requestGet = function requestGet(caller, url, callback) {
	imorumjs.sys.request(caller, 'GET', url, callback);
}

// Helper
$s = imorumjs.helper = {};

$s.isArray = function isArray(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

$s.processObjectOrArray = function processObjectOrArray(caller, val, objproc, arrproc) {
	if (!this.isArray(val)) {
		objproc.call(caller, val);
	} else {
		for ( var i = 0; i < val.length; i++) {
			arrproc.call(caller, val, i);
		}
	}
}

$s.DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		DOCUMENT_NODE 	   : 9
	};

$s.getNodeLocalName = function getNodeLocalName( node ) {
	var nodeLocalName = node.localName;			
	if(nodeLocalName == null) // Yeah, this is IE!! 
		nodeLocalName = node.baseName;
	if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
		nodeLocalName = node.nodeName;
	return nodeLocalName;
}

$s.getNodePrefix = function getNodePrefix(node) {
	return node.prefix;
}

$s.parseDOMChildren = function parseDOMChildren( node ) {
	if(node.nodeType == this.DOMNodeTypes.DOCUMENT_NODE) {
		var result = new Object;
		var child = node.firstChild; 
		var childName = this.getNodeLocalName(child);
		result[childName] = this.parseDOMChildren(child);
		return result;
	}
	else
	if(node.nodeType == this.DOMNodeTypes.ELEMENT_NODE) {
		var result = new Object;
		result.__cnt=0;
		
		var nodeChildren = node.childNodes;
		
		// Children nodes
		for(var cidx=0; cidx <nodeChildren.length; cidx++) {
			var child = nodeChildren.item(cidx); // nodeChildren[cidx];
			var childName = this.getNodeLocalName(child);
			
			result.__cnt++;
			if(result[childName] == null) {
				result[childName] = this.parseDOMChildren(child);
			}
			else {
				if(result[childName] != null) {
					if( !(result[childName] instanceof Array)) {
						var tmpObj = result[childName];
						result[childName] = new Array();
						result[childName][0] = tmpObj;
					}
				}
				var aridx = 0;
				while(result[childName][aridx]!=null) aridx++;
				(result[childName])[aridx] = this.parseDOMChildren(child);
			}			
		}
		
		// Attributes
		for(var aidx=0; aidx <node.attributes.length; aidx++) {
			var attr = node.attributes.item(aidx); // [aidx];
			result.__cnt++;
			result["_"+attr.name]=attr.value;
		}
		
		// Node namespace prefix
		var nodePrefix = this.getNodePrefix(node);
		if(nodePrefix!=null && nodePrefix!="") {
			result.__cnt++;
			result.__prefix=nodePrefix;
		}
		
		if( result.__cnt == 1 && result["#text"]!=null  ) {
			result = result["#text"];
		} 
		
		if(result["#text"]!=null) {
			delete result["#text"];
		}
		if(result["#cdata-section"]!=null) {
			delete result["#cdata-section"];
		}
		delete result["__cnt"];
		return result;
	}
	else
	if(node.nodeType == this.DOMNodeTypes.TEXT_NODE || node.nodeType == this.DOMNodeTypes.CDATA_SECTION_NODE) {
		return node.nodeValue;
	}	
}

$s.parseXmlString = function parseXmlString(xmlDocStr) {
	var xmlDoc;
	if (window.DOMParser) {
		var parser=new window.DOMParser();			
		xmlDoc = parser.parseFromString( xmlDocStr, "text/xml" );
	}
	else {
		// IE :(
		if(xmlDocStr.indexOf("<?")==0) {
			xmlDocStr = xmlDocStr.substr( xmlDocStr.indexOf("?>") + 2 );
		}
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async="false";
		xmlDoc.loadXML(xmlDocStr);
	}
	return xmlDoc;
}

$s.xml_str2json = function xml_str2json(xmlDocStr) {
	var xmlDoc = this.parseXmlString(xmlDocStr);	
	return this.parseDOMChildren(xmlDoc);
}

// Plugin system
$s = imorumjs.Plugin = {
	repositoryFile : "repositories.xml",
	repositoryInfos : [],
	loadedComponents: []
};

$s.includeJS = function includeJS(fileUrl) {
	var elHead = document.getElementsByTagName('HEAD').item(0);
	var elScript = document.createElement("script");
	elScript.language = "javascript";
	elScript.type = "text/javascript";
	elScript.src = fileUrl;
	elHead.appendChild(elScript);
}

$s.__getRepositoryInfo = function __getRepositoryInfo(url) {
	var storedInfo = null;
	imorumjs.sys.requestGet(this, url + 'repository.xml', function(url,
			response) {
		storedInfo = imorumjs.helper.xml_str2json(response);
	});
	return storedInfo;
}

$s.__readRepoId = function __readRepoId(storedInfo) {
	return storedInfo.config.repositoryId;
}

$s.__readComponents = function __readComponents(storedInfo) {
	var components = [];
	var arrComponents = storedInfo.config.components.component;
	imorumjs.helper.processObjectOrArray(this, arrComponents, function(obj) {
		var versions = [];
		imorumjs.helper.processObjectOrArray(this, obj.versions.version, function(obj) {
			versions.push(obj);
		}, function(arrVer, j) {
			versions.push(arrVer[j]);
		});
		components.push({
			'groupId' : obj.groupId,
			'componentId' : obj.componentId,
			'versions' : versions
		});
	}, function(arr, i) {
		var versions = [];
		imorumjs.helper.processObjectOrArray(this, arr[i].versions.version, function(obj) {
			versions.push(obj);
		}, function(arrVer, j) {
			versions.push(arrVer[j]);
		});
		components.push({
			'groupId' : arr[i].groupId,
			'componentId' : arr[i].componentId,
			'versions' : versions
		});
	});
	return components;
}

$s.readRepositoryConfig = function readRepositoryConfig(repositoryFile) {
	var storedConfig;
	if (repositoryFile == null)
		repositoryFile = imorumjs.Plugin.repositoryFile;
	imorumjs.sys
			.requestGet(
					this,
					repositoryFile,
					function(fileUrl, response) {
						storedConfig = imorumjs.helper.xml_str2json(response);
						var arrRepos = storedConfig.repositories.url;
						imorumjs.helper.processObjectOrArray(
								this,
								arrRepos,
								function(obj) {
									var storedInfo = imorumjs.Plugin
											.__getRepositoryInfo(obj);
									imorumjs.Plugin.repositoryInfos.push({
										'id' : imorumjs.Plugin
												.__readRepoId(storedInfo),
										'url' : obj,
										'components' : imorumjs.Plugin
												.__readComponents(storedInfo)
									});
								},
								function(arr, i) {
									// check for duplication by url
									var exist = false;
									for ( var j = 0; j < imorumjs.Plugin.repositoryInfos.length; j++) {
										if (imorumjs.Plugin.repositoryInfos[j].url == arr[i]) {
											exist = true;
											break;
										}
									}
									if (!exist) {
										// check again for duplication by id
										var storedInfo = imorumjs.Plugin
												.__getRepositoryInfo(arr[i]);
										var repositoryId = imorumjs.Plugin
												.__readRepoId(storedInfo);
										for ( var j = 0; j < imorumjs.Plugin.repositoryInfos.length; j++) {
											if (imorumjs.Plugin.repositoryInfos[j].id == repositoryId) {
												exist = true;
												break;
											}
										}
										if (!exist) {
											imorumjs.Plugin.repositoryInfos
													.push({
														'id' : repositoryId,
														'url' : arr[i],
														'components' : imorumjs.Plugin
																.__readComponents(storedInfo)
													});
										}
									}
								});
					});
}

$s.registerComponent = function registerComponent(componentId, version, dependencies, onDependenciesLoaded) {
	if(dependencies!=null)
	{
		for(var i=0; i<dependencies.length; i++){
			var loadedComponent = null;
			for(var j=0; j<this.loadedComponents.length; j++){
				if(dependencies[i].id === this.loadedComponents[j].id){
					loadedComponent=this.loadedComponents[j];
					break;
				}
			}
			if(loadedComponent === null){
				imorumjs.Plugin.require(dependencies[i].id, dependencies[i].version);
			}else if(dependencies[i].version !== loadedComponent.version){
				alert('Warning: Component ' + loadedComponent.id + ' is already loaded at version ' + loadedComponent.version + 
						'.\nDependant Component: ' + componentId + ' version ' + version );
			}
		}
	}
	// This should be called when all dependencies component have been loaded
	if(onDependenciesLoaded!=null){
		if(onDependenciesLoaded.call(this)){
			this.loadedComponents.push({'id': componentId, 'version': version});
		}
	}else{
		this.loadedComponents.push({'id': componentId, 'version': version});
	}
	// should check and call the dependant component onDependenciesLoaded
}

$s.require = function require(componentId, version){
	// Auto-load component
	var repoInfos = imorumjs.Plugin.repositoryInfos;
	// search through all repositories
	for(var j=0; j<repoInfos.length; j++){
		// scan components
		var components = repoInfos[j].components;
		for(var k=0; k<components.length; k++){
			if(componentId === components[k].componentId){
				var groupPath = components[k].groupId.replace(/\./g, '/');
				var versions = components[k].versions;
				var isVersionAvailable=false;
				for(var v=0; v<versions.length; v++){
					if(versions[v] === version){
						isVersionAvailable=true;
						break;
					}
				}
				var versionToLoad = versions[0];
				if(isVersionAvailable){
					versionToLoad = version;
				}else{
					// TODO: find in other repository first
					alert('Warning: Component ' + componentId + ' version ' + version + ' is not available, using version ' + versionToLoad + 'as default');
				}
				imorumjs.Plugin.includeJS( repoInfos[j].url + groupPath + '/' + components[k].componentId + '/' + versionToLoad + '/' + components[k].componentId + '-' + versionToLoad + '.js');						
			}
		}
	}	
}