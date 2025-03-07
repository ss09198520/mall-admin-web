<template>
  <div class="app-container">
    <!-- 搜索表單 -->
    <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
        <el-button type="danger" :icon='Delete' click="handleDelete" :disabled="multiple">删除</el-button>
      </el-form-item>

      <el-form-item prop="name">
        <el-input v-model="queryParams.name" placeholder="品牌名稱"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 數據表格 -->
    <el-table
        ref="dataTable"
        v-loading="loading"
        :data="pageList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        border
    >
      <el-table-column
          type="selection"
          min-width="5%"
      />
      <el-table-column
          prop="name"
          label="品牌名稱"
          min-width="10"
      />
      <el-table-column
          prop="logoUrl"
          label="LOGO"
          min-width="10"
      >
        <template #default="scope">
          <el-popover
              placement="right"
              :width="400"
              trigger="hover">
            <img :src="scope.row.logoUrl" width="400" height="400"/>
            <template #reference>
              <img :src="scope.row.logoUrl" style="max-height: 60px;max-width: 60px"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column
          prop="sort"
          label="排序"
          min-width="10"
      />

      <el-table-column
          label="操作"
          width="150">
        <template #default="scope">
          <el-button
              @click="handleUpdate(scope.row)"
              type="primary"
              :icon="Edit"
              circle
              plain
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
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="handleQuery"
    />

    <!-- 表單弹窗 -->
    <el-dialog
        :title="dialog.title"
        v-model="dialog.visible"
        top="5vh"
        width="600px"
    >
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="品牌名稱" prop="name">
          <el-input v-model="formData.name" auto-complete="off"/>
        </el-form-item>

        <el-form-item label="LOGO" prop="logoUrl">
          <single-upload v-model="formData.logoUrl"/>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort"/>
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
import {listBrandsWithPage, getBrandDetail, updateBrand, addBrand, deleteBrands} from '@/api/pms/brand'
import SingleUpload from "@/components/Upload/SingleUpload.vue"
import {onMounted, reactive, ref, toRefs, unref} from "vue";
import {ElForm, ElTable, ElMessage, ElMessageBox} from "element-plus";
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'

const dataTableRef = ref(ElTable)
const queryFormRef = ref(ElForm)  // 属性名必須和元素的ref属性值一致
const dataFormRef = ref(ElForm)  // 属性名必須和元素的ref属性值一致

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
  pageList: [],
  total: 0,
  dialog: {
    title: '',
    visible: false
  },
  formData: {
    id: undefined,
    name: undefined,
    logoUrl: undefined,
    sort: 1
  },
  rules: {
    name: [{
      required: true, message: '請輸入品牌名稱', trigger: 'blur'
    }]
  }
})

const {loading, single, multiple, queryParams, pageList, total, dialog, formData, rules} = toRefs(state)

function handleQuery() {
  state.loading = true
  listBrandsWithPage(state.queryParams).then(response => {
    const {data, total} = response as any
    state.pageList = data
    state.total = total
    state.loading = false
  })
}

function resetQuery() {
  const dataTable = unref(dataTableRef)
  dataTable.resetFields()
  handleQuery()
}

function handleRowClick(row: any) {
  const dataTable = unref(dataTableRef)
  dataTable.toggleRowSelection(row);
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id)
  state.single = selection.length !== 1
  state.multiple = !selection.length
}

function handleAdd() {
  state.dialog = {
    title: '添加品牌',
    visible: true
  }
}

function handleUpdate(row: any) {
  state.dialog = {
    title: '修改品牌',
    visible: true,
  }
  const advertId = row.id || state.ids
  getBrandDetail(advertId).then((response) => {
    state.formData = response.data
  })
}

function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {
    if (valid) {
      if (state.formData.id) {
        updateBrand(state.formData.id as any, state.formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          resetForm()
          handleQuery()
        })
      } else {
        addBrand(state.formData).then(response => {
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
  resetForm()
}

function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',')
  ElMessageBox.confirm('確認删除已選中的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteBrands(ids).then(() => {
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
</style>
