<template>
  <div class='server-server'>
    <div class="img">
      <a :href="'tel:'+codephone">
        <img :src="imgUrl" alt="">
      </a>
    </div>
    <div class="inp">
      <div class="inp-box">
        <el-input type="textarea" class="inp-set" placeholder="请描述您的问题..." v-model="textarea">
        </el-input>
        <el-upload
          :action='actionsUrl'
          list-type="picture-card"
          name="10"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="successFile"
          class="upload-up">
          <img src="../../assets/market/addphoto.png" alt="">
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <div @click="submit" class="server-submit">提交</div>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      textarea: '',
      dialogImageUrl: '',
      dialogVisible: false,
      imgUrl: '',
      actionsUrl: '',
      fileList: [],
      imgUrlArr: [],
      codephone: '',
      merchantNo: '',
      version: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    // this.imgUrl=JSON.parse(localStorage.getItem('allImg'))['10E']
    if (process.env.NODE_ENV === 'production') {
      this.actionsUrl = `http://chuangyijinfu.llyzf.cn/lly-posp-proxy/uploadImage.app?0=0700&3=790101&43=${JSON.parse(this.$stact.state.token)[0].id}&42=${JSON.parse(this.$stact.state.token)[0].merchantNo}&9=10Y&59=${this.$stact.state.version}&64=${this.$md5('0700' + '790101' + JSON.parse(this.$stact.state.token)[0].id + JSON.parse(this.$stact.state.token)[0].merchantNo + '10Y' + this.$stact.state.version + '21E4ACD4CD5D4619B063F40C5A454F7D')}`
    } else {
      this.actionsUrl = `/apis/uploadImage.app?0=0700&3=790101&43=${JSON.parse(this.$stact.state.token)[0].id}&42=${JSON.parse(this.$stact.state.token)[0].merchantNo}&9=10Y&59=${this.$stact.state.version}&64=${this.$md5('0700' + '790101' + JSON.parse(this.$stact.state.token)[0].id + JSON.parse(this.$stact.state.token)[0].merchantNo + '10Y' + this.$stact.state.version + '21E4ACD4CD5D4619B063F40C5A454F7D')}`
    }
    this.getcode()
  },
  mounted () {
  },
  methods: {
    getcode () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.codephone = res.data[6]
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit () {
      if (this.textarea === '') {
        this.$message({
          message: '请填写反馈意见',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '690029',
        '22': this.textarea,
        '23': this.imgUrlArr.join(','),
        '24': JSON.parse(this.$stact.state.token)[0].id,
        '59': this.$stact.state.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$message({
              message: '提交成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
            this.dialogImageUrl = ''
            this.imgUrlArr = []
            this.textarea = ''
            document.querySelector('.el-upload-list').innerHTML = ''
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
        })
    },
    handleRemove (file, fileList) {
      this.imgUrlArr = []
      fileList.forEach(item => {
        this.imgUrlArr.push(item.response[57])
      })
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    successFile (response, file, fileList) {
      if (response[39] === '00') {
        this.imgUrlArr.push(response[57])
      }
    }
  }
}
</script>
