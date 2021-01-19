# Black Jack Card Game

## [Check it live here](https://repl.it/@marcelmos/CardGame#index.html)
![This is a alt text.](/src/img/gamePrev.png "Screen shoot of game.")

Black Jack is card game when your job is to win against Dealer without over 21 points.

Game was created with use of [API](https://deckofcardsapi.com)

## Getting Started
To run game you need first download or clone project from this GitHub repository.
Then open `src` folder and `index.html` via your favourite web browser.
After that you are ready to play Black Jack.
Have fun and good luck.

## Game rules
#### OBJECT OF THE GAME
Each participant attempts to beat the dealer by getting a count as close to 21 as possible, without going over 21.

>In my project you play 5 rounds

#### CARD VALUE
Cards from 2 to 10 are equel they pip value.
KING, QUEEN, JACK are equal 10 points.
ACE are equal 1 or 11 depend on player.

#### ACTIONS
Player had 3 action decision:
* HIT - Player get one card
* STAND - Player pass his move
* DOUBLE DOWN - player cards are split to two (avilable only if cards value are the same like KING and QUEEN)

#### WIN / LOSE CONDITIONS
* Win:
    * Player win if his hand value is equal 21
    * Player win if his hand value is greater then dealer hand (player hand is not over 21)
    * Player win if dealer hand pass 21 points
* Lose:
    * Player lose if hand value is smaller then dealer hand (dealer hand is not over 21)
    * Player lose if hand value is over 21)
* Draw:
    * When player and dealer hand value are equal (not over 21 points)

If player win they earn 150% of his bet value, if draw they get back 100% of his bet, if lose they not earn back their bet

## Authors
* Marcel Moś - _Development_

## Licence
I do not agree to publishing and personal use for the purpose of achieving any advantage without prior contact with me.