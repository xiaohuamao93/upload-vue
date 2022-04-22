<template>
  <div>
    文件上传-切片
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
        <img v-if="isImg(file.type)" class="img" :src="file.url" />
        <video class="video" v-else :src="file.url" />
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
  name: "Upload_3",
  props: {},
  data() {
    return {
      uploadMats: [],
      // progress: 10,
      size: 1024 * 500,
      fileChunks: [],
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
        size: file.size,
        name: file.name,
        isUpload: false,
      };
      matsArr.push(fileWrap);
      this.uploadMats = this.uploadMats.concat(matsArr);
      this.fileInfo = fileWrap;
      this.uploadFile(fileWrap);
    },

    selectedMats() {
      this.$refs.upload.click();
    },

    isImg(type) {
      const imgType = ["png", "jpg"];
      return imgType.includes(type);
    },

    getUrl(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    uploadFile(fileInfo) {
      let fileChunks = [];
      let index = 0; //切片序号
      let [fname, type] = fileInfo.name.split(".");
      for (let cur = 0; cur < fileInfo.size; cur += this.size) {
        let blob = fileInfo.file.slice(cur, cur + this.size);
        let blobName = `${fname}.${index}.${type}`;
        let blobFile = new File([blob], blobName);
        fileChunks.push({
          uploadSize: 0,
          hash: index++,
          chunk: blobFile,
        });
      }

      this.fileChunks = fileChunks;
      const url = this.$host + "/uploadslice/file";

      this.$async.each(
        fileChunks,
        (chunkInfo, callback) => {
          let param = new FormData();
          param.append("filename", fileInfo.name);
          param.append("hash", chunkInfo.hash);
          param.append("file", chunkInfo.chunk);

          // let progress = 0;
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            // onUploadProgress(progressEvent) {
            //   if (progressEvent.lengthComputable) {
            //     // progress = (
            //     //   (progressEvent.loaded / progressEvent.total) *
            //     //   100
            //     // ).toFixed(0);
            //     // console.log("----progress", progress);
            //     // self.fileChunks[index].progress = parseInt(progress);
            //     //  currentMat.progress = parseInt(progress);
            //     // self.$set(self.uploadMats, index, currentMat);
            //   }
            // },
          };
          this.axios
            .post(url, param, config)
            .then((res) => {
              console.log("--res", res);
              let result = res.data;
              if (result && result.code === 0) {
                callback();
              } else {
                callback("err");
              }
            })
            .catch((err) => {
              callback(err);
            });
        },
        (err) => {
          if (err) return this.$message.error("切片上传失败");
          this.mergePost(fileInfo.name);
        }
      );
    },
    mergePost(fileName) {
      const merUrl = this.$host + "/uploadslice/merge";
      this.axios
        .get(merUrl, {
          params: {
            fileName: fileName,
          },
        })
        .then(() => {
          this.$message.success("文件上传成功");
        })
        .catch(() => {
          this.$message.error("文件上传失败");
        });
    },
  },
  computed: {
    progress: function () {
      const mat = this.uploadMats.find((file) => !file.isUpload);
      if (!mat) return 0;
      this.fileChunks.reduce((total, chunkInfo) => {
        return total + chunkInfo.uploadSize;
      }, 0);
      return "";
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
.video {
  width: 100%;
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
