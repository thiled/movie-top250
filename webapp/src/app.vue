<template>
  <!-- data-app必须设置，否则v-dialog无效 -->
  <div class="v-application" data-app="true">
    <!-- filter -->
    <div class="filters">
      <v-btn
        v-for="(item, key) in unSelectedFilter"
        :key="key"
        @click="onFilterClick(item.name, key)"
        >{{ item.name }}</v-btn
      >
    </div>
    <div class="filter-result" v-if="showReset">
      <v-btn @click="onReset" depressed color="primary" small class="reset-btn"
        >重置</v-btn
      >
      <template v-for="(item, key) in selectedFilter">
        <SelectedFilterLabel
          :key="key"
          :attr="key"
          :filter="item"
          @close="removeFilter"
        />
      </template>
      <span class="filter-result__count grey--text"
        >匹配到{{ this.renderList.length }}个结果</span
      >
    </div>
    <FilterDialog
      v-bind="filterDialog"
      v-if="filterDialog.visible"
      :visible.sync="filterDialog.visible"
      @select="onFilterSelect"
    />
    <!-- list -->
    <div class="list">
      <MovieCard
        v-for="item in renderList"
        v-bind="item"
        :key="item.title"
      ></MovieCard>
    </div>
  </div>
</template>
<script>
import MovieCard from './components/MovieCard.vue';
import FilterDialog from './components/FilterDialog.vue';
import SelectedFilterLabel from './components/SelectedFilterLabel.vue';
import progressiveRender from './utils/progressiveRender.js';
import { PlayTypes } from './enums.js';

let filterDataDict = {};
const pageSize = 100;

export default {
  name: 'app',
  components: {
    MovieCard,
    FilterDialog,
    SelectedFilterLabel,
  },
  computed: {
    showReset() {
      for (let key in this.filter) {
        if (this.filter[key].value) {
          return true;
        }
      }
    },
    selectedFilter() {
      let filter = {};
      for (let key in this.filter) {
        if (this.filter[key].value) {
          filter[key] = { ...this.filter[key] };
          if (key == 'playType') {
            filter[key].value = PlayTypes[this.filter[key].value];
          }
        }
      }
      return filter;
    },
    unSelectedFilter() {
      let filter = {};
      for (let key in this.filter) {
        if (!this.filter[key].value) {
          filter[key] = { ...this.filter[key] };
        }
      }
      return filter;
    },
  },
  watch: {
    filter: {
      handler() {
        let targetList = this.movieDB.filter((item) => {
          for (let key in this.filter) {
            let value = this.filter[key].value;
            if (item[key] instanceof Array) {
              if (value && item[key].indexOf(value) == -1) {
                return false;
              }
            } else if (value && item[key] != value) {
              return false;
            }
          }
          return true;
        });
        this.renderList = [];
        progressiveRender(targetList, this.renderList, pageSize);
        this.fillFilters();
      },
      deep: true,
    },
  },
  data() {
    return {
      movieDB: [],
      filterDialog: {
        visible: false,
        title: '',
        filterData: null,
        orderByCount: true,
      },
      renderList: [],
      filter: null,
      currentFilterAttr: '',
    };
  },
  async created() {
    this.movieDB = await fetch('./data/movieTop250.json').then((response) => {
      return response.json();
    });
    this.initFilter();
    this.fillFilters();
  },
  methods: {
    fillFilters() {
      for (let key in this.filter) {
        filterDataDict[key] = {};
      }
      this.movieDB.forEach((item) => {
        for (let key in this.filter) {
          this.fillFilter(item, key);
        }
      });
    },
    initFilter() {
      this.filter = {
        year: {
          value: 0,
          name: '年份',
        },
        directors: {
          value: '',
          name: '导演',
        },
        writers: {
          value: '',
          name: '编剧',
        },
        areas: {
          value: '',
          name: '地区',
        },
        languages: {
          value: '',
          name: '语言',
        },
        genres: {
          value: '',
          name: '类型',
        },
        playType: {
          value: 0,
          name: '在线播放',
        },
      };
    },
    /**
     * 填充过滤器
     */
    fillFilter(item, attr) {
      // item先与filter进行比较
      for (let attr in this.filter) {
        if (item[attr] instanceof Array) {
          if (
            this.filter[attr].value &&
            item[attr].indexOf(this.filter[attr].value) == -1
          ) {
            return;
          }
        } else {
          if (
            this.filter[attr].value &&
            item[attr] != this.filter[attr].value
          ) {
            return;
          }
        }
      }
      // 符合filter条件的进行填充
      let filters = filterDataDict[attr];
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
    onFilterClick(title, filterAttr) {
      this.filterDialog.visible = true;
      this.filterDialog.title = title;
      this.filterDialog.filterData = filterDataDict[filterAttr];
      this.filterDialog.orderByCount = filterAttr == 'year' ? false : true;
      this.currentFilterAttr = filterAttr;
    },
    onFilterSelect(value) {
      this.filter[this.currentFilterAttr].value = value;
    },
    onReset() {
      for (let key in this.filter) {
        this.filter[key].value = null;
      }
    },
    removeFilter(attr) {
      this.filter[attr].value = null;
    },
  },
};
</script>
<style scoped>
::v-deep {
  .v-btn__content {
    transform: translateZ(0);
  }
}
.v-application {
  padding: 20px;
  flex-direction: column;

  .filters {
    margin-bottom: 10px;

    .v-btn {
      margin: 0 10px 10px 0;
    }
  }

  .filter-result {
    font-size: 12px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .reset-btn {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    &__count {
      margin-bottom: 10px;
      line-height: 28px;
    }
  }

  .list {
    display: grid;
    padding-top: 10px;
    grid-gap: 20px 20px;
    grid-template-columns: repeat(auto-fill, 146px);
  }
}
</style>
