<template>
  <div class="app-container">

    <!-- D3圖表  -->
<!--    <el-row style="margin-top: 20px">-->
    <el-row>
      <el-col>
        <!--基礎網路力向圖-->
<!--        <ForceBasedChart id="funnelChart" height="400px" width="100%" class="chart-container"/>-->
        <router-view v-slot="{ Component ,route}" class="chart-container" height="900px" width="100%">
          <transition name="router-fade" mode="out-in">
            <component :is="Component" :key="route.path"/>
          </transition>
        </router-view>
      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">

// Vue引用
import {computed, nextTick, onMounted, reactive, toRefs, watchEffect} from "vue";

// 组件引用
// import ForceBasedChart from "./components/D3-Chart/ForceBasedLabelPlacementI.vue";


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
