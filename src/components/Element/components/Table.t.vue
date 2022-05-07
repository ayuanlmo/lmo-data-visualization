<script>
export default {
  name: "lmo-table",
  props: {
    data: {
      type: Array
    },
    columns: {
      type: Array
    },
    showSelection: {
      type: Boolean,
      default: false
    },
    i18n: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    select(e) {
      this.$emit('select', e);
    },
    selectAll(e) {
      this.$emit('selectAll', e);
    },
    cellClick(row, column, cell, event) {
      this.$emit('click', row, column, cell, event);
    },
    rowDblclick(r, e) {
      this.$emit('rowDblclick', r, e);
    },
    rowClick(r, e, c) {
      this.$emit('rowClick', r, e, c);
    }
  }
};
</script>
<template>
  <el-table @row-click="rowClick" @select="select" @row-dblclick="rowDblclick	" @cell-click="cellClick"
            @select-all="selectAll"
            style="width: 100%;" stripe :data="data" v-bind="$attrs">
    <el-table-column v-if="showSelection" type="selection" width="55"/>
    <template v-for="(column, index) of columns">
      <el-table-column :sortable="column.sort || false" :width="column.width" :fixed="column.fixed" :prop="column.prop"
                       :label="i18n ? $t(column.label) : column.label"
                       v-if="column.render" :key="index">
        <template slot-scope="scope">
          <lmo-extend :render="column.render" :params="scope"/>
        </template>
      </el-table-column>
      <el-table-column :sortable="column.sort || false" :width="column.width" :fixed="column.fixed" :prop="column.prop"
                       :label="i18n ? $t(column.label) : column.label" v-else
                       :key="index"/>
    </template>
  </el-table>
</template>