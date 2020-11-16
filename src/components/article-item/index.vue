<template>
  <van-cell class="article-item">
    <div
      slot="title"
      class="title van-multi-ellipsis--l3">{{ article.title }}</div>
    <div slot="label">
      <div
        class="cover-wrap"
        v-if="article.cover.type === 3"
      >
        <van-image
          fit="cover"
          v-for="(img, index) in article.cover.images"
          :key="index"
          :src="img"
        />
      </div>
      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}</span>
        <span>{{ article.pubdate | reletiveTime }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      class="right-img"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less">
.article-item{
  .title{
    font-size: 16px;
    color: #3a3a3a;
  }
  .label-wrap{
    font-size: 11px;
    color: #b4b4b4;
    span{
      margin-right: 12px;
    }
  }
  .cover-wrap{
    display: flex;
    .van-image__img{
      width: 116px;
      height: 73px;
      flex: 1;
      padding-right: 4px;
      box-sizing: border-box;
      margin: 15px 0;
    }
  }
  .van-cell__value{
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
    .van-image__img{
      width: 116px;
      height: 73px;
    }
  }
}
</style>
