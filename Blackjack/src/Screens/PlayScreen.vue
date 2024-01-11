<template>
  <div class="gameContainer">
    <div class="cardArea" id="dealer">
      <TransitionGroup name="hand" class="hand" tag="div">
        <div class="card" v-for="card in dealerHand" :key="card.code">
          <img v-show="card !== dealerHand[0] || showCard" :src="card.image" alt="Card Image"/>
          <img v-show="card === dealerHand[0] && !showCard" :src="cardBackImage"  alt="back of card"/>
        </div>
      </TransitionGroup>
    </div>
    <div class="points">
      <p class="pointsDealer">{{ calculateHandValue(dealerHand) }}</p>
    </div>
    <div class="middleArea">
      <p>Money: <br />{{money}}</p>
      <button @click="stay">Stay</button>
      <button @click="hit">Hit</button>
      <button v-if="!roundActive" @click="deal">Deal</button>
      <p>Bet: <br />{{betMoney}}</p>
    </div>
    <div class="points">
      <p class="pointsPlayer">{{ calculateHandValue(playerHand) }}</p>
    </div>
    <div class="cardArea" id="player">
      <div class="chipArea">
        <div class="chips">
          <Chip v-for="value in chipValues" @click="addBet(value)" :key="value" :chip-value="value" :chips-folder="chipsFolder" class="chip"/>
        </div>
      </div>
      <TransitionGroup name="hand" class="hand" tag="div">
        <div class="card" v-for="card in playerHand" :key="card.code">
          <img :src="card.image" alt="Card Image" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Axios from 'axios';
import Chip from '/src/components/Chip.vue'

const apiUrl = 'https://deckofcardsapi.com/api/deck';

const apiKey = 'your-api-key'; // Replace with your actual API key
let deckId = ref('');
let playerHand = ref([]);
let dealerHand = ref([]);
let cardImages = ref({}); // Store preloaded card images
let roundActive = false;
let showCard = false;
let preloaded = false;

const chipValues = [5, 10, 20, 50, 100];
let money = 200;
let betMoney = 0;

const cardBackImage = "/src/assets/cardBack.png"
const chipsFolder = "/src/assets/"

const shuffleDeck = async () => {
  const numDecks = 6; // Change this number as needed
  const response = await Axios.get(`${apiUrl}/new/shuffle/?deck_count=${numDecks}`);
  deckId.value = response.data.deck_id;
};

const deal = async () => {
  roundActive = true;
  await shuffleDeck();

  const response = await Axios.get(`${apiUrl}/${deckId.value}/draw/?count=4`);
  const cards = response.data.cards;

  playerHand.value = cards.slice(0, 2).map(card => ({ ...card, image: card.image }));
  dealerHand.value = cards.slice(2).map(card => ({ ...card, image: card.image }));

  updateHands();
};

const hit = () => {
  Axios.get(`${apiUrl}/${deckId.value}/draw/?count=1`)
      .then(response => {
        playerHand.value.push({ ...response.data.cards[0], image: response.data.cards[0].image });
        updateHands();
      });

  console.log(calculateHandValue(playerHand.value));
};

const dealerDraw = async () => {
  while (calculateHandValue(dealerHand.value) < 17) {
    await Axios.get(`${apiUrl}/${deckId.value}/draw/?count=1`)
        .then(response => {
          dealerHand.value.push({ ...response.data.cards[0], image: response.data.cards[0].image });
          updateHands();
        });
  }
}

const roundLost = () => {
  console.log("lost");
}

const roundWon = () => {
  console.log("won");
}

const stay = async () => {
  showCard = true;
  await dealerDraw();
  if (calculateHandValue(dealerHand.value) >= 17 && calculateHandValue(dealerHand.value) <= 21) {
    if (calculateHandValue(dealerHand.value) > calculateHandValue(playerHand.value)) {
      roundLost();
    } else if (calculateHandValue(dealerHand.value) < calculateHandValue(playerHand.value)) {
      roundWon();
    } else {
      console.log("draw i guess");
    }
  } else {
    roundWon();
  }
}

const updateHands = () => {
  // Example: Log hands to the console
  console.log("Player's Hand:", playerHand.value);
  console.log("Dealer's Hand:", dealerHand.value);
  if (calculateHandValue(playerHand.value) > 21) {
    roundLost();
  }
};

const calculateHandValue = (hand) => {
  let value = 0;
  let hasAce = false;

  for (const card of hand) {
    const cardValue = card.value;
    value += isNaN(cardValue) ? (cardValue === 'ACE' ? 11 : 10) : parseInt(cardValue);

    if (cardValue === 'ACE') {
      hasAce = true;
    }
  }

  // Handle Aces
  if (hasAce && value > 21) {
    value -= 10;
  }

  return value;
};

const addBet = (value) => {
  betMoney += value;
  console.log(betMoney);
}

const preloadImages = async () => {
  const deckIdResponse = await Axios.get(`${apiUrl}/new/shuffle/?deck_count=1`);
  const deckId = deckIdResponse.data.deck_id;

  const cardsResponse = await Axios.get(`${apiUrl}/${deckId}/draw/?count=52`);
  const cards = cardsResponse.data.cards;

  const promises = cards.map((card) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        cardImages.value[card.code] = image;
        resolve();
      };
      image.src = card.image;
    });
  });

  await Promise.all(promises);
  preloaded = true;
  console.log("preloaded: " + preloaded);
};

onMounted(() => {
  preloadImages();
});
</script>

<style lang="scss">

* {
  margin: 0;
  padding: 0;
  font-family: Roboto;
}

.gameContainer {
  width: calc(100%);
  height: calc(100%);
  overflow: hidden;
  position: fixed;
  background-color: #528045;
}

.card {
  margin-left: -5rem;
  filter: drop-shadow(-0.2rem 0.2rem 0.2rem black);
  height: 90%;
  width: auto;
  display: block;
  img {
    height: 100%;
  }
}

.hand {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 90%;
  margin-left: 2.5rem;
  position: relative;
}

.hand-move,
.hand-enter-active {
  transition: all 0.3s ease;
}

.hand-enter-from {
  opacity: 0;
  transform: translateY(-8rem);
}

.hand-leave-active {
  position: absolute;
}

.hand-leave-to {
  opacity: 0;
}


.cardArea {
  height: 40%;
  width: 100%;
  position: relative;
  display: block;
  background-color: #528045;
}

.points {
  font-family: Roboto, serif;
  text-align: center;
  height: 5%;
  font-size: 20pt;
  font-weight: bold;
  color: white;
}

.middleArea {
  border-top: 0.4rem solid #2c1807;
  border-bottom: 0.4rem solid #2c1807;
  background-color: #6a3c14;
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-content: center;
  text-align: center;
  position: relative;
  margin: 0;
  padding: 0.3rem;
  z-index: 10;
  p {
    width: 30%;
    color: white;
    font-size: 16pt;
    font-weight: bold;
    margin: 0 0.3rem;
    align-self: center;
  }
  button {
    height: 2rem;
    width: 3rem;
    background-color: white;
    border: 0.1rem solid black;
    border-radius: 0.2rem;
    position: relative;
    align-self: center;
  }
}

.chipArea {

}

.chips {
  height: calc(80%);
  width: calc(90%);
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  background-color: #528045;
  .chip {
    margin: 0 2%;
    border: 2px solid red;
  }
  img {
    height: 35%;
    filter: drop-shadow(-0.2rem 0.2rem 0.2rem black);
    pointer-events: none;
  }
}

</style>