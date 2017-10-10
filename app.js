const inquirer = require('inquirer');
const BasicCard =  require("./BasicCard.js");
const ClozeCard = require('./ClozeCard.js');
const library = require('./library.json');
const fs = require('fs');

var pullCard;
var currentCard;


function mainMenu(){
	inquirer.prompt([
		{
			type:"list",
			message:"\nPlease select one of the following menu options from the following list.",
			choices: ["create", "use cards"],
			name: 'menuList'
		}

		]).then(function (answer) {

			var msgTime;

			switch (answer.menuList){

				case 'create':
				console.log("Lovely, time to make a new flash card!")
				msgTime =  setTimeout(createCard, 1000);
				break;

				case 'use cards'
				console.log("Perfect, time to test your knowledge")
				msgTime = setTimeout(knoledgeTime,1000);
				break;

				default:
				console.log("");
				console.log("Error");

			}
		});
};

mainMenu();

function newCard(){
	inquirer.prompt([

	{
		type: 'list',
		message: 'What type of card would you like to make?',
		choices: ['Basic Card', 'Cloze Card'],
		name: 'cardChoice'
	}

		]).then(function(app){

			var cardChoice = app.cardChoice;
			console.log(cardChoice);

			if(cardChoice === "Basic Card"){
				inquirer.prompt([

				{
					type: 'input',
					message: 'Please fill out the front of the card with your question',
					name: 'front'
				},

					
				{
					type: 'input',
					message: 'Please fill out the back of the card with your answer',
					name: 'back'
				}


			]).then(function(card){

				var cardObject = {
					type: "BasicCard",
					front: card.front,
					back: card.back
				};

				library.push(cardObject);
				fs.writeFile('library.json'),

				inquirer.prompt([

					{
						type: 'list';
						message: "Would you like to make another flash card?"
						choices: ['yes', 'no'],
						name: 'anotherOne'
					}

				]).then(function (app) {

					if(app.anotherOne === 'yes'){
						newCard();

					} else {
						setTimeout(mainMenu, 1000);
					}

				});

			});
				
			} else {

				inquirer.prompt([

				{
					type: 'input',
					message: 'write your complete statement',
					name: 'text'
				},

				{
					type: 'input'
					message: 'write the portion of the text you want to hide'
					name: 'cloze'
				}


				]).then(function (card){

					var cardObject = {
						type: "ClozeCard",
						text: card.text,
						cloze: card.cloze
					};

					if(cardObject.text.indexOf(cardObject.cloze) !== -1){

						library.push(cardObject);
						fs.writeFile('library.json', JSON.stringify(library, null, 2));

					} else {

						console.log("Whoops, the cloze does not match anywords in your statement.")

					}


					inquirer.prompt([

						{
							type: 'list',
							message: "Would you like to make another flash card?",
							choices: ['yes', 'no'],
							name: 'anotherOne'
						}

					]).then(function (app) {

						if(app.anotherOne === 'yes'){

							newCard();

						} else {

							setTimeout(mainMenu, 1000);
							
						}
					});
				});
			}

		});
};


