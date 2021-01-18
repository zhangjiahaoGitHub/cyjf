<template>
  <div>
    <div class='verifiedImage'>
        <el-upload
            class='upload-demo'
            action='#'
            ref='upload'
            :show-file-list='false'
            :multiple='true'
            accept='image/*'
            :on-change='handleChange'
            :on-exceed='handleChangeMax'
            :http-request='none'
            :file-list='fileList'
            :auto-upload='true'
            :limit='4'
            list-type='picture-card'>
            <img :src="url?url:require('../../assets/real/positivezheng.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        添加身份证正面照
    </div>
    <div class='verifiedImage'>
        <el-upload
            class='upload-demo'
            action='#'
            ref='upload'
            :show-file-list='false'
            :multiple='true'
            accept='image/*'
            :on-change='handleTwo'
            :on-exceed='handleChangeMax'
            :http-request='none'
            :file-list='fileList'
            :auto-upload='true'
            :limit='4'
            list-type='picture-card'>
            <img :src="urlTwo?urlTwo:require('../../assets/real/positivebei.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        添加身份证背面照
    </div>
    <div class='verifiedImage'>
        <el-upload
            class='upload-demo'
            action='#'
            ref='upload'
            :show-file-list='false'
            :multiple='true'
            accept='image/*'
            :on-change='handleThree'
            :on-exceed='handleChangeMax'
            :http-request='none'
            :file-list='fileList'
            :auto-upload='true'
            :limit='4'
            list-type='picture-card'>
            <img :src="urlThree?urlThree:require('../../assets/real/cardzheng.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        添加银行卡正面照
    </div>
    <div class='verifiedImage'>
        <el-upload
            class='upload-demo'
            action='#'
            ref='upload'
            :show-file-list='false'
            :multiple='true'
            accept='image/*'
            :on-change='handleFour'
            :on-exceed='handleChangeMax'
            :http-request='none'
            :file-list='fileList'
            :auto-upload='true'
            :limit='4'
            list-type='picture-card'>
            <img :src="urlFour?urlFour:require('../../assets/real/cardbei.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        添加银行卡背面照
    </div>
    <div class='transferConfirm adduser-mar-top' @click='uploadImg()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        下一步
    </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      fileTwo: [],
      fileThree: [],
      fileFour: [],
      imgUrlBase64: {},
      url: '',
      urlTwo: '',
      urlThree: '',
      urlFour: '',
      card: '',
      name: '',
      fullscreenLoading: false,
      phone: '',
      merchantId: '',
      token: '',
      tokenId: '',
      queryparmas: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = this.$route.query.merchantNo
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    async handleChange (file, fileList) {
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.fileList = []
          this.url = ''
          return
        }
        this.fileList = fileList
        await this.chageBase('10E', fileList[fileList.length - 1])
      }
      return false
    },
    async handleTwo (file, fileList) {
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.urlTwo = ''
          this.fileTwo = []
          return
        }
        this.fileTwo = fileList
        await this.chageBase('10F', fileList[fileList.length - 1])
      }
      return false
    },
    async handleThree (file, fileList) {
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.urlThree = ''
          this.fileThree = []
          return
        }
        this.fileThree = fileList
        await this.chageBase('10K', fileList[fileList.length - 1])
      }
      return false
    },
    async handleFour (file, fileList) {
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.urlFour = ''
          this.fileFour = []
          return
        }
        this.fileFour = fileList
        await this.chageBase('10L', fileList[fileList.length - 1])
      }
      return false
    },
    async handleChangeMax (file, fileList) {
      this.$message({
        message: '上传图片次数过多，请勿重复',
        center: true,
        offset: 30,
        duration: 2500,
        type: 'success'
      })
    },
    none () {
      console.log(1)
    },
    chageBase (type, fileList) {
      let vm = this
      let file = fileList.raw
      // 将文件以Data URL形式读入页面
      let reader = new FileReader()
      this.imgUrlBase64 = reader.readAsDataURL(file)
      reader.onload = function () {
        let parmas = {
          '0': '0700',
          '3': '190948',
          '9': type,
          '42': vm.merchantNo,
          '59': vm.version
        }
        let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
        vm.fullscreenLoading = true
        var param = new FormData()
        param.append('10', file)
        const root = process.env.NODE_ENV === 'production' ? 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/' : '/apis'
        axios.post(root + `/uploadImage.app${url}`, param)
          .then(res => {
            vm.fullscreenLoading = false
            if (res.data[39] === '00') {
              vm.$message({
                message: '上传成功',
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
              switch (type) {
                case '10E':
                  vm.url = res.data[57]
                  break
                case '10F':
                  vm.urlTwo = res.data[57]
                  break
                case '10K':
                  vm.urlThree = res.data[57]
                  break
                case '10L':
                  vm.urlFour = res.data[57]
                  break
              }
            } else {
              vm.$message({
                message: res.data[39],
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.log(err)
            vm.fullscreenLoading = false
          })
      }
    },
    uploadImg () {
      let vm = this
      if (this.fileList.length < 1) {
        this.$message({
          message: '必须上传一张身份证正面照',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.fileTwo.length < 1) {
        this.$message({
          message: '必须上传一张身份证背面照',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.fileThree.length < 1) {
        this.$message({
          message: '必须上传一张银行卡正面',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.fileFour.length < 1) {
        this.$message({
          message: '必须上传一张银行卡背面',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      vm.$router.go(-2)
    }
  }
}
</script>
