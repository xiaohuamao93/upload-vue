<template>
  <div>
    文件上传1
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
      size: 1024 * 50,
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
      this.uploadFile(fileWrap);
    },

    selectedMats() {
      this.$refs.upload.click();
    },

    getUrl(file) {
      return URL.createObjectURL(file);
    },
    uploadFile(fileInfo) {
      console.log("------");
      let fileChunks = [];
      let index = 0; //切片序号
      let [fname, fext] = fileInfo.name.split(".");
      for (let cur = 0; cur < fileInfo.size; cur += this.size) {
        let blob = fileInfo.file.slice(cur, cur + this.size);
        let blobName = `${fname}.${index}.${fext}`;
        let blobFile = new File([blob], blobName);
        fileChunks.push({
          hash: index++,
          chunk: blobFile,
        });
      }
      console.log("----fileChunks", fileChunks);

      const url = this.$host + "/upload/file3";
      const merUrl = this.$host + "/upload/merge";

      this.$async.each(
        fileChunks,
        (chunkInfo, callback) => {
          let param = new FormData();
          param.append("filename", fileInfo.name);
          param.append("hash", chunkInfo.hash);
          param.append("file", chunkInfo.chunk);
          // param.append(
          //   "file",
          //   chunkInfo.chunk,
          //   `${fileInfo.name}-${chunkInfo.hash}`
          // );

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
                console.log("----progress", progress);
                // self.uploadMats[index].progress = parseInt(progress);
                //  currentMat.progress = parseInt(progress);
                // self.$set(self.uploadMats, index, currentMat);
              }
            },
          };
          this.axios
            .post(url, param, config)
            .then((res) => {
              console.log("--res", res);
              let result = res.data;
              if (result && result.code === 0) {
                // this.uploadMats[index].isUpload = true;
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
          if (err) {
            console.log("err", err);
          } else {
            console.log("All files have been deleted successfully", res);
            this.axios
              .get(merUrl, {
                params: {
                  fileName: fileInfo.name,
                },
              })
              .then((res) => {
                console.log("---a-aaa success", res);
              })
              .catch((err) => {
                console.log("-----errr erro", err);
              });
          }
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
