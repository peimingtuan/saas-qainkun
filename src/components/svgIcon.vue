<template>
  <svg class="svg-icon" aria-hidden="true" :style="{width:size+'px',height:size+'px',color:color}">
    <use :xlink:href="'#icon-'+name" :fill="color"></use>
  </svg>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 32
    },
    color: {
      type: String,
      default: '#000000'
    }

  }
}
</script>

<style scoped>

</style>
