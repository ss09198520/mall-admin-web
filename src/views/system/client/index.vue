<template>
  <div class="app-container">
    <!-- 搜索表單 -->
    <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :icon='Delete' :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>

      <el-form-item prop="clientId">
        <el-input
            v-model="queryParams.clientId"
            placeholder="輸入客户端ID"
            clearable
            style="width: 240px"
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
        :data="pageList"
        border
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序號" type="index" width="55" align="center"/>
      <el-table-column label="客户端ID" prop="clientId" width="200"/>
      <el-table-column label="客户端密钥" prop="clientSecret" width="100"/>
      <el-table-column label="域" width="100" prop="scope"/>
      <el-table-column label="自動放行" prop="autoapprove" width="100"/>
      <el-table-column label="授權方式" prop="authorizedGrantTypes"/>
      <el-table-column label="認證令牌時效(單位：秒)" width="200" prop="accessTokenValidity"/>
      <el-table-column label="刷新令牌時效(單位：秒)" width="200" prop="refreshTokenValidity"/>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
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

    <!-- 分頁工具條 -->
    <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
    />

    <!-- 表單弹窗 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        width="700px"
    >
      <el-form ref="dataForm"
               :model="formData"
               :rules="rules"
               label-width="100px"
      >
        <el-form-item label="客户端ID" prop="clientId">
          <el-input v-model="formData.clientId" placeholder="請輸入客户端ID"/>
        </el-form-item>

        <el-form-item label="客户端密钥" prop="clientSecret">
          <el-input v-model="formData.clientSecret" placeholder="請輸入客户端密钥"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">
            確定
          </el-button>
          <el-button @click="cancel">
            取消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {listClientsWithPage, detail, update, add, del} from '@/api/system/client'
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import {onMounted, reactive, getCurrentInstance, ref, unref, toRefs} from 'vue'
import {ElForm, ElMessage, ElMessageBox} from "element-plus"

const dataForm = ref(ElForm)
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
    clientId: undefined
  },
  pageList: [],
  total: 0,
  dialog: {
    title: '',
    visible: false,
    type: 'create'
  },
  formData: {
    authorizedGrantTypes: [],
    clientSecret: undefined,
    clientId: undefined,
    accessTokenValidity: undefined,
    refreshTokenValidity: undefined,
    webServerRedirectUri: undefined,
    authorities: undefined,
    additionalInformation: undefined,
    autoapprove: 'false'
  },
  rules: {
    clientId: [
      {required: true, message: '客户端ID不能為空', trigger: 'blur'}
    ]
  }
})

const {loading, ids, single, multiple, queryParams, pageList, total, dialog, formData, rules} = toRefs(state)

function handleQuery() {
  listClientsWithPage(state.queryParams).then(response => {
    const {data, total} = response as any
    state.pageList = data
    state.total = total
    state.loading = false
  })
}

function resetQuery() {
  state.queryParams = {
    pageNum: 1,
    pageSize: 10,
    clientId: undefined
  }
  handleQuery()
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.clientId)
  state.single = selection.length !== 1
  state.multiple = !selection.length
}

function handleAdd() {
  resetForm()
  state.dialog = {
    title: '添加客户端',
    visible: true,
    type: 'create'
  }
}

function handleUpdate(row: any) {
  resetForm()
  state.dialog = {
    title: '修改客户端',
    visible: true,
    type: 'edit'
  }
  const clientId = row.clientId || ids
  detail(clientId).then(response => {
    state.formData = response.data
  })
}


function submitForm() {
  const form = unref(dataForm)
  form.validate((valid: any) => {
    if (valid) {
      if (state.dialog.type == 'edit') {
        update(state.formData.clientId as any, formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          handleQuery()
        })
      } else {
        add(formData).then(response => {
          ElMessage.success('新增成功')
          state.dialog.visible = false
          handleQuery()
        })
      }
    }
  })
}

function resetForm() {
  state.formData = {
    authorizedGrantTypes: [],
    clientSecret: undefined,
    clientId: undefined,
    accessTokenValidity: undefined,
    refreshTokenValidity: undefined,
    webServerRedirectUri: undefined,
    authorities: undefined,
    additionalInformation: undefined,
    autoapprove: 'false'
  }
}

function cancel() {
  resetForm()
  state.dialog.visible = false
}

function handleDelete(row: any) {
  const clientIds = [row.clientId || ids].join(',')
  ElMessageBox.confirm('確認删除已選中的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    del(clientIds).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  }).catch(() =>
      ElMessage.info('已取消删除')
  )
}

onMounted(() => {
  handleQuery()
  // 全局字典调用
  const {proxy}: any = getCurrentInstance();
  proxy.$listDictsByCode('gender').then((response: any) => {
    console.log('性别字典數據', response.data)
  })
})

</script>
