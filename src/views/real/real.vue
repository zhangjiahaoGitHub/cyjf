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
            :limit='5'
            list-type='picture-card'>
            <img :src=" url ? url :require('../../assets/real/positive.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        点击上传 <span class='blueColor'>身份证正面</span>
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
            :file-list='fileTwo'
            :auto-upload='true'
            :limit='5'
            list-type='picture-card'>
            <img :src="urlTwo?urlTwo:require('../../assets/real/negative.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        点击上传 <span class='blueColor'>身份证反面</span>
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
            :file-list='fileThree'
            :auto-upload='true'
            :limit='5'
            list-type='picture-card'>
            <img :src="urlThree?urlThree:require('../../assets/real/card.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        点击上传 <span class='blueColor'>肖像正面</span>
    </div>
    <div class='realTitle'>请核对您的身份信息</div>
    <div class='verifiedContent'>
        <div class='allFlex setInput'>
            <div class='setName'>身份证</div>
            <input class='setEntryLong' type='text'  v-model='card' oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" placeholder='请输入您的身份证号码' />
        </div>
        <div class='allFlex setInput'>
            <div class='setName'>姓名</div>
            <input class='setEntryLong' type='text'  v-model='name' placeholder='请输入您的身份证名字' />
        </div>
    </div>
    <div class='transferConfirm' @click='uploadImg()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
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
      imgUrlBase64: {},
      url: '',
      urlTwo: '',
      urlThree: '',
      card: '',
      name: '',
      fullscreenLoading: false,
      phone: '',
      merchantId: '',
      token: '',
      tokenId: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    async handleChange (file, fileList) {
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传图片只能是 JPG,PNG 格式!')
          this.url = ''
          this.fileList = []
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
          this.$message.error('上传图片只能是 JPG,PNG 格式!')
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
          this.$message.error('上传图片只能是 JPG,PNG 格式!')
          this.urlThree = ''
          this.fileThree = []
          return
        }
        this.fileThree = fileList
        await this.chageBase('10M', fileList[fileList.length - 1])
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
    real () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190937',
        '21': vm.merchantNo,
        '22': vm.tokenId,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    compressImg (width, height, img) {
      let canvas = document.createElement('canvas')
      let c = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      c.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, width, height)
      return canvas.toDataURL('image/png')
    },
    dataURLtoFile (dataurl, filename = 'file') { // 将base64转换为文件
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, { type: mime })
    },
    chageBase (type, fileList) {
      let vm = this
      let file = fileList.raw
      console.log(file)
      // 将文件以Data URL形式读入页面
      let reader = new FileReader()
      this.imgUrlBase64 = reader.readAsDataURL(file)
      reader.onload = function () {
        let img = new Image()
        img.src = reader.result
        img.onload = function () {
          let w = this.width
          let h = this.height
          let scale = w / h // 压缩图片
          let b64 = vm.compressImg(550, 550 / scale, img)
          let b64Img = vm.dataURLtoFile(b64)
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
          param.append('10', b64Img)
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
                  case '10M':
                    vm.urlThree = res.data[57]
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
      }
    },
    uploadImg () {
      let vm = this
      if (this.url.match(/^[ ]*$/)) {
        this.$message({
          message: '必须上传一张身份证人像面',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.urlTwo.match(/^[ ]*$/)) {
        this.$message({
          message: '必须上传一张身份证国徽面',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.fileThree.length < 1) {
        this.$message({
          message: '必须上传一张肖像正面',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.card.match(/^[ ]*$/)) {
        this.$message({
          message: '您的身份证号必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      let regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (!regIdNo.test(vm.card)) {
        this.$message({
          message: '您的身份证号填写有误',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      if (this.name.match(/^[ ]*$/)) {
        this.$message({
          message: '您的姓名必须填写',
          center: true,
          offset: 30,
          duration: 2000,
          type: 'warning'
        })
        return
      }
      vm.$router.push({ name: 'realcard', query: { card: vm.card, name: vm.name } })
    }
  }
}
</script>
