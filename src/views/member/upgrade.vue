<template>
  <div>
    <div class='vipImg'>
      <swiper :options="swiperOption" ref="mySwper">
        <swiper-slide v-for='item in level' :key='item.level'>
          <img :src='item.lv' class='VIP'/>
        </swiper-slide>
      </swiper>
    </div>
    <div>
      <p class='interests'>会员权益</p>
      <img :src='img' class='putong'/>
      <!--<div class='allFlex homeList'>
        <div class='textCenter'>
          <img src='../../assets/member/rebate.png'  class='imageOne' />
          <p class='gary'>推荐返佣<br/>最高30%</p>
        </div>
        <div class='textCenter'>
          <img src='../../assets/member/swipe.png'  class='imageOne' />
          <p class='gary'>刷卡费率<br/>低至0.41</p>
        </div>
        <div class='textCenter'>
          <img src='../../assets/member/rate.png'  class='imageOne' />
          <p class='gary'>代还费率<br/>低至0.47</p>
        </div>
        <div class='textCenter'>
          <img src='../../assets/member/reward.png'  class='imageOne' />
          <p class='gary'>开通空卡<br/>使用权限</p>
        </div>
        <div class='textCenter'>
          <img src='../../assets/member/study.png'  class='imageOne' />
          <p class='gary'>开通财商<br/>学习权限</p>
        </div>
        <div class='textCenter'>
          <img src='../../assets/member/divided.png'  class='imageOne' />
          <p class='gary'>极差分润<br/>高至0.57</p>
        </div>
      </div> -->
    </div>
    <div class='vipContent' v-if='cusTrue || upTrue'>
      <div>距离升级到<span class='blueColor'>{{nameLevel[realIndex+1]}}</span></div>
      <div v-if='countvip != 0'>还需直推<span class='blueColor'>{{countvip}}</span>个{{nameLevel[2]}}</div>
      <div v-if='count != 0'>团队内还需<span class='blueColor'>{{count}}</span>个实名会员用户</div>
      <div v-if='teamVipCount != 0'>团队内还需<span class='blueColor'>{{teamVipCount}}</span>个{{nameLevel[2]}}</div>
    </div>
    <div class='loginTo'>
      <div class='blue' v-if="upTrue && moneyShow !=0" @click='upup()'>
        立即升级
      </div>
      <router-link class='blue' :to="{name: 'customer'}" tag='div' v-if="cusTrue">
          联系客服
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 15,
        centeredSlides: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        on: {
          transitionEnd: () => {
            let swiper = this.$refs.mySwper.swiper
            if (swiper) {
              this.realIndex = swiper.realIndex
              console.log(this.$refs.mySwper.swiper.realIndex)
              this.img = this.level[this.realIndex].putong
              this.countvip = this.level[this.realIndex].countvip
              this.count = this.level[this.realIndex].count
              this.teamVipCount = this.level[this.realIndex].teamVipCount
              this.moneyShow = this.levelMoney['lv' + (Number(this.realIndex) + 1)]
              // this.realIndex === 1 && Number(this.vip) === 1 ? this.upTrue = true : this.upTrue = false
              // this.$refs.mySwper.swiper.realIndex + 1 > 2 && Number(this.vip) < this.$refs.mySwper.swiper.realIndex + 1 ? this.cusTrue = true : this.cusTrue = false
              Number(this.moneyShow) !== 0 && Number(this.vip) < this.$refs.mySwper.swiper.realIndex + 1 ? this.upTrue = true : this.upTrue = false
              Number(this.moneyShow) === 0 && Number(this.vip) < this.$refs.mySwper.swiper.realIndex + 1 ? this.cusTrue = true : this.cusTrue = false
              console.log(Number(this.moneyShow) === 0)
            }
          }
        }
      },
      level: {},
      version: '',
      agentNo: '',
      merchantNo: '',
      vip: 0,
      img: '',
      countvip: 0,
      teamVipCount: 0,
      count: 0,
      realIndex: 0,
      upTrue: true,
      cusTrue: true,
      levelMoney: {},
      nameLevel: {},
      moneyShow: 0
    }
  },
  components: {
  },
  beforeCreate () {
  },
  created () {
    this.version = this.$stact.state.version
    this.agentNo = this.$stact.state.agentNo
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
  },
  mounted () {
    this.realIndex = this.$refs.mySwper.swiper.realIndex
    new Promise(async (resolve, reject) => { // 判断是否登录 用登录后的token里merchantNo做唯一标
      await this.message()
      resolve()
    }).then(r => {
    })
      .catch(error => console.log(error))
  },
  methods: {
    up () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790008',
        '42': vm.merchantNo,
        '43': JSON.parse(this.$stact.state.token)[0].level,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.level = JSON.parse(res.data[10])
            vm.img = vm.level[vm.$refs.mySwper.swiper.realIndex].putong
            vm.countvip = vm.level[vm.$refs.mySwper.swiper.realIndex].countvip
            vm.count = vm.level[vm.$refs.mySwper.swiper.realIndex].count
            vm.teamVipCount = vm.level[vm.$refs.mySwper.swiper.realIndex].teamVipCount
            vm.$refs.mySwper.swiper.realIndex === 1 && Number(vm.vip) === 1 ? vm.upTrue = true : vm.upTrue = false
            vm.$refs.mySwper.swiper.realIndex + 1 > 2 && Number(vm.vip) < vm.$refs.mySwper.swiper.realIndex + 1 ? vm.cusTrue = true : vm.cusTrue = false
            vm.moneyShow = vm.levelMoney['lv' + (Number(vm.$refs.mySwper.swiper.realIndex) + 1)]
            vm.nameLevel = vm.$stact.state.level
            console.log(Number(this.moneyShow) === 0)
            Number(this.moneyShow) !== 0 && Number(vm.vip) < vm.$refs.mySwper.swiper.realIndex + 1 ? vm.upTrue = true : vm.upTrue = false
            Number(this.moneyShow) === 0 && Number(vm.vip) < vm.$refs.mySwper.swiper.realIndex + 1 ? vm.cusTrue = true : vm.cusTrue = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    upup () {
      let vm = this
      console.log('lv' + vm.$refs.mySwper.swiper.realIndex + 1)
      vm.$router.push({ name: 'pay', query: { money: vm.levelMoney['lv' + (Number(vm.$refs.mySwper.swiper.realIndex) + 1)], level: vm.$refs.mySwper.swiper.realIndex + 1 } })
    },
    message () {
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
            vm.$stact.dispatch('SetToken', res.data[57]) // 存token
            vm.levelMoney = JSON.parse(res.data[13])
            vm.level = vm.$stact.state.level[JSON.parse(vm.$stact.state.token)[0].level]
            vm.$stact.dispatch('SetMoall', JSON.parse(res.data[13]))
            this.vip = JSON.parse(this.$stact.state.token)[0].level
            this.swiperOption.initialSlide = this.vip - 1
            this.up()
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
