/*

[].slice.call(HTMLcollection) ==> elemnt array

document.querySelector('[id^=question_text_]').id 	                                                gets question text field (needs to be fed into document.getElementId)
    .parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0]    gets question field for multiple choice
        .children[0]                                                                                gets text field if text input     
        .children[0].children                                                                       gets the multiple choice fields for multiple choice question
            .children[0].children[0]                                                                    gets checkbox
            .children[0].children[1].innerText                                                          gets question text


//stores all question elements in questionElements
var spans = [].slice.call(document.getElementsByTagName("span"));
var questionElements = [];
for(let i = 0; i < spans.length; i++) {
    if(spans[i].id && spans[i].id.includes("question_text")) {
        console.log(questionElements.push(document.getElementById(spans[i].id)));
    }
}



*/


var info = {
    firstname: {
        value: "Your first name",
        quantifiers: ["First", "name"]
    },
    lastname: {
        value: "Your last name",
        quantifiers: ["Last", "name"]
    },
    cwid: {
        value: "Your CWID",
        quantifiers: ["Campus Wide ID", "CWID", "ID"]
    },
    studentType: {
        value: "Your undergraduateness",
        quantifiers: ["am an undergraduate student"]
    },
    email: {
        value: "Your email",
        quantifiers: ["STEVENS EMAIL", "email"]
    },
    phonenumber: {
        value: "Your phone number",
        quantifiers: ["Phone number", "phone", "Cell Phone"]
    }
}


//the main shit
var run = function() {
    let questions = getQuestions();
    let infoKeys = Object.keys(info);

    for(var i = 0; i < questions.length; i++) {
        let question = questions[i];
        let questionText = question.innerHTML;

        //test
        if(answerElementIsText(getAnswerElement(question))) {
            //is text element
            getAnswerElement(question).value = info[findRelaventKey(info, questionText)[0]].value;
        } else {
            //is multiple choice element
            let choices = getAnswerElement(question).children;
            //console.log(choices);
            let highest = 0;
            for(let ii = 0; ii < choices.length; ii++) {
                let choice = choices[ii];
                let result = findRelaventKey(info, getMultChoiceText(choice));
                //console.log(getMultChoiceText(choice), result);
                if(result[1] > 0 && result[1] > highest) {
                    selectMultipleChoice(choice);
                    highest = result[1];
                }
            }
        }
    }
}


//give info object and quantifier string (text is question string, mult choice is question + the optiono)
//returns info key
var findRelaventKey = function(info, quantifierString) {
    let keys = Object.keys(info);
    let scores = {};
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        scores[key] = 0;
        for(let ii = 0; ii < info[keys[i]].quantifiers.length; ii++) {
            let thisQuantifierSplit = info[keys[i]].quantifiers[ii].toLocaleLowerCase().split(" ");
            for(let iii = 0; iii < thisQuantifierSplit.length; iii++) {
                let thisQuantifier = thisQuantifierSplit[iii];
                if(quantifierString.toLocaleLowerCase().split(" ").includes(thisQuantifier)) {
                    scores[key]++;
                }
            }
        }
    }

    //return highest in score
    return getHighestScore(scores);
}


//get highest score
//return [key, score]
var getHighestScore = function(inputObject) {
    let highestScore = -Infinity;
    let keyOfHighestScore = '';

    // Iterate through each key-value pair in the object
    for (const [key, value] of Object.entries(inputObject)) {
        // Update the highest score and key if current score is higher
        if (value > highestScore) {
            highestScore = value;
            keyOfHighestScore = key;
        }
    }

    return [keyOfHighestScore, highestScore];
}


//get spans and filter by if question element
var getQuestions = function() {
    var spans = [].slice.call(document.getElementsByTagName("span"));
    var questionElements = [];
    for(let i = 0; i < spans.length; i++) {
        if(spans[i].id && spans[i].id.includes("question_text")) {
            questionElements.push(document.getElementById(spans[i].id));
        }
    }
    return questionElements;
}

//from text (span), get answer element
var getAnswerElement = function(element) {
    return element.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0];
}

//expects answer element
var answerElementIsText = function(element) {
    return (element.children.length === 0);
}

//get multiple choice answers
//expects answer element
//returns ordered element list
var getMultipleChoiceAnswers = function(element) {
    return [].slice.call(element.children)
}

//given multiple choice option element, return text
var getMultChoiceText = function(element) {
    return element.children[1].innerText;
}

//tick multiple choice answer
//expects multiple choice option element
var selectMultipleChoice = function(element) {
    element.children[0].click();
}

run();