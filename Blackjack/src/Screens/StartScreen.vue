<template>
  <div class="gameContainer">
    <h1 id="score">Welcome to <br /> Blackjack</h1>
    <button id="playButton" @click="emit('playButtonPressed')">Play!</button>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['playButtonPressed'])

</script>

<style lang="scss">
.gameContainer {
  width: calc(100%);
  height: calc(100%);
  background-color: #528045;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

#score {
  color: white;
}

#playButton {
  padding: 0.5rem 0.7rem;
  background-color: #b58962;
  border: 0.2rem solid #2c1807;
  border-radius: 0.5rem;
  margin: 0.3rem;
  align-self: center;
  font-size: 12pt;
  font-weight: bold;
}

</style>
