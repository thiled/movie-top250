<template>
  <div>
    <MovieCard v-for="item in list" v-bind="item" :key="item.title"></MovieCard>
  </div>
</template>

<script>
import MovieCard from './components/MovieCard.vue';
const MovieDB = await fetch('./data/movieTop250.json').then((response) =>
  response.json()
);
export default {
  name: 'app',
  components: {
    MovieCard,
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    console.log(MovieDB);
    this.list = [MovieDB[0]];
  },
};
</script>

<style>
</style>
