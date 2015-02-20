App.ns('Parser');

App.Parser = (function(){	
	'use strict';

	// Parser Class
	function Parser(lexer){
		this.lexer = lexer;
		this.tokers = [];
	}

	Parser.prototype = {
		constructor: Parser,

		parse: parse
	};

	function parse(text){
		this.tokens = this.lexer.lex(text);

		return this.tokens;
	}

	return Parser;
})();