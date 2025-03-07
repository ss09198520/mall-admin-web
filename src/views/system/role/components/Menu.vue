<template>
  <div class="menu-container">
    <el-form >
      <el-form-item>
        <el-row>
          <el-col :span="16">
            <el-button type="success" plain :icon="Switch" @click="toggleExpandAll">展開/折叠</el-button>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="primary" :icon="Check" @click="handleSubmit">提交</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-tree
        ref="menuRef"
        v-if="refreshTree"
        :default-expanded-keys="expandedKeys"
        :default-expand-all="isExpandAll"
        :data="menuOptions"
        show-checkbox
        node-key="id"
        empty-text="加載菜單中..."
        :check-strictly="checkStrictly"
        highlight-current
        @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts">
import {listTreeSelectMenus} from "@/api/system/menu";
import {listRoleMenuIds, updateRoleMenu} from "@/api/system/role"
import { nextTick, onMounted, reactive, ref, toRefs, watch} from "vue"
import {ElTree, ElMessage, ElMessageBox} from "element-plus"
import {Switch, Check} from '@element-plus/icons-vue'

const emit = defineEmits(['menuClick'])
const props = defineProps({
  role: {
    type: Object,
    default: {}
  }
})

const menuRef = ref(ElTree) // 属性名必須和元素的ref属性值一致

watch(() => props.role.id as any, (newVal, oldVal) => {
  const roleId = props.role.id
  if (roleId) {
    state.checkStrictly = true
    listRoleMenuIds(roleId).then(response => {
      const checkedMenuIds = response.data
      menuRef.value.setCheckedKeys(checkedMenuIds)
      state.checkStrictly = false
    })
  }
})

const state = reactive({
  expandedKeys: [],  // 展開的节點
  menuOptions: [],
  checkStrictly: false,
  isExpandAll: true,
  refreshTree: true
})

const {expandedKeys, menuOptions, checkStrictly, isExpandAll, refreshTree} = toRefs(state)

/**
 * 加載菜單樹
 */
async function loadTreeSelectMenuOptions() {
  await listTreeSelectMenus().then(response => {
    state.menuOptions = response.data
  })
}

function handleNodeClick(node: any) {
  emit('menuClick', node)
}

/**
 * 展開/收缩
 */
function toggleExpandAll() {
  state.refreshTree = false
  state.isExpandAll = !state.isExpandAll
  nextTick(() => {
    state.refreshTree = true
  })
}

/**
 * 保存角色的菜單
 */
function handleSubmit() {
  const checkedMenuIds = menuRef.value.getCheckedNodes(false, true).map((node: any) => node.id)
  updateRoleMenu(props.role.id, checkedMenuIds).then(() => {
    ElMessage.success('提交成功')
  })
}

onMounted(() => {
  loadTreeSelectMenuOptions()
})

</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
}
</style>
