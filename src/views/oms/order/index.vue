<template>
  <div class="app-container">
    <!-- 搜索表單 -->
    <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
    >
      <el-form-item prop="orderSn">
        <el-input v-model="queryParams.orderSn" placeholder="訂單號"/>
      </el-form-item>

      <el-form-item>
        <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="開始日期"
            end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item>
        <el-select
            v-model="queryParams.status"
            class="filter-item"
            placeholder="訂單狀態"
        >
          <el-option
              v-for="(key, value) in orderStatusMap"
              :label="key"
              :value="value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
        ref="dataTable"
        v-loading="loading"
        :data="pageList"
        border
    >
      <el-table-column type="expand" width="100" label="訂單商品">
        <template #default="scope">
          <el-table
              :data="scope.row.orderItems"
              border
          >
            <el-table-column label="序號" type="index" width="100"/>
            <el-table-column label="商品编號" align="center" prop="skuSn"/>
            <el-table-column label="商品規格" align="center" prop="skuName"/>
            <el-table-column label="圖片" prop="picUrl">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
            <el-table-column align="center" label="單價" prop="price">
              <template slot-scope="scope">{{ scope.row.price}}</template>
            </el-table-column>
            <el-table-column align="center" label="數量" prop="count">
              <template slot-scope="scope">{{ scope.row.count }}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderSn" label="訂單编號"/>

      <el-table-column align="center" prop="memberId" label="會員ID"/>

      <el-table-column align="center" label="訂單来源">
        <template #default="scope">
          <el-tag>{{ scope.row.sourceType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="訂單狀態">
        <template #default="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="orderPrice" label="訂單金額">
        <template #default="scope">
          {{ scope.row.totalAmount }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="payPrice" label="支付金額">
        <template #default="scope">
          {{ scope.row.payAmount  }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="支付方式">
        <template #default="scope">
          <el-tag>{{ scope.row.payType  }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="gmtCreate" label="创建時間"/>

      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button @click="viewDetail(scope.row)">查看</el-button>
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

import {listOrdersWithPage, getOrderDetail} from '@/api/oms/order'
import {onMounted, reactive, ref, toRefs} from "vue"
import {ElForm, ElMessage, ElMessageBox} from "element-plus"
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'

const dataForm = ref(ElForm)  // 属性名必須和元素的ref属性值一致

const orderSourceMap = {
  1: '微信小程序',
  2: 'APP',
  3: 'PC'
}

const orderStatusMap = {
  101: '待付款',
  102: '用戶取消',
  103: '系统取消',
  201: '已付款',
  202: '申請退款',
  203: '已退款',
  301: '待發货',
  401: '已發货',
  501: '用戶收货',
  502: '系统收货',
  901: '已完成'
}

const payTypeMap = {
  1: '支付宝',
  2: '微信',
  3: '會員余額'
}


const state = reactive({
  loading: false,
  ids: [],
  single: true,
  multiple: true,
  dateRange: [],
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    orderSn: undefined,
    status:undefined
  },
  pageList: [],
  total: 0,
  dialog: {
    title: '訂單詳情',
    visible: false
  },
  dialogVisible: false,
  orderDetail: {
    order: {
      refundAmount: undefined,
      refundType: undefined,
      refundNote: undefined,
      gmtRefund: undefined,
      confirmTime: undefined,
      gmtDelivery: undefined,
      shipSn: undefined,
      shipChannel: undefined,
      gmtPay: undefined,
      integralPrice: undefined,
      payChannel: undefined,
      skuPrice : undefined,
      couponPrice: undefined,
      freightPrice: undefined,
      orderPrice : undefined
    },
    member: {},
    orderItems: []
  },
  orderSourceMap,
  orderStatusMap,
  payTypeMap
})

const {loading, single, multiple, queryParams, pageList, total, dialog,dateRange, orderDetail} = toRefs(state)

function handleQuery() {
  state.loading = true
  listOrdersWithPage(state.queryParams).then(response => {
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
    orderSn: undefined,
    status: undefined
  }
  handleQuery()
}

function viewDetail(row: any) {
  state.dialog.visible = true
  getOrderDetail(row.id).then(response => {
    state.orderDetail = response.data
  })
}

function cancel() {
  state.dialog.visible = false
}

onMounted(() => {
  handleQuery()
})
</script>

<style scoped>

</style>
