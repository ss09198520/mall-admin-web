<!-- 圓餅圖 -->
<template>
  <div
      :id="id"
      :class="className"
      :style="{height, width}"
  />
</template>

<script setup lang="ts">
import {nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted} from "vue";
import {init, EChartsOption} from 'echarts'
import resize from "@/utils/resize";

const props = defineProps({
  id: {
    type: String,
    default: 'pieChart'
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

function initChart() {
  const pieChart = init(document.getElementById(props.id) as HTMLDivElement)

  pieChart.setOption({
    title: {
      show: true,
      text: '產品分類總覽南丁格爾餅圖',
      x: 'center',
      padding: 15,
      textStyle: {
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'bold',
        color:'#096b92'
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '10%',
      containLabel: true
    },
    legend: {
      top: 'bottom'
    },
    series: [
      {
        name: 'Nightingale Chart',
        type: 'pie',
        radius: [50, 130],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          { value: 26, name: '家用電器' },
          { value: 27, name: '戶外運動' },
          { value: 24, name: '汽車用品' },
          { value: 23, name: '手機產品' }
        ]
      }
    ]
  } as EChartsOption)

  chart.value = pieChart
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
  nextTick(() => {
    initChart()
  })
})
</script>

<style lang="scss" scoped>

</style>