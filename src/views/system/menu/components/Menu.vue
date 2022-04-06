<template>
  <div class="component-container">
    <!-- 搜索表單 -->
    <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
      </el-form-item>

      <el-form-item prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="菜單名稱"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 數據表格 -->
    <el-table
        v-loading="loading"
        :data="menuList"
        row-key="id"
        highlight-current-row
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @row-click="handleRowClick"
        border
    >
      <el-table-column label="菜單名稱">
        <template #default="scope">
          <svg-icon color='#333' :icon-class="scope.row.icon?scope.row.icon:'build'"/>
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column label="狀態" align="center" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.visible===1" type="success">顯示</el-tag>
          <el-tag v-else type="info">隐藏</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
              type="success"
              :icon="Plus"
              circle
              plain
              @click.stop="handleAdd(scope.row)"
          />
          <el-button
              type="primary"
              :icon="Edit"
              circle
              plain
              @click.stop="handleUpdate(scope.row)"
          />
          <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              @click.stop="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗表單 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        width="750px"
    >
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="父級菜單" prop="parentId">
          <tree-select
              v-model="formData.parentId"
              :options="menuOptions"
              placeholder="選擇上級菜單"
          />
        </el-form-item>

        <el-form-item label="菜單名稱" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入菜單名稱"/>
        </el-form-item>

        <el-form-item label="是否外链">
          <el-radio-group v-model="isExternalPath">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isExternalPath" label="外链地址" prop="path">
          <el-input v-model="formData.path" placeholder="請輸入外链完整路径"/>
        </el-form-item>

        <el-form-item v-if="!isExternalPath" label="頁面路径" prop="component">
          <el-input
              v-model="formData.component"
              placeholder="system/user/index"
              style="width: 95%"
          >
            <template v-if="formData.parentId!=0" #prepend>src/views/</template>
            <template v-if="formData.parentId!=0" #append>.vue</template>
          </el-input>

          <el-tooltip effect="dark"
                      content="請輸入组件路径，如果是父组件填寫 Layout 即可"
                      placement="right">
            <i class="el-icon-info" style="margin-left: 10px;color:darkseagreen"></i>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="菜單圖標">
          <el-popover
              placement="bottom-start"
              :width="540"
              v-model:visible="showChooseIcon"
              trigger="click"
              @show="showSelectIcon"
          >
            <icon-select ref="iconSelectRef" @selected="selected"/>
            <template #reference>
              <el-input v-model="formData.icon" placeholder="點擊選擇圖標" readonly>
                <template #prefix>
                  <svg-icon
                      v-if="formData.icon"
                      :icon-class="formData.icon"
                      class="el-input__icon"
                      style="margin:auto"
                      color="#999"
                  />
                  <i v-else class="el-icon-search el-input__icon"/>
                </template>
              </el-input>
            </template>
          </el-popover>
        </el-form-item>

        <el-form-item label="狀態">
          <el-radio-group v-model="formData.visible">
            <el-radio :label="1">顯示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" style="width: 100px" controls-position="right" :min="0"/>
        </el-form-item>

        <el-form-item label="跳轉路径">
          <el-input v-model="formData.redirect" placeholder="請輸入跳轉路径" maxlength="50"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">確 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {listTableMenus, getMenuDetail, listTreeSelectMenus, addMenu, deleteMenus, updateMenu} from "@/api/system/menu";
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {reactive, ref, unref, onMounted, toRefs} from "vue";
import SvgIcon from '@/components/SvgIcon/index.vue';
import TreeSelect from '@/components/TreeSelect/index.vue';
import IconSelect from '@/components/IconSelect/index.vue';
import {isExternal} from '@/utils/validate'

const emit = defineEmits(['menuClick'])
const iconSelectRef = ref(null);

const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const state = reactive({
  loading: true,
  // 選中ID數组
  ids: [],
  // 非單個禁用
  single: true,
  // 非多個禁用
  multiple: true,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined
  },
  menuList: [],
  total: 0,
  dialog: {
    title: '',
    visible: false
  },
  formData: {
    id: undefined,
    parentId: 0,
    name: '',
    visible: 1,
    icon: '',
    sort: 1,
    component: 'Layout',
    path: '',
    redirect: ''
  },
  rules: {
    parentId: [
      {required: true, message: '請選擇頂級菜單', trigger: 'blur'}
    ],
    name: [
      {required: true, message: '請輸入菜單名稱', trigger: 'blur'}
    ],
    component: [
      {required: true, message: '請輸入頁面路径', trigger: 'blur'}
    ]
  },
  menuOptions: [] as any[],
  currentRow: undefined,
  showChooseIcon: false,
  isExternalPath: false
})

const {
  loading,
  single,
  multiple,
  queryParams,
  menuList,
  total,
  dialog,
  formData,
  rules,
  menuOptions,
  isExternalPath,
  showChooseIcon
} = toRefs(state)

/**
 * 查询
 */
function handleQuery() {
  // 重置父组件
  emit('menuClick', null)
  state.loading = true
  listTableMenus(state.queryParams).then(response => {
    const {data, total} = response as any
    state.menuList = data
    state.total = total
    state.loading = false
  })
}

/**
 * 加載菜單下拉樹
 */
async function loadTreeSelectMenuOptions() {
  const menuOptions: any[] = []
  await listTreeSelectMenus().then(response => {
    const menuOption = {id: 0, label: '頂級菜單', children: response.data}
    menuOptions.push(menuOption)
    state.menuOptions = menuOptions
  })
}

/**
 * 重置查询
 */
function resetQuery() {
  const queryForm = unref(queryFormRef)
  queryForm.resetFields()
  handleQuery()
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id)
  state.single = selection.length !== 1
  state.multiple = !selection.length
}

function handleRowClick(row: any) {
  state.currentRow = JSON.parse(JSON.stringify(row))
  emit('menuClick', row)
}

async function handleAdd(row: any) {
  await loadTreeSelectMenuOptions()
  state.dialog = {
    title: '添加菜單',
    visible: true,
  }
  if (row.id) {
    // 行點擊新增
    state.formData.parentId = row.id
    if (row.id == 0) {
      state.formData.component = 'Layout'
    } else {
      state.formData.component = ''
    }

  } else {
    if (state.currentRow) {
      // 工具欄新增
      state.formData.parentId = (state.currentRow as any).id
      state.formData.component = ''
    } else {
      state.formData.parentId = 0
      state.formData.component = 'Layout'
    }
  }
}

async function handleUpdate(row: any) {
  await loadTreeSelectMenuOptions()
  state.dialog = {
    title: '修改菜單',
    visible: true
  }
  const id = row.id || state.ids
  getMenuDetail(id).then(response => {
    state.formData = response.data
    const path = state.formData.path as string
    state.isExternalPath = isExternal(path);
  })
}

function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {
    if (valid) {
      if (state.formData.id) {
        updateMenu(state.formData.id, state.formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          handleQuery()
        })
      } else {
        addMenu(state.formData).then(response => {
          ElMessage.success('新增成功')
          state.dialog.visible = false
          handleQuery()
        })
      }
    }
  })
}

function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',')
  ElMessageBox.confirm('確認删除已選中的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMenus(ids).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  }).catch(() =>
      ElMessage.info('已取消删除')
  )
}

// 重置表單
function resetForm() {
  dataFormRef.value.resetFields()
}

function cancel() {
  state.dialog.visible = false
  resetForm()
}

function showSelectIcon() {
  (iconSelectRef as any).value.reset();
  state.showChooseIcon = true;
}

function selected(name: string) {
  state.formData.icon = name;
  state.showChooseIcon = false;
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped>

</style>
