<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="12" :xs="24">
        <el-card class="box-card">
          <template #header>
            <svg-icon color="#333" icon-class="education"/>
            字典列表
          </template>
          <!-- 字典列表子组件 -->
          <dict @dictClick="handleDictClick"/>
        </el-card>
      </el-col>

      <el-col :span="12" :xs="24">
        <el-card class="box-card">
          <template #header>
            <svg-icon color="#333" icon-class="dict"/>
            <span style="margin:0 5px;">字典數據項</span>
            <el-tag type="success" v-if=" state.dictCode" size="small">{{ state.dictName }}</el-tag>
            <el-tag type="warning" v-else size="small">未選擇字典</el-tag>
          </template>
          <!-- 字典項组件 -->
          <dict-item :dictName="state.dictName" :dictCode='state.dictCode'/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import Dict from './components/Dict.vue'
import DictItem from './components/DictItem.vue'

import {reactive,toRefs} from 'vue'

const state = reactive({
  dictCode: '',
  dictName: ''  // 字典名稱，用于字典項组件回顯
})

const {dictCode,dictName} =toRefs(state)

const handleDictClick = (dictRow: any) => {
  if (dictRow) {
    state.dictName = dictRow.name
    state.dictCode = dictRow.code
  } else {
    state.dictName = ''
    state.dictCode = ''
  }
}
</script>
