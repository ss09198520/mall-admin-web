<template>
  <el-config-provider :locale="locale">
    <router-view/>
  </el-config-provider>
</template>

<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";
import {useAppStoreHook} from "@/store/modules/app";
import {ElConfigProvider} from 'element-plus'
import {localStorage} from "@/utils/storage";

//官方文件: https://element-plus.gitee.io/zh-CN/guide/i18n.html

// 導入 Element Plus 語言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const language = computed(() => useAppStoreHook().language)

const locale = ref()
watch(language, (value) => {
  if (value == 'en') {
    locale.value = en
  } else {
    locale.value = zhCn
  }
}, {
  // 初始化立即执行，
  immediate: true
})
onMounted(()=>{
  const style = localStorage.get("style");
  document.documentElement.style.cssText = style as string;
})
</script>

