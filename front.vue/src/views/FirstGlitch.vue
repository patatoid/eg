<template>
  <div class="glitch">
    <img src="../assets/glitch.gif" />
  </div>
</template>

<script>
export default {
  name: 'first-glitch',
  mounted () {
    setTimeout(() => {
      this.$router.push({ name: 'dark' })
    }, 10000)
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
