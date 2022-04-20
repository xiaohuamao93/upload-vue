<template>
  <div>
    文件上传1

    <input
      class="not-show"
      ref="upload"
      type="file"
      @change="attachFile"
      name="file"
      accept="image/*"
      capture="camera"
    />
    <ul class="img-list">
      <li class="img-item el-upload--picture-card" @click="selectedMats">
        <i class="el-icon-upload2"></i>
        <span>上传文件</span>
      </li>
      <li class="img-item" v-for="(file, index) in uploadMats" :key="index">
        <img class="img" :src="file.url" />
        <!-- <el-progress
          :percentage="file.progress"
          v-if="!file.isUpload"
        ></el-progress> -->
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
// import axios from "axios";
// import { Progress } from "element-ui";
export default {
  name: "Upload_2",
  components: {
    // Progress,
  },
  props: {},
  data() {
    return {
      uploadMats: [
        // {
        //   url: "https://img.jiguang.cn/moonfox/images/moonfox-wechart-img.jpg",
        //   progress: 50,
        //   isUpload: false,
        // },
      ],
    };
  },
  methods: {
    attachFile(evt) {
      let fileArr = evt.target.files;
      let matsArr = [];
      let fileLength = fileArr.length;
      for (let i = 0; i < fileLength; i++) {
        let file = fileArr[i];
        let fileType = file.type.split("/")[0];
        let fileWrap = {
          type: fileType,
          url: this.getUrl(fileArr[i]),
          file,
          name: file.name,
          progress: 50,
        };
        matsArr.push(fileWrap);
      }
      this.uploadMats = this.uploadMats.concat(matsArr);
      // this.uploadFile();
    },

    selectedMats() {
      this.$refs.upload.click();
    },

    getUrl(file) {
      return URL.createObjectURL(file);
    },
    uploadFile() {
      if (this.showProgress) return;
      let self = this;
      let mats = [];
      this.uploadMats.forEach((item, index) => {
        if (!item.isUpload) {
          mats.push({
            index,
            file: item.file,
          });
        }
      });
      if (mats.length === 0) return this.$message("请选择需要上传的视频或图片");
      // let loadingMasks = [];
      this.showProgress = true;
      const url = this.$host + "/upload/file";
      this.$async.each(
        mats,
        (mat, callback) => {
          let { file, index } = mat;
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
                self.uploadMats[index].progress = parseInt(progress);
              }
            },
          };
          console.log("---param", param);
          this.axios
            .post(url, param, config)
            .then((res) => {
              let result = res.data;
              if (result && result.code === 0) {
                this.uploadMats[index].isUpload = true;
                callback();
              } else {
                callback("err");
              }
              // if (loadingMasks[index]) loadingMasks[index].close();
            })
            .catch((err) => {
              // if (loadingMasks[index]) loadingMasks[index].close();
              callback(err);
            });
        },
        (err, res) => {
          this.showProgress = false;
          if (err) {
            return this.$message("上传失败");
          }
          console.log("--res", res);
          this.$message("上传成功");
        }
      );
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
