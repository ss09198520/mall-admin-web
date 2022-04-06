<template>
  <div class="component-container">
    <div class="component-container__main">
      <el-card class="box-card">
        <template #header>
          <span>商品規格</span>
          <el-button
              :icon="Plus"
              type="success"
              @click="handleSpecAdd"
              size="small"
              style="float: right;"
          >
            添加規格項
          </el-button>
        </template>

        <el-form
            ref="specFormRef"
            :model="specForm"
            :inline="true"
            size="small"
        >
          <el-table
              ref="specTableRef"
              :data="specForm.specList"
              row-key="id"
              size="small"
          >
            <el-table-column align="center" width="50">
              <template>
                <svg-icon class="drag-handler" icon-class="drag"/>
              </template>
            </el-table-column>
            <el-table-column label="規格名" width="200">
              <template #default="scope">
                <el-form-item
                    :prop="'specList[' + scope.$index + '].name'"
                    :rules="rules.spec.name"
                >
                  <el-input
                      type="text"
                      v-model="scope.row.name"
                      size="small"
                      @input="handleSpecChange()"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column>
              <template #header>
                規格值
                <el-link type="danger" style="font-size:12px" :underline="false">（默認第一條規格包含圖片）</el-link>
              </template>

              <template #default="scope">
                <div v-for="item in scope.row.values"
                     style="margin-right:15px;display: inline-block"
                >
                  <el-tag
                      size="small"
                      closable
                      :type="colors[scope.$index%colors.length]"
                      @close="handleSpecValueRemove(scope.$index,item.id)"
                  >
                    {{ item.value }}
                  </el-tag>
                  <single-upload
                      v-model="item.picUrl"
                      v-if="scope.$index==0"
                      style="margin-top: 5px"
                  />
                </div>

                <el-input
                    v-if="tagInputs.length>0 &&tagInputs[scope.$index].visible"
                    v-model="tagInputs[scope.$index].value"
                    @keyup.enter.native="handleSpecValueInput(scope.$index)"
                    @blur="handleSpecValueInput(scope.$index)"
                    style="width: 80px;vertical-align: top"
                    size="small"
                />
                <el-button
                    v-else
                    @click="handleSpecValueAdd(scope.$index)"
                    :icon="Plus"
                    style="vertical-align: top"
                    size="small"
                >
                  添加規格值
                </el-button>
              </template>
            </el-table-column>

            <el-table-column width="60" label="操作">
              <template #default="scope">
                <el-button
                    type="danger"
                    :icon="Minus"
                    size="small"
                    circle
                    plain
                    @click.stop="handleSpecRemove(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>

      <el-card class="box-card">
        <template #header>
          <span>商品庫存</span>
        </template>
        <el-form
            ref="skuFormRef"
            :model="skuForm"
            size="small"
            :inline="true"
        >
          <el-table
              :data="skuForm.skuList"
              :span-method="objectSpanMethod"
              highlight-current-row
              size="small"
              border
          >

            <el-table-column
                v-for="(title,index) in specTitles"
                align="center"
                :prop="'specValue'+(index+1)"
                :label="title">
            </el-table-column>

            <el-table-column
                label="商品编碼"
                align="center"
            >
              <template #default="scope">
                <el-form-item :prop="'skuList['+scope.$index+'].sn'" :rules="rules.sku.sn">
                  <el-input v-model="scope.row.sn"/>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="價格" align="center">
              <template #default="scope">
                <el-form-item :prop="'skuList['+scope.$index+'].price'" :rules="rules.sku.price">
                  <el-input v-model="scope.row.price"/>
                </el-form-item>
              </template>
            </el-table-column>

            <el-table-column label="庫存" align="center">
              <template #default="scope">
                <el-form-item :prop="'skuList['+scope.$index+'].stock'" :rules="rules.sku.stock">
                  <el-input v-model="scope.row.stock"/>
                </el-form-item>
              </template>
            </el-table-column>

          </el-table>

        </el-form>
      </el-card>
    </div>
    <div class="component-container__footer">
      <el-button @click="handlePrev">上一步，設置商品属性</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>


  </div>
</template>

<script setup>
import {listAttributes} from "@/api/pms/attribute";
import SingleUpload from '@/components/Upload/SingleUpload.vue'
// import Sortable from 'sortablejs'
import {addGoods, updateGoods} from "@/api/pms/goods";
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs, unref, watch} from "vue";
import {ElNotification, ElMessage, ElTable, ElForm} from "element-plus"
import {Plus, Minus} from '@element-plus/icons-vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import {useRouter} from "vue-router";

