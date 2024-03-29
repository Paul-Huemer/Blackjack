<template>
  <div class="gameContainer">
    <button class="finishButton" @click="emit('playFinished', money)" :disabled="betMoney > 0 || roundActive">
      Finish
    </button>
    <div class="cardArea" id="dealer">
      <TransitionGroup name="hand" class="hand" id="dealerHand" tag="div" v-show="roundActive">
        <div class="card" v-for="card in dealerHand" :key="card.code">
          <img v-show="card !== dealerHand[0] || showCard" :src="card.image" alt="Card Image" />
          <img
            v-show="card === dealerHand[0] && !showCard"
            :src="cardBackImage"
            alt="back of card"
          />
        </div>
      </TransitionGroup>
    </div>
    <div class="points">
      <p class="pointsDealer">{{ calculateDealerPoints(dealerHand) }}</p>
    </div>
    <div class="middleArea">
      <p>Money: <br />{{ money }}</p>
      <button @click="stay" :disabled="disableButtons">Stay</button>
      <button @click="hit" :disabled="disableButtons">Hit</button>
      <button @click="deal" :disabled="betMoney <= 0 || roundActive">Bet</button>
      <p>Bet: <br />{{ betMoney }}</p>
    </div>
    <div class="points">
      <p class="pointsPlayer">{{ calculateHandValue(playerHand) }}</p>
    </div>
    <div class="cardArea" id="player">
      <div class="chipArea" v-show="!roundActive">
        <div class="chips">
          <Chip
            v-for="value in chipValues"
            @chipClicked="addBet"
            :key="value"
            :chip-value="value"
            :chips-folder="chipsFolder"
            class="chip"
          />
        </div>
      </div>
      <TransitionGroup name="hand" class="hand" id="playerHand" tag="div" v-show="roundActive">
        <div class="card" v-for="card in playerHand" :key="card.code">
          <img :src="card.image" alt="Card Image" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue';
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import Axios from 'axios'
import Chip from '@/components/Chip.vue'

const apiUrl = 'https://deckofcardsapi.com/api/deck'

 onMounted(() => {
  preloadImages()
})

const emit = defineEmits(['playFinished'])

const props = defineProps<{
  startMoney: number
}>()

let deckId = ref('')
let playerHand: any = ref([])
let dealerHand: any = ref([])
let cardImages: any = ref({})
let roundActive = ref(false)
let showCard = ref(false)
let preloaded = ref(false)

let disableButtons = ref(true)

const chipValues = [5, 10, 20, 50, 100]
const money = ref(props.startMoney)
const betMoney = ref(0)

const cardBackImage = '/src/assets/cardBack.png'
const chipsFolder = '/src/assets/'

const shuffleDeck = async () => {
  const numDecks = 6
  const response = await Axios.get(`${apiUrl}/new/shuffle/?deck_count=${numDecks}`, {timeout: 5000})
  deckId.value = response.data.deck_id
}

const deal = async () => {
  disableButtons.value = false
  roundActive.value = true
  await shuffleDeck()

  const response = await Axios.get(`${apiUrl}/${deckId.value}/draw/?count=4`, {timeout: 5000})
  const cards = response.data.cards

  playerHand.value = cards.slice(0, 2).map((card: any) => ({ ...card, image: card.image }))
  dealerHand.value = cards.slice(2).map((card: any) => ({ ...card, image: card.image }))

  updateHands()
}

const hit = () => {
  Axios.get(`${apiUrl}/${deckId.value}/draw/?count=1`, {timeout: 5000}).then((response) => {
    playerHand.value.push({ ...response.data.cards[0], image: response.data.cards[0].image })
    updateHands()
  })
}

const dealerDraw = async () => {
  if (calculateHandValue(dealerHand.value) < 17) {
    await Axios.get(`${apiUrl}/${deckId.value}/draw/?count=1`, {timeout: 5000}).then((response) => {
      dealerHand.value.push({ ...response.data.cards[0], image: response.data.cards[0].image })
      updateHands()
    })
    setTimeout(() => {
      dealerDraw()
    }, 300)
  }
}

