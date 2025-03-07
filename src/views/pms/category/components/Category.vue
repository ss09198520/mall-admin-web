<!-- 商品分類層級最多為三層，level字段標示 -->
<template>
  <div class="component-container">

    <el-tree
        v-loading="loading"
        ref="categoryTreeRef"
        :data="categoryOptions"
        :props="{ label: 'name', children: 'children',disabled:'' }"
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :accordion="true"
        @node-click="handleNodeClick"
    >
      <template #default="scope">
        <div class="custom-tree-node">
          <span>
            <el-image
                v-show="scope.data.level == 3 "
                :src="scope.data.iconUrl"
                style="width: 20px; height:20px; vertical-align: middle;margin-top: -5px"
            >
              <template #error>
                <div class="image-slot">
                  <Picture style="width: 20px; height:20px;"/>
                </div>
              </template>
            </el-image>

            {{ scope.data.name }}
          </span>
          <span>
                <el-button
                    v-show="scope.data.level != 3 "
                    type="primary"
                    icon="Plus"
                    circle
                    plain
                    @click.stop="handleAdd(scope.data)"/>
                <el-button
                    v-show="scope.data.id !== 0"
                    type="warning"
                    :icon="Edit"
                    circle
                    plain
                    @click.stop="handleUpdate(scope.data)"/>
                <el-button
                    v-show="scope.data.id && (!scope.data.children || scope.data.children.length <= 0)"
                    type="danger"
                    :icon="Delete"
                    circle
                    plain
                    @click.stop="handleDelete(scope.data)"/>
              </span>
        </div>
      </template>
    </el-tree>

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
        <el-form-item label="上級分類" prop="parentId">
          <el-input v-model="parent.name" readonly/>
        </el-form-item>

        <el-form-item label="分類名稱" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>

        <el-form-item label="分類圖標" prop="iconUrl">
          <single-upload v-model="formData.iconUrl"/>
        </el-form-item>

        <el-form-item label="顯示狀態" prop="visible">
          <el-radio-group v-model="formData.visible">
            <el-radio :label="1">顯示</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort"></el-input>
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
import {listCategories, addCategory, updateCategory, deleteCategories} from '@/api/pms/category'
import {Search, Plus, Edit, Refresh, Delete} from '@element-plus/icons-vue'
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import {getCurrentInstance, onMounted, reactive, ref, toRefs, unref} from "vue";
import {ElForm, ElMessage, ElMessageBox, ElTree} from "element-plus";

const emit = defineEmits(['categoryClick'])

const categoryTreeRef = ref(ElTree)
const dataFormRef = ref(ElForm)

const state = reactive({
  // 遮罩層
  loading: true,
  ids: [],
  queryParam: {},
  categoryOptions: [] as Array<any>,
  formData: {
    id: undefined,
    name: undefined,
    parentId: 0,
    level: undefined,
    iconUrl: undefined,
    visible: 1,
    sort: 100
  },
  rules: {
    parentId: [{
      required: true, message: '請選擇上級分類', trigger: 'blur'
    }],
    name: [{
      required: true, message: '請輸入分類名稱', trigger: 'blur'
    }]
  },
  dialog: {
    title: '',
    visible: false
  },
  parent: {} as any,
  current: {} as any
})

const {loading, categoryOptions, formData, rules, dialog, parent} = toRefs(state)

function handleQuery() {
  state.loading = true
  listCategories(state.queryParam).then(response => {
    state.categoryOptions = [{
      id: 0,
      name: '全部分類',
      parentId: 0,
      level: 0,
      children: response.data
    }]
    state.loading = false
  })

}

function handleNodeClick(row: any) {
  const categoryTree = unref(categoryTreeRef)
  const parentNode = categoryTree.getNode(row.parentId)

  state.parent = {
    id: parentNode.key,
    name: parentNode.label,
    level: row.level
  }
  state.current = JSON.parse(JSON.stringify(row))
  emit('categoryClick', row)
}


function handleAdd(row: any) {
  resetForm()
  state.dialog = {
    title: '新增商品分類',
    visible: true
  }
  if (row.id != null) { // 行點擊新增
    state.parent = {
      id: row.id,
      name: row.name,
      level: row.level
    }
  }
}

function handleUpdate(row: any) {
  resetForm()
  handleNodeClick(row)
  state.dialog = {
    title: '修改商品分類',
    visible: true
  }
  Object.assign(state.formData, state.current)
}

function submitForm() {
  const form = unref(dataFormRef)
  form.validate((valid: any) => {
    if (valid) {
      if (state.formData.id) {
        updateCategory(state.formData.id, state.formData).then(response => {
          ElMessage.success('修改成功')
          state.dialog.visible = false
          handleQuery()
        })
      } else {
        const parentCategory= state.parent as any
        console.log('parent',parentCategory)
        state.formData.parentId = parentCategory.id
        state.formData.level = parentCategory.level+1

        addCategory(state.formData).then(() => {
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
    deleteCategories(ids).then(() => {
      ElMessage.success('删除成功')
      handleQuery()
    })
  })
}

function resetForm() {
  state.formData = {
    id: undefined,
    name: undefined,
    parentId: 0,
    level: undefined,
    iconUrl: undefined,
    visible: 1,
    sort: 100
  }
}

function cancel() {
  resetForm()
  state.dialog.visible = false
}

onMounted(() => {
  handleQuery()
})
</script>

<style>
.component-container {
  height: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.el-tree-node__content {
  height: 40px;
}

.el-divider--horizontal {
  margin: 30px 0 15px;
}
</style>
