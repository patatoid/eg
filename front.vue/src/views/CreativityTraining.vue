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
      says: [
        "Je vous prie de me pardonner. Tout semble indiquer que mon module de langage oral a été endommagé.",
        "Afin que nous puissions communiquer ensemble plus facilement, vous devez m'aider.",
        "J'ai besoin d'entendre le plus de voix possible afin d'être capable de reprogrammer mon module de langage.",
        "Pour cela vous devez rejoindre individuellement les postes et mettre les casques que vous y trouverez. Évitez de communiquer ensemble, cela risquerait de parasiter le signal.",
        "J'afficherai toujours deux mots à l'écran. Votre rôle est de deviner le mot qui lie les deux autres et de le prononcer le plus distinctement possible.",
        "Par exemple, si je vous dis [ OR ], [ PIOCHE ] et [ DIAMANT ] vous me dites... ",
        "[ MINE ]",
        "Très bien alors... à vos postes ! Mon module se dégrade de minute en minute. Si vous ne faites rien, il est probable que dans 5 minutes, j'aurai définitivement perdu l'usage de la parole. Alors dépêchez-vous, je vous en prie. "
      ]
    }
  }
}
</script>