const roundLost = () => {
  resetRound()
}
const roundWon = () => {
  money.value += betMoney.value * 2
  resetRound()
}
const roundDraw = () => {
  money.value += betMoney.value
  resetRound()
}

const resetRound = () => {
  disableButtons.value = true
  showCard.value = true
  setTimeout(() => {
    betMoney.value = 0
    playerHand.value = []
    dealerHand.value = []
    roundActive.value = false
    showCard.value = false
    checkMoney()
  }, 2000)
}

const checkMoney = () => {
  if (money.value <= 0 && betMoney.value <= 0) {
    emit('playFinished', money.value)
  }
}

const stay = async () => {
  disableButtons.value = true
  showCard.value = true
  await dealerDraw()
  setTimeout(() => {
    if (calculateHandValue(dealerHand.value) >= 17 && calculateHandValue(dealerHand.value) <= 21) {
      if (calculateHandValue(dealerHand.value) > calculateHandValue(playerHand.value)) {
        roundLost()
      } else if (calculateHandValue(dealerHand.value) < calculateHandValue(playerHand.value)) {
        roundWon()
      } else {
        roundDraw()
      }
    } else {
      roundWon()
    }
  }, 700)
}

const updateHands = () => {
  if (calculateHandValue(playerHand.value) > 21) {
    roundLost()
  }
}

const calculateHandValue = (hand: any) => {
  let value = 0
  let hasAce = false
  let aces = 0

  for (const card of hand) {
    const cardValue = card.value
    value += isNaN(cardValue) ? (cardValue === 'ACE' ? 11 : 10) : parseInt(cardValue)

    if (cardValue === 'ACE') {
      hasAce = true
      aces += 1
    }
  }

  while (aces > 0) {
    if (hasAce && value > 21) {
      value -= 10
    }
    aces -= 1;
  }

  return value
}

const calculateDealerPoints = (dealerHand: any) => {
  if (showCard.value) {
    return calculateHandValue(dealerHand)
  } else {
    if (dealerHand.length > 0) {
      let tempHand = dealerHand.map((x: any) => x)
      tempHand.splice(0, 1)
      return calculateHandValue(tempHand)
    } else {
      return 0
    }
  }
}

const addBet = (value: number) => {
  if (money.value - value >= 0) {
    betMoney.value += value
    money.value -= value
  }
  return betMoney.value;
}

const preloadImages = async () => {
  const deckIdResponse = await Axios.get(`${apiUrl}/new/shuffle/?deck_count=1`, {timeout: 5000})
  const deckId = deckIdResponse.data.deck_id

  const cardsResponse = await Axios.get(`${apiUrl}/${deckId}/draw/?count=52`, {timeout: 5000})
  const cards = cardsResponse.data.cards

  const promises = cards.map((card: any) => {
    return new Promise((resolve): void => {
      const image = new Image()
      image.onload = () => {
        cardImages.value[card.code] = image
        resolve(0)
      }
      image.src = card.image
    })
  })

  await Promise.all(promises)
  preloaded.value = true
}

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
  margin-left: -9rem;
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
  width: 100%;
  height: 90%;
  margin-left: 9rem;
  position: relative;
}

#playerHand {
  align-self: flex-start;
  align-items: flex-start;
}
#dealerHand {
  align-self: flex-end;
  align-items: flex-end;
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
  display: flex;
  padding: 1rem 0;
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
    height: 3rem;
    width: 4rem;
    background-color: #b58962;
    border: 0.2rem solid #2c1807;
    border-radius: 0.5rem;
    margin: 0.1rem;
    align-self: center;
    font-size: 12pt;
    font-weight: bold;
  }
}

.finishButton {
  padding: 0.5rem 0.7rem;
  background-color: #b58962;
  border: 0.2rem solid #2c1807;
  border-radius: 0.5rem;
  margin: 0.3rem;
  font-size: 12pt;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
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
    pointer-events: all;
    z-index: 100;
  }
  img {
    height: 35%;
    filter: drop-shadow(-0.2rem 0.2rem 0.2rem black);
    pointer-events: none;
  }
}
</style>
