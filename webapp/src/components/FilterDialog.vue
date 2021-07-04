<template>
  <v-dialog v-model="dialog" width="500" @click:outside="onClose">
    <v-card>
      <v-card-title primary-title> {{ title }} </v-card-title>
      <div v-for="item in filterList" :key="item.key">
        <span v-if="title == '在线播放'">{{
          getPlayTypeString(item.key)
        }}</span>
        <span v-else>{{ item.key }}</span>
        {{ item.count }}
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'FilterDialog',
  props: {
    title: String,
    filterData: Object,
    orderByCount:Boolean
  },
  data() {
    return {
      dialog: true,
      filterList: [],
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
  },
  methods: {
    getPlayTypeString(key) {
      if (key == 0) {
        return '无在线';
      } else if (key == 1) {
        return '免费播放';
      } else {
        return '需要会员';
      }
    },
    onClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style>
</style>