<template>
  <div class="wrap" data-app="true">
    <div class="filters">
      <v-btn @click="onFilterClick('年份', yearFilter, false)">年份</v-btn>
      <v-btn @click="onFilterClick('在线播放', playTypeFilter)">在线播放</v-btn>
      <v-btn @click="onFilterClick('类型', genresFilter)">类型</v-btn>
      <v-btn @click="onFilterClick('地区', areaFilter)">地区</v-btn>
      <v-btn @click="onFilterClick('语言', langFilter)">语言</v-btn>
      <v-btn @click="onFilterClick('导演', directorFilter)">导演</v-btn>
      <v-btn @click="onFilterClick('编剧', writerFilter)">编剧</v-btn>
      <FilterDialog
        :title="filterDialog.title"
        v-if="filterDialog.visible"
        :visible.sync="filterDialog.visible"
        :filterData="filterDialog.data"
        :orderByCount="filterDialog.orderByCount"
      />
    </div>
    <div class="list">
      <MovieCard
        v-for="item in list"
        v-bind="item"
        :key="item.title"
      ></MovieCard>
    </div>
  </div>
</template>

<script>
import MovieCard from './components/MovieCard.vue';
import FilterDialog from './components/FilterDialog.vue';

const MovieDB = await fetch('./data/movieTop250.json').then((response) =>
  response.json()
);
export default {
  name: 'app',
  components: {
    MovieCard,
    FilterDialog,
  },
  computed: {
    list() {
      return MovieDB;
    },
  },
  data() {
    return {
      filterDialog: {
        visible: false,
        title: '',
        data: null,
        orderByCount: true,
      },
      filter: {
        year: 0,
        director: '',
        writer: '',
        genres: [],
        area: '',
        lang: '',
        playType: -1,
      },
      yearFilter: {},
      directorFilter: {},
      writerFilter: {},
      genresFilter: {},
      areaFilter: {},
      langFilter: {},
      playTypeFilter: {},
    };
  },

  mounted() {
    MovieDB.forEach((item) => {
      this.fillFilter(item, this.yearFilter, 'year');
      this.fillFilter(item, this.directorFilter, 'directors');
      this.fillFilter(item, this.writerFilter, 'writers');
      this.fillFilter(item, this.genresFilter, 'genres');
      this.fillFilter(item, this.areaFilter, 'areas');
      this.fillFilter(item, this.langFilter, 'languages');
      this.fillFilter(item, this.playTypeFilter, 'playType');
    });
  },
  methods: {
    filterMatch(item) {
      if (!this.filter.year && this.filter.year != item.year) {
        return false;
      }
      if (
        !this.filter.director &&
        item.directors.indexOf(this.filter.director) == -1
      ) {
        return false;
      }
      if (
        !this.filter.writer &&
        item.writers.indexOf(this.filter.writer) == -1
      ) {
        return false;
      }

      return true;
    },
    /**
     * 填充过滤器
     */
    fillFilter(item, filters, attr) {
      if (item[attr] instanceof Array) {
        item[attr].forEach((element) => {
          if (!filters[element]) {
            filters[element] = {
              count: 1,
              checked: false,
            };
          } else {
            filters[element].count++;
          }
        });
      } else {
        if (!filters[item[attr]]) {
          filters[item[attr]] = {
            count: 1,
            checked: false,
          };
        } else {
          filters[item[attr]].count++;
        }
      }
    },
    onFilterClick(title, filter, orderByCount = true) {
      this.filterDialog.visible = true;
      this.filterDialog.title = title;
      this.filterDialog.data = filter;
      this.filterDialog.orderByCount = orderByCount;
    },
  },
};
</script>

<style scoped lang="less">
.wrap {
  padding: 20px;
  .filters {
    margin-bottom: 20px;
  }
  .list {
    display: grid;
    grid-gap: 20px 20px;
    grid-template-columns: repeat(auto-fill, 146px);
  }
}
</style>
