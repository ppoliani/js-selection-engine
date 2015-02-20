(function(global, Parser, Lexer){
	'use strict';

	global.$ = function (selector) {
		var elements = [],
		  	tokens = parse(selector),
		  	SelectorTypes = App.SelectorTypes,
		  	mainNodes = [];

		if(!tokens.length){
			return elements;
		}

		switch(tokens[0].type){
			case SelectorTypes.Element:
				mainNodes = document.getElementsByTagName(tokens[0].value);
				break;
			case SelectorTypes.Id:
				mainNodes = [document.getElementById(tokens[0].value)];
				break;
			case SelectorTypes.ClassName:
				mainNodes = document.getElementsByClassName(tokens[0].value);
				break;
		}

		return findSpecificNodes(mainNodes, tokens.slice(1));
	}

	/**
	 * Parses the selector
	 */
	function parse(selector) {
		var lexer = new Lexer(),
			parser = new App.Parser(lexer);

		return parser.parse(selector);
	}

	/**
	 * Finds the specific elements  based on the childNodes and the
	 * reamining tokens
	 */
	function findSpecificNodes(mainElements, tokens){
		var elements = [],
			SelectorTypes = App.SelectorTypes;

		// convert to array
		elements = HTMLCollectionToArray(mainElements);

		tokens.forEach(function(token){
			elements = elements.filter(function(el){
				switch(token.type){
					case SelectorTypes.Id:
						return el.id === token.value;
					case SelectorTypes.ClassName:
						return el.className.indexOf(token.value) !== -1;
				}
			});
		});

		return elements;
	}

	/**
	 * Converts the HTMLCollection to an array; This is for IE8
	 * since the [].slice.call() doesn't work.
	 */
	function HTMLCollectionToArray(collection){
		var arr = [];
		
		for (var i = 0, length = collection.length; i < length; i++) {
		    arr.push(collection[i]);
		}

		return arr;
	}

})(window, App.Parser, App.Lexer);
