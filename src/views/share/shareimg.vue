<template>
  <div class='hundred'>
    <div class='vipImga'>
      <swiper :options="swiperOption">
        <swiper-slide v-for='(item, index) in img' :key='item.id'>
          <div class='swiperPos'>
            <img :src='downloadUrl[index]' class='shareBan'/>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <div class='textCenter'>温馨提示：请截图保存，保存后可以在手机相册中找到分享图</div>
    <div style='height: 0.5rem'></div>
    <div id='qrcode' style='display:none'></div>
  </div>
</template>

<script>
import QRcode from 'qrcodejs2'

export default {
  data () {
    return {
      swiperOption: {
        spaceBetween: 30,
        effect: 'fade',
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      downloadUrl: [],
      img: [],
      realIndex: 0,
      phone: '',
      version: '',
      imgSrc: ''
    }
  },
  components: {
  },
  watch: {
  },
  beforeCreate () {
  },
  created () {
    this.phone = JSON.parse(this.$stact.state.token)[0].phone
    this.version = this.$stact.state.version
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      let vm = this
      let parmas = {
        '0': '0700',
        '3': '790017',
        '59': vm.version
      }
      let url = vm.$utils.queryParams(vm.$mdata.mdGet(parmas))
      vm.$http.get(`request.app${url}`)
        .then(res => {
          if (res.data[39] === '00') {
            this.img = JSON.parse(res.data[57])
            this.img.map((x, i) => {
              x.image = x.image.replace('chuangyijinfu.llyzf.cn:5555', 'chuangyijinfu.llyzf.cn:7080')
              console.log(x.image)
            })
            this.qrcode()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    qrcode () {
      let vm = this
      let qrcode = new QRcode('qrcode', {
        width: 200,
        height: 200, // 高度
        text: 'http://chuangyijinfu.llyzf.cn/lly-posp-proxy/cyjf/cyjf.html#/registered?invite=' + vm.phone
      })
      vm.img.map(async (x, i) => {
        await vm.changeimg(i)
      })
    },
    changeimg (i) {
      let vm = this
      console.log(document.querySelector('#qrcode canvas').toDataURL('image/png'))
      let imgsrcArray = [
        vm.img[i].image,
        document.querySelector('#qrcode canvas').toDataURL('image/png')
      ]
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.width = 740
      canvas.height = 1250
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, 740, 1250)
      let imglen = imgsrcArray.length
      function f (n) {
        if (n < imglen) {
          let img = new Image()
          img.setAttribute('crossOrigin', 'anonymous')
          img.onload = function () {
            if (n === 0) {
              ctx.drawImage(img, 0, 0, 740, 1250)
            } else {
              ctx.drawImage(img, 520, 1040, 205, 205)
            }
            f(n + 1)
          }
          img.src = imgsrcArray[n]
        } else {
          vm.downloadUrl.push('')
          vm.downloadUrl[i] = canvas.toDataURL('image/jpeg')
        }
      }
      f(0)
    }
  }
}
</script>
