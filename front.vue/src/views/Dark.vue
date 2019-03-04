<template>
  <div class="creativity-training">
    <Console :says="says"/>
  </div>
</template>

<script>
import Console from '@/components/Console.vue'

export default {
  name: 'creativity-training',
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
