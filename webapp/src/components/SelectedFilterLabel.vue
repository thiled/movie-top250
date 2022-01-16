<template>
  <div class="filter-label">
    <span class="label">{{ filter.name }}: {{ filter.value }}</span>
    <v-btn icon x-small @click="$emit('close', attr)">
      <span class="material-icons md-18">close</span>
    </v-btn>
  </div>
</template>
<script>
export default {
  name: 'SelectedFilterLabel',
  props: {
    filter: Object,
    attr: String,
  },
};
</script>
<style scoped>
.filter-label {
  display: flex;
  align-items: center;
  margin-right: 10px;
  flex-shrink: 0;
  margin-bottom: 10px;

  .label {
    background: #f5f5f5;
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    border-radius: 4px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.87);
  }
}
</style>
