<template>
  <div class="movie-card">
    <div class="pic-container">
      <img class="img" :src="picUrl" alt="" />
      <span class="top-no">No.{{ topNo }}</span>
    </div>
    <div class="info">
      <div class="top">
        <div class="title">{{ title }}</div>
        <div class="year">{{ year }}</div>
      </div>
      <div class="bottom">
        <div class="duration">{{ duration }}分钟</div>
        <div class="score">{{ score }}</div>
      </div>
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
    duration: Number,
    score: Number,
    topNo: Number,
  },
};
</script>

<style scoped lang='less'>
.movie-card {
  display: flex;
  width: 300px;
  box-sizing: border-box;
  padding: 5px;
  .pic-container {
    position: relative;
    font-size: 0;
    .img {
      width: 100px;
    }
    .top-no {
      color: #744900;
      padding: 2px;
      background: #fcdd7d;
      font-size: 12px;
      line-height: 1;
      display: flex;
      align-items: center;
      width: fit-content;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .info {
    font-size: 13px;
    margin-left: 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .score {
      color: #ff9500;
    }
    .year {
      color: #808080;
    }
    .duration {
      color: #808080;
    }
  }
}
</style>