<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { editUserProfile } from '../../../api/user'
import dayjs from 'dayjs'

export default {
  name: 'update-birthday',
  data () {
    return {
      minDate: new Date(1800, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
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
      const date = dayjs(this.currentDate).format('YYY-MM-DD')

      await editUserProfile({
        birthday: date
      })
      // 更新成功 -> 修改父组件的name -> 关闭弹出层
      this.$toast.success('保存成功')
      this.$emit('update-birthday', date)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>

</style>
