var data = { "title" : "Jedi Quiz",
    "questions" : [
    {"prompt" : "Which of these most appeals to you?",
    "answers" : [{"answer" : "Glory", "value" : "dark"}, {"answer" : "Peace", "value" : "light"}, {"answer" : "Strength", "value" : "dark"}, {"answer" : "Knowledge", "value" : "light"}]},
    {"prompt": "There is a sealed door between you and your goal. How do you proceed?",
    "answers" : [{"answer" : "Smash it down", "value" : "force"}, {"answer" : "Slice the controls", "value" : "stealth"}, {"answer" : "Knock", "value" : "words"}]},
    {"prompt": "It's a dangerous galaxy. What do you rely on to keep you safe?",
    "answers" : [{"answer" : "My lightsaber", "value" : "force"}, {"answer" : "My fearsome reputation", "value" : "dark"}, {"answer" : "My way with words", "value" : "words"}, {"answer" : "Knowledge and foresight", "value" : "light"}, {"answer" : "My talent for remaining unseen", "value" : "stealth"}]},
    {"prompt": "You are aboard a starship, and the order is given to evacuate. You see a crew member pinned beneath fallen heavy objects. What do you do?",
    "answers" : [{"answer" : "Leave him. It's everyone for themselves!", "value" : "dark"}, {"answer" : "Help him. It's the right thing to do.", "value" : "light"}, {"answer" : "Extract a promise of payment or service if I save him.", "value" : "dark"}]},
    {"prompt": "A war breaks out between your home planet and another world. What do you do?",
    "answers" : [{"answer" : "Let the conflict rage, and seek ways to amass fortune and power amidst the chaos", "value" : "dark"}, {"answer" : "Seek a peaceful solution to the conflict", "value" : "light"}, {"answer" : "Make the enemy pay for messing with your home", "value" : "dark"}, {"answer" : "Seek a decisive victory to quickly end the conflict", "value" : "light"}]},
    {"prompt": "Which of these traits is most important?",
    "answers" : [{"answer" : "Selflessness", "value" : "light"}, {"answer" : "Power", "value" : "dark"}, {"answer" : "Justice", "value" : "light"}, {"answer" : "Wisdom", "value" : "light"}, {"answer" : "Ambition", "value" : "dark"}, {"answer" : "Passion", "value" : "dark"}]},
    {"prompt": "Which of these statements do you agree with most strongly?",
    "answers" : [{"answer" : "Much conflict could be avoided if people were willing to speak, and listen.", "value" : "words"}, {"answer" : "Words and subterfuge may fail, but strength and conviction can change the universe", "value" : "force"}, {"answer" : "If knowledge is power, remain unknown and you will never be bested", "value" : "stealth"}]},
    {"prompt" : "You are fighting your worst enemy, and you gain the upper hand. They yield and ask for mercy. What do you do?",
    "answers" : [{"answer" : "Kill them. Mercy is for the weak.", "value" : "dark"}, {"answer" : "Accept their surrender, but bring them to justice.", "value" : "light"}, {"answer" : "Let them live on the condition that they serve you from now on.", "value" : "dark"}, {"answer" : "Accept their surrender. You would never strike down a defenseless opponent.", "value" : "light"}]}
    ]
};

