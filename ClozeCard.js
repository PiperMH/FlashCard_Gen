function ClozeCard(text,cloze){
	this.text = text;
	this.cloze = cloze;
};

function CCPrototype(){
	this.clozeMissing = function(){
		return '${this.text[0]} ... ${this.text[1]}';
	};
};

CCPrototype.prototype = new CCPrototype();

module.exports = ClozeCard;