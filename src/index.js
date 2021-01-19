const showPlayerData = document.querySelector('.player-hand');
const showEnemyData = document.querySelector('.enemy-hand');
const showCardValPlayer = document.querySelector('.card-value-player');
const showCardValEnemy = document.querySelector('.card-value-enemy');
const showBetVal = document.querySelector('.bet-value');
const displayCredit = document.querySelector('.display-credit');
const betSection = document.querySelector('.bet-section');
const actionsBtnSection = document.querySelector('.actions');
const actionBtn = document.getElementsByClassName('action-btn');
const gameEndText = document.querySelector('.game-ended');
const displayHistory = document.querySelector('.history-of-game');
const submitBtn = document.querySelector('.submit');
const clearBtn = document.querySelector('.clear');
const url = 'https://deckofcardsapi.com/api/deck';

let deckId;
let roundNum = 0;
let betValue = 0;
let gameStat = "";
let wasHit = false;
let isCardShow=false;
let gameHistory = [];
let hands = {
  player: {
    credit: 1000,
    cardValue: 0,
    cards: []
  },
  enemy: {
    cardValue: 0,
    cards: []
  }
};

function getDeck(){
  let api = `${url}/new/shuffle/?deck_count=6`;
  hands.player.cardValue = 0;

  fetch(api).then(function(response){
    let data = response.json();
    return data;
  })
  .then(function(data){
    deckId = data.deck_id;
  })
  .then(function(){
    drawCards(deckId);
  });
}

// Check if game is Won or lose.
function gameStatus(){

  if(gameStat === ""){
    if(isCardShow){
      if(hands.player.cardValue == hands.enemy.cardValue && (hands.player.cardValue <= 21 && hands.enemy.cardValue <= 21)){
        hands.player.credit += Math.floor(betValue);
        gameStat = 'draw';
      }else if(hands.player.cardValue < 21 && hands.enemy.cardValue < hands.player.cardValue){
        hands.player.credit += Math.floor(betValue * 1.5);
        gameStat = 'won';
      }else if(hands.player.cardValue < 21 && hands.enemy.cardValue > 21){
        hands.player.credit += Math.floor(betValue * 1.5);
        gameStat = 'won';
      }else if(hands.enemy.cardValue < 21 && hands.enemy.cardValue > hands.player.cardValue){
        gameStat = 'lose';
      }else if(hands.enemy.cardValue == 21){
        gameStat = 'lose';
      }
    }else if(hands.player.cardValue == 21 && wasHit == false){
      hands.player.credit += Math.floor(betValue * 1.5);
      gameStat = 'bj'; // BLACK JACK
      isCardShow = true;
      displayHands();
    }else if(hands.player.cardValue == 21){
      hands.player.credit += Math.floor(betValue * 1.5);
      gameStat = 'won';
      isCardShow = true;
      displayHands();
    }else if(hands.player.cardValue > 21){
      gameStat = 'lose';
      isCardShow = true;
      displayHands();
    }
  }

  if(isCardShow || gameStat){
    if(gameStat == 'won'){
      showCardValPlayer.innerHTML = `You WON! With ${hands.player.cardValue} points!`;
      gameHistory.push(`Game Status: Player Won ${hands.player.cardValue} : ${hands.enemy.cardValue} points.`);
    }else if(gameStat == 'draw'){
      showCardValPlayer.innerHTML = `Draw! Your card value is ${hands.player.cardValue} points.`;
      gameHistory.push(`Game Status: Draw ${hands.player.cardValue} : ${hands.enemy.cardValue} points.`);
    }else if(gameStat == 'bj'){
      showCardValPlayer.innerHTML = `BLACK JACK!`;
      gameHistory.push(`Game Status: Player had Black Jack.`);
    }else{
      showCardValPlayer.innerHTML = `You Lose. With ${hands.player.cardValue} points.`;
      gameHistory.push(`Game Status: Player Lose ${hands.player.cardValue} : ${hands.enemy.cardValue} points.`);
    }
    betValue = 0;
    displayCredit.innerHTML = hands.player.credit;

    // Display only Next Round and New Game button
    hideActionBtn();
    displayGameHistory();
  }

}

