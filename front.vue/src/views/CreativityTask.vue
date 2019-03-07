<template>
  <div class="creativity-task">
    <svg ref="canvas" class="canvas" width="500" height="500">
      <circle ref="answer" cx="50" cy="50" r="150" fill="white" />
      <text ref="answerText" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle" fill="#5f3" display="none">"parlez"</text>
      <circle ref="word1" cx="50" cy="50" r="150" stroke="#aaa" fill="white" />
      <text ref="word1Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
      <circle ref="word2" cx="50" cy="50" r="150" stroke="#aaa" fill="white" />
      <text ref="word2Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
      <circle ref="word3" cx="50" cy="50" r="150" stroke="#aaa" fill="white" />
      <text ref="word3Text" x="50" y="50" text-anchor="middle" font-size="40" alignment-baseline="middle"></text>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3"
import socket from '@/socket'

let currentGraph, data

export default {
  name: 'home',
  data () {
    const simulation = d3.forceSimulation()
      .force("link", d3
        .forceLink()
        .id(function(d) { return d.id; })
        .distance((d) => { return d.value * 800 })
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
    const answer = { node: this.$refs.answer, text: this.$refs.answerText }
    answer.node.setAttribute('cx', window.innerWidth / 2)
    answer.node.setAttribute('cy', window.innerHeight / 2)

    socket.off('creativity-trial-recording')
    socket.on('creativity-trial-recording', () => {
      this.pushOn()
    })
    socket.off('next-creativity-trial')
    socket.on('next-creativity-trial', () => {
      this.answer()
    })

    data = require('../data/creativity-task').data.slice(0)
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
      const graphData = data.splice(0, 1)[0]
      if (graphData) {
        currentGraph = this.buildGraphFromData(graphData)

        this.draw()
      } else {
        socket.emit('creativity-task-end')
      }
    },
    pushOn () {
      if (this.pending) return
      const answer = { node: this.$refs.answer, text: this.$refs.answerText }
      answer.text.setAttribute('display', 'block')
      answer.text.setAttribute('x', window.innerWidth / 2)
      answer.text.setAttribute('y', window.innerHeight / 2)
      answer.node.setAttribute('class', 'answering')
      answer.node.setAttribute('stroke', '#5f3')
      answer.node.setAttribute('stroke-width', '5')
    },
    pushOff () {
      const answer = { node: this.$refs.answer, text: this.$refs.answerText }
      answer.text.setAttribute('display', 'none')
      answer.node.removeAttribute('stroke')
      answer.node.setAttribute('stroke-width', '5')
    },
    answer () {
      if (this.pending) return
      this.pushOff()
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
      }, 1500)
    },
    draw () {
      const canvas = this.$refs.canvas
      canvas.setAttribute('height', window.innerHeight)
      canvas.setAttribute('width', window.innerWidth)

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
      answer.node.setAttribute('fill', 'white')
      function ticked () {
        currentGraph.nodes.forEach(drawNode);

        function drawNode(d) {
          if (d.name === '?') {
            answer['node'].setAttribute('class', 'not-answering')
            answer['node'].setAttribute('fill', '#9fa')
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
@keyframes smooth {
  from { transform: scale(1) }
  15% { transform: scale(1.5) }
  30% { transform: scale(1) }
  70% { transform: scale(1) }
  85% { transform: scale(1.5)}
  to { transform: scale(1) }
}
.answering {
  transition: transform .4s ease-in-out;
  transform-origin: center;
  animation: smooth 1.2s linear infinite;
}
</style>
