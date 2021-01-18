<template>
  <div class='hundred'>
    <div class='allFlex'>
      <router-link v-if="showLogo['10A']" tag="div" :to="{name:'collection'}" class='half textCenter homeTopm'>
        <img src='../assets/doshou.png' />
        <p>{{showLogo['10A']}}</p>
      </router-link>
      <router-link v-if="showLogo['10B']" tag="div" :to="{name:'repayment'}" class='half textCenter homeTopm'>
        <img src='../assets/znhk.png' />
        <p>{{showLogo['10B']}}</p>
      </router-link>
      <div v-if="showLogo['10C']" @click="vipUse('emptyrepayment')" class='half textCenter homeTopm'>
        <img src='../assets/kkhk.png' />
        <p>{{showLogo['10C']}}</p>
      </div>
    </div>
    <div class='homeLogo' v-if='bannerList.length > 0'>
      <!--<router-link :to="{name: 'share'}" tag="a"><img src='../assets/code.png' class='shareCode' /></router-link>-->
      <swiper :options="swiperOptions">
        <swiper-slide v-for='item in bannerList' :key='item.id'>
          <img :src="item.singleNo ? item.singleNo : require('../assets/banner.png')" class='imgBanner' @click="tohref(item.orderPaymentId)" />
        </swiper-slide>
      </swiper>
    </div>
    <div class='homeIcon'>
    </div>
    <div class='allFlex homeList'>
      <div v-if="showLogo['10D']" :to="{name:'repayment'}" class='textCenter' @click="card(1, '贷款办理')">
        <img src='../assets/card.png'  class='imageOne' />
        <p>{{showLogo['10D']}}</p>
      </div>
      <div v-if="showLogo['10E']" class='textCenter' @click="toInter('intermediaryagency')">
        <img src='../assets/surrender.png'  class='imageOne' />
        <p>{{showLogo['10E']}}</p>
      </div>
      <router-link v-if="showLogo['10F']" :to="{name: 'share'}" tag='div' class='textCenter'>
        <img src='../assets/share.png'  class='imageOne' />
        <p>{{showLogo['10F']}}</p>
      </router-link>
      <router-link v-if="showLogo['10G']" :to="{name: 'upgrade'}" tag='div' class='textCenter'>
        <img src='../assets/upgrade.png'  class='imageOne' />
        <p>{{showLogo['10G']}}</p>
      </router-link>
      <div v-if="showLogo['10H']" class='textCenter' @click="card(0, '信用卡办理')">
        <img src='../assets/handle.png'  class='imageOne' />
        <p>{{showLogo['10H']}}</p>
      </div>
      <div v-if="showLogo['10I']"  class='textCenter' @click="card(4, '积分兑换')">
        <img src='../assets/exchange.png'  class='imageOne' />
        <p>{{showLogo['10I']}}</p>
      </div>
      <div v-if="showLogo['10L']" class='textCenter' @click="card(3, '卡测评')">
        <img src='../assets/evaluation.png'  class='imageOne' />
        <p>{{showLogo['10L']}}</p>
      </div>
      <div v-if="showLogo['10M']" class='textCenter' @click="card(2, '征信')">
        <img src='../assets/credit.png'  class='imageOne' />
        <p>{{showLogo['10M']}}</p>
      </div>
      <router-link v-if="showLogo['10R']" :to="{name: 'collection', query: {flower: 1} }" tag='div' class='textCenter'>
        <img src='../assets/flower.png'  class='imageOne' />
        <p>{{showLogo['10R']}}</p>
      </router-link>
    </div>
    <div class='homeTutorial'>
        <div v-if="showLogo['10S']">
           <div class='tutorial'>
           {{showLogo['10S']}}
          </div>
          <div @click="card(9, showLogo['10S'])" class='tutorialImg'>
              <img src='../assets/leader.png'>
          </div>
        </div>
        <div v-if="showLogo['10J']">
           <div class='tutorial'>
           {{showLogo['10J']}}
          </div>
          <div @click="card(10, showLogo['10J'])" class='tutorialImg'>
              <img src='../assets/market.png'>
          </div>
        </div>
        <div v-if="showLogo['10T']">
           <div class='tutorial'>
           {{showLogo['10T']}}
          </div>
          <router-link :to="{name: 'cool'}" tag='div' class='tutorialImg'>
              <img src='../assets/bannerW.png'>
          </router-link>
        </div>
        <div v-if="showLogo['10U']">
           <div class='tutorial'>
            {{showLogo['10U']}}
          </div>
          <router-link :to="{name: 'commerce'}" tag='div' class='tutorialImg'>
              <img src='../assets/bannerX.png'>
          </router-link>
        </div>
    </div>
    <div class="flagshapbox" v-if="shapflag">
      <div class="mesbox">
        <div class="mes-title">
          {{itemList.title}}
        </div>
        <div class="mes-con">
          {{itemList.content}}
        </div>
        <div class="mes-btn">
          <div class="btn-l" @click="closeflag()">好的</div>
          <div class="btn-r" @click="tomessage(itemList.id)">查看</div>
        </div>
      </div>
    </div>
    <div class='bottomLong' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
    <el-dialog
      class='messdia'
      :title="textList.title"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="90%"
      :before-close="handleClose">
      <span v-html='textList.content'></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleClose()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  data () {
    return {
      agentNo: '',
      version: '',
      merchantNo: '',
      bannerList: [],
      cardUrl: '',
      shapflag: false,
      itemList: [],
      noticeid: '',
      freezeStatus: '',
      isIntermediary: 0,
      level: 0,
      showLogo: {},
      swiperOptions: {
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        autoplay: {
          delay: 2500
        }
      },
      fullscreenLoading: false,
      dialogVisible: false,
      textList: {},
      appid: '',
      openId: ''
    }
  },
  components: {
  },
  watch: {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.message()
  },
  mounted () {
    if (document.querySelector('.el-image-viewer__wrapper')) {
      document.querySelector('.el-image-viewer__wrapper').style.display = 'none'
    }
    this.banner()
  },
  methods: {
    isApprove () {
      let vm = this
      let href = window.location.href
      if (href.includes('html?code')) { // url包括 com/?code 证明为从微信跳转回来的
        let url = href.split('#')[0] // vue自动在末尾加了 #/ 符号，截取去掉
        let jingPosit = url.indexOf('html') + 4 // 获取域名结束的位置
        let urlLeft = url.substring(0, jingPosit) // url左侧部分
        let urlRight = url.substring(jingPosit, url.length) // url右侧部分
        window.location.href = urlLeft + '#/home' + urlRight // 拼接跳转
      } else {
        vm.getTure()
      }
    },
    getTure () { // 获取微信授权 建议history模式
      let vm = this
      if (!vm.openId) {
        if (!vm.$route.query.code) {
          let url = encodeURIComponent(window.location.href)
          if (sessionStorage.getItem('setOne') === '1') {
            return
          }
          sessionStorage.setItem('setOne', '1')
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${vm.appid}&redirect_uri=${url}&response_type=code&scope=snsapi_base#wechat_redirect`
        } else {
          vm.approve()
        }
      } else {
        vm.fullscreenLoading = false
        if (sessionStorage.getItem('textkey') === '1') {
          vm.dialogVisible = false
        } else {
          this.text()
        }
      }
    },
    approve () { // 微信授权获取store openid
      let vm = this
      if (!vm.$route.query.code) {
        sessionStorage.setItem('setOne', '0')
        return
      }
      let parmas = {
        '0': '0700',
        '3': '790018',
        '42': vm.merchantNo,
        '43': vm.$route.query.code,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          vm.fullscreenLoading = false
          if (res.data[39] === '00') {
            if (sessionStorage.getItem('textkey') === '1') {
              vm.dialogVisible = false
            } else {
              this.text()
            }
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    tohref (imgurl) {
      if (imgurl) {
        this.$router.push({ name: 'ifarme', query: { url: imgurl, title: '' } })
      }
    },
    handleClose () {
      this.dialogVisible = false
    },
    closeflag () {
      this.shapflag = false
    },
    tomessage (id) {
      this.noticeid = id
      this.list()
      this.$router.push({ name: 'systemnotice', query: { index: 0, itemid: this.noticeid } })
    },
    vipUse (rou) {
      let vm = this
      vm.$router.push({ name: rou })
    },
    text () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190103',
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            if (res.data[60]) {
              vm.textList = JSON.parse(res.data[60])[0]
              let readNoArr = JSON.parse(res.data[60])
              console.log(vm.textList)
              if (readNoArr[0]) {
                if (sessionStorage.getItem('textkey') === '1') {
                  vm.dialogVisible = false
                } else {
                  sessionStorage.setItem('textkey', '1')
                  vm.dialogVisible = true
                }
              } else {
                this.dialogVisible = false
              }
            }
          } else {
            this.dialogVisible = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    banner () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '190108',
        '44': vm.agentNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.bannerList = JSON.parse(res.data[57])
            console.log(this.bannerList)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    vipUes () {
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
          if (res.data[39] === '00') {
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.isIntermediary = JSON.parse(vm.$stact.state.token)[0].isIntermediary
            vm.freezeStatus = JSON.parse(this.$stact.state.token)[0].freezeStatus
            vm.level = JSON.parse(this.$stact.state.token)[0].level
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
            vm.showLogo = JSON.parse(res.data[15])
            vm.$stact.dispatch('SetMoall', JSON.parse(res.data[13]))
            let ua = window.navigator.userAgent.toLowerCase()
            vm.appid = res.data[16]
            vm.openId = JSON.parse(this.$stact.state.token)[0].openId
            // if (ua.match(/MicroMessenger/i)) {
            //   this.isApprove()
            // } else {
            //   vm.fullscreenLoading = false
            //   if (sessionStorage.getItem('textkey') === '1') {
            //     this.dialogVisible = false
            //   } else {
            //     this.text()
            //   }
            // }
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
            vm.fullscreenLoading = false
            if (sessionStorage.getItem('textkey') === '1') {
              this.dialogVisible = false
            } else {
              this.text()
            }
          } else {
            vm.fullscreenLoading = false
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    },
    toInter () {
      let vm = this
      if (Number(vm.level) < 4) {
        vm.$message({
          message: `${vm.$stact.state.level[3]}以上用户才可使用`,
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      Number(vm.isIntermediary) === 1 ? vm.$router.push({ name: 'intermediaryagency' }) : vm.$message({
        message: '请联系客服在后台开通中介',
        center: true,
        offset: 30,
        duration: 2500,
        type: 'warning'
      })
    },
    card (type, title) {
      let vm = this
      if (vm.freezeStatus !== '10B') {
        vm.$confirm('尚未实名请先实名？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          vm.$router.push({ name: 'real' })
        }).catch(() => {
        })
        return
      }
      if (type === 2) {
        vm.$message({
          message: '功能开发中',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'warning'
        })
        return
      }
      if (type === 3) {
        vm.$router.push({ name: 'credit' })
        return
      }
      if (type === 4) {
        vm.$router.push({ name: 'ifarme', query: { url: `http://daifu.llyzf.cn:6442/lly-posp-proxy/wwwroot/index.html?/version=${vm.version}&merchantNo=${vm.merchantNo}&posturl=http://chuangyijinfu.llyzf.cn/lly-posp-proxy/`, title: title } })
      }
      if (type === 9) {
        vm.$router.push({ name: 'dragonlist' })
        return
      }
      if (type === 10) {
        vm.$router.push({ name: 'shoparea' })
        return
      }
      let parmas = {
        '0': '0700',
        '3': '890005',
        '42': vm.merchantNo,
        '43': type,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.$router.push({ name: 'ifarme', query: { url: res.data[38], title: title } })
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
    }
  }
}
</script>
