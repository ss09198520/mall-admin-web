<template>
  <div class="component-container">
    <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item>
        <el-input
            v-model="queryParams.nickName"
            placeholder="會員暱稱"
            clearable
            @keyup.enter.native="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading"
              :data="pageList"
              border
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"/>
      <el-table-column type="expand" width="80" label="會員地址">
        <template #default="scope">
          <el-table
              :data="scope.row.addressList"
              size="small"
              border>
            <el-table-column type="index" label="序號" width="80" align="center"/>
            <el-table-column align="center" label="收货人" prop="name"/>
            <el-table-column align="center" label="聯系方式" prop="mobile"/>
            <el-table-column align="center" label="收货地址">
              <template #default="scope">
                {{ scope.row.province + scope.row.city + scope.row.area + scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="邮编" prop="zipCode"/>
            <el-table-column align="center" label="是否默認">
              <template #default="scope">
                <el-tag v-if="scope.row.defaulted==1" type="success">是</el-tag>
                <el-tag v-if="scope.row.defaulted==0" type="info">否</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序號" width="50" align="center"/>
      <el-table-column prop="nickName" label="暱稱"/>
      <el-table-column label="性别" width="80">
        <template #default="scope">
          <span v-if="scope.row.gender===0">未知</span>
          <span v-if="scope.row.gender===1">男</span>
          <span v-if="scope.row.gender===2">女</span>
        </template>
      </el-table-column>
      <el-table-column label="頭像" width="100">
        <template #default="scope">
          <el-popover
              placement="right"
              :width="400"
              trigger="hover">
            <img :src="scope.row.avatarUrl" width="400" height="400"/>
            <template #reference>
              <img :src="scope.row.avatarUrl" style="max-height: 60px;max-width: 60px"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手機號碼"/>
      <el-table-column prop="birthday" label="出生日期"/>
      <el-table-column prop="status" width="80" label="狀態">
        <template #default="scope">
          <el-tag v-if="scope.row.status===1" type="success" >正常</el-tag>
          <el-tag v-else type="info" >禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="gmtCreate" label="注册時間"/>

      <el-table-column label="账户余額">
        <template #default="scope">
          {{ scope.row.balance / 100 }}
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
  </div>
</template>

<script setup lang="ts">
import {reactive, onMounted, toRefs} from 'vue'
import {ElTable, ElMessage, ElMessageBox} from 'element-plus'
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'

import {listMembersWithPage} from '@/api/ums/member'

const state = reactive({
  // 遮罩層
  loading: true,
  // 選中數组
  ids: [],
  // 非單個禁用
  single: true,
  // 非多個禁用
  multiple: true,
  total: 0,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    nickName: undefined
  },
  pageList: []
})

const { loading,ids,single, multiple,  queryParams, pageList,total} = toRefs(state);

function handleQuery() {
  state.loading = true
  listMembersWithPage(state.queryParams).then(response => {
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
    nickName: undefined,
  }
  handleQuery()
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: { id: any }) => item.id)
  state.single = selection.length != 1
  state.multiple = !selection.length
}


onMounted(() => {
  handleQuery()
})

</script>

<style scoped>
</style>
