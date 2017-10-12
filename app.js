const inquirer = require('inquirer');
const BasicCard =  require("./BasicCard.js");
const ClozeCard = require('./ClozeCard.js');
const library = require('./library.json');
const fs = require('fs');

var pullCard;
var currentCard;
var count =0;
//function that creates the opening menu
function mainMenu(){
	inquirer.prompt([
		{
			type:"list",
			message:"\nPlease select one of the following menu options from the following list.",
			choices: ["create", "use cards"],
			name: 'menuList'
		}
//function that takes the user's answer and then runs function related to their choice
		]).then(function (answer) {

			var msgTime;

			switch (answer.menuList){

				case 'create':
				console.log("Lovely, time to make a new flash card!")
				msgTime =  setTimeout(newCard, 1000);
				break;

				case 'use cards':
				console.log("Perfect, time to test your knowledge")
				msgTime = setTimeout(askQ,1000);
				break;

				default:
				console.log("");
				console.log("Error");

			}
		});
};

mainMenu();

//function that creates a new flash card
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

			if(cardChoice === "Basic Card"){// creates a basic card
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


			]).then(function(card){// takes basic card input and assigns it and then writes to library

				var cardObject = {
					type: "BasicCard",
					front: card.front,
					back: card.back
				};

				library.push(cardObject);
				fs.writeFile('library.json'),

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
				
			} else {

				inquirer.prompt([ //takes in input for the cloze card if basic card is not users choice

				{
					type: 'input',
					message: 'write your complete statement',
					name: 'text'
				},

				{
					type: 'input',
					message: 'write the portion of the text you want to hide',
					name: 'cloze'
				}


				]).then(function (data){// takes input, assigns, and then write to library

					var cardObject = {
						type: "ClozeCard",
						text: data.text,
						cloze: data.cloze
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



//function used to get the question from the drawnCard in the askQuestions function
function getQ(card) {
    if (card.type === "BasicCard") {					
        drawnCard = new BasicCard(card.front, card.back);	
        return drawnCard.front;								
    } else if (card.type === "ClozeCard") {					
        drawnCard = new ClozeCard(card.text, card.cloze)	
        return drawnCard.clozeRemove();					
    }
};


//function to ask questions from all stored card in the library
function askQ() {
    if (count < library.length) {		
        playedCard = getQ(library[count]);	
        inquirer.prompt([				
            {
                type: "input",
                message: playedCard,
                name: "question"
            }
        ]).then(function (answer) {					
        	//if the users answer equals .back or .cloze of the playedCard run a message "You are correct."
            if (answer.question === library[count].back || answer.question === library[count].cloze) {
                console.log("You are correct.");
            } else {
            	//check to see if current card is Cloze or Basic
                if (drawnCard.front !== undefined) { 
                    console.log("Sorry, the correct answer was ") + library[count].back + "."; 
                } else { // otherwise it is a Cloze card
                    console.log("Sorry, the correct answer was ") + library[count].cloze + ".";
                }
            }
            count++; 		
            askQ();
        });
    } else {
      	count=0;			
      	mainMenu();			
    }
};

