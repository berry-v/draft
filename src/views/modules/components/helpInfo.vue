<template>
  <div class="help-info">
    <router-link :to="'AntVG6'"
                 style="margin-right: 15px;">AntVG6</router-link>
    <router-link :to="'gojs'">GoJS</router-link>
  </div>
</template>

<script>
export default {
  name: 'helpInfo',
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.help-info {
    height: 47px;
    line-height: 47px;
    border-bottom: 1px solid #e9e9e9;
    font-size: 18px;
    padding: 0 15px;
}
</style>
