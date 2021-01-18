<template>
  <div class="productdetails-productdetails">
    <div class="title-img">
      <swiper  class='swiperImg' :options="swiperOptions" v-if='bannerList.length > 0'>
        <swiper-slide v-for='(item, index) in bannerList' :key='index'>
          <img :src="item"/>
        </swiper-slide>
      </swiper>
    </div>
    <div class="title">&yen;&nbsp;{{productdetails.price}}{{productdetails.point ? ` + ${productdetails.point}积分` : ''}}</div>
    <div class="title-name">{{productdetails.name}}</div>
    <div class="buypeople">
      <div class="give">购买人数{{productdetails.salesVolume}}人</div>
      <div class="people">运费{{productdetails.freight}}元</div>
    </div>
    <!-- <div class="product-palt">商品规格： {{productdetails.specification}}</div>-->
    <div class="product-palt">商品状态： {{status[productdetails.status]}}</div>
    <div class="product-con">
      <div class="product-palt">商品详情</div>
      <div class="product-palt">
        {{productdetails.descript}}
      </div>
    </div>
    <!-- 下方立即购买 -->
    <ul class="allFlex-buy homeBanner-buy">
      <router-link tag="li" :to="{name:'shoparea'}">
        <i class="el-icon-house appFont"></i>
        <p class="home">首页</p>
      </router-link>
      <router-link tag="li" :to="{name:'ordersure',query : {id: $route.query.id}}" class="promptly-buy">
        <p class="activity-buy">立即购买</p>
      </router-link>
    </ul>
    <div class='bottomLong' element-loading-background="rgba(0, 0, 0, 0.7)" v-loading.fullscreen.lock='fullscreenLoading'></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      version: '',
      merchantNo: '',
      noticelist: {},
      productdetails: [],
      type: '',
      bannerList: [],
      imgList: [],
      swiperOptions: {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
          delay: 3000
        }
      },
      status: {
        1: '上架',
        2: '下架',
        3: '删除'
      },
      fullscreenLoading: false
    }
  },
  created () {
    this.version = this.$stact.state.version
    this.merchantNo = JSON.parse(this.$stact.state.token)[0].merchantNo
    this.type = this.$route.query.type
  },
  mounted () {
    this.getnotice()
  },
  methods: {
    getnotice () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '680004',
        '5': '0',
        '6': '10',
        '7': vm.$route.query.id,
        '42': vm.merchantNo,
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.fullscreenLoading = true
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            vm.fullscreenLoading = false
            vm.productdetails = JSON.parse(res.data[40])[0]
            vm.bannerList = vm.productdetails.detailUrl.split(',')
          }
        })
        .catch(err => {
          vm.fullscreenLoading = false
          console.log(err)
        })
    }
  }
}
</script>
