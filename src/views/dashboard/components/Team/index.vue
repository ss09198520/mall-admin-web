<!-- 團隊介绍 -->
<template>
  <div class="component-container">
    <el-card class="team-card">
      <template #header>
        <span class="fw-b">有来開源组織 & 技術團隊 </span>
      </template>
      <el-tabs v-model="teamActiveName">
        <el-tab-pane label="開發者「无回」" name="developer">
          <div class="developer">
            <ul class="developer__container">
              <li class="developer__item" v-for="(item,index) in developers">
                <div class="developer__inner">
                  <el-image
                      class="developer__img"
                      :src="item.imgUrl"
                      :preview-src-list="[item.imgUrl]">
                  </el-image>
                  <div class="developer__info">
                    <span class="developer__nickname">{{ item.nickname }}</span>
                    <div class="developer__position">
                      <el-tag v-for="(position,i) in item.positions"
                              :type="colors[i%colors.length]"
                              :class="i!==0?'f-ml':''"
                              size="small">
                        {{ position }}
                      </el-tag>
                    </div>
                    <div class="developer__homepage">
                      <a :href="item.homepage" target="_blank">
                        個人主頁
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <el-image class="developer__indicator" :src="indicatorImgUrl"/>
          </div>
        </el-tab-pane>

        <el-tab-pane label="交流群「有来」" name="2">
          <div class="group">
            <el-image
                class="group-img"
                src="https://gitee.com/haoxr/image/raw/master/default/20220129090754.png"
                :preview-src-list="['https://gitee.com/haoxr/image/raw/master/default/20220129090754.png']"
            />
            <div class="group-tip">
              群二维碼過期可添加開發者微信由其拉入群，备注「有来」即可。
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="加入我们" name="3">
          <div class="join">
            <p>1. 人品良好、善于思考、执行力强；</p>
            <p>2. 熟悉項目，且至少给項目提交(過)一個PR； </p>
            <p>3. Git代碼庫活跃，個人主頁或博客完善者优先；</p>
            <p>4. 過分优秀者我们会主動聯系您...</p>
            <div class="join__desc">
              申請加入方式: 添加開發者微信申請即可。
            </div>
          </div>
        </el-tab-pane>

      </el-tabs>
    </el-card>

  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, reactive, toRefs, watchEffect} from "vue";
import BScroll from "better-scroll";

const state = reactive({
  teamActiveName: 'developer',
  developers: [
    {
      imgUrl: 'https://gitee.com/haoxr/image/raw/master/hxr.jpg',
      nickname: '郝先瑞',
      positions: ['后端', '前端', '打杂'],
      homepage: 'https://www.cnblogs.com/haoxianrui/'
    },
    {
      imgUrl: 'https://gitee.com/haoxr/image/raw/master/default/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220128222910_gaitubao_841x841.jpg',
      nickname: '张加林',
      positions: ['DevOps'],
      homepage: 'https://gitee.com/ximy'
    },
    {
      imgUrl: 'https://gitee.com/haoxr/image/raw/master/default/ba695a5e70410a066b7052c5dc9db5c.jpg',
      nickname: '张川',
      positions: ['后端', '前端'],
      homepage: 'https://blog.csdn.net/qq_41595149'
    },
  ],
  colors: ['', 'success', 'warning', 'danger'],
  indicatorImgUrl: new URL(`../../../../assets/index/indicator.png`, import.meta.url).href
})

const {teamActiveName, developers, colors, indicatorImgUrl} = toRefs(state)

/*let bScroll = reactive({})

onMounted(() => {
  bScroll = new BScroll(document.querySelector('.developer-wrapper') as any, {
    startX: 0,
    click: true,
    scrollX: true,
    scrollY: false,
    eventPassthrough: "vertical" // 横向滚動，保留纵向原生滚動
  })
})

watchEffect(() => {
  nextTick(() => {
    bScroll && (bScroll as any).refresh()
  })
})*/

</script>

<style lang="scss" scoped>
.component-container {
  .team-card {
    font-size: 14px;

    .el-tabs__content {
      .el-tab-pane {
        height: 252px;
      }
    }

    .developer {
      width: 100%;

      &__container {
        display: flex;
        justify-content: flex-start;

        .developer__item {
          &:not(:first-child) {
            margin-left: 20px;
          }

          align-items: center;
          list-style: none;
          width: 180px;
          min-width: 180px;

          .developer__inner {
            border: 1px solid #cccccc;
            border-radius: 5px;
            box-shadow: 6px 6px 6px #AAA;
            padding: 8px;
            text-align: center;

            .developer__img {
              height: 100px;
              width: 100px;
            }

            .developer__info {
              padding: 6px;
              font-size: 14px;

              .developer__position {
                margin-top: 10px;
              }

              .developer__homepage {
                margin-top: 16px;

                a {
                  display: inline-block;
                  padding: 4px 10px;
                  color: #409EFF;
                  border: 1px solid #409EFF;
                  border-radius: 5px;
                  background: #ecf5ff;

                  &:hover {
                    background: #409EFF;
                    color: #FFFFFF;
                  }
                }
              }
            }
          }
        }
      }

      &__indicator{
        position: absolute;
        right: 0;
        bottom: 0;
        width: 120px;
        height: 100px;
      }
    }

    .join {
      height: 240px;

      p {
        font-weight: bold;
      }

      &__desc {
        margin-top: 20px;
        color: #409EFF;
        font-weight: bold;
      }
    }

    .group {
      height: 254px;

      &-img {
        height: 200px;
        width: 200px;
      }
    }
  }

  .fw-b {
    font-weight: bold;
  }

  .f-ml {
    margin-left: 5px;
  }


}

</style>
