<template>
  <div class="component-container">
    <div class="component-container__main">
      <el-cascader-panel
          ref="categoryRef"
          :options="categoryOptions"
          v-model="modelValue.categoryId"
          :props="{emitPath:false}"
          @change="handleCategoryChange"

      />

      <div style="margin-top: 20px">
        <el-link type="info" :underline="false" v-show="pathLabels.length>0">您選擇的商品分類:</el-link>
        <el-link type="danger" :underline="false" v-for="(item,index) in pathLabels" style="margin-left: 5px">
          {{ item }}
          <i v-show="index<pathLabels.length-1" class=" el-icon-arrow-right"></i>
        </el-link>
      </div>

    </div>
    <div class="component-container__footer">
      <el-button type="primary" @click="handleNext">下一步，填寫商品信息</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {listCascadeCategories} from "@/api/pms/category";
import {nextTick, onMounted, reactive, ref, toRefs} from "vue";
import {ElCascaderPanel, ElMessage} from "element-plus";
const emit = defineEmits(['next'])

const props = defineProps({
  modelValue: {
    type: Object,
    default:{ }
  }
})

const state = reactive({
  categoryOptions: [],
  pathLabels: []
})

const {categoryOptions, pathLabels} = toRefs(state)

function loadData() {
  listCascadeCategories({}).then(response => {
    state.categoryOptions = response.data
    if (props.modelValue.id) {
      nextTick(() => {
        handleCategoryChange()
      })
    }
  })
}
const categoryRef = ref(ElCascaderPanel)

function handleCategoryChange() {
  const checkNode = categoryRef.value.getCheckedNodes()[0]
  state.pathLabels = checkNode.pathLabels // 商品分類選擇層級提示
  props.modelValue.categoryId = checkNode.value
}

function handleNext() {
  if (!props.modelValue.categoryId) {
    ElMessage.warning('請選擇商品分類')
    return false
  }
  emit('next' )
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
}
</style>
