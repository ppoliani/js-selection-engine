App.ns('Lexer');

App.Lexer = (function(SelectorTypes){
	'use strict';
	
	// Lexer Class
	function Lexer(){
		this.text = undefined;
		this.index = 0;
		this.ch = undefined;
		this.tokens = [];
	}

	Lexer.prototype = {
		constructor: Lexer,

		lex: lex,
		isNumber: isNumber,
		skip: skip,
		isNested: isNested,
		readString: readString,
		hasReachedTheEnd: hasReachedTheEnd,
	};


	/**
	 * Fills up the token list
	 */
	function lex(text){
		this.text = text;
		this.index = 0;
		this.ch = undefined;
		this.tokens = [];

		while (this.index < this.text.length) {
			this.ch = this.text.charAt(this.index);

			if (isElementSelector(this.ch)) {
				this.readString(SelectorTypes.Element);
			} 
			else if (isIdSelectector(this.ch)) {
				this.skip();
				this.readString(SelectorTypes.Id);
			} 
			else if (isClassSelectector(this.ch)) {
				this.skip();
				this.readString(SelectorTypes.ClassName);
			} 
			else if (isDescendantSelector(this.ch)) {
				this.skip();
			} 
			else {
				throw 'Unexpected next character: ' + this.ch;
			}
		}

		return this.tokens;
	}

	/**
	 * Checks if the given character signal the start of 
	 * an elmement selector
	 */
	function isElementSelector(ch){
		return !isNumber(ch) && isPermittedChar(ch) ;
	}


	/**
	 * Checks if the given character signal the start of 
	 * an id selector
	 */
	function isIdSelectector(ch){
		return ch === '#';
	}

	/**
	 * Checks if the given character signal the start of 
	 * a class selector
	 */
	function isClassSelectector(ch){
		return ch === '.';
	}

	/**
	 * Checks if the given character signal the start of 
	 * a descendant selector
	 */
	function isDescendantSelector(ch){
		return ch === ' ';
	}

	/**
	 * Checks if the given character is a number
	 */
	function isNumber(ch){
		return '0' <= ch && ch <= '9';
	}

	/**
	 * Checks if the given character can be part
	 * of a selector name
	 */
	function isPermittedChar(ch){
		return ch !== '.' && 
			ch !== '#' && 
			ch !== '' &&
			ch !== ' ';
	}

	/**
	 * Skips the current position of the cursor
	 */
	function skip(){
		this.index += 1;
	}

	/**
	 * Checks if the gicen selector is descendent
	 */
	function isNested(tokenLength){
		return this.text.charAt(this.index - tokenLength - 1) === ' ' ||
			this.text.charAt(this.index - tokenLength - 2) === ' ';
	}

	/**
	 * Returns a boolean value that indicates if we reached the end of the text
	 */
	function hasReachedTheEnd(){
		return !this.text.charAt(this.index + 1);
	}

	/**
	 * Read a selector name
	 */
	function readString(type){
		var string = '';
		while (this.index < this.text.length + 1) {
			var ch = this.text.charAt(this.index);
			
			if (!isPermittedChar(ch)) {
				this.tokens.push({
					type: type,
					value: string,
					isNested: this.isNested(string.length)
				});

				return;
			} 
			else {
				string += ch;
			}

			this.index++;
		}
	}

	return Lexer;
})(App.SelectorTypes);