<template>
  <div>
    <input
      class="not-show"
      ref="upload"
      type="file"
      @change="attachFile"
      name="file"
    />
    <ul class="img-list">
      <li class="img-item el-upload--picture-card" @click="selectedMats">
        <i class="el-icon-upload2"></i>
        <span>上传文件</span>
      </li>
      <li class="img-item" v-for="(file, index) in uploadMats" :key="index">
        <img class="img" :src="file.url" />
        <div class="progress-wrap">
          <el-progress
            :text-inside="true"
            :stroke-width="24"
            :percentage="file.progress"
            v-if="!file.isUpload"
          ></el-progress>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Upload_1",
  props: {},
  data() {
    return {
      uploadMats: [],
      progress: 10,
    };
  },
  created() {},
  methods: {
    attachFile(evt) {
      let file = evt.target.files?.[0];
      let matsArr = [];
      let fileType = file.type.split("/")[0];
      let fileWrap = {
        type: fileType,
        url: this.getUrl(file),
        file,
        name: file.name,
        isUpload: false,
      };
      matsArr.push(fileWrap);
      this.uploadMats = this.uploadMats.concat(matsArr);
      this.uploadFile(fileWrap);
    },

    selectedMats() {
      this.$refs.upload.click();
    },

    getUrl(file) {
      return URL.createObjectURL(file);
    },
    uploadFile(fileWrap) {
      const self = this;
      const index = this.uploadMats.length - 1;
      const currentMat = this.uploadMats[index];

      let { file } = fileWrap;
      let param = new FormData();
      param.append("file", file, file.name);
      let progress = 0;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress(progressEvent) {
          if (progressEvent.lengthComputable) {
            progress = (
              (progressEvent.loaded / progressEvent.total) *
              100
            ).toFixed(0);
            currentMat.progress = parseInt(progress);
            self.$set(self.uploadMats, index, currentMat);
          }
        },
      };
      const url = this.$host + "/upload/file";
      this.axios
        .post(url, param, config)
        .then(() => {
          self.uploadMats[index].isUpload = true;
          this.$message.success("文件上传成功");
        })
        .catch(() => {
          this.$message.error("文件上传失败");
        });
    },
  },
};
</script>

<style>
ul {
  list-style: none;
}
.not-show {
  display: none;
}
.img-list {
  display: flex;
  flex-wrap: wrap;
}
.img-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 50px;
  width: 200px;
  height: 200px;
  border-radius: 6px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  margin: 10px;
  overflow: hidden;
}
.img {
  width: 100%;
  height: 100%;
}
.progress-wrap {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.el-progress {
  margin-top: 100px;
}
.el-progress-bar__outer {
  background: transparent;
}
</style>
