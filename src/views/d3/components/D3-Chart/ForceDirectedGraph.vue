<!-- 漏斗圖 -->
<template>
  <div
      :id="id"
      :class="className"
      :style="{height, width}"
  >
    <h2>Force-Direct Graph</h2>
    <svg width="960" height="600" class="container-border"></svg>
  </div>
</template>

<script setup >
import {nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted} from "vue";
import * as d3 from 'd3';
import resize from '@/utils/resize'

const props = defineProps({
  id: {
    type: String,
    default: 'ForceDirectGraph'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '960px',
    required: true
  },
  height: {
    type: String,
    default: '600px',
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
// 原力Link
async function forceLink(){
  // js
  const data = {
    "nodes": [
      {"id": 1, "name": "A"},
      {"id": 2, "name": "B"},
      {"id": 3, "name": "C"},
      {"id": 4, "name": "D"},
      {"id": 5, "name": "E"},
      {"id": 6, "name": "F"},
      {"id": 7, "name": "G"},
      {"id": 8, "name": "H"},
      {"id": 9, "name": "I"},
      {"id": 10, "name": "J"}
    ],
    "links": [
      {"source": 1, "target": 2},
      {"source": 1, "target": 3},
      {"source": 1, "target": 6},
      {"source": 2, "target": 3},
      {"source": 2,"target": 7},
      {"source": 3,"target": 4},
      {"source": 8,"target": 3},
      {"source": 4,"target": 5},
      {"source": 4,"target": 9},
      {"source": 5,"target": 10}
    ]
  }
  // 設置一個颜色比例尺
  let colorScale = d3.scaleOrdinal()
      .domain(d3.range(data.nodes.length))
      .range(d3.schemeCategory10)
  const svg = d3.select('.container-border') //取得SVG 畫布
  const g = svg.append('g')
      // .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
  // 生成節點
  const dots = g.selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', 25)
      .attr('fill', (d, i) => {
        return colorScale(i)
      })
      .style('opacity', 0.4)

  const link = g.selectAll("line")
      .data(data.links)
      .join("line")
      .style('opacity', 0.4)
      // .style("stroke", 'green') //顏色
      .attr('stroke', (d, i) => {
        return colorScale(i)
      })
      .attr('stroke-width', 1.5)
  // 線上的文字
  // let linksText = d3.select('.container-border')
  //     .selectAll('text')
  //     .data(data.links)
  //     .enter()
  //     .append('text')
  //     .text(function (d) {
  //       return 'asdasd'
  //     })
  // 設定力模擬器
  const simulation = d3.forceSimulation(data.nodes)
      // .alphaDecay(0) // 收斂永不停止
      // .velocityDecay(0.2) // 設定摩擦係數
      .force("link",  d3.forceLink().id( (d) => d.id ).links(data.links))
      // 設定中心點位置
      // .force("center", d3.forceCenter(250, 150))
      .force("center", d3.forceCenter().x(550).y(150))
      // 設定節點間電荷力
      .force("charge", d3.forceManyBody().strength(-300))
      // .force("charge", d3.forceManyBody().strength(1))
      // 設定節點間彼此的互斥力
      .force("collide", d3.forceCollide().strength(0.2).radius(50).iterations(1))
      .on('tick', ticked)


  // 綁定節點
  function ticked(d){
    link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    dots.attr("cx", d=> d.x)
        .attr("cy", d => d.y);
  }

}

async function forceLink2(){
  // js
  // Node Dataset
  const data = {
    "nodes": [
      {"id": 1, "name": "A"},
      {"id": 2, "name": "B"},
      {"id": 3, "name": "C"},
      {"id": 4, "name": "D"},
      {"id": 5, "name": "E"},
      {"id": 6, "name": "F"},
      {"id": 7, "name": "G"},
      {"id": 8, "name": "H"},
      {"id": 9, "name": "I"},
      {"id": 10, "name": "J"}
    ],
    "links": [
      {"source": 1, "target": 2},
      {"source": 1, "target": 3},
      {"source": 1, "target": 6},
      {"source": 2, "target": 3},
      {"source": 2,"target": 7},
      {"source": 3,"target": 4},
      {"source": 8,"target": 3},
      {"source": 4,"target": 5},
      {"source": 4,"target": 9},
      {"source": 5,"target": 10}
    ]
  }
  // 設置一個颜色比例尺
  let colorScale = d3.scaleOrdinal()
      .domain(d3.range(data.nodes.length))
      .range(d3.schemeCategory10)
  const svg = d3.select('.container-border') //取得SVG 畫布
  const g = svg.append('g')
  // .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
  // 生成節點
  const dots = g.selectAll('.circleText')
      .data(data.nodes)
      .enter()
      .append('g')
  // .attr('transform', function (d) {
  //   console.log('transform ', d)
  //   let cirX = d.x
  //   let cirY = d.y
  //   return 'translate(' + cirX + ',' + cirY + ')'
  // })

  dots.append('circle')
      .attr('r', 25)
      // .style('fill', 'green')
      .attr('fill', (d, i) => {
        return colorScale(i)
      })
      .style('opacity', 0.4)
  // .append('text')
  // .text(function (d) {
  //   return d.name
  // })
  dots.append("text")
      .text(d => d.name)

  const link = g.append('g')
      .selectAll("line")
      .data(data.links)
      .join("line")
      .style('opacity', 0.4)
      // .style("stroke", 'green') //顏色
      .attr('stroke', (d, i) => {
        return colorScale(i)
      })
      .attr('stroke-width', 1.5)
  // 線上的文字
  // let linksText = d3.select('.container-border')
  //     .selectAll('text')
  //     .data(data.links)
  //     .enter()
  //     .append('text')
  //     .text(function (d) {
  //       return 'asdasd'
  //     })
  // 設定力模擬器
  const simulation = d3.forceSimulation(data.nodes)
      // .alphaDecay(0) // 收斂永不停止
      // .velocityDecay(0.2) // 設定摩擦係數
      .force("link",  d3.forceLink().id( (d) => d.id ).links(data.links))
      // 設定中心點位置
      // .force("center", d3.forceCenter(250, 150))
      .force("center", d3.forceCenter().x(550).y(150))
      // 設定節點間電荷力
      .force("charge", d3.forceManyBody().strength(-300))
      // .force("charge", d3.forceManyBody().strength(1))
      // 設定節點間彼此的互斥力
      .force("collide", d3.forceCollide().strength(0.2).radius(50).iterations(1))
      .on('tick', ticked)


  // 綁定節點
  function ticked(d){
    link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    dots.attr("cx", d=> d.x)
        .attr("cy", d => d.y);
  }

}

async function initChart2() {
  // js
  const data = {
    "nodes": [
      {"id": 1, "name": "A"},
    ],
    "links": [
      {"source": 1, "target": 2},
      {"source": 1, "target": 3},
      {"source": 1, "target": 6},
      {"source": 2, "target": 3},
      {"source": 2,"target": 7},
      {"source": 3,"target": 4},
      {"source": 8,"target": 3},
      {"source": 4,"target": 5},
      {"source": 4,"target": 9},
      {"source": 5,"target": 10}
    ]
  }

  // 設定顏色分組
  const colorScale = d3.scaleOrdinal()
      .domain([150, 250, 350])
      .range(["red", "blue", "orange"])

  const dots =  d3.select('.container-border')
      .append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('cx', 250)
      .attr('cy', 150)
      .attr('r', 20)
      .style('fill', (d) => colorScale (d.group))
      .style('opacity', '0.6') //透明度

  // const link = d3.select('.container-border')
  //     .selectAll("line")
  //     .data(data.links)
  //     .join("line")
  //     .style("stroke", "#aaa")

  // 設定力模擬
  const simulation = d3.forceSimulation()
      .alphaDecay(0) // 收斂永不停止
      .velocityDecay(0.2) // 設定摩擦係數
      .force("x", d3.forceX()) // 設定Ｘ軸平移位置
      .force("y", d3.forceY()) // 設定Ｙ軸移動位置
      .force("x", d3.forceX().strength(1.5).x(d => d.group))
      .force("y", d3.forceY().strength(1.1).y( 150 ))
      // 設定中心點位置
      .force("center", d3.forceCenter().x(550).y(150))
      // 設定節點間電荷力
      .force("charge", d3.forceManyBody().strength(1))
      // 設定節點間彼此的互斥力
      .force("collide", d3.forceCollide().strength(.1).radius(100).iterations(0.2))
  // 設定力模擬器
  // const simulation = d3.forceSimulation()
  //     .force("x", d3.forceX().strength(0.5).x(d => d.group))
  //     .force("y", d3.forceY().strength(0.1).y( 150 ))
  //     .force("center", d3.forceCenter().x(250).y(150))
  //     .force("charge", d3.forceManyBody().strength(1))
  //     .force("collide", d3.forceCollide().strength(.1).radius(20).iterations(1))

  // 將力模擬器的節點綁定資料，設定ticks開始時節點的動作
  simulation.nodes(data.nodes)
      .on("tick", function(d,i){
        dots.attr("cx", d => { console.log('tick' , d); d.x +100} ) //起始 X位置
            .attr("cy", d => d.y+100) //起始 Y位置
      });
}

async function initChart() {

  let marge = { top: 60, bottom: 60, left: 60, right: 60 }
  let svg = d3.select('svg')
  let width = svg.attr('width')
  let height = svg.attr('height')
  console.log('svg' , svg)
  console.log('width' , width)
  console.log('height' , height)
  let g = svg.append('g')
      .attr('transform', 'translate(' + marge.top + ',' + marge.left + ')')
  console.log('start init...')
  // Node Dataset
  let nodes = [
    { name: '湖南邵阳' },
    { name: '山东泰安' },
    { name: '广东阳江' },
    { name: '山西太原' },
    { name: '亮' },
    { name: '丽' },
    { name: '雪' },
    { name: '小明' },
    { name: '组長' }
  ]
  // Side Dataset
  let edges = [
    { source: 0, target: 4, relation: '籍贯', value: 1.3 },
    { source: 4, target: 5, relation: '舍友', value: 1 },
    { source: 4, target: 6, relation: '舍友', value: 1 },
    { source: 4, target: 7, relation: '舍友', value: 1 },
    { source: 1, target: 6, relation: '籍贯', value: 2 },
    { source: 2, target: 5, relation: '籍贯', value: 0.9 },
    { source: 3, target: 7, relation: '籍贯', value: 1 },
    { source: 5, target: 6, relation: '同學', value: 1.6 },
    { source: 6, target: 7, relation: '朋友', value: 0.7 },
    { source: 6, target: 8, relation: '职责', value: 2 }
  ]
  // Set a color scale
  // 設置一個颜色比例尺
  let colorScale = d3.scaleOrdinal()
      .domain(d3.range(nodes.length))
      .range(d3.schemeCategory10)

  // Create a new force guide diagram
  // 新建力導向圖
  console.log('start init...新建力導向圖')
  let forceSimulation = d3.forceSimulation()
      .force('link', d3.forceLink())
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter())
  // Generate node data
  // 生成node資料
  console.log('start init...生成node資料' ,nodes)
  forceSimulation.nodes(nodes)
      .on('tick', ticked)
  // Generate side data
  // 生成線資料
  console.log('start init...生成線資料')
  forceSimulation.force('link')
      .links(edges)
      .distance(function (d) { // side length / 每一邊的長度
        return d.value * 100
      })
  // Set drawing center location
  // 設定圖形中心位置
  console.log('start init...設定圖形中心位置')
  forceSimulation.force('center')
      .x(width / 2)
      .y(height / 2)

  // Draw side
  // 繪制邊
  console.log('start init...繪制邊')
  let links = g.append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', function (d, i) {
        return colorScale(i)
      })
      .attr('stroke-width', 1)
  // Text on side
  // 邊上的文字
  console.log('start init...邊上的文字')
  let linksText = g.append('g')
      .selectAll('text')
      .data(edges)
      .enter()
      .append('text')
      .text(function (d) {
        console.log('start init...邊上的文字' , d)
        return d.relation
      })
  // Create group
  // 創立分组
  console.log('start init...創立分组')
  let gs = g.selectAll('.circleText')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', function (d) {
        let cirX = d.x
        let cirY = d.y
        return 'translate(' + cirX + ',' + cirY + ')'
      })
      .call(d3.drag()
          .on('start', started)
          .on('drag', dragged)
          .on('end', ended)
      )
  // Draw node
  // 繪製節點
  console.log('start init...繪製節點')
  gs.append('circle')
      .attr('r', 10)
      .attr('fill', function (d, i) {
        return colorScale(i)
      })
  // Draw text
  // 繪製文字
  console.log('start init...繪製文字')
  gs.append('text')
      .attr('x', -10)
      .attr('y', -20)
      .attr('dy', 10)
      .text(function (d) {
        return d.name
      })
  // ticked
  function ticked () {
    links
        .attr('x1', function (d) { console.log('ticked',d); return d.source.x })
        .attr('y1', function (d) { return d.source.y })
        .attr('x2', function (d) { return d.target.x })
        .attr('y2', function (d) { return d.target.y })
    linksText
        .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
        .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })
    gs
        .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' })
  }
  // drag
  function started (dragEvent , d) {
    if (!dragEvent.active) {
      forceSimulation.alphaTarget(0.8).restart() // Set the attenuation coefficient to simulate the node position movement process. The higher the value, the faster the movement. The value range is [0, 1] // 設置衰减系數，對节點位置移動過程的模拟，數值越高移動越快，數值范围[0, 1]
    }
    d.fx = d.x
    d.fy = d.y
    // dragEvent.subject.fx = dragEvent.subject.x
    // dragEvent.subject.fy = dragEvent.subject.y
  }
  function dragged (dragEvent, d) {
    dragEvent.subject.fx = dragEvent.x;
    dragEvent.subject.fy = dragEvent.y;
    // d.fx = dragEvent.x;
    // d.fy = dragEvent.y;
  }
  function ended (dragEvent ,d) {
    if (!dragEvent.active) {
      forceSimulation.alphaTarget(0)
    }
    d.fx = null
    d.fy = null
  }

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
    await forceLink()
  })
})

</script>

<style lang="scss" scoped>

</style>
