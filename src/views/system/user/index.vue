<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部門數據 -->
      <el-col
          :span="4"
          :xs="24"
      >
        <el-card class="box-card">
          <el-input
              v-model="deptName"
              placeholder="部門名稱"
              clearable
              :prefix-icon="Search"
              style="margin-bottom: 20px"
          />
          <el-tree
              ref="deptTreeRef"
              :data="deptOptions"
              :props="{ children: 'children',label: 'label',disabled:''}"
              :expand-on-click-node="false"
              :filter-node-method="filterDeptNode"
              default-expand-all
              @node-click="handleDeptNodeClick"
          >
          </el-tree>
        </el-card>
      </el-col>

      <!-- 用戶數據 -->
      <el-col
          :span="20"
          :xs="24"
      >
        <el-card class="box-card">
          <el-form
              ref="queryFormRef"
              :model="queryParams"
              :inline="true"
          >
            <el-form-item>
              <el-button
                  type="success"
                  :icon="Plus"
                  @click="handleAdd"
                  v-hasPerm="['sys:user:add']"
              >
                新增
              </el-button>
              <el-button
                  type="danger"
                  :icon="Delete"
                  :disabled="multiple"
                  @click="handleDelete"
                  v-hasPerm="['sys:user:delete']"
              >
                删除
              </el-button>
            </el-form-item>

            <el-form-item prop="keywords">
              <el-input
                  v-model="queryParams.keywords"
                  placeholder="用戶名/暱稱/手機號"
                  clearable
                  style="width: 200px"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item prop="status">
              <el-select
                  v-model="queryParams.status"
                  placeholder="用戶狀態"
                  clearable
                  style="width: 200px"
              >
                <el-option label="正常" value="1"/>
                <el-option label="停用" value="0"/>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button
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
              :data="pageList"
              @selection-change="handleSelectionChange"
          >
            <el-table-column
                type="selection"
                width="50"
                align="center"
            />
            <el-table-column
                key="id"
                label="用戶编號"
                align="center"
                prop="id"
            />
            <el-table-column
                key="username"
                label="用戶名稱"
                align="center"
                prop="username"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="用戶暱稱"
                align="center"
                prop="nickname"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="部門"
                align="center"
                prop="deptName"
                :show-overflow-tooltip="true"
            />
            <el-table-column
                label="手機號碼"
                align="center"
                prop="mobile"
                width="120"
            />

            <el-table-column
                label="狀態"
                align="center"
                prop="status"
            >
              <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    :inactive-value=0
                    :active-value=1
                    @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
                label="创建時間"
                align="center"
                prop="gmtCreate"
                width="180"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
              <template #default="scope">
                <el-button
                    type="primary"
                    :icon="Edit"
                    circle
                    plain
                    @click="handleUpdate(scope.row)"
                    v-hasPerm="['sys:user:edit']"
                >
                </el-button>
                <el-button
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click="handleDelete(scope.row)"
                    v-hasPerm="['sys:user:delete']"
                >
                </el-button>
                <el-button
                    type="warning"
                    :icon="Lock"
                    circle
                    plain
                    @click="resetPassword(scope.row)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
              v-show="total>0"
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.pageSize"
              @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改参數配置對話框 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        width="600px"
        append-to-body
        @close="cancel"
    >
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
      >

        <el-form-item
            label="用戶名"
            prop="username"
        >
          <el-input
              :readonly="!!formData.id"
              v-model="formData.username"
              placeholder="請輸入用戶名"
          />
        </el-form-item>

        <el-form-item
            label="用戶暱稱"
            prop="nickname"
        >
          <el-input
              v-model="formData.nickname"
              placeholder="請輸入用戶暱稱"
          />
        </el-form-item>

        <el-form-item
            label="歸属部門"
            prop="deptId"
        >
          <tree-select
              v-model="formData.deptId"
              :options="deptOptions"
              placeholder="請選擇歸属部門"
          />
        </el-form-item>

        <el-form-item
            label="手機號碼"
            prop="mobile"
        >
          <el-input
              v-model="formData.mobile"
              placeholder="請輸入手機號碼"
              maxlength="11"
          />
        </el-form-item>

        <el-form-item
            label="邮箱"
            prop="email"
        >
          <el-input
              v-model="formData.email"
              placeholder="請輸入邮箱"
              maxlength="50"
          />
        </el-form-item>

        <el-form-item label="狀態" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="用戶性别" prop="gender">
          <el-select
              v-model="formData.gender"
              placeholder="請選擇"
          >
            <el-option label="未知" :value="0"/>
            <el-option label="男" :value="1"/>
            <el-option label="女" :value="2"/>
          </el-select>
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select
              v-model="formData.roleIds"
              multiple
              placeholder="請選擇"
          >
            <el-option
                v-for="item in roleOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
              type="primary"
              @click="submitForm"
          >
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

