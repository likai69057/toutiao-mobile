<template>
  <div class="edit-name">
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />

    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { editUserProfile } from '../../../api/user'

export default {
  name: 'EditName',
  data () {
    return {
      localName: this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // 请求提交用户更新
      await editUserProfile({
        name: this.localName
      })
      // 更新成功 -> 修改父组件的name -> 关闭弹出层
      this.$toast.success('保存成功')
      this.$emit('update-name', this.localName)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.name-field-wrap{
  padding: 10px;
}
</style>
