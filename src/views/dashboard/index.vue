<template>
  <div class="dashboard-container">
<!--    <github-corner class="github-corner"/>-->

    <!-- 數據 -->
    <el-row :gutter="40" class="card-panel-col">

      <el-col :xs="24" :sm="12"  :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
             瀏覽數
            </div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              訊息數
            </div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              交易金額
            </div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12"  :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              訂單數量
            </div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 項目 + 團隊成員介绍 -->
    <el-row :gutter="40">

      <!-- 項目介绍 -->
      <!-- <el-col :md="12" :lg="12" class="card-panel-col">
        <Project/>
      </el-col> -->

      <!-- 團隊介绍 -->
      <!-- <el-col :md="12" :lg="12" class="card-panel-col">
        <Team/>
      </el-col> -->


    </el-row>


    <!-- Echarts 圖表 -->
    <el-row :gutter="40" style="margin-top: 20px">
      <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
        <!--訂單漏斗圖-->
        <FunnelChart id="funnelChart" height="400px" width="100%" class="chart-container"/>
      </el-col>
      <el-col :sm="24" :lg="8" class="card-panel-col">
        <BarChart id="barChart" height="400px" width="100%" class="chart-container"/>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
        <PieChart id="pieChart" height="400px" width="100%" class="chart-container"/>
        <!--訂單漏斗圖-->
        <!--<FunnelChart id="funnelChart" height="400px" width="100%" class="chart-container"/>-->
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel-col">
        <RadarChart id="radarChart" height="400px" width="100%" class="chart-container"/>
      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">

// Vue引用
import {computed, nextTick, onMounted, reactive, toRefs, watchEffect} from "vue";

// 组件引用
import GithubCorner from '@/components/GithubCorner/index.vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import BarChart from "./components/Chart/BarChart.vue";
import PieChart from "./components/Chart/PieChart.vue";
import RadarChart from "./components/Chart/RadarChart.vue";
import FunnelChart from "./components/Chart/FunnelChart.vue";

import Project from "./components/Project/index.vue";
import Team from "./components/Team/index.vue";

import BScroll from 'better-scroll'

import {useUserStoreHook} from "@/store/modules/user"

const roles = computed(() => useUserStoreHook().roles);
const avatar = computed(() => useUserStoreHook().avatar);
const nickname = computed(() => useUserStoreHook().nickname);


</script>


<style lang="scss" scoped>

.dashboard-container {
  padding: 24px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .user-profile {
    .user-name {
    }

    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .card-panel-col {
    margin-bottom: 12px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-user {
        background: #e77541;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;

      .svg-icon {
        width: 4em !important;
        height: 4em !important;
      }
    }

    .icon-message {
      color: #36a3f7;

      .svg-icon {
        width: 4em !important;
        height: 4em !important;
      }
    }

    .icon-money {
      color: #f4516c;

      .svg-icon {
        width: 4em !important;
        height: 4em !important;
      }
    }

    .icon-shopping {
      color: #34bfa3;

      .svg-icon {
        width: 4em !important;
        height: 4em !important;
      }
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 20px 0;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }


  .chart-container {
    background: #ffffff;
  }


}

</style>
