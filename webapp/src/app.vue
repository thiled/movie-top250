<template>
  <div></div>
</template>

<script>
const MovieDB = await fetch('./data/movieTop250.json').then((response) =>
  response.json()
);
export default {
  name: 'app',
  data() {
    return {};
  },
  mounted() {
    console.log(MovieDB);
  },
};
</script>

<style>
</style>