function countValue(val = ''){
  let isAceEnemy = false;
  let isAcePlayer = false;
  hands.player.cardValue = 0;
  hands.enemy.cardValue = 0;

  // Count player Hand
   Object.keys(hands.player.cards).forEach(key => {
    let value = hands.player.cards[key].value;

    if(isNaN(value)){
      if(value == 'ACE'){
        if(key == 0){
          isAcePlayer = true;
        }else{
          let tmpVal = hands.player.cardValue;
          tmpVal += 11;

          if(tmpVal > 21){
            hands.player.cardValue = hands.player.cardValue + 1;
          }
          if(tmpVal <= 21){
            hands.player.cardValue = hands.player.cardValue + 11;
          }
        }
      }else{
        hands.player.cardValue = hands.player.cardValue + 10;
      }
    }else{
      hands.player.cardValue = hands.player.cardValue + +value;
    }

    if(isAcePlayer && key.length == key){
      let tmpVal = hands.player.cardValue;
      tmpVal += 11;

      if(tmpVal > 21){
        hands.player.cardValue = hands.player.cardValue + 1;
      }
      if(tmpVal <= 21){
        hands.player.cardValue = hands.player.cardValue + 11;
      }
      showCardValPlayer.innerHTML = hands.player.cardValue;
    }else{
      showCardValPlayer.innerHTML = hands.player.cardValue;
    }
    value = 0;
  });

  // Count Enemy Hand
  Object.keys(hands.enemy.cards).forEach(key => {
    let value = hands.enemy.cards[key].value;

    if(isCardShow == false){
      if(key != 0){
        if(isNaN(value)){
          if(value == 'ACE'){
            if(key == 0){
              isAceEnemy = true;
            }else{
              let tmpVal = hands.enemy.cardValue;
              tmpVal += 11;

              if(tmpVal > 21){
                hands.enemy.cardValue = hands.enemy.cardValue + 1;
              }
              if(tmpVal <= 21){
                hands.enemy.cardValue = hands.enemy.cardValue + 11;
              }
            }
          }else{
            hands.enemy.cardValue = hands.enemy.cardValue + 10;
          }
        }else{
          hands.enemy.cardValue = hands.enemy.cardValue + +value;
        }
      }
    }else{
      if(isNaN(value)){
        if(value == 'ACE'){
          if(key == 0){
            isAce = true;
          }else{
            let tmpVal = hands.enemy.cardValue;
            tmpVal += 11;

            if(tmpVal > 21){
              hands.enemy.cardValue = hands.enemy.cardValue + 1;
            }
            if(tmpVal <= 21){
              hands.enemy.cardValue = hands.enemy.cardValue + 11;
            }
          }
        }else{
          hands.enemy.cardValue = hands.enemy.cardValue + 10;
        }
      }else{
        hands.enemy.cardValue = hands.enemy.cardValue + +value;
      }
    }

    if(isAceEnemy && key.length == key){
      let tmpVal = hands.enemy.cardValue;
      tmpVal += 11;

      if(tmpVal > 21){
        hands.enemy.cardValue = hands.enemy.cardValue + 1;
      }
      if(tmpVal <= 21){
        hands.enemy.cardValue = hands.enemy.cardValue + 11;
      }
      showCardValEnemy.innerHTML = hands.enemy.cardValue;
    }else{
      showCardValEnemy.innerHTML = hands.enemy.cardValue;
    }
    value = 0;
  });

  if(isCardShow || hands.player.cardValue == 21){
    if(hands.enemy.cardValue < 17){
      takeCard(deckId, 'Enemy');
      //gameStatus();
    }else{
      gameStatus();
    }
  }

  if(val === 'Player'){
    gameHistory.push(`Game Status: Player hand value ${hands.player.cardValue} points.`);
  }else if(val === 'Enemy'){
    gameHistory.push(`Game Status: Enemy hand value ${hands.enemy.cardValue} points.`);
  }else{
    gameHistory.push(`Game Status: Player hand value is ${hands.player.cardValue} points, and Dealer hand value is ${hands.enemy.cardValue} points.`);
  }
}

function displayHands(){
  let temp;
  showPlayerData.innerHTML = '';
  showEnemyData.innerHTML = '';


  Object.keys(hands.player.cards).forEach(key => {
    const newDiv = document.createElement('div');
    newDiv.className = "one";
    newDiv.innerHTML = `<img src='${hands.player.cards[key].image}' width='113px' height='157px'>`;
    showPlayerData.appendChild(newDiv);
  });

  Object.keys(hands.enemy.cards).forEach(key => {
    if(key == 0 && isCardShow==false){
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<img src='img/cardReverse.png' width='113px' height='157px'>`;
      showEnemyData.appendChild(newDiv);
    }else{
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<img src='${hands.enemy.cards[key].image}' width='113px' height='157px'>`;
      showEnemyData.appendChild(newDiv);
    }
  });

  countValue();
}

function addCard(value, suit, image){
  this.value = value;
  this.suit = suit;
  this.image = image;
}

// Rozdaj karty
function drawCards(id){
  let api = `${url}/${id}/draw/?count=4`;

  fetch(api).then(function(response){
    let data = response.json();
    return data;
  })
  .then(function(data){
    for(let i = 0; i < Object.keys(data.cards).length; i++){
      if(i%2){
        hands.player.cards.push(new addCard(
          data.cards[i].value,
          data.cards[i].suit,
          data.cards[i].image
          ));
      }else{
        hands.enemy.cards.push(new addCard(
          data.cards[i].value,
          data.cards[i].suit,
          data.cards[i].image
          ));
      }
    }
  })
  .then(function(){
    displayHands();
  })
  .catch(function(){
    drawCards(deckId)
  });
}

