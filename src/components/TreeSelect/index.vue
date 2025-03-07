<template>
  <div class="el-tree-select">
    <el-select
        style="width: 100%"
        v-model="modelValue"
        ref="treeSelect"
        :filterable="true"
        :clearable="true"
        @clear="clearHandle"
        :filter-method="selectFilterData"
        :placeholder="placeholder"
    >
      <el-option :value="modelValue" :label="valueTitle">
        <el-tree
            id="tree-option"
            ref="selectTree"
            :accordion="accordion"
            :data="options"
            :props="state.props"
            :node-key="state.props.value"
            :expand-on-click-node="false"
            :default-expanded-keys="defaultExpandedKey"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
        ></el-tree>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, nextTick, onMounted, computed, watch} from "vue";

const {proxy} = getCurrentInstance();

const state = defineProps({
  // 配置項
  props: {
    type: Object,
    default: () => {
      return {
        value: 'id', // ID字段名
        label: 'label', // 顯示名稱
        children: 'children' // 子級字段名
      }
    }
  },
  // 自動收起
  accordion: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  // v-model 绑定的值
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // 數據源
  options: {
    type: Array,
    default: []
  },
  // 提示文字
  placeholder: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue']);

const modelValue = computed({
  get: () => {
    return state.modelValue
  },
  set: (val) => {
    emit('update:modelValue', val)
  }
});
const valueTitle = ref('');
const defaultExpandedKey = ref([]);

function initHandle() {
  nextTick(() => {
    const selectedValue = modelValue.value;
    if (selectedValue !== null && typeof (selectedValue) !== "undefined") {
      const node = proxy.$refs.selectTree.getNode(selectedValue)
      if (node) {
        valueTitle.value = node.data[state.props.label]
        proxy.$refs.selectTree.setCurrentKey(selectedValue) // 設置默認選中
        defaultExpandedKey.value = [selectedValue] // 設置默認展開
      } else {
        clearHandle()
      }
    }
  })
}

function handleNodeClick(node) {
  valueTitle.value = node[state.props.label]
  modelValue.value = node[state.props.value];
  defaultExpandedKey.value = [];
  proxy.$refs.treeSelect.blur()
  selectFilterData('')
}

function selectFilterData(val) {
  proxy.$refs.selectTree.filter(val)
}

function filterNode(value, data) {
  if (!value) return true
  return data[state.props['label']].indexOf(value) !== -1
}

function clearHandle() {
  valueTitle.value = ''
  modelValue.value = ''
  defaultExpandedKey.value = [];
  clearSelected()
}

function clearSelected() {
  const allNode = document.querySelectorAll('#tree-option .el-tree-node')
  allNode.forEach((element) => element.classList.remove('is-current'))
}

onMounted(() => {
  initHandle()
})

watch(modelValue, () => {
  initHandle();
})
</script>

<style lang='scss' scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  padding: 0;
  background-color: #fff;
  height: auto;
}

.el-select-dropdown__item.selected {
  font-weight: normal;
}

ul li .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
  box-sizing: border-box;
}

:deep(.el-tree-node__content:hover),
:deep(.el-tree-node__content:active),
:deep(.is-current > div:first-child),
:deep( .el-tree-node__content:focus ) {
  background-color: mix(#fff, #409EFF, 90%);
  color: #409EFF;
}
</style>
