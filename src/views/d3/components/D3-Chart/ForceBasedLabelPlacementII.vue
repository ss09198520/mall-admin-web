<!-- 漏斗圖 -->
<template>
  <div
      :id="id"
      :class="className"
      :style="{height, width}"
  >
    <h2>Force-based label placement II</h2>
    <svg id="viz" class="container-border"></svg>
  </div>
</template>

<script setup >
import {nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted} from "vue";
import * as d3 from 'd3';
import resize from '@/utils/resize'
import jsonData from '../assets/json/simple_force_layout.json'

const props = defineProps({
  id: {
    type: String,
    default: 'funnelChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  }
})

const {
  mounted,
  chart,
  beforeDestroy,
  activated,
  deactivated
} = resize()

async function initChart() {
  let width = 1850
  let height = 800
  let color = d3.scaleOrdinal(d3.schemeCategory10)
  let graph = jsonData
  let label = {
    'nodes': [],
    'links': []
  }
  graph.nodes.forEach(function (d, i) {
    label.nodes.push({ node: d })
    label.nodes.push({ node: d })
    label.links.push({
      source: i * 2,
      target: i * 2 + 1
    })
  })
  let labelLayout = d3.forceSimulation(label.nodes)
      .force('charge', d3.forceManyBody().strength(-50))
      .force('link', d3.forceLink(label.links).distance(0).strength(2))

  d3.forceSimulation(graph.nodes)
      .force('charge', d3.forceManyBody().strength(-3000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('x', d3.forceX(width / 2).strength(1))
      .force('y', d3.forceY(height / 2).strength(1))
      .force('link', d3.forceLink(graph.links).id(function (d) { return d.id }).distance(50).strength(1))
      .on('tick', ticked)

  let adjlist = []

  graph.links.forEach(function (d) {
    adjlist[d.source.index + '-' + d.target.index] = true
    adjlist[d.target.index + '-' + d.source.index] = true
  })

  // function neigh (a, b) {
  //   return a === b || adjlist[a + '-' + b]
  // }
  let svg = d3.select('#viz').attr('width', width).attr('height', height)
  let container = svg.append('g')

  svg.call(
      d3.zoom()
          .scaleExtent([.1, 4]) // eslint-disable-line
          .on('zoom', function () {
            container.attr('transform', d3.event.transform)
          })
  )

  let link = container.append('g').attr('class', 'links')
      .selectAll('line')
      .data(graph.links)
      .enter()
      .append('line')
      .attr('stroke', '#aaa')
      .attr('stroke-width', '1px')

  let node = container.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', function (d) { return color(d.group) })

  // node.on('mouseover', focus).on('mouseout', unfocus)

  // node.call(
  //   d3.drag()
  //     .on('start', dragstarted)
  //     .on('drag', dragged)
  //     .on('end', dragended)
  // )

  let labelNode = container.append('g').attr('class', 'labelNodes')
      .selectAll('text')
      .data(label.nodes)
      .enter()
      .append('text')
      .text(function (d, i) { return i % 2 === 0 ? '' : d.node.id })
      .style('fill', '#555')
      .style('font-family', 'Arial')
      .style('font-size', 12)
      .style('pointer-events', 'none') // to prevent mouseover/drag capture

  // node.on('mouseover', focus).on('mouseout', unfocus)

  function ticked () {
    node.call(updateNode)
    link.call(updateLink)

    labelLayout.alphaTarget(0.3).restart()
    labelNode.each(function (d, i) {
      if (i % 2 === 0) {
        d.x = d.node.x
        d.y = d.node.y
      } else {
        let b = this.getBBox()
        let diffX = d.x - d.node.x
        let diffY = d.y - d.node.y

        let dist = Math.sqrt(diffX * diffX + diffY * diffY)

        let shiftX = b.width * (diffX - dist) / (dist * 2)
        shiftX = Math.max(-b.width, Math.min(0, shiftX))
        let shiftY = 16
        this.setAttribute('transform', 'translate(' + shiftX + ',' + shiftY + ')')
      }
    })
    labelNode.call(updateNode)
  }

  function fixna (x) {
    if (isFinite(x)) return x
    return 0
  }

  // function focus () {
  //   let index = d3.select(d3.event.target).datum().index
  //   node.style('opacity', function (o) {
  //     return neigh(index, o.index) ? 1 : 0.1
  //   })
  //   labelNode.attr('display', function (o) {
  //     return neigh(index, o.node.index) ? 'block' : 'none'
  //   })
  //   link.style('opacity', function (o) {
  //     return o.source.index === index || o.target.index === index ? 1 : 0.1
  //   })
  // }

  // function unfocus () {
  //   labelNode.attr('display', 'block')
  //   node.style('opacity', 1)
  //   link.style('opacity', 1)
  // }

  function updateLink (link) {
    link.attr('x1', function (d) { return fixna(d.source.x) })
        .attr('y1', function (d) { return fixna(d.source.y) })
        .attr('x2', function (d) { return fixna(d.target.x) })
        .attr('y2', function (d) { return fixna(d.target.y) })
  }

  function updateNode (node) {
    node.attr('transform', function (d) {
      // console.log(fixna(d.x) + ' , ' + fixna(d.y))
      return 'translate(' + fixna(d.x) + ',' + fixna(d.y) + ')'
    })
  }

  // function dragstarted (d) {
  //   d3.event.sourceEvent.stopPropagation()
  //   if (!d3.event.active) graphLayout.alphaTarget(0.3).restart()
  //   d.fx = d.x
  //   d.fy = d.y
  // }

  // function dragged (d) {
  //   d.fx = d3.event.x
  //   d.fy = d3.event.y
  // }

  // function dragended (d) {
  //   if (!d3.event.active) graphLayout.alphaTarget(0)
  //   d.fx = null
  //   d.fy = null
  // }
}

onBeforeUnmount(() => {
  beforeDestroy()
})

onActivated(() => {
  activated()
})

onDeactivated(() => {
  deactivated()
})

onMounted(() => {
  mounted()
  nextTick(async () => {
    await initChart()
  })
})

</script>

<style lang="scss" scoped>

</style>
