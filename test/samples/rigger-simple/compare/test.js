var test = true;

/*
 * ## qsa(selector, element)
 * 
 * This function is used to get the results of the querySelectorAll output in the fastest
 * possible way.  This code is very much based on the implementation in 
 * [zepto](https://github.com/madrobby/zepto/blob/master/src/zepto.js#L104), but perhaps 
 * not quite as terse.
 */
var qsa = (function() {
    var classSelectorRE = /^\.([\w\-]+)$/,
        idSelectorRE = /^#([\w\-]+)$/,
        tagSelectorRE = /^[\w\-]+$/;
    
    return function(selector, scope) {
        var idSearch;
        
        // default the element to the document
        scope = scope || document;
        
        // determine whether we are doing an id search or not
        idSearch = scope === document && idSelectorRE.test(selector);
        
        // perform the search
        return idSearch ? 
            // we are doing an id search, return the element search in an array
            [scope.getElementById(RegExp.$1)] :
            // not an id search, call the appropriate selector
            Array.prototype.slice.call(
                classSelectorRE.test(selector) ? scope.getElementsByClassName(RegExp.$1) :
                tagSelectorRE.test(selector) ? scope.getElementsByTagName(selector) : 
                scope.querySelectorAll(selector)
            );
    };
}());