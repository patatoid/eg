<template>
  <div class="creativity-task" v-on:click="answer()">
    <svg ref="canvas" class="canvas" width="500" height="500">
      <circle ref="word1" cx="50" cy="50" r="150" fill="#aaa" />
      <text ref="word1Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
      <circle ref="word2" cx="50" cy="50" r="150" fill="#aaa" />
      <text ref="word2Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
      <circle ref="word3" cx="50" cy="50" r="150" fill="#aaa" />
      <text ref="word3Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
      <circle ref="answer" cx="50" cy="50" r="150" fill="#9fa" />
      <text ref="answerText" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle" fill="black" class="hidden">✓</text>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3"
import { cloneDeep } from 'lodash'
import HelloWorld from '@/components/HelloWorld.vue'
import { data } from '@/data/creativity-task'

let currentGraph

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  data () {
    const simulation = d3.forceSimulation()
      .force("link", d3
        .forceLink()
        .id(function(d) { return d.id; })
        .distance((d) => { console.log(d); return d.value * 800 })
        .strength(0.5)
      )
      .force("center", d3.forceCenter(window.innerWidth / 2, innerHeight / 2))
      .force("collide", d3.forceCollide(200))
      .alphaDecay(0)
      .velocityDecay(0.9)

    return {
      simulation,
      pending: false,
    }
  },
  mounted () {
    this.next()
  },
  methods: {
    buildGraphFromData (data) {
      return {
        nodes: [
          { id: 1, group: 1, name: data[0] },
          { id: 2, group: 1, name: data[1] },
          { id: 3, group: 1, name: data[2] }
        ],
        links: [
          { source: 1, target: 2, value: 1 },
          { source: 2, target: 3, value: 1 },
          { source: 3, target: 1, value: 1 }
        ]
      }
    },
    next () {
      currentGraph = this.buildGraphFromData(data.splice(0, 1)[0])

      this.draw()
      this.speech()
    },
    speech () {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.lang = 'fr-FR'
      recognition.interimResults = false
      recognition.maxAlternatives = 5

      recognition.start()

      recognition.onerror = () => {
        this.answer()
      }
      let time = Date.now()
      recognition.onspeechstart = () => {
        time = Date.now() - time
      }

      recognition.onresult = (event) => {
        try {
          var color = event.results[0][0].transcript
        } catch (error) {
          console.log(error)
        }
        console.log(event.results)
        console.log(color)
        this.answer()
      }
    },
    answer () {
      if (this.pending) return
      this.pending = true
      currentGraph.nodes.push({ id: 4, name: '?', x: window.innerWidth / 2, y: window.innerHeight / 2 })
      currentGraph.links.push({ source: 4, target: 3, value: Math.sqrt(3) / 6 })
      currentGraph.links.push({ source: 4, target: 1, value: Math.sqrt(3) / 6 })
      currentGraph.links.push({ source: 4, target: 2, value: Math.sqrt(3) / 6 })
      this.simulation.nodes(currentGraph.nodes)
      this.simulation.force("link").links(currentGraph.links)

      setTimeout(() => {
        this.next()
        this.pending = false
      }, 2500)
    },
    draw () {
      const canvas = this.$refs.canvas
      canvas.setAttribute('height', window.innerHeight)
      canvas.setAttribute('width', window.innerWidth)
      const width = canvas.width
      const height = canvas.height

      this.simulation
        .nodes(currentGraph.nodes)
        .on("tick", ticked);

      this.simulation.force("link")
        .links(currentGraph.links)

      const words = {
        1: { node: this.$refs.word1, text: this.$refs.word1Text },
        2: { node: this.$refs.word2, text: this.$refs.word2Text },
        3: { node: this.$refs.word3, text: this.$refs.word3Text }
      }
      const answer = { node: this.$refs.answer, text: this.$refs.answerText }
      answer.node.setAttribute('display', 'none')
      function ticked () {
        currentGraph.links.forEach(drawLink);
        currentGraph.nodes.forEach(drawNode);

        function drawLink(d) {
        }

        function drawNode(d) {
          if (d.name === '?') {
            answer.node.setAttribute('display', 'block')
            answer['node'].setAttribute('cx', d.x)
            answer['node'].setAttribute('cy', d.y)
            answer['text'].setAttribute('x', d.x)
            answer['text'].setAttribute('y', d.y)
          } else {
            words[d.id]['node'].setAttribute('cx', d.x)
            words[d.id]['node'].setAttribute('cy', d.y)
            words[d.id]['text'].setAttribute('x', d.x)
            words[d.id]['text'].setAttribute('y', d.y)
            words[d.id]['text'].innerHTML = d.name
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.hidden {
  display: none;
}
</style>
