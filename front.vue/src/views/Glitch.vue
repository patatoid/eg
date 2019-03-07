<template>
  <div class="glitch">
    <img src="../assets/glitch.gif" />
  </div>
</template>

<script>
export default {
  name: 'glitch',
  data () {
    return {
      says: []
    }
  }
}
</script>

<style scoped lang="scss">
.glitch {
  img {
    width: 100vw;
    height: 100vh;
  }
}
</style>
