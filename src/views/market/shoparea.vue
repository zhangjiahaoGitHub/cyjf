<template>
  <div class="shoparea-shoparea">
    <div class="banner">
      <img src="../../assets/market/martop.png" alt="">
    </div>
    <ul class='allFlex peopleFlex' style='border-bottom: 1px solid #f5f5f5'>
      <li @click="()=>{this.$router.push({name:'myshopdetail', query: {title:'我的订单'}})}">
        <span>
          我的订单
        </span>
      </li>
      <li @click="notYetOpen">
        <span>
          收货地址
        </span>
      </li>
    </ul>
    <div class="home-list" v-if="allgoodsList.length != 0" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
        <div class="list-li" @click="toproductdetails(item)" v-for="(item, i) in allgoodsList" :key="i">
          <div class="left-img">
            <img :src="item.url" alt="">
          </div>
          <div class="right-box">
            <div class="title">{{item.name}}</div>
            <p class="cont">{{item.descript}}</p>
            <div class="price-box">
              <span v-if="item.point!=0" class="price">&yen;{{item.price}}元 + {{item.point}}积分</span>
              <span v-if="item.point==0" class="price">&yen;{{item.price}}元</span>
              <span class="many">已购人数{{item.salesVolume}}人</span>
            </div>
          </div>
        </div>
      <p class="bottom-more" v-if="loading">加载中...</p>
      <p class="bottom-more" v-if="noMore && !loading">没有更多了</p>
    </div>
    <div class="no-box" v-if="noneimg">
      <div class="no-img">
        <img src="../../assets/market/noshop.png" alt="">
      </div>
      <p class="no-font">暂无商品记录</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      merchantNo: '',
      activitylist: [],
      shade: false,
      titleImage: '',
      goodsList: [], // 商品列表
      allgoodsList: [],
      yema: 0,
      yeshu: 5,
      loading: false,
      noneimg: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo // 获取商户号
    this.getgoodsList()
  },
  computed: {
    noMore () {
      return this.goodsList.length < this.yeshu
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  methods: {
    openshade () {
      this.shade = true
    },
    closeshade () {
      this.shade = false
    },
    toproductdetails (item) {
      this.$router.push({ name: 'productdetails', query: { id: item.id } })
    },
    notYetOpen () {
      this.$router.push({ name: 'shopAddress', query: { my: true } })
    },
    getgoodsList () {
      let vm = this
      vm.goodsList = []
      let parmas = {
        '0': '0700',
        '3': '680004',
        '5': vm.yema, // 页码
        '6': vm.yeshu,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.yema += 1
            vm.goodsList = JSON.parse(res.data[40])
            for (var i in vm.goodsList) {
              vm.allgoodsList.push(vm.goodsList[i])
            }
            if (vm.allgoodsList.length === 0) {
              vm.noneimg = true
            } else {
              vm.noneimg = false
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    load () {
      this.loading = true
      setTimeout(() => {
        this.getgoodsList()
        this.loading = false
      }, 1000)
    }
  }
}
</script>
