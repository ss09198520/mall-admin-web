<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="菜單二級" type="success">
      <router-view />
    </el-alert>
  </div>
</template>