const emit = defineEmits(['prev', 'next'])

const proxy = getCurrentInstance()
const router = useRouter()

const specTableRef = ref(ElTable)
const specFormRef = ref(ElForm)
const skuFormRef = ref(ElForm)

const props = defineProps({
  modelValue: {
    type: Object,
    default: {}
  }
})

const categoryId = computed(() => props.modelValue.categoryId);

const state = reactive({
  specForm: {
    specList: []
  },
  skuForm: {
    skuList: []
  },
  // 規格項表格標題
  specTitles: [],
  rules: {
    spec: {
      name: [{required: true, message: '請輸入規格名稱', trigger: 'blur'}],
      value: [{required: true, message: '請輸入規格值', trigger: 'blur'}]
    },
    sku: {
      sn: [{required: true, message: '請輸入商品编號', trigger: 'blur'}],
      price: [{required: true, message: '請輸入商品價格', trigger: 'blur'}],
      stock: [{required: true, message: '請輸入商品庫存', trigger: 'blur'}],
    }
  },
  colors: ['', 'success', 'warning', 'danger'],
  tagInputs: [{value: undefined, visible: false}], // 規格值標签臨時值和顯隐控制
  loading: undefined
})

const {specForm, skuForm, specTitles, rules, colors, tagInputs, loading} = toRefs(state)

watch(categoryId, (newVal, oldVal) => {
      // 商品编辑不加載分類下的規格
      const spuId = props.modelValue.id
      if (spuId) {
        return false;
      }
      if (newVal) {
        // type=1 商品分類下的規格
        listAttributes({categoryId: newVal, type: 1}).then(response => {
          const specList = response.data
          if (specList && specList.length > 0) {
            specList.forEach((item) => {
              state.specForm.specList.push({
                name: item.name,
                values: []
              })
            })
            loadData()
          }
        })
      }
    },
    {
      immediate: true,
      deep: true
    }
)


function loadData() {
  props.modelValue.specList.forEach((specItem) => {
    const specIndex = state.specForm.specList.findIndex(item => item.name == specItem.name)
    if (specIndex > -1) {
      state.specForm.specList[specIndex].values.push({
        id: specItem.id,
        value: specItem.value,
        picUrl: specItem.picUrl
      })
    } else {
      state.specForm.specList.push({
        name: specItem.name,
        values: [{id: specItem.id, value: specItem.value, picUrl: specItem.picUrl}]
      })
    }
  })

  // 每個規格項追加一個添加規格值按鈕
  for (let i = 0; i < state.specForm.specList.length; i++) {
    state.tagInputs.push({'value': undefined, 'visible': false})
  }

  // SKU規格ID拼接字符串处理
  props.modelValue.skuList.forEach((sku) => {
    sku.specIdArr = sku.specIds.split('_')
  })

  generateSkuList()

  handleSpecChange()

  handleSpecReorder()

  nextTick(() => {
    // registerSpecDragSortEvent()
  })
}

/**
 * 生成SKU列表的title
 */
function handleSpecChange() {
  const specList = JSON.parse(JSON.stringify(state.specForm.specList))
  state.specTitles = specList.map((item) => item.name)
}

/**
 * 規格列表重排序
 */
function handleSpecReorder() {
  state.specForm.specList.forEach((item, index) => {
    item.index = index
  })
}

/**
 * 注册拖拽排序事件
 */
/*function registerSpecDragSortEvent() {
  const el = specTableRef.value.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
  Sortable.create(el, {
    ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
    setData: function (dataTransfer: any) {
      dataTransfer.setData('Text', '')
    },
    onEnd: (evt: any) => {
      // oldIndex 拖拽行当前所在索引
      // newIndex 拖拽行目標索引
      const targetRow = state.specForm.specList.splice(evt.oldIndex, 1)[0] //  返回被删除的行
      state.specForm.specList.splice(evt.newIndex, 0, targetRow) // 拼接
      generateSkuList() // 重新生成sku
      handleSpecChange()
      handleSpecReorder()
    }
  })
}*/

/**
 *  根據商品規格笛卡尔积生成SKU列表
 *
 * 規格列表：
 * [
 *    { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] },
 *    { 'id':2,'name':'版本','values':[{id:1,value:'6+128G'},{id:2,value:'8+128G'},{id:3,value:'8G+256G'}] }
 * ]
 */
