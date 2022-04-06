<template>
  <div class="app-container">

    <el-form
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
    >
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :icon="Delete" :disabled="single" @click="handleDelete">删除
        </el-button>
      </el-form-item>

      <el-form-item>
        <el-input
            v-model="queryParams.name"
            placeholder="請輸入部門名稱"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-select
            v-model="queryParams.status"
            placeholder="部門狀態"
            clearable
        >
          <el-option :value="1" label="正常"/>
          <el-option :value="0" label="禁用"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
            class="filter-item"
            type="primary"
            :icon="Search"
            @click="handleQuery"
        >
          搜索
        </el-button>
        <el-button
            :icon="Refresh"
            @click="resetQuery"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        :data="deptList"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column prop="name" label="部門名稱"/>
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status==1" type="success">正常</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="顯示排序" width="200"/>


      <el-table-column
          label="操作"
          align="center" width="150"
      >
        <template #default="scope">
          <el-button
              type="primary"
              :icon="Edit"
              circle
              plain
              @click.stop="handleUpdate(scope.row)"
          >
          </el-button>
          <el-button
              type="success"
              :icon="Plus"
              circle
              plain
              @click.stop="handleAdd(scope.row)"
          >
          </el-button>

          <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              @click.stop="handleDelete(scope.row)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部門對話框 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        width="600px"
        @closed="cancel"
    >
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
      >
        <el-form-item
            label="上級部門"
            prop="parentId"
        >
          <tree-select
              :options="deptOptions"
              placeholder="選擇上級部門"
              v-model="formData.parentId"
          />
        </el-form-item>
        <el-form-item label="部門名稱" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入部門名稱"/>
        </el-form-item>
        <el-form-item label="顯示排序" prop="sort">
          <el-input-number v-model="formData.sort" controls-position="right" style="width: 100px" :min="0"/>
        </el-form-item>
        <el-form-item label="部門狀態">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button
              type="primary"
              @click="submitForm">
            確 定
          </el-button>
          <el-button @click="cancel">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// Vue依賴
import {onMounted, reactive, unref, ref, toRefs} from 'vue'

// API依賴
import {listDeptTable, getDeptDetail, deleteDept, updateDept, addDept, listDeptSelect} from '@/api/system/dept'

// 组件依賴
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import TreeSelect from '@/components/TreeSelect/index.vue'
import {ElForm, ElMessage, ElMessageBox} from 'element-plus'

// DOM元素的引用聲明定義
const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const state = reactive({
  // 選中ID數组
  ids: [],
  // 非單個禁用
  single: true,
  disabled: false,
  originOptions: [],
  loading: true,
  // 表格樹數據
  deptList: [],
  // 部門樹選項
  deptOptions: [] as Array<any>,
  // 弹窗属性
  dialog: {
    title: '',
    visible: false
  },
  // 查询参數
  queryParams: {
    name: undefined,
    status: undefined
  },
  // 表單數據
  formData: {
    id: undefined,
    parentId: '',
    name: '',
    sort: 1,
    status: 1
  },
  // 表單参數校驗
  rules: {
    parentId: [
      {required: true, message: '上級部門不能為空', trigger: 'blur'}
    ],
    name: [
      {required: true, message: '部門名稱不能為空', trigger: 'blur'}
    ],
    sort: [
      {required: true, message: '顯示排序不能為空', trigger: 'blur'}
    ]
  }
})


const {ids, single, disabled, loading, deptList, deptOptions, queryParams, formData, rules, dialog} = toRefs(state)


/**
 * 部門查询
 */
function handleQuery() {
  state.loading = true
  listDeptTable(state.queryParams).then((response: any) => {
    state.deptList = response.data
    state.loading = false
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
  state.single = selection.length === 0
}


/**
 * 加載部門下拉數據源
 */
async function loadDeptOptions() {
  const deptOptions: any[] = []
  listDeptSelect().then(response => {
    const rootDeptOption = {id: 0, label: '頂級部門', children: response.data}
    deptOptions.push(rootDeptOption)
    state.deptOptions = deptOptions
  })
}

/**
 * 表單重置
 **/
function resetForm() {
  state.formData = {
    id: undefined,
    parentId: '',
    name: '',
    sort: 1,
    status: 1
  }
}

/**
 * 添加部門
 */
function handleAdd(row: any) {
  resetForm()
  loadDeptOptions()
  state.formData.parentId = row.id
  state.dialog = {
    title: '添加部門',
    visible: true
  }
}

/**
 * 修改部門
 */
async function handleUpdate(row: any) {
  await loadDeptOptions()
  const deptId = row.id || state.ids
  state.dialog = {
    title: '修改部門',
    visible: true
  }
  getDeptDetail(deptId).then((response: any) => {
    state.formData = response.data
  })
}

/**
 * 部門表單提交
 */
function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {

    if (valid) {
      if (state.formData.id) {
        updateDept(state.formData.id, state.formData).then((res: any) => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          handleQuery()
        })
      } else {
        addDept(state.formData).then(() => {
          ElMessage.success('新增成功')
          state.dialog.visible = false
          handleQuery()
        })
      }
    }
  })
}

/**
 * 删除部門
 *
 * @param row
 */
function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',')
  ElMessageBox.confirm(`確認删除已選中的數據項?`, '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteDept(ids).then(() => {
      handleQuery()
      ElMessage.success('删除成功')
    }).catch(() => {
      console.log(`删除失败`)
    })
  }).catch(() =>
      ElMessage.info('已取消删除')
  )
}

/**
 * 取消/關閉弹窗
 **/
function cancel() {
  resetForm()
  state.dialog.visible = false
}

onMounted(() => {
  handleQuery()
})
</script>
