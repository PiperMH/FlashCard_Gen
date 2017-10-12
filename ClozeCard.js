function ClozeCard(text,cloze){
	this.text = text;
	this.cloze = cloze;
};

function ClozeCardPrototype(){
	this.clozeRemove = function(){
		return this.text[0] + this.text[1];
	};
};

ClozeCard.prototype = new ClozeCard();

module.exports = ClozeCard;