<template>
  <div id="app">
      <div v-if="$route.meta.left" class="leftRouter">
        <img src="./assets/leftArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'withdlist'}" v-if="$route.meta.withdraw" tag="span" class='retreat'>提现记录</router-link>
        <router-link :to="{name: 'creditlist'}" v-if="$route.meta.credit" tag="span" class='retreat'>查询记录</router-link>
      </div>
      <div v-if="$route.meta.backLeft" class="leftRouter backRouter">
        <img src="./assets/leftArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <div v-if="$route.meta.regLeft" class="leftRouter">
        {{$route.meta.title}}
        <!--<router-link :to="{name: 'registered'}" tag="span" class='retreat'>注册</router-link>-->
      </div>
      <div v-if="$route.meta.changeLeft" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png" v-if="$route.meta.withdraw"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link v-if="$route.meta.card" :to="{name: 'change'}" tag="span" class='retreat gary'>更换储蓄卡</router-link>
      </div>
      <div v-if="$route.meta.aisleLeft" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <!--<router-link :to="{name: 'registered'}" tag="span" class='retreat gary'>支持银行</router-link> -->
      </div>
      <div v-if="$route.meta.home" class="leftRouter leftwihteRouter">
        <router-link tag="a" :to="{name:'message'}" >
          <img src="./assets/message.png"  class="leftMess"/>
        </router-link>
        {{$route.meta.title}}
        <router-link :to="{name: 'customer'}" tag='a' >
          <img src="./assets/service.png"  class="rightService"/>
        </router-link>
      </div>
      <div v-if="$route.meta.whiteLeft" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'withdlist'}" v-if="$route.meta.withdraw" tag="span" class='retreat gary'>提现记录</router-link>
      </div>
      <!-- 空卡还款开始 -->
      <div v-if="$route.meta.emptyrepayment" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'addcard'}" tag="span" class='retreat gary'>添加信用卡</router-link>
      </div>
      <!-- 空卡还款结束 -->
      <!-- 中介代还开始 -->
      <div v-if="$route.meta.intermediaryagency" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <!-- 中介代还开始 -->
      <!-- 实名认证开始 -->
      <div v-if="$route.meta.realname" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'adduser'}" tag="span" class='retreat gary'>添加用户</router-link>
      </div>
      <!-- 实名认证结束 -->
      <!-- 制定计划开始 -->
      <div v-if="$route.meta.makeplan" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'makeplan'}" tag="span" class='retreat gary'></router-link>
      </div>
      <!-- 制定计划结束 -->
      <!-- 制定计划开始 -->
      <div v-if="$route.meta.checkplan" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
        <router-link :to="{name: 'checkplan'}" tag="span" class='retreat gary'></router-link>
      </div>
      <!-- 制定计划结束 -->
      <!-- 增加卡位开始 -->
      <div v-if="$route.meta.addposition" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <!-- 增加卡位结束 -->
      <!-- 增加卡位开始 -->
      <div v-if="$route.meta.cardadmin" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <!-- 增加卡位结束 -->
      <!-- 选择卡片开始 -->
      <div v-if="$route.meta.selectcard" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <!-- 选择卡片结束 -->
      <div v-if="$route.meta.srroll" class="leftRouter leftwihteRouter">
        <img src="./assets/blackArrow.png"  class="leftArrow" @click="goTop()"/>
        {{$route.meta.title}}
      </div>
      <div v-if="$route.meta.noLeft" class="leftRouter">
        {{$route.meta.title}}
      </div>
      <div v-if="$route.meta.nowihteLeft" class="leftRouter leftwihteRouter">
        {{$route.meta.title}}
      </div>
      <div v-if="$route.meta.noblackLeft" class="leftRouter leftBlackRouter">
        {{$route.meta.title}}
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <!-- 这里不会被keepalive -->
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <ul class="allFlex homeBanner" v-if="$route.meta.navShow">
      <router-link tag="li" :to="{name:'home'}">
        <i class="iconfont icon-shouye appFont" :class="routeData=='home' && 'blueColor'"></i>
        <p :class="routeData=='home'?'checkColor':''">首页</p>
      </router-link>
      <router-link tag="li" :to="{name:'repayment'}">
        <i class="iconfont icon-xinyongqia appFont" :class="routeData=='repayment' && 'blueColor'"></i>
        <p :class="routeData=='repayment'?'checkColor':''">还款</p>
      </router-link>
      <router-link tag="li" :to="{name:'collection'}">
        <i class="iconfont icon-yingshoukuan appFont" :class="routeData=='collection' && 'blueColor'"></i>
        <p :class="routeData=='collection'?'checkColor':''">收款</p>
      </router-link>
      <router-link tag="li" :to="{name:'my'}">
        <i class="iconfont icon-wode appFont" :class="routeData=='my' && 'blueColor'"></i>
        <p :class="routeData=='my'?'checkColor':''">我的</p>
      </router-link>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  data () {
    return {
      routeData: '',
      merchantNo: '',
      version: '',
      agentNo: '',
      phone: '',
      freezeStatus: '',
      real: ''
    }
  },
  watch: {
    '$route' (to, from) {
      let vm = (this as any)
      vm.routeData = to.name
      vm.merchantNo = ''
      vm.real = vm.$stact.state.real
      if (to.name === 'ifarme') {
        to.meta.title = vm.$route.query.title
        if (to.meta.title.length > 16) {
          to.meta.title = to.meta.title.substring(0, 16) + '...'
        }
        document.title = vm.$route.query.title
        document.body.title = vm.$route.query.title
      }
      if (to.name === 'collection') {
        to.meta.title = '收款'
        document.title = '收款'
        document.body.title = '收款'
      }
      if (to.name === 'collection' && this.$route.query.flower) {
        to.meta.title = '花呗收款'
        document.title = '花呗收款'
        document.body.title = '花呗收款'
      }
      new Promise((resolve, reject) => { // 判断是否登录 用登录后的token里merchantNo做唯一标示
        vm.$stact.state.token.length !== 0 ? vm.merchantNo = JSON.parse(vm.$stact.state.token)[0].merchantNo : console.log('无')
        resolve()
      }).then(r => {
        if (vm.merchantNo) { // 有无merchantNo的情况下 判断是否在登录页 忘记密码页 还有注册页
          if (vm.routeData === 'login' || vm.routeData === 'forget' || vm.routeData === 'registered') {
            vm.$router.push({ name: 'home' })
          } else {
            vm.freezeStatus = JSON.parse(vm.$stact.state.token)[0].freezeStatus
            if (vm.routeData !== 'real' && vm.routeData !== 'realcard') {
              if (vm.freezeStatus !== '10B') {
                if (vm.real !== 'realSb') {
                  vm.$confirm('尚未实名请先实名？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    vm.$router.push({ name: 'real' })
                  }).catch(() => {
                  })
                }
              }
            }
          }
        } else {
          if (vm.routeData === 'login' || vm.routeData === 'forget' || vm.routeData === 'registered' || vm.routeData === 'ifarme') {
          } else {
            vm.$router.push({ name: 'login' })
          }
        }
      })
        .catch(error => console.log(error))
    }
  },
  created () {
    let vm = (this as any)
    vm.$stact.dispatch('setVers', 'CYJF-W-1.0.1')
    vm.$stact.dispatch('SetAgent', '2800001')
    vm.version = vm.$stact.state.version
    vm.agentNo = vm.$stact.state.agentNo
    let shurl: string = ''
    if (vm.$stact.state.token.length !== 0) {
      vm.phone = JSON.parse(vm.$stact.state.token)[0].phone
      shurl = 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/cyjf/cyjf.html#/registered?invite=' + vm.phone
    } else {
      shurl = 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/cyjf/cyjf.html#/registered'
    }
  },
  mounted () {
    if (localStorage.getItem('bgcolor')) {
      let colorll = localStorage.getItem('bgcolor')
      if (colorll === '#38a3f7') {
        window.document.documentElement.setAttribute('data-theme', 'lanse')
      }
      if (colorll === '#221814') {
        window.document.documentElement.setAttribute('data-theme', 'anjin')
      }
      if (colorll === '#f08519') {
        window.document.documentElement.setAttribute('data-theme', 'orange')
      }
      if (colorll === '#f1b900') {
        window.document.documentElement.setAttribute('data-theme', 'huangse')
      }
    } else {
      window.document.documentElement.setAttribute('data-theme', '')
    }
  },
  methods: {
    goTop () {
      if (this.$route.name === 'registered') {
        this.$router.push({ name: 'login' })
        return
      }
      if (this.$route.query.title === '通道绑卡' && this.$route.name === 'ifarme') {
        this.$router.go(-2)
        return
      }
      if (this.$route.query.title === '快捷交易' && this.$route.name === 'ifarme') {
        this.$router.go(-2)
        return
      }
      if (this.$route.name === 'intermediaryagency') {
        this.$router.push({ name: 'home' })
        return
      }
      if (this.$route.name === 'checkplan') {
        this.$router.push({ name: 'intermediaryagency' })
        return
      }
      if (this.$route.query.title === '操作手册' && this.$route.name === 'ifarme') {
        this.$router.push({ name: 'my' })
        return
      }
      if (this.$route.name === 'emptyrepayment') {
        this.$router.push({ name: 'home' })
        return
      }
      if (this.$route.name === 'shoparea') {
        this.$router.push({ name: 'home' })
        return
      }
      if (this.$route.name === 'ordersure' && this.$route.query.selecttype) {
        this.$router.go(-2)
        return
      }
      this.$router.go(-1)
    }
  }
})
</script>
<style lang="scss">
</style>
