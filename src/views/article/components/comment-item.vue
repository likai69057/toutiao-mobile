<template>
  <van-cell
    class="comment-item"
  >
    <van-image
      slot="icon"
      width="35"
      height="35"
      round
      fixed
      :src='comment.aut_photo'
    />
    <div slot="title">
      <div>{{ comment.aut_name }}</div>
      <div>{{ comment.content }}</div>
    </div>
  </van-cell>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