<script setup lang='ts'>
// Vue依賴
import {reactive, ref, unref, watchEffect, onMounted, getCurrentInstance, toRefs} from 'vue'

// API依賴
import {listUsersWithPage, getUserFormDetail, deleteUsers, addUser, updateUser, updateUserPart} from '@/api/system/user'
import {listDeptSelect} from '@/api/system/dept'
import {listRoles} from '@/api/system/role'

// 组件依賴
import {ElMessage, ElMessageBox, ElTree, ElForm} from 'element-plus'
import {Search, Plus, Edit, Refresh, Delete, Lock} from '@element-plus/icons-vue'
import TreeSelect from '@/components/TreeSelect/index.vue'

// DOM元素的引用聲明定義
const deptTreeRef = ref(ElTree) // 變量名和DOM的ref属性值一致
const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const {proxy}: any = getCurrentInstance();

const state = reactive({
  // 遮罩層
  loading: true,
  // 選中數组
  ids: [],
  // 非單個禁用
  single: true,
  // 非多個禁用
  multiple: true,
  // 总條數
  total: 0,
  // 用戶分頁數據
  pageList: [],
  // 弹窗属性
  dialog: {
    title: '',
    visible: false
  },
  deptName:undefined,
  // 部門樹選項
  deptOptions: [],
  // 部門名稱
  // 性别狀態字典
  genderOptions: [] as any[],
  // 角色選項
  roleOptions: [] as any[],
  // 表單参數
  formData: {
    id: undefined,
    deptId: undefined,
    username: undefined,
    nickname: undefined,
    password: '',
    mobile: undefined,
    email: undefined,
    gender: undefined,
    status: 1,
    remark: undefined,
    roleIds: []
  },
  // 查询参數
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    keywords: undefined,
    status: undefined,
    deptId: undefined
  },
  // 表單校驗
  rules: {
    username: [
      {required: true, message: '用戶名不能為空', trigger: 'blur'}
    ],
    nickname: [
      {required: true, message: '用戶暱稱不能為空', trigger: 'blur'}
    ],
    deptId: [
      {required: true, message: '歸属部門不能為空', trigger: 'blur'}
    ],
    roleId: [
      {required: true, message: '用戶角色不能為空', trigger: 'blur'}
    ],
    email: [
      {
        pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
        message: '請輸入正確的邮箱地址',
        trigger: 'blur'
      }
    ],
    mobile: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '請輸入正確的手機號碼',
        trigger: 'blur'
      }
    ]
  }
})

const {
  loading,
  single,
  multiple,
  queryParams,
  pageList,
  total,
  dialog,
  formData,
  rules,
  deptName,
  deptOptions,
  roleOptions
} = toRefs(state)

/**
 * 部門筛選
 **/
watchEffect(() => {
  const deptTree = unref(deptTreeRef)
  deptTree.filter(state.deptName)
}, {
  flush: 'post' // watchEffect会在DOM挂載或者更新之前就会觸發，此属性控制在DOM元素更新后运行
})

function filterDeptNode(value: string, data: any) {
  if (!value) {
    return true
  }
  return data.label.indexOf(value) !== -1
}

