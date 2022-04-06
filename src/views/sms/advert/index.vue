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
        <el-button type="danger" :icon="Delete" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-form-item>

      <el-form-item>
        <el-input
            v-model="queryParams.title"
            placeholder="廣告標題"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
        ref="dataTable"
        v-loading="loading"
        :data="pageList"
        @selection-change="handleSelectionChange"
        border
    >
      <el-table-column type="selection" min-width="5" align="center"/>
      <el-table-column type="index" label="序號" width="80" align="center"/>
      <el-table-column prop="title" min-width="100" label="廣告標題" />
      <el-table-column label="廣告圖片" width="100">
        <template #default="scope">
          <el-popover
              placement="right"
              :width="400"
              trigger="hover">
            <img :src="scope.row.picUrl" width="400" height="400"/>
            <template #reference>
              <img :src="scope.row.picUrl" style="max-height: 60px;max-width: 60px"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime" label="開始時間" width="150"/>
      <el-table-column prop="endTime" label="结束時間" width="150"/>
      <el-table-column prop="status" label="狀態" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status===1" type="success" >開啟</el-tag>
          <el-tag v-else type="info">關閉</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="80"/>
      <el-table-column label="操作" align="center" width="150">
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
      <el-form
          ref="dataFormRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="廣告標題" prop="title">
          <el-input v-model="formData.title"/>
        </el-form-item>

        <el-form-item label="有效期" prop="beginTime">
          <el-date-picker
              v-model="formData.beginTime"
              placeholder="開始時間"
              value-format="YYYY-MM-DD"
          />
          ~
          <el-date-picker
              v-model="formData.endTime"
              placeholder="结束時間"
              value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="廣告圖片" prop="picUrl">
          <single-upload v-model="formData.picUrl"/>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort" style="width: 200px"/>
        </el-form-item>

        <el-form-item label="狀態" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">開啟</el-radio>
            <el-radio :label="0">關閉</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="跳轉链接" prop="url">
          <el-input v-model="formData.url"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="formData.remark"/>
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
import {listAdvertsWithPage, getAdvertDetail, updateAdvert, addAdvert, deleteAdverts} from '@/api/sms/advert'
import SingleUpload from "@/components/Upload/SingleUpload.vue";
import {onMounted, reactive, ref, toRefs, unref} from "vue";
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'

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
    title: undefined
  },
  pageList: [],
  total: 0,
  dialog: {
    title: '',
    visible: false
  },
  formData: {
    id: undefined,
    title: '',
    picUrl: '',
    beginTime: undefined,
    endTime: undefined,
    status: 1,
    sort: 100,
    url: undefined,
    remark: undefined
  },
  rules: {
    title: [
      {required: true, message: '請輸入廣告名稱', trigger: 'blur'}
    ],
    beginTime: [
      {required: true, message: '請填寫開始時間', trigger: 'blur'}
    ],
    endTime: [
      {required: true, message: '請填寫结束時間', trigger: 'blur'}
    ],
    picUrl: [
      {required: true, message: '請上傳廣告圖片', trigger: 'blur'}
    ]
  }
})

const {loading, single, multiple, queryParams, pageList, total, dialog, formData, rules} = toRefs(state)

function handleQuery() {
  state.loading = true
  listAdvertsWithPage(state.queryParams).then(response => {
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
    title: undefined
  }
  handleQuery()
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item.id)
  state.single = selection.length !== 1
  state.multiple = !selection.length
}

function handleAdd() {
  resetForm()
  state.dialog = {
    title: '添加廣告',
    visible: true
  }
}

function handleUpdate(row: any) {
  resetForm()
  state.dialog = {
    title: '修改廣告',
    visible: true,
  }
  const advertId = row.id || state.ids
  getAdvertDetail(advertId).then((response) => {
    state.formData = response.data
  })
}

function submitForm() {
  const dataForm = unref(dataFormRef)
  dataForm.validate((valid: any) => {
    if (valid) {
      const avertId = state.formData.id
      if (avertId) {
        updateAdvert(avertId, state.formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          handleQuery()
        })
      } else {
        addAdvert(state.formData).then(response => {
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
    id: undefined,
    title: '',
    picUrl: '',
    beginTime: undefined,
    endTime: undefined,
    status: 1,
    sort: 100,
    url: undefined,
    remark: undefined
  }
}

function cancel() {
  resetForm()
  state.dialog.visible = false
}

function handleDelete(row: any) {
  const ids = [row.id || state.ids].join(',')
  ElMessageBox.confirm('確認删除已選中的數據項?', '警告', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteAdverts(ids).then(() => {
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
