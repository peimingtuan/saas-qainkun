<template>
  <div id="content">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted () {

  }
}
</script>
<style lang="less">
@import "./style/common.less";
#content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