function displayGameHistory(){
  const newLi = document.createElement('li');

  console.log(gameHistory);

  for(let index = 0; index<gameHistory.length; index++){
    newLi.innerHTML = gameHistory[index];
    displayHistory.appendChild(newLi);
  }
}

// Dobierz kartę
function takeCard(id, giveTo='Player'){
  let api = `${url}/${id}/draw`;

  if(giveTo == 'Player'){
    fetch(api).then(function(response){
      let data = response.json();
      return data;
    })
    .then(function(data){
      hands.player.cards.push(new addCard(
        data.cards[0].value,
        data.cards[0].suit,
        data.cards[0].image
        ));
    })
    .then(function(){
      displayHands('Player');
      gameStatus();
    })
    .catch(function(){
      takeCard(deckId);
    });
  }else{
    if(hands.enemy.cardValue < 17){
      fetch(api).then(function(response){
        let data = response.json();
        return data;
      })
      .then(function(data){
        hands.enemy.cards.push(new addCard(
          data.cards[0].value,
          data.cards[0].suit,
          data.cards[0].image
          ));
      })
      .then(function(){

        displayHands('Enemy');
        gameStatus();
      })
      .catch(function(){
        takeCard(deckId, 'Enemy');
      });;
    }
  }
}

function playerActions(event){
  switch(event){
    case 'HIT':
      gameHistory.push('Player: HIT');
      displayGameHistory();
      console.log(gameHistory);
      wasHit = true;
      takeCard(deckId);
      break;
    case 'STAND':
      gameHistory.push('Player: STAND');
      displayGameHistory();
      isCardShow = true;
      displayHands();
      break;
    // case 'DOUBLE DOWN':
    //   console.log('Player event: '+event);
    //   break;
    case 'NEXT ROUND':
      gameHistory.push('Player: NEXT ROUND');
      clearBoard();
      break;
  }
}

function betting(betStatus){
  if(betStatus == 'OK' && betValue > 0){
    betSection.style.display = 'none';
    actionsBtnSection.style.display = 'block';
    document.querySelector(".action-btn.next").style.display = 'none';
    gameHistory.push(`Game Status: Round ${roundNum}.`);
    gameHistory.push(`Player: Bet $${betValue}`);
    getDeck();
  }else{
    if(betStatus <= hands.player.credit){
      betValue += +betStatus;
      hands.player.credit -= +betStatus;
      // showBetVal.innerHTML = betValue;
    }
    if(betStatus == 'Clear'){
      hands.player.credit += +betValue;
      betValue = 0;
    }
    showBetVal.innerHTML = betValue;
    displayCredit.innerHTML = hands.player.credit;
  }
  displayGameHistory();
}

function gameStart(){
  if(roundNum < 5){
    clearBtn.style.display = 'inline';
    submitBtn.style.display = 'inline';
    betSection.style.display = 'block';
    actionsBtnSection.style.display = 'none';
    displayCredit.innerHTML = hands.player.credit;
    roundNum += 1;
  }else{
    gameEnded();
  }
  displayGameHistory();
}

function clearBoard(){
  const div = document.getElementsByClassName('hand');
  div[0].innerHTML = "";
  div[1].innerHTML = "";
  showCardValPlayer.innerHTML = "";
  showCardValEnemy.innerHTML = "";

  hands.player.cardValue = 0;
  hands.player.cards = [];
  hands.enemy.cardValue = 0;
  hands.enemy.cards = [];

  isCardShow = false;
  gameStat = "";
  wasHit = false;
  isCardShow=false;
  showBetVal.innerHTML = betValue;

  if(hands.player.credit == 0 || hands.player.credit < 5){
    gameEnded();
  }else{
    showActionBtn();
    gameStart();
  }
}

function hideActionBtn(){
  for(let i = 0; i < actionBtn.length; i++){
    actionBtn[i].style.display = 'none';
  }
  document.querySelector(".next").style.display = 'inline';
  document.querySelector(".new-game").style.display = 'inline';
}

function showActionBtn(){
  for(let i = 0; i < actionBtn.length; i++){
    actionBtn[i].style.display = 'inline';
  }
  document.querySelector(".next").style.display = 'none';
  document.querySelector(".new-game").style.display = 'inline';
}

function gameEnded(){
  hideActionBtn();
  document.querySelector(".next").style.display = 'none';
  document.querySelector(".new-game").style.display = 'inline';
  showCardValPlayer.style.display = 'none';
  showCardValEnemy.style.display = 'none';

  if(hands.player.credit > 0){
    gameEndText.innerHTML = 'Game Ended. Your total credit amount is $'+hands.player.credit+'.';
  }else{
    gameEndText.innerHTML = 'Game Ended. No more credits to play.';
  }
}


//gameStart();





// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6    - Stwórz nową talie
// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2     - Ciągnij karty