function generateSkuList() {
  const specList = JSON.parse(JSON.stringify(state.specForm.specList.filter(item => item.values.length > 0))) // 深拷贝，取有属性的規格項，否则笛卡尔积运算得到的SKU列表值為空
  // 如果規格為空，生成SKU列表為空
  if (specList.length === 0) {
    state.skuForm.skuList = []
    return
  }
  const skuList = specList.reduce((acc, curr) => {
    let result = []
    acc.forEach((item) => {
      // curr => { 'id':1,'name':'颜色','values':[{id:1,value:'白色'},{id:2,value:'黑色'},{id:3,value:'蓝色'}] }
      curr.values.forEach((v) => {  // v=>{id:1,value:'白色'}
        let temp = Object.assign({}, item)
        temp.specValues += v.value + '_' // 規格值拼接
        temp.specIds += v.id + '|' // 規格ID拼接
        result.push(temp)
      })
    })
    return result
  }, [{specValues: '', specIds: ''}])

  skuList.forEach((item) => {
    item.specIds = item.specIds.substring(0, item.specIds.length - 1)
    item.name = item.specValues.substring(0, item.specIds.length - 1).replaceAll('_', ' ')
    const specIdArr = item.specIds.split('|')
    const skus = props.modelValue.skuList.filter((sku) =>
        sku.specIdArr.length === specIdArr.length &&
        sku.specIdArr.every((a) => specIdArr.some((b) => a === b)) &&
        specIdArr.every((x) => sku.specIdArr.some((y) => x === y))
    ) // 數據庫的SKU列表

    if (skus && skus.length > 0) {
      const sku = skus[0]
      item.id = sku.id
      item.sn = sku.sn
      item.price = sku.price / 100
      item.stock = sku.stock
    }
    const specValueArr = item.specValues.substring(0, item.specValues.length - 1).split('_')  // ['黑','6+128G','官方標配']
    specValueArr.forEach((v, i) => {
      const key = 'specValue' + (i + 1)
      item[key] = v
      if (i == 0 && state.specForm.specList.length > 0) {
        const valueIndex = state.specForm.specList[0].values.findIndex((specValue) => specValue.value == v)
        if (valueIndex > -1) {
          item.picUrl = state.specForm.specList[0].values[valueIndex].picUrl
        }
      }
    })
  })
  state.skuForm.skuList = JSON.parse(JSON.stringify(skuList))
}

/**
 * 添加規格
 */
function handleSpecAdd() {
  if (state.specForm.specList.length >= 3) {
    ElMessage.warning('最多支持3组規格')
    return
  }
  state.specForm.specList.push({})
  state.tagInputs.push({'value': undefined, 'visible': false})
  handleSpecReorder()
}

/**
 * 删除規格
 * @param index
 */
function handleSpecRemove(index) {
  state.specForm.specList.splice(index, 1)
  state.tagInputs.splice(index, 1)
  generateSkuList()
  handleSpecReorder()
  handleSpecChange()
}

/**
 * 添加規格值
 *
 * @param specIndex
 */
function handleSpecValueAdd(specIndex) {
  state.tagInputs[specIndex].visible = true
}

/**
 *  删除規格值
 *
 * @param rowIndex
 * @param specValueId
 */
function handleSpecValueRemove(rowIndex, specValueId) {
  const specList = JSON.parse(JSON.stringify(state.specForm.specList))
  const removeIndex = specList[rowIndex].values.map((item) => item.id).indexOf(specValueId)
  specList[rowIndex].values.splice(removeIndex, 1)
  state.specForm.specList = specList
  generateSkuList()
  handleSpecChange()
  handleSpecReorder()
}

/**
 * 規格值輸入
 */
function handleSpecValueInput(rowIndex) {
  const currSpecValue = state.tagInputs[rowIndex].value
  const specValues = state.specForm.specList[rowIndex].values
  if (specValues && specValues.length > 0 && specValues.map((item) => item.value).includes(currSpecValue)) {
    ElMessage.warning("規格值重复，請重新輸入")
    return false
  }
  if (currSpecValue) {
    if (specValues && specValues.length > 0) {
      // 臨時規格值ID tid_1_1
      let maxSpecValueIndex = specValues.filter((item) => item.id.includes('tid_')).map((item) => item.id.split('_')[2]).reduce((acc, curr) => {
        return acc > curr ? acc : curr
      }, 0)
      console.log('maxSpecValueIndex', maxSpecValueIndex)
      state.specForm.specList[rowIndex].values[specValues.length] = {
        'value': currSpecValue,
        'id': 'tid_' + (rowIndex + 1) + '_' + ++maxSpecValueIndex
      }
    } else {
      state.specForm.specList[rowIndex].values = [{'value': currSpecValue, 'id': 'tid_' + (rowIndex + 1) + '_1'}]
    }
  }
  state.tagInputs[rowIndex].value = undefined
  state.tagInputs[rowIndex].visible = false
  generateSkuList()
}


