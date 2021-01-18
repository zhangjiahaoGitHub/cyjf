<template>
    <div class='hundred'>
        <div class='white'>
            <div class='myTitle'>
                <div class='allFlex headTitle'>
                    <div class='headUpload'>
                        <el-upload
                            class='upload-demo'
                            action='#'
                            ref='upload'
                            :show-file-list='false'
                            :multiple='true'
                            :accept="'image/*'"
                            :http-request='none'
                            :on-change='handleChange'
                            :on-exceed='handleChangeMax'
                            :file-list='fileList'
                            :auto-upload='true'
                            :limit='5'
                            list-type='picture-card'>
                            <img :src="url?url:require('../../assets/head.png')" />
                        </el-upload>
                    </div>
                    <div class='allFlex justifyBetween levelWidth'>
                      <div>
                        <div class='myName allFlex'>
                            <span>{{merchantCnName?merchantCnName:phone}}</span>
                            <span class='signin' @click='signin()' v-if="showLogo['10N']">{{showLogo['10N']}}</span>
                        </div>
                        <div>{{phone}}</div>
                      </div>
                      <div>
                          <span class='levelName'>{{level}}</span>
                      </div>
                    </div>
                </div>
            </div>
            <div class='myBorder myMargin'>
                <div class='allFlex'>
                    <router-link :to="{name: 'wallet'}" tag='div' class='halfSix allFlex'>
                        <div class='half'>
                            <p class='myMoney'>{{Number(sumSwitch)?'***':income}}</p>
                            <div class='moneyCaption'>总收益</div>
                        </div>
                        <div class='half'>
                            <p class='myMoney'>{{Number(sumSwitch)?'***':withdraw}}</p>
                            <div class='moneyCaption'>可提现收益</div>
                        </div>
                    </router-link>
                    <div class='halfFour'>
                        <img @click='show()' :src="Number(sumSwitch) ? require('../../assets/my/nolook.png') : require('../../assets/my/look.png')" class='look'/>
                        <router-link :to="{name: 'retreat'}" tag='span' class='levelName levelColor'>立即提现</router-link>
                    </div>
                </div>
            </div>
            <div class='allFlex'>
                <div @click='toReal()' class='half textCenter'>
                    <img src='../../assets/my/real.png'  class='imageTwo immargin' />
                    <p>实名认证</p>
                </div>
                <router-link v-if="showLogo['10B']" :to="{name: 'repayment'}" tag='div' class='half textCenter'>
                    <img src='../../assets/my/card.png'  class='imageTwo immargin' />
                    <p>我的卡包</p>
                </router-link>
                <router-link :to="{name: 'team'}" tag='div' class='half textCenter'>
                    <img src='../../assets/my/team.png'  class='imageTwo immargin' />
                    <p>我的团队</p>
                </router-link>
                <router-link v-if="showLogo['10G']" :to="{name: 'upgrade'}" tag='div' class='half textCenter'>
                    <img src='../../assets/my/up.png'  class='imageTwo immargin' />
                    <p>{{showLogo['10G']}}</p>
                </router-link>
            </div>
        </div>
        <div class='centerSelect'>
            <router-link :to="{name: 'wallet'}" tag='div' class='allFlex'>
                <img src='../../assets/my/wallet.png' class='myImage'/>
                我的钱包
                <img src='../../assets/right.png' class='rightNext'/>
            </router-link>
            <router-link :to="{name: 'alldetails'}" tag='div' class='allFlex'>
                <img src='../../assets/my/detail.png' class='myImage'/>
                交易明细
                <img src='../../assets/right.png' class='rightNext'/>
            </router-link>
            <router-link :to="{name: 'share'}" v-if="showLogo['10F']" tag='div' class='allFlex'>
                <img src='../../assets/my/share.png' class='myImage'/>
                {{showLogo['10F']}}
                <img src='../../assets/right.png' class='rightNext'/>
            </router-link>
            <router-link :to="{name: 'customer'}" tag='div' class='allFlex'>
                <img src='../../assets/my/phone.png' class='myImage'/>
                联系客服
                <img src='../../assets/right.png' class='rightNext'/>
            </router-link>
            <div class='allFlex'  @click="problem(guarantee, '我的保单')">
                <img src='../../assets/my/policy.png' class='myImage'/>
                我的保单
                <img src='../../assets/right.png' class='rightNext'/>
            </div>
            <div class='allFlex' @click="problem('https://q.eqxiu.com/s/Y4BRKjjU', '操作手册')">
                <img src='../../assets/my/book.png' class='myImage'/>
                操作手册
                <img src='../../assets/right.png' class='rightNext'/>
            </div>
            <div class='allFlex' @click="problem(`http://chuangyijinfu.llyzf.cn/lly-posp-proxy/kdh/helpCenter.html?merchantNo=${merchantNo}&version=${version}`, '常见问题')">
                <img src='../../assets/my/problem.png' class='myImage'/>
                常见问题
                <img src='../../assets/right.png' class='rightNext'/>
            </div>
            <router-link :to="{name: 'setting'}" tag='div' class='allFlex'>
                <img src='../../assets/my/set.png' class='myImage'/>
                系统设置
                <img src='../../assets/right.png' class='rightNext'/>
            </router-link>
        </div>
        <div class='bottomLong' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
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
      imgUrlBase64: {},
      url: '',
      phone: {},
      version: '',
      agentNo: '',
      level: '',
      list: [],
      merchantNo: '',
      parentPhone: '',
      merchantCnName: '',
      income: 0,
      withdraw: 0,
      sumSwitch: 0,
      showLogo: {},
      fullscreenLoading: false,
      blem: [],
      real: 0,
      freezeStatus: '',
      guarantee: ''
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.real = this.$stact.state.real
    this.merchantCnName = JSON.parse(this.$stact.state.token)[0].merchantCnName
    console.log(this.$stact.state.level)
    this.freezeStatus = JSON.parse(this.$stact.state.token)[0].freezeStatus
    this.phone = JSON.parse(this.$stact.state.token)[0].phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  methods: {
    async handleChange (file, fileList) {
      console.log(fileList)
      if (fileList.length > 0) {
        if (!(fileList[fileList.length - 1].raw.type === 'image/jpeg' || fileList[fileList.length - 1].raw.type === 'image/jpg' || fileList[fileList.length - 1].raw.type === 'image/png')) {
          this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
          this.fileList = []
          return
        }
        this.fullscreenLoading = true
        this.fileList = fileList
        this.url = fileList[fileList.length - 1].url
        await this.chageBase(fileList[fileList.length - 1])
      }
    },
    async handleChangeMax (file, fileList) {
      vm.$message({
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
    signin () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790016',
        '42': vm.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$message({
              message: '签到成功',
              center: true,
              offset: 30,
              duration: 2500,
              type: 'success'
            })
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
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    chageBase (fileList) {
      console.log(fileList)
      let vm = this
      let file = fileList.raw
      // 将文件以Data URL形式读入页面
      let reader = new FileReader()
      this.imgUrlBase64 = reader.readAsDataURL(file)
      reader.onload = function () {
        let parmas = {
          '0': '0700',
          '3': '190949',
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
            this.fileList = []
            if (res.data[39] === '00') {
              vm.$message({
                message: '上传成功',
                center: true,
                offset: 30,
                duration: 2500,
                type: 'success'
              })
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
    problem (url, title) {
      if (title === '操作手册') {
        this.$message({
          message: '暂未开放',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (title === '我的保单') {
        window.location.href = url
        return
      }
      this.$router.push({ name: 'ifarme', query: { url: url, title: title } })
      // let vm = this
      // let parmas = {
      //   '0': '0700',
      //   '3': '790013',
      //   '42': vm.merchantNo,
      //   '59': vm.version
      // }
      // let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      // vm.$http.get(`request.app${url}`)
      //   .then(res => {
      //     if (res.data[39] === '00') {
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    message () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190112',
        '42': vm.merchantNo,
        '59': vm.version
      }
      vm.fullscreenLoading = true
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.guarantee = res.data[51] // 保单
            vm.level = vm.$stact.state.level[JSON.parse(vm.$stact.state.token)[0].level]
            vm.url = JSON.parse(vm.$stact.state.token)[0].headUrl
            vm.sumSwitch = JSON.parse(vm.$stact.state.token)[0].sumSwitch
            vm.freezeStatus = JSON.parse(this.$stact.state.token)[0].freezeStatus
            vm.income = res.data[46]
            vm.withdraw = res.data[6]
            vm.showLogo = JSON.parse(res.data[15])
            vm.$stact.dispatch('SetMoall', JSON.parse(res.data[13]))
            vm.$stact.dispatch('Set_Vip', {
              1: JSON.parse(res.data[13]).lvName1,
              2: JSON.parse(res.data[13]).lvName2,
              3: JSON.parse(res.data[13]).lvName3,
              4: JSON.parse(res.data[13]).lvName4,
              5: JSON.parse(res.data[13]).lvName5,
              6: JSON.parse(res.data[13]).lvName6,
              7: JSON.parse(res.data[13]).lvName7
            })
            if (Number(res.data[7]) === 1) { // 蓝色
              window.document.documentElement.setAttribute('data-theme', 'lanse')
              localStorage.setItem('bgcolor', '#38a3f7')
            }
            if (Number(res.data[7]) === 2) { // 褐色
              window.document.documentElement.setAttribute('data-theme', 'anjin')
              localStorage.setItem('bgcolor', '#221814')
            }
            if (Number(res.data[7]) === 3) { // 橙色
              window.document.documentElement.setAttribute('data-theme', 'orange')
              localStorage.setItem('bgcolor', '#f08519')
            }
            if (Number(res.data[7]) === 4) { // 黄色
              window.document.documentElement.setAttribute('data-theme', 'huangse')
              localStorage.setItem('bgcolor', '#f1b900')
            }
            if (Number(res.data[7]) === 5) { // 原始色
              window.document.documentElement.setAttribute('data-theme', '')
              localStorage.removeItem('bgcolor')
            }
            if (vm.freezeStatus === '10B' && document.querySelector('.v-modal') !== null) {
              document.querySelector('.v-modal').style.display = 'none'
              document.querySelector('.el-message-box__wrapper').style.display = 'none'
            }
            if (JSON.parse(this.$stact.state.token)[0].useStatus === '10B') {
              vm.$message({
                message: '您已经被禁用',
                center: true,
                offset: 30,
                duration: 2500,
                type: 'warning'
              })
              vm.$stact.dispatch('SetToken', '')
              vm.$stact.dispatch('SetReal', '')
              vm.$router.push({ name: 'login' })
            }
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    show () {
      let vm = this
      console.log(vm.sumSwitch)
      Number(vm.sumSwitch) === 1 ? vm.sumSwitch = 0 : vm.sumSwitch = 1
      let parmas = {
        '0': '0700',
        '3': '790009',
        '42': vm.merchantNo,
        '43': 'Z',
        '44': vm.sumSwitch,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            console.log(res)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    toReal () {
      let vm = this
      if (vm.freezeStatus !== '10B') {
        vm.$router.push({ name: 'real' })
      } else {
        vm.$message({
          message: '已实名或者审核中',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
      }
    }
  }
}
</script>
