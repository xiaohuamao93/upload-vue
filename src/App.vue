<template>
  <div id="app">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文件上传" name="first"><Upload1 /> </el-tab-pane>
      <el-tab-pane label="文件上传-2" name="second"><Upload2 /> </el-tab-pane>
      <el-tab-pane label="文件上传-切片" name="third"><Upload3 /></el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Upload1 from "./components/upload_1.vue";
import Upload2 from "./components/upload_2.vue";
import Upload3 from "./components/upload_3.vue";
export default {
  name: "App",
  data() {
    return {
      activeName: "third",
    };
  },
  components: {
    // HelloWorld,
    Upload1,
    Upload2,
    Upload3,
  },
  methods: {
    handleClick() {},
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