/**
 * 合並規格單元格
 *
 * @param cellObj 單元格對象
 */

const objectSpanMethod = ({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                          }) => {

  let mergeRows = [1, 1, 1] // 分别對應規格1、規格2、規格3列合並的行數
  const specLen = state.specForm.specList.filter(item => item.values && item.values.length > 0).length
  if (specLen == 2) {
    const values_len_2 = state.specForm.specList[1].values ? state.specForm.specList[1].values.length : 1 // 第2個規格項的規格值的數量
    mergeRows = [values_len_2, 1, 1]
  } else if (specLen == 3) {
    const values_len_2 = state.specForm.specList[1].values ? state.specForm.specList[1].values.length : 1 // 第2個規格項的規格值的數量
    const values_len_3 = state.specForm.specList[2].values ? state.specForm.specList[2].values.length : 1 // 第3個規格項的規格值的數量
    mergeRows = [values_len_2 * values_len_3, values_len_3, 1]
  }
  if (columnIndex == 0) {
    if (rowIndex % mergeRows[0] === 0) {
      return [mergeRows[0], 1]// 合並單元格
    } else {
      return [0, 0] // 隐藏單元格
    }
  }
  if (columnIndex == 1) {
    if (rowIndex % mergeRows[1] === 0) {
      return [mergeRows[1], 1]// 合並單元格
    } else {
      return [0, 0]  // 隐藏單元格
    }
  }
}


/**
 * 商品表單提交
 */
function submitForm() {
  // 判断商品SKU列表是否為空
  if (!state.skuForm.skuList || state.skuForm.skuList.length === 0) {
    ElMessage.warning("未添加商品庫存")
    return false;
  }

  const specForm = unref(specFormRef)
  specForm.validate((specValid) => {
    if (specValid) {
      const skuForm = unref(skuFormRef)
      skuForm.validate((skuValid) => {
        if (skuValid) {
          // openFullScreen()

          // 重组商品的規格和SKU列表
          let submitsData = Object.assign({}, props.modelValue)
          delete submitsData.specList
          delete submitsData.skuList

          let specList = []
          state.specForm.specList.forEach(item => {
            item.values.forEach((value) => {
              value.name = item.name
            })
            specList = specList.concat(item.values)
          })
          submitsData.specList = specList  // 規格列表

          submitsData.price *= 100  // 金額轉成分保存至數據庫
          submitsData.originPrice *= 100

          let skuList = JSON.parse(JSON.stringify(state.skuForm.skuList))
          skuList.map((item) => {
            item.price *= 100
            return item
          })
          submitsData.skuList = skuList
          console.log('提交數據', submitsData)
          const goodsId = props.modelValue.id
          if (goodsId) { // 编辑商品提交
            updateGoods(goodsId, submitsData).then((res) => {
                  router.push({path: '/pms/goods'})
                  ElNotification({
                    title: '提示',
                    message: '编辑商品成功',
                    type: 'success',
                  })
                  //closeFullScreen()
                }, (err) => {
                  //closeFullScreen()
                }
            )
          } else { // 新增商品提交
            addGoods(submitsData).then(response => {
              router.push({path: '/pms/goods'})
              ElNotification({
                title: '提示',
                message: '新增商品成功',
                type: 'success',
              })
              // closeFullScreen()
            }, (err) => {
              // closeFullScreen()
            })
          }
        }
      })
    }
  })
}

function openFullScreen() {
  state.loading = proxy.$loading({
    lock: true,
    text: '商品信息提交中，請等待...',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}

function closeFullScreen() {
  if (state.loading) {
    state.loading.close()
  }
}

function handlePrev() {
  emit('prev')
}

function handNext() {
  emit('next')
}

onMounted(() => {
  loadData()
})

</script>

<style lang="scss" scoped>

.component-container {
  &__main {
    margin: 20px auto
  }

  &__footer {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }

  .box-card {
    margin-bottom: 20px;
  }
}

.el-form-item--mini.el-form-item {
  margin-top: 18px;
}
</style>
