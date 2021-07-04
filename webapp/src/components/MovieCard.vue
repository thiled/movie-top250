<template>
  <div class="movie-card" @click="goDouban">
    <img class="img" :src="picUrl" alt="" />
    <div class="title">
      {{ title.split(' ')[0] }}
    </div>
    <div class="bottom">
      <span class="top-no">No.{{ topNo }}</span>
      <span class="year">{{ year }}</span>
      <span class="score">{{ score }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    title: String,
    picUrl: String,
    year: Number,
    score: Number,
    topNo: Number,
    playType: Number,
    url: String,
  },
  methods: {
    goDouban() {
      window.open(this.url, '_blank');
    },
  },
};
</script>

<style scoped lang='less'>
.movie-card {
  display: flex;
  width: fit-content;
  box-sizing: border-box;
  flex-direction: column;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  font-size: 13px;
  cursor: pointer;
  .img {
    width: 126px;
    height: 171px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
  }
  .title {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 126px;
    margin-bottom: 2px;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    .top-no {
      color: #744900;
      padding: 2px;
      background: #fcdd7d;
      font-size: 12px;
      line-height: 1;
      display: inline-block;
      border-radius: 2px;
    }
    .year {
      color: #808080;
    }
    .score {
      color: #ff9500;
    }
  }
}
</style>