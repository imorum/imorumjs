// Helper
imorumjs.Helper = {};

imorumjs.Helper.isArray = function(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
}

imorumjs.Helper.processObjectOrArray = function(caller, val, objproc, arrproc) {
	if (!this.isArray(val)) {
		objproc.call(caller, val);
	} else {
		for ( var i = 0; i < val.length; i++) {
			arrproc.call(caller, val, i);
		}
	}
}

imorumjs.Helper.DOMNodeTypes = {
		ELEMENT_NODE 	   : 1,
		TEXT_NODE    	   : 3,
		CDATA_SECTION_NODE : 4,
		DOCUMENT_NODE 	   : 9
	};

imorumjs.Helper.getNodeLocalName = function( node ) {
	var nodeLocalName = node.localName;			
	if(nodeLocalName == null) // Yeah, this is IE!! 
		nodeLocalName = node.baseName;
	if(nodeLocalName == null || nodeLocalName=="") // =="" is IE too
		nodeLocalName = node.nodeName;
	return nodeLocalName;
}

imorumjs.Helper.getNodePrefix = function(node) {
	return node.prefix;
}

imorumjs.Helper.parseDOMChildren = function( node ) {
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

imorumjs.Helper.parseXmlString = function(xmlDocStr) {
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

imorumjs.Helper.xml_str2json = function(xmlDocStr) {
	var xmlDoc = this.parseXmlString(xmlDocStr);	
	return this.parseDOMChildren(xmlDoc);
}

