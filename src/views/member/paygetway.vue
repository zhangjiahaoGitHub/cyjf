<template>
  <!-- <div v-html = "paygetway" class="zfbbox">{{paygetway}}</div> -->
  <div></div>
</template>
<script>
export default {
  name: 'paygetway',
  data () {
    return {
      paygetway: ''
    }
  },
  mounted () {
    let form = this.$route.query.htmldata
    this.paygetway = form
    document.querySelector('body').innerHTML = form
    const div = document.createElement('div') // 创建div
    div.innerHTML = form // 将返回的form 放入div
    document.body.appendChild(div)
    document.forms[0].submit()
  }
}
</script>
