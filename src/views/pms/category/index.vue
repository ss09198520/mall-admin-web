<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="14" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="menu"/>
            商品分類
          </template>
          <category ref="categoryRef" @categoryClick="handleCategoryClick"/>
        </el-card>
      </el-col>

      <el-col :span="10" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="menu"/>
            {{category.name}} 規格属性
          </template>
          <!-- 商品規格 -->
          <attribute ref="specificationRef" :attributeType="1" :category="category"/>
          <!-- 商品属性 -->
          <attribute ref="attributeRef" :attributeType="2" :category="category"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">

import Category from './components/Category.vue'
import Attribute from './components/Attribute.vue'
import SvgIcon from '@/components/SvgIcon/index.vue';

import {reactive, toRefs} from "vue";

const state = reactive({
  category:{
    id: undefined,
    name: '',
    childrenLen: 0
  }
})

const {category}=toRefs(state)

function handleCategoryClick(categoryRow: any) {
  if (categoryRow) {
    state.category={
      id: categoryRow.id,
      name:  categoryRow.name,
      childrenLen: categoryRow.children.length
    }
  } else {
    state.category={
      id: undefined,
      name: '',
      childrenLen: 0
    }
  }
}
</script>

<style scoped>

</style>
