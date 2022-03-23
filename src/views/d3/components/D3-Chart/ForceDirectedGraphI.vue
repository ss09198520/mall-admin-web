<!-- 漏斗图 -->
<template>
  <div
      :id="id"
      :class="className"
      :style="{height, width}"
  >
    <el-button
        type="success"
        @click="reDraw"
        size="small"
        style="float: right;"
    >
      重新生成
    </el-button>
    <h2>Force-Direct Graph</h2>
    <svg width="960" height="600" class="container-border"></svg>
  </div>
</template>

<script setup >
  import {nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted} from "vue";
  import { reactive, ref, toRefs } from 'vue'

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

  // ref声明响应式数据，用于声明基本数据类型
  // const name = ref('Jerry')
  // // 修改
  // name.value = 'Tom'
  //
  // // reactive声明响应式数据，用于声明引用数据类型
  // const state2 = reactive({
  //   name2: 'Jerry',
  //   sex: '男'
  // })

  // 修改
  // state2.name2 = 'Tom'
  // 使用

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
    "relations": [
      {"source": 1, relation: '關係A', "target": 2},
      {"source": 1, relation: '關係A', "target": 3},
      {"source": 1, relation: '關係A', "target": 6},
      {"source": 2, relation: '關係A', "target": 3},
      {"source": 2, relation: '關係A', "target": 7},
      {"source": 3, relation: '關係A', "target": 4},
      {"source": 8, relation: '關係A', "target": 3},
      {"source": 4, relation: '關係A', "target": 5},
      {"source": 4, relation: '關係A', "target": 9},
      {"source": 5, relation: '關係A', "target": 10}
    ]
  }
  // reactive声明响应式数据，用于声明引用数据类型
  const state = reactive(data)
  // 使用toRefs解构
  const {nodes, relations} = toRefs(state)


  function reDraw(){
    state.nodes = [
      {"id": 1, "name": "A"},
      {"id": 2, "name": "B"},
      {"id": 3, "name": "C"},
    ]

    state.relations = [
      {"source": 1, relation: '關係A', "target": 2},
      {"source": 1, relation: '關係A', "target": 3},
      {"source": 2, relation: '關係A', "target": 3},
      {"source": 2, relation: '關係A', "target": 3},
    ]
    forceLink2();
  }

  async function forceLink2(){

    // js
    // 设置一个颜色比例尺
    let colorScale = d3.scaleOrdinal()
        .domain(d3.range(nodes.value.length))
        .range(d3.schemeCategory10)
    const svg = d3.select('.container-border') //取得SVG 畫布
    const g = svg.append('g')

    let exit = svg.exit();
    exit.remove();
    // 生成節點 Group
    const dots = g.selectAll('.circleText')
        .data(nodes.value)
        .enter()
        .append('g')
    // 生成節點
    dots.append('circle')
        .attr('r', 25)
        .attr('fill', (d, i) => {
          return colorScale(i)
        })
        .style('opacity', 0.4)
    // 生成節點文字
    dots.append("text")
        .attr('x', -15)
        .attr('y', -15)
        .attr('dy', -10)
        .text(d => d.name)

    // 生成線群組
    const links = g.append('g')
          .selectAll("line")
          .data(relations.value)
          .join("line")
          .style('opacity', 0.4) //不透明度
          .attr('stroke', (d, i) => { //顏色
            return colorScale(i)
          })
          .attr('stroke-width', 2.5) //粗細

    // 線上的文字
    const linksText = g.append('g')
          .selectAll('text')
          .data(relations.value)
          .enter()
          .append('text')
          .text(data => data.relation)
          .attr('x', -15)
          .attr('y', -15)
          .attr('dy', -10)

    // 設定力模擬器
    const simulation = d3.forceSimulation(nodes.value)
        // .alphaDecay(0) // 收斂永不停止
        // .velocityDecay(0.2) // 設定摩擦係數
        .force("link",  d3.forceLink().id( (d) => d.id ).links(relations.value))
        // 設定中心點位置
        // .force("center", d3.forceCenter(250, 150))
        .force("center", d3.forceCenter().x(550).y(150))
        // 設定節點間電荷力
        .force("charge", d3.forceManyBody().strength(-300))
        // .force("charge", d3.forceManyBody().strength(1))
        // 設定節點間彼此的互斥力
        .force("collide", d3.forceCollide().strength(0.2).radius(50).iterations(1))
        .on('tick', ticked)


    // 綁定節點 線 文字
    function ticked(d){
      links
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      linksText
          .attr('x', function (d) { return (d.source.x + d.target.x) / 2 })
          .attr('y', function (d) { return (d.source.y + d.target.y) / 2 })

      dots.attr("cx", d=> d.x)
          .attr("cy", d => d.y)
          .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')' });
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
      await forceLink2()
    })
  })

</script>

<style lang="scss" scoped>

</style>