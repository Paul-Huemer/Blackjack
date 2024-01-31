# Team members:
  - Paul Huemer (s2310629009)

# Purpose:
A blackjack card game using the deck of cards API (https://deckofcardsapi.com). It should be responsive to work on both desktop and mobile resolutions. The purpose is just fun, there is no actual money in the gambling involved and may help people with decision making and risk taking.

# Dev setup:
  - latest Version of vue with typescript.
  - Vitest and vue/test-utils.

  - ScreenManager.vue
      + manages linking between the screens using their emits
      + Calculates score from PlayScreen.vue emits and the deposit
        
      + StartScreen.vue
          > Handling the user input of how much "money" they want to deposit
          > Emits 'playButtonClicked' to invoke the deposit and the screen change to PlayScreen.vue.
      + PlayScreen.vue
          > The game. It uses the deposit and takes bets from it and adds winnings towards it.
          > Chip.vue
            - Component to handle betting values. 5 Chips are displayed and each has their own value.
            - Emits 'chipClicked' with their chipvalue to invoke a bet on PlayScreen.vue.
          > Emits 'playFinished' with the money left to invoke score calculation and screen change to EndScreen.vue
      + Endscreen.vue
          > Displays the final score, calculated from the leftover money - deposit.
          > If the final score is under 0, "You Lost." is displayed. Otherwise "Congratulations.
          > Emits 'return' if the back to Menu button is pressed, to let the user return to StartScreen.vue.

# User guide:
Just enter the amount of money you want to play with and hit Play! You will enter the Blackjack game and be able to use the chips to make a bet. Once a bet is made, the Blackjack starts. You can pull another card by using the "hit" button, or you can stay with your cards using the "stay" button. Once the stay button is pressed or the hand value exceeds 21, the dealer will pull cards until they reach at least 17. If your hand value is higher than his, but under 21, you won. If it exceeds 21 though, you lost. If you win, your bet will be doubled and added to your money.

You can pull out of the game and walk away with your score at any time as long as no round is actively played and no bet has been set. Your score will be calculated from the money you have left minus your deposit.

The game ends automatically if you have no funds available anymore.
