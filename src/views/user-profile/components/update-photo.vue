<template>
  <div class="update-photo">
    <img class="image" :src=image alt="" ref="image">
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>

<script>
import { editUserPhoto } from '../../../api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'update-photo',
  props: {
    file: {
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例对象
    }
  },
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    // getCroppedCanvas()方法 获取裁切对象
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true
      })
      // 获取裁切的结果
      const file = await this.getCroppedCanvas()
      // 要求提交multipart/form-mata数据对象 不能直接提交普通数据对象{}
      const fd = new FormData()
      // 先拿到父组件的图片文件对象,再拿到通过getCroppedCanvas方法裁切的图片对象
      fd.append('photo', file)
      // 调用修改用户头像的接口
      await editUserPhoto(fd)

      this.$toast.success('保存成功')
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang="less">
.image{
  display: block;
  max-width: 100%;
}
.toolbar{
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: #000;
}
</style>