var quiz = {
  userAnswers : [],
  userAlignment : 0,
  userProf : [],
  userPosition : -1,
  getQuestion : function(direction) {
    var question;
    var userAnswered = this.getAnswers();
    if (userAnswered === undefined) {
      
    }
    display.destroyAnswers();
    if (this.userPosition < 7) {
      if (direction === 'forward') {
        this.userPosition++;
      } else if (this.userPosition > -1 && direction === 'backward') {
        this.userPosition--;
      }
      question = data.questions[this.userPosition];
      if (question === undefined) {
        return;
      }
      display.displayQuestion(question);
      display.displayAnswers(question);
      this.getUserChecked();
    } else {
      display.displayResult();
    }
  },
  
  getUserChecked : function() {
    if (!this.userAnswers[this.userPosition]) {
      return;
    } else {
      var index = this.userAnswers[this.userPosition].index;
      document.getElementsByTagName('input')[index].checked = true;
    }
  },
  
  getAnswers : function() {
    var answerList = document.getElementById('answers').children;
    var answerObj = {};
    for (var i = 0; i < answerList.length; i++) {
      if (document.getElementsByTagName('input')[i].checked) {
        answerObj.answer = answerList[i].firstChild.textContent, answerObj.value = document.getElementsByTagName('input')[i].value, answerObj.index = document.getElementsByTagName('input')[i].id;
        this.userAnswers[this.userPosition] = answerObj;
      }
    }
    if (answerObj.value === "light") {
      this.userAlignment++;
    } else if (answerObj.value === "dark") {
      this.userAlignment--;
    } else {
      this.userProf.push(answerObj.value);
    }
    return answerObj;
  },
  
  calculateResult : function() {
    var greeting;
    var caution;
    var profession;
    var duplicates;
    for (var i = 0; i < this.userProf.length; i++) {
      for (var j = i+1; j < this.userProf.length; j++) {
        if (this.userProf[i] === this.userProf[j]) {
          duplicates = this.userProf[i];
          break;
        }
      }
    }
    switch (duplicates) {
      case "force" :
        profession = [" Guardian", " Marauder"];
        break;
      case "words" : 
        profession = [" Consular", " Lord"];
        break;
      case "steatlth" :
        profession = [" Shadow", " Assassin"];
        break;
      default : 
        profession = [" Knight", " Warrior"];
    }
    if (this.userAlignment > 0) {
      greeting = "You are a Jedi";
    } else if (this.userAlignment <= 0) {
      greeting = "You are a Sith";
    }
    
    if (this.userAlignment > 1) {
      caution = ". You follow the path of the Light.";
      profession = profession[0];
    } else if (this.userAlignment >= -1) {
      profession = "";
      caution = ", but I sense much conflict in you. You must choose your path.";
    } else if (this.userAlignment < -1) {
      profession = profession[1];
      caution = ". The Dark side calls, and you answer.";
    } 
    return greeting + profession + caution;
  }
    
};

var handlers = {
  noAnswer : function() {
    var message = "You must answer the question";
  }
};

var display = {
  displayQuestion : function(question) {
    var output = document.querySelector('h2');
    output.textContent = question.prompt;
  },
  
  displayResult : function() {
    result = quiz.calculateResult();
    var output = document.querySelector('h2');
    output.textContent = result;
  },
  
  // displayAnswers : function(question) {
  //   var answerList = document.getElementById('answers');
  //   question.answers.forEach(function(answerObject) {
  //     var response = answerObject.answer;
  //     var newLabel = document.createElement('label');
  //     var newText = document.createTextNode(response);
  //     var newLi = document.createElement('li');
  //     var newRadioButton = document.createElement('input');
  //     newRadioButton.setAttribute('type', 'radio');
  //     newRadioButton.setAttribute('value', answerObject.value);
  //     newRadioButton.setAttribute('name', 'responses');
  //     newRadioButton.setAttribute('id', question.answers.indexOf(answerObject));
  //     newLabel.appendChild(newRadioButton);
  //     newLabel.appendChild(newText);
  //     newLi.appendChild(newLabel);
  //     answerList.appendChild(newLi);
  //   });
  // },
  
  displayAnswers : function(question) {
    var answerList = document.getElementById('answers');
    question.answers.forEach(function(answerObject) {
    var response = answerObject.answer;
    var newDiv = document.createElement('div');
    var newLabel = document.createElement('label');
    var newRadio = document.createElement('input');
    var newText = document.createTextNode(response);
    var outerSpan = document.createElement('span');
    var innerSpan = document.createElement('span');
    newRadio.setAttribute('type', 'radio'), newRadio.setAttribute('name', 'responses'), newRadio.setAttribute('id', question.answers.indexOf(answerObject)), newRadio.setAttribute('value', answerObject.value);
    newLabel.setAttribute('for', question.answers.indexOf(answerObject));
    outerSpan.appendChild(innerSpan);
    newLabel.appendChild(outerSpan);
    newLabel.appendChild(newText);
    newDiv.appendChild(newRadio), newDiv.appendChild(newLabel);
    answerList.appendChild(newDiv);
    });

  },
  
  destroyAnswers : function() {
    var answerList = document.getElementById('answers');
    do {
      if (answerList.lastChild.nodeName === 'DIV') {
        answerList.removeChild(answerList.lastChild);
    } 
    } while (answerList.children.length > 0);
  }
};