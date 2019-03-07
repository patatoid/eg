<template>
  <div class="creativity-task-end">
    <Console :says="says" :disablePrompt="true" />
  </div>
</template>

<script>
import Console from '@/components/Console.vue'

export default {
  name: 'creativity-task-end',
  components: {
    Console
  },
  data () {
    return {
      says: ['Merci ! Je vais essayer de reprogrammer mon module de langage avec cela.']
    }
  }
}
</script>
