$t = imorumjs.sys.CSS = function CSS(){}

// Convert dash css style into camelCase
$t.camelCase = function(string){
	var msPrefix = /^-ms-/;  // "-ms-"
	var dashAlphaNum = /-([\da-z])/gi; // "-[0-9a-z]" global, ignore case
	
	function toCamelCase( all, letter ) {
		return ( letter + "" ).toUpperCase();
	}

	return string.replace( msPrefix, "ms-" ).replace( dashAlphaNum, toCamelCase );
}
