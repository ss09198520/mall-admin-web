<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="菜單一級">
      <router-view />
    </el-alert>
  </div>
</template>
