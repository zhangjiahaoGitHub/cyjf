<template>
  <div class="box-">
      <div class="intermediarybox">
        <router-link tag="div" :to="{ name:'realname' }" class="imgbox">
            <img src="../../assets/realname.png" alt="">
        </router-link>
        <router-link tag="div" :to="{ name:'makeplan' }" class="imgbox">
            <img src="../../assets/makeplan.png" alt="">
        </router-link>
        <router-link tag="div" :to="{ name:'cardadmin', query: { type: '1' } }" class="imgbox">
            <img src="../../assets/management.png" alt="">
        </router-link>
        <router-link tag="div" :to="{ name:'checkplan' }" class="imgbox">
            <img src="../../assets/viewplan.png" alt="">
        </router-link>
      </div>
  </div>
</template>

<script>
export default {

}
</script>
