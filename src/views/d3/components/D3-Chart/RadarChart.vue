<!-- 雷達圖 -->
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
    default: 'radarChart'
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
  const radarChart = init(document.getElementById(props.id) as HTMLDivElement)

  radarChart.setOption({
    title: {
      show: true,
      text: '訂單狀態總雷達圖',
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
      x: 'center',
      y: 'bottom',
      data: ['預定數量', '下單數量','發貨數量']
    },
    radar: {
      // shape: 'circle',
      radius: '60%',
      indicator: [
        { name: '家用電器', max: 6500 },
        { name: '服裝箱包', max: 16000 },
        { name: '運動戶外', max: 30000 },
        { name: '手機產品', max: 38000 },
        { name: '汽車用品', max: 52000 },
        { name: '家具廚具', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 10000, 20000, 35000, 50000, 18000],
            name: '預定數量'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '下單數量'
          },
          {
            value: [5000, 12000, 23000, 18000, 31000, 11000],
            name: '發貨數量'
          }
        ]
      }
    ]
  } as EChartsOption)

  chart.value = radarChart
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
