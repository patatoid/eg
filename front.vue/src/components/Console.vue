<template>
  <div class="console">
    <div class="says" v-for="(say, index) in batchSays" :key="index">
      <div class="prompt">
        <span class="date">{{ now }}</span>
        <span class="name"> (Nuclea)</span>
        <span class="start"> >></span>
      </div>
      <div class="message">{{ say.message }}</div>
      <div class="continue" v-if="say.end">[press any key]</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Console',
  props: {
    says: { type: Array }
  },
  data () {
    return { batchSays: [] }
  },
  mounted () {
    this.incrementSays(this.says[0])
  },
  computed: {
    now () {
      return moment().format('MMMM Do YYYY | hh:mm:ss')
    }
  },
  methods: {
    incrementSays (current) {
      const target = this.says.slice(0)
      const i = target.indexOf(current)
      if (i === -1) return

      let handler = null
      function next () {
        const result = this.batchSays.slice(0)
        result[i] = Object.assign(result[i], { end: false })
        this.batchSays = result
        this.incrementSays(target[i + 1], target)
        document.removeEventListener('keypress', handler, true)
      }
      return this.incrementSay(Promise.resolve(''), current, i).catch(() => {
        handler = next.bind(this)
        document.addEventListener('keypress', handler, true)
      })
    },
    incrementSay (current, target, i) {
      return current.then((current) => {
        if (current.length === target.length) {
          const result = this.batchSays.slice(0)
          if (this.says.indexOf(target) !== this.says.length - 1) {
            result[i] = Object.assign(result[i], { end: true })
            this.batchSays = result
          }
          return Promise.reject()
        }
        return new Promise((resolve) => {
          current = current + target[current.length]
          const result = this.batchSays.slice(0)
          result[i] = { message: current }
          this.batchSays = result
          setTimeout(() => resolve(this.incrementSay(Promise.resolve(current), target, i)), 5)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.console {
  height: 100vh;
  background: black;
  color: white;
  padding: 1em;
  font-size: 1.5em;
  .says {
    margin-bottom: 2em;
  }
  .prompt {
    float: left;
    margin-right: 1em;
    .date { color: violet; }
    .name { color: blue; }
  }
  .continue {
    margin-top: 2em;
  }
}
</style>
