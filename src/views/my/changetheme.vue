<template>
  <div class='jyj-changetheme'>
    <div :class="borderflag == '1' ? 'color-box select' : 'color-box'" @click="choose('1')">
      <div class="color-font">
        <span class="wenzi">蓝色</span>
        <span>#38a3f7</span>
      </div>
      <div class="color-img">
        <img src="../../assets/label/lch.png" alt="">
      </div>
    </div>
    <div :class="borderflag == '2' ? 'color-box select' : 'color-box'" @click="choose('2')">
      <div class="color-font">
        <span class="wenzi">褐色</span>
        <span>#221814</span>
      </div>
      <div class="color-img">
        <img src="../../assets/label/hch.png" alt="">
      </div>
    </div>
    <div :class="borderflag == '3' ? 'color-box select' : 'color-box'" @click="choose('3')">
      <div class="color-font">
        <span class="wenzi">橙色</span>
        <span>#f08519</span>
      </div>
      <div class="color-img">
        <img src="../../assets/label/cch.png" alt="">
      </div>
    </div>
    <div :class="borderflag == '4' ? 'color-box select' : 'color-box'" @click="choose('4')">
      <div class="color-font">
        <span class="wenzi">黄色</span>
        <span>#f1b900</span>
      </div>
      <div class="color-img">
        <img src="../../assets/label/hhch.png" alt="">
      </div>
    </div>
    <div :class="borderflag == '5' ? 'color-box select' : 'color-box'" @click="choose('5')">
      <div class="color-font">
        <span class="wenzi">深蓝</span>
        <span>#1351E0</span>
      </div>
      <div class="color-img">
        <img src="../../assets/label/ch.png" alt="">
      </div>
    </div>
    <div class="btn-color" @click="select(borderflag)">保存并修改</div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      borderflag: ''
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    choose (type) {
      if (type === '1') { // 蓝色
        this.borderflag = '1'
      }
      if (type === '2') { // 褐色
        this.borderflag = '2'
      }
      if (type === '3') { // 橙色
        this.borderflag = '3'
      }
      if (type === '4') { // 黄色
        this.borderflag = '4'
      }
      if (type === '5') { // 宝蓝色
        this.borderflag = '5'
      }
    },
    select (type) {
      if (!type) {
        this.$message({
          message: '请选择主题',
          center: true,
          offset: 30,
          duration: 2500,
          type: 'success'
        })
        return
      }
      if (type === '1') { // 蓝色
        window.document.documentElement.setAttribute('data-theme', 'lanse')
        localStorage.setItem('bgcolor', '#38a3f7')
      }
      if (type === '2') { // 褐色
        window.document.documentElement.setAttribute('data-theme', 'anjin')
        localStorage.setItem('bgcolor', '#221814')
      }
      if (type === '3') { // 橙色
        window.document.documentElement.setAttribute('data-theme', 'orange')
        localStorage.setItem('bgcolor', '#f08519')
      }
      if (type === '4') { // 黄色
        window.document.documentElement.setAttribute('data-theme', 'huangse')
        localStorage.setItem('bgcolor', '#f1b900')
      }
      if (type === '5') { // 原始色
        window.document.documentElement.setAttribute('data-theme', '')
        localStorage.removeItem('bgcolor')
      }
      this.$router.go(-1)
    }
  }
}
</script>