/**
 * 部門樹节點點擊事件
 */
function handleDeptNodeClick(data: { [key: string]: any }) {
  state.queryParams.deptId = data.id
  handleQuery()
}

/**
 * 加載角色數據
 */
async function loadRoleOptions() {
  listRoles().then(response => {
    state.roleOptions = response.data
  })
}

/**
 * 用戶狀態修改
 */
function handleStatusChange(row: { [key: string]: any }) {
  const text = row.status === 1 ? '啟用' : '停用'
  ElMessageBox.confirm('確認要' + text + '' + row.username + '用戶嗎?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return updateUserPart(row.id, {status: row.status})
  }).then(() => {
    ElMessage.success(text + '成功')
  }).catch(() => {
    row.status = row.status === 1 ? 0 : 1
  })
}

/**
 * 用戶查询
 **/
function handleQuery() {
  state.loading = true
  listUsersWithPage(state.queryParams).then(response => {
    const {data, total} = response as any
    state.pageList = data
    state.total = total
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

/**
 * 表格行選中事件
 **/
function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id)
  state.single = selection.length !== 1
  state.multiple = !selection.length
}

/**
 * 密碼重置
 **/
function resetPassword(row: { [key: string]: any }) {
  ElMessageBox.prompt('請輸入用戶「' + row.username + '」的新密碼', '重置密碼', {
    confirmButtonText: '確定',
    cancelButtonText: '取消'
  }).then(({value}) => {
    if (!value) {
      ElMessage.warning("請輸入新密碼")
      return false
    }
    updateUserPart(row.id, {
      password: value
    }).then(() => {
      ElMessage.success('修改成功，新密碼是：' + value)
    })
  }).catch(() => {

  })
}

/**
 * 添加用戶
 **/
async function handleAdd() {
  await loadDeptOptions()
  await loadRoleOptions()
  state.dialog = {
    title: '添加用戶',
    visible: true
  }
}

/**
 * 修改用戶
 **/
async function handleUpdate(row: { [key: string]: any }) {
  const userId = row.id || state.ids
  await loadDeptOptions()
  await loadRoleOptions()
  state.dialog = {
    title: '修改用戶',
    visible: true
  }
  getUserFormDetail(userId).then((response: any) => {
    state.formData = response.data
  })
}


/**
 * 表單提交
 **/
function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {
    if (valid) {
      const userId = state.formData.id
      if (userId) {
        updateUser(userId, state.formData).then(() => {
          ElMessage.success('修改用戶成功')
          state.dialog.visible = false
          resetForm()
          handleQuery()
        })
      } else {
        addUser(state.formData).then((response: any) => {
          ElMessage.success('新增用戶成功')
          state.dialog.visible = false
          resetForm()
          handleQuery()
        })
      }
    }
  })
}


/**
 * 重置表單
 */
function resetForm() {
  dataFormRef.value.resetFields()
}


/**
 * 删除用戶
 **/
function handleDelete(row: { [key: string]: any }) {
  const userIds = row.id || state.ids.join(',')
  ElMessageBox.confirm('是否確認删除用戶编號為「' + userIds + '」的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(function () {
    deleteUsers(userIds).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  }).catch(() =>
      ElMessage.info('已取消删除')
  )
}

/**
 * 取消關閉
 */
function cancel() {
  state.dialog.visible = false
  resetForm()
}

/**
 * 加載部門數據
 **/
async function loadDeptOptions() {
  listDeptSelect().then(response => {
    state.deptOptions = response.data
  })
}

/**
 * 加載性别字典數據
 */
function loadGenderOptions() {
  proxy.$listDictsByCode('gender').then((response: any) => {
    state.genderOptions = response?.data
  })
}

/**
 * 初始化數據
 */
function loadData() {
  loadGenderOptions()
  loadDeptOptions()
  handleQuery()
}

onMounted(() => {

  loadData()
})
</script>
<style lang="scss" scoped>

</style>
