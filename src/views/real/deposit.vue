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
            :file-list='fileList'
            :auto-upload='true'
            :limit='1'
            list-type='picture-card'>
            <img :src="url?url:require('../../assets/real/card.png')" class='iDcard'/>
        </el-upload>
    </div>
    <div class='verifiedName'>
        点击上传 <span class='blueColor'>储蓄卡正面</span>
    </div>
    <div class='realTitle'>请核对您的身份信息</div>
    <div class='verifiedContent'>
        <div class='allFlex setInput'>
            <div class='setName'>身份证</div>
            <input class='setEntryLong' type='text' v-model='card' oninput="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" onafterpaste="this.value=this.value.replace(/[\u4e00-\u9fa5]/ig,'')" placeholder='请输入您的身份证号码' />
        </div>
        <div class='allFlex setInput'>
            <div class='setName'>姓名</div>
            <input class='setEntryLong' type='text' v-model='name' placeholder='请输入您的身份证名字' />
        </div>
    </div>
    <div class='transferConfirm' @click='uploadImg()' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'>
        下一步
    </div>
    <div class='bottomLong'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      imgUrlBase64: {},
      url: '',
      card: '',
      name: '',
      fullscreenLoading: false,
      phone: '',
      merchantId: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token).merchant.merchantNo
    this.phone = JSON.parse(this.$stact.state.token).merchant.phone
  },
  mounted () {
    this.$inputLen.inputJs()
  },
  methods: {
    async handleChange (file, fileList) {
      if (fileList.length > 0) {
        this.fileList = fileList
        this.url = fileList[0].url
        await this.chageBase('10A', fileList)
      }
      return false
    },
    chageBase (type, fileList) {
      let vm = this
      let file = fileList[0].raw
      // 将文件以Data URL形式读入页面
      let reader = new FileReader()
      this.imgUrlBase64 = reader.readAsDataURL(file)
      reader.onload = function () {
        let url = reader.result.split(',')[1]
        let parmas = {
          'agentNo': vm.agentNo,
          'imageData': url,
          'imageType': type,
          'merchantNo': vm.merchantNo.toString(),
          'version': vm.version
        }
        parmas = vm.$mdata.mdGet(parmas)
        vm.fullscreenLoading = true
        vm.$http.post('image/imageUpload', parmas)
          .then(res => {
            vm.fullscreenLoading = false
            vm.$message({
              message: res.data[39],
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
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
          message: '必须上传一张身份证人像面',
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
      let parmas = {
        'agentNo': vm.agentNo,
        'id': vm.merchantId.toString(),
        'idCardNum': vm.card,
        'name': vm.name,
        'phone': vm.phone,
        'version': vm.version
      }
      parmas = vm.$mdata.mdGet(parmas)
      vm.fullscreenLoading = true
      vm.$http.post('merchant/autonymAuthenticate', parmas)
        .then(res => {
          vm.fullscreenLoading = false
          this.$message({
            message: res.data[39],
            center: true,
            offset: 30,
            duration: 2000,
            type: 'success'
          })
          if (res.data[39] === '00') {
            vm.$router.push({ name: 'my' })
          }
        })
        .catch(err => {
          console.log(err)
          vm.fullscreenLoading = false
        })
    }
  }
}
</script>
