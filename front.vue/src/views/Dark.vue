<template>
  <div class="dark">
    <Console :says="says"/>
  </div>
</template>

<script>
import Console from '@/components/Console.vue'

export default {
  name: 'dark',
  components: {
    Console
  },
  data () {
    return {
      says: []
    }
  }
}
</script>
