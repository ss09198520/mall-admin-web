<template>
  <div class="component-container">
    <!-- 上傳组件 -->
    <el-upload
        ref="uploadRef"
        action=""
        class="single-uploader"
        list-type="picture-card"
        :show-file-list="false"
        :before-upload="handleBeforeUpload"
        :on-exceed="handleExceed"
        :limit="1"
        :http-request="uploadImage"
    >
      <img v-if="imgUrl" :src="imgUrl" class="single-uploader-image"/>

      <el-icon v-else class="single-uploader-icon">
        <Plus/>
      </el-icon>

      <!-- 删除圖標 -->
      <el-icon
          v-if="imgUrl"
          class="single-uploader-remove-icon"
          @click.stop="handleRemove(imgUrl)"
      >
        <Close/>
      </el-icon>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {Plus, Close} from '@element-plus/icons-vue'
import {ElMessage, ElUpload} from "element-plus"
import {uploadFile, deleteFile} from "@/api/system/file";
import {UploadFile} from "element-plus/es/components/upload/src/upload";

const uploadRef = ref(ElUpload)
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const imgUrl = computed<string | null>({
  get() {
    return props.modelValue
  },
  set(val) {
    // imgUrl改變時觸發修改父组件绑定的v-model的值
    emit('update:modelValue', val)
  }
})


/**
 * 自定義圖片上傳
 *
 * @param params
 */
function uploadImage({file}: any) {
  uploadFile(file).then(response => {
    imgUrl.value = response.data
  })
}

/**
 * 后選擇文件覆盖前面的文件
 *
 * Set limit and on-exceed to automatically replace the previous file when select a new file.
 *
 * @param files
 */
function handleExceed(files: UploadFile[]) {
  uploadRef.value.clearFiles()
  uploadRef.value.handleStart(files[0])
  uploadFile(files[0]).then(response => {
    imgUrl.value = response.data
  })
}

/**
 * 删除圖片
 *
 * @param file
 */
function handleRemove(file: string | null) {
  if (file) {
    deleteFile(file)
    imgUrl.value = null // 这里会觸發imgUrl的computed的set方法
  }
}

function handleBeforeUpload(file: any) {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2
  /* if (!isJPG) {
     ElMessage.warning("此文件非圖片文件")
     return false
   }*/

  if (!isLt2M) {
    ElMessage.warning("上傳圖片不能大于2M")
  }
  return true
}
</script>

<style lang="scss" scoped>

.component-container {
  .single-uploader {
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409EFF;
    }

    &-icon {
      font-size: 28px;
      color: #8c939d;
      text-align: center;
    }

    &-image {
      width: 146px;
      height: 146px;
      display: block;
    }

    &-remove-icon {
      font-size: 12px;
      color: #ff4d51 !important;
      margin-top: 0px !important;
      position: absolute;
      right: 0;
      top: 0;
      color: #409eff;
    }
  }
}
</style>
