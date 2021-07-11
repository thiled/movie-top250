<template>
  <!-- data-app必须设置，否则v-dialog无效 -->
  <div class="v-application" data-app="true">
    <div class="filters">
      <v-btn
        v-for="(item, key) in filter"
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
          :label="item"
          :attr="key"
          @close="removeFilter"
        />
      </template>
      <span class="grey--text">匹配到{{ this.list.length }}个结果</span>
    </div>
    <div class="list">
      <MovieCard
        v-for="item in list"
        v-bind="item"
        :key="item.title"
      ></MovieCard>
    </div>
    <FilterDialog
      v-bind="filterDialog"
      v-if="filterDialog.visible"
      :visible.sync="filterDialog.visible"
      @select="onFilterSelect"
    />
  </div>
</template>
<script>
import MovieCard from './components/MovieCard.vue';
import FilterDialog from './components/FilterDialog.vue';
import SelectedFilterLabel from './components/SelectedFilterLabel.vue';
import { PlayTypes } from './enums.js';
const MovieDB = await fetch('./data/movieTop250.json').then((response) =>
  response.json()
);
let filterDataDict = {};
export default {
  name: 'app',
  components: {
    MovieCard,
    FilterDialog,
    SelectedFilterLabel,
  },
  computed: {
    list() {
      return MovieDB.filter((item) => {
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
    },
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
          filter[key] = this.filter[key].value;
          if (key == 'playType') {
            filter[key] = PlayTypes[this.filter[key].value];
          }
        }
      }
      return filter;
    },
  },
  data() {
    return {
      filterDialog: {
        visible: false,
        title: '',
        filterData: null,
        orderByCount: true,
      },
      filter: {
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
        genres: {
          value: '',
          name: '类型',
        },
        areas: {
          value: '',
          name: '地区',
        },
        languages: {
          value: '',
          name: '语言',
        },
        playType: {
          value: 0,
          name: '在线播放',
        },
      },
      currentFilterAttr: '',
    };
  },
  created() {
    for (let key in this.filter) {
      if (!filterDataDict[key]) {
        filterDataDict[key] = {};
      }
    }
    MovieDB.forEach((item) => {
      for (let key in this.filter) {
        this.fillFilter(item, key);
      }
    });
  },
  methods: {
    /**
     * 填充过滤器
     */
    fillFilter(item, attr) {
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
    margin-bottom: 10px;
    font-size: 12px;
    display: flex;
    align-items: center;
    .reset-btn {
      margin-right: 10px;
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