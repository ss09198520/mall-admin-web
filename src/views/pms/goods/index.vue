<template>
  <div class="app-container">
    <el-form
        ref="queryForm"
        :inline="true"

    >
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd">發布商品</el-button>
        <el-button type="danger" :icon="Delete" @click="handleDelete" :disabled="multiple">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryParams.name" placeholder="商品名稱" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-cascader
            v-model="queryParams.categoryId"
            placeholder="商品分類"
            :props="{emitPath: false, expandTrigger: 'hover'}"
            :options="categoryOptions"
            clearable
            style="width: 300px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
        v-loading="loading"
        ref="dataTableRef"
        :data="pageList"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        border
    >
      <el-table-column type="selection" min-width="5%" center/>
      <el-table-column type="expand" width="120" label="庫存信息">

        <template #default="props">
          <el-table
              :data="props.row.skuList"
              border>
            <el-table-column align="center" label="商品编碼" prop="sn"/>
            <el-table-column align="center" label="商品規格" prop="name"/>
            <el-table-column label="圖片" prop="picUrl">
              <template #default="scope">
                <img :src="scope.row.picUrl" width="40">
              </template>
            </el-table-column>
            <el-table-column align="center" label="現價" prop="price">
              <template #default="scope">{{ moneyFormatter(scope.row.price) }}</template>
            </el-table-column>
            <el-table-column align="center" label="庫存" prop="stock"/>
          </el-table>
        </template>

      </el-table-column>
      <el-table-column label="商品名稱" prop="name" min-width="140"/>
      <el-table-column label="商品圖片">
        <template #default="row">
          <img :src="row.picUrl" width="40">
        </template>
      </el-table-column>
      <el-table-column label="商品類目" prop="categoryName" min-width="100"/>
      <el-table-column label="商品品牌" prop="brandName" min-width="100"/>
      <el-table-column align="center" label="零售價" prop="originalPrice">
        <template #default="scope">{{ moneyFormatter(scope.row.price) }}</template>
      </el-table-column>
      <el-table-column align="center" label="促銷價" prop="price">
        <template #default="scope">{{ moneyFormatter(scope.row.price) }}</template>
      </el-table-column>
      <el-table-column label="銷量" prop="sales" min-width="100"/>
      <el-table-column label="單位" prop="unit" min-width="100"/>
      <el-table-column label="描述" prop="description" min-width="100"/>
      <el-table-column label="詳情" prop="detail">
        <template #default="scope">
          <el-button type="primary"  @click="handleGoodsView(scope.row.detail)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
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
    <el-dialog v-model="dialogVisible" title="商品詳情">
      <div class="goods-detail-box" v-html="goodDetail"/>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import {listGoodsWithPage, deleteGoods} from '@/api/pms/goods'
import {listCascadeCategories} from '@/api/pms/category'
import {reactive, ref, onMounted, toRefs} from 'vue'
import {ElTable, ElMessage, ElMessageBox} from 'element-plus'
import {getCurrentInstance} from 'vue'
import {moneyFormatter} from '@/utils/filter'
import {useRouter} from "vue-router"

const dataTableRef = ref(ElTable)
const router=useRouter()

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
    name: undefined,
    categoryId: undefined
  },
  pageList: [],
  categoryOptions: [],
  goodDetail: undefined,
  dialogVisible: false
})


const {
  loading,
  ids,
  single,
  multiple,
  queryParams,
  pageList,
  categoryOptions,
  goodDetail,
  total,
  dialogVisible
} = toRefs(state);


function handleQuery() {
  state.loading = true
  listGoodsWithPage(state.queryParams).then(response => {
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
    name: undefined,
    categoryId: undefined
  }
  handleQuery()
}

function handleGoodsView(detail: any) {
  state.goodDetail = detail
  state.dialogVisible = true
}

function handleAdd() {
  router.push({path: 'goods-detail'})
}

function handleUpdate(row: any) {
  router.push({path: 'goods-detail', query: {goodsId: row.id, categoryId: row.categoryId}})
}

function handleDelete(row: any) {
  const ids = row.id || state.ids.join(',')
  ElMessageBox.confirm('是否確認删除選中的數據項?', "警告", {
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return deleteGoods(ids)
  }).then(() => {
    ElMessage.success("删除成功")
    handleQuery()
  })
}

function handleRowClick(row: any) {
  dataTableRef.value.toggleRowSelection(row);
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: { id: any }) => item.id)
  state.single = selection.length != 1
  state.multiple = !selection.length
}

onMounted(() => {
  listCascadeCategories({}).then(response => {
    state.categoryOptions = ref(response.data)
  })
  handleQuery()
})
</script>

<style scoped>

</style>
