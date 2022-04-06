<template>
  <div claas="component-container">
    <!-- 搜索表單 -->
    <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item>
        <el-button type="success" :icon="Plus" :disabled="!menuId" @click="handleAdd">新增</el-button>
        <el-button type="danger" :icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>
      <el-form-item prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="權限名稱"
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
        :data="pageList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        border
    >
      <el-table-column type="selection" width="40" align="center"/>
      <el-table-column label="權限名稱" prop="name" width="150"/>
      <el-table-column label="URL權限" align="center">
        <el-table-column prop="serviceName" label="所属服务"/>
        <el-table-column prop="requestMethod" label="請求方式"/>
        <el-table-column prop="requestPath" label="請求路径"/>
      </el-table-column>
      <el-table-column label="按鈕權限" prop="btnPerm" width="200"/>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
              type="primary"
              :icon="Edit"
              circle
              plain
              @click="handleUpdate(scope.row)"
          />
          <el-button
              type="danger"
              :icon="Delete"
              circle
              plain
              @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁工具條 -->
    <pagination
        v-show="total>0"
        :total="total"
        :page="queryParams.pageNum"
        :limit="queryParams.pageSize"
        @pagination="handleQuery"
    />

    <!-- 表單弹窗 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        width="700px">
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="120px"
      >

        <el-form-item label="權限名稱" prop="name">
          <el-input v-model="formData.name" placeholder="請輸入權限名稱"/>
        </el-form-item>

        <el-form-item label="URL權限標示" prop="urlPerm">
          <el-input placeholder="/api/v1/users" v-model="urlPerm.requestPath" class="input-with-select">
            <template #prepend>
              <el-select
                  v-model="urlPerm.serviceName"
                  style="width: 130px;"
                  placeholder="所属服务"
                  clearable
              >
                <el-option v-for="item in microServiceOptions" :value="item.value" :label="item.name"/>
              </el-select>

              <el-select
                  v-model="urlPerm.requestMethod"
                  style="width: 120px;margin-left: 20px"
                  slot="prepend"
                  placeholder="請求方式"
                  clearable
              >
                <el-option
                    v-for="item in requestMethodOptions"
                    :value="item.value"
                    :label="item.name"
                />
              </el-select>
            </template>
          </el-input>
          <el-link v-show="urlPerm.requestMethod">
            {{ urlPerm.requestMethod }}:/{{ urlPerm.serviceName }}{{ urlPerm.requestPath }}
          </el-link>
        </el-form-item>

        <el-form-item label="按鈕權限標示" prop="btnPerm">
          <el-input v-model="formData.btnPerm" placeholder="sys:user:add"/>
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
import {listPermsWithPage, getPermDetail, addPerm, updatePerm, deletePerms} from "@/api/system/perm"
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import {onMounted, watch, reactive, ref, unref, getCurrentInstance, toRefs} from 'vue'
import {ElForm, ElMessage, ElMessageBox} from "element-plus"

const {proxy}: any = getCurrentInstance();

const queryFormRef = ref(ElForm)
const dataFormRef = ref(ElForm)

const props = defineProps({
  menuId: {
    type: String,
    default: ''
  }
})

watch(() => props.menuId as any, (newVal, oldVal) => {
  state.queryParams.menuId = newVal
  handleQuery()
})

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
    menuId: undefined,
    name: undefined
  },
  pageList: [],
  total: 0,
  dialog: {
    title: '',
    visible: false
  },
  formData: {
    id: undefined,
    name: undefined,
    urlPerm: '',
    btnPerm: '',
    menuId: ''
  },
  rules: {
    name: [
      {required: true, message: '請輸入權限名稱', trigger: 'blur'}
    ],
    perm: [
      {required: true, message: '請輸入權限標示', trigger: 'blur'}
    ],
    method: [
      {required: true, message: '請選擇請求方式', trigger: 'blur'}
    ]
  },
  microServiceOptions: [] as Array<any>,
  requestMethodOptions: [] as Array<any>,
  urlPerm: {
    requestMethod: undefined,
    serviceName: undefined,
    requestPath: undefined
  },
})

const {
  loading,
  ids,
  single,
  multiple,
  pageList,
  total,
  dialog,
  formData,
  rules,
  microServiceOptions,
  requestMethodOptions,
  urlPerm,
  queryParams
} = toRefs(state)

function handleQuery() {
  if (state.queryParams.menuId) {
    state.loading = true
    listPermsWithPage(state.queryParams).then(response => {
      const {data, total} = response as any
      state.pageList = data
      state.total = total
      state.loading = false
    })
  } else {
    state.loading = false
    state.pageList = []
    state.total = 0
    state.queryParams.pageNum = 1
  }
}

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

/**
 * 加載字典數據
 */
function loadDictOptions() {
  proxy.$listDictsByCode('micro_service').then((response: any) => {
    state.microServiceOptions = response.data
  })

  proxy.$listDictsByCode('request_method').then((response: any) => {
    state.requestMethodOptions = response.data
  })
}

function handleAdd() {
  loadDictOptions()
  state.dialog = {
    title: '添加權限',
    visible: true
  }
}

function handleUpdate(row: any) {
  loadDictOptions()
  state.dialog = {
    title: '修改權限',
    visible: true
  }
  const id = row.id || state.ids
  getPermDetail(id).then(response => {
    const {data} = response
    state.formData = data
    if (data && data.urlPerm) {
      // GET:/youlai-admin/api/v1/users
      const urlPermArr = data.urlPerm.split(':')
      state.urlPerm.requestMethod = urlPermArr[0]
      state.urlPerm.serviceName = urlPermArr[1].substring(1, urlPermArr[1].substring(1).indexOf('/') + 1)
      state.urlPerm.requestPath = urlPermArr[1].substring(urlPermArr[1].substring(1).indexOf('/') + 1)
    }
  })
}

function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {
    if (valid) {
      // 接口權限和按鈕權限必填其一
      console.log(state.urlPerm.requestPath, state.formData.btnPerm)
      if (!(state.urlPerm.requestPath || state.formData.btnPerm)) {
        ElMessage.warning('請至少填寫一种權限')
        return false
      }
      // 如果填寫了URL權限，完整性校驗
      if (!state.urlPerm.requestPath) {
        if (!state.urlPerm.requestMethod) {
          ElMessage.warning('URL權限的請求方式不能為空')
          return false
        }
        if (!state.urlPerm.serviceName) {
          ElMessage.warning('URL權限的所属服务不能為空')
          return false
        }
        state.formData.urlPerm = state.urlPerm.requestMethod + ':/' + state.urlPerm.serviceName + state.urlPerm.requestPath;
      }

      state.formData.menuId = props.menuId
      if (state.formData.id) {
        updatePerm(state.formData.id, state.formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          resetForm()
          handleQuery()
        })
      } else {
        addPerm(state.formData).then(response => {
          ElMessage.success('新增成功')
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
  const dataForm = unref(dataFormRef)
  dataForm.resetFields()

}

function cancel() {
  state.dialog.visible = false
}

function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',')
  ElMessageBox.confirm('確認删除已選中的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deletePerms(ids).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  }).catch(() =>
      ElMessage.info('已取消删除')
  )
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped>
.component-container {
  margin-bottom: 20px;
}
</style>

