<template>
    <div class="hundred">
        <iframe class="iframeWH" :src="iframeShow" frameborder="0"></iframe>
    </div>
</template>
<script>
export default {
  data () {
    return {
      iframeShow: ''
    }
  },
  mounted () {
    this.iframeShow = this.$route.query.url
  }
}
</script>
