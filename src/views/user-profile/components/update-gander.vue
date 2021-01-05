<template>
  <div class="update-gander">
    <van-picker
      show-toolbar
      :default-index="defaltIndex"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @onchange="onGenderChange"
    />
  </div>
</template>

<script>
import { editUserProfile } from '../../../api/user'

export default {
  name: 'update-gander',
  data () {
    return {
      showPicker: false,
      columns: ['男', '女'],
      defaltIndex: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    onGenderChange (picker, value, index) {
      this.defaltIndex = index
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // 请求提交用户更新
      await editUserProfile({
        gender: this.defaltIndex
      })
      // 更新成功 -> 修改父组件的name -> 关闭弹出层
      this.$toast.success('保存成功')
      this.$emit('update-gender', this.defaltIndex)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
