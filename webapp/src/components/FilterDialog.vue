<template>
  <v-dialog v-model="dialog" width="800" scrollable @click:outside="onClose">
    <v-card>
      <v-card-title primary-title class="title">
        <span>{{ title }}</span>
        <v-btn icon @click="onClose">
         <span class="material-icons">close</span>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn
          class="filter-btn"
          depressed
          v-for="item in renderList"
          :key="item.key"
          @click="onSelect(item.key)"
        >
          <span v-if="title == '在线播放'">{{
            getPlayTypeString(item.key)
          }}</span>
          <span v-else>{{ item.key }}</span>
          <span class="grey--text">({{ item.count }})</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { PlayTypes } from '../enums.js';
import progressiveRender from '../utils/progressiveRender.js';
const pageSize = 100;

export default {
  name: 'FilterDialog',
  props: {
    title: String,
    filterData: Object,
    orderByCount: Boolean,
  },
  data() {
    return {
      dialog: true,
      filterList: [],
      renderList: [],
    };
  },
  created() {
    // 对象转数组
    for (const key in this.filterData) {
      if (Object.hasOwnProperty.call(this.filterData, key)) {
        this.filterList.push({
          key,
          ...this.filterData[key],
        });
      }
    }
    if (this.orderByCount) {
      // 根据count排序
      this.filterList.sort((a, b) => {
        return b.count - a.count;
      });
    }
    progressiveRender(this.filterList, this.renderList, pageSize);
  },
  methods: {
    getPlayTypeString(key) {
      return PlayTypes[key];
    },
    onClose() {
      this.$emit('update:visible', false);
    },
    onSelect(value) {
      this.$emit('select', value);
      this.onClose();
    },
  },
};
</script>
<style scoped>
.title {
  justify-content: space-between;
}
.filter-btn {
  margin: 0 10px 10px 0;
}
</style>