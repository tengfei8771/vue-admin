<template>
  <div class="app-container calendar-list-container" id="menu">
    <el-row style="margin-bottom: 5px" :gutter="20">
      <el-col :span="3">
        <el-input size="mini" placeholder="请输入"></el-input>
      </el-col>
      <el-col :span="6">
        <el-button
          size="size"
          type="primary"
          @click="getList"
          icon="el-icon-search"
          >搜索</el-button
        >
        <el-button
          size=size
          type='primary'
          @click="handleCreate"
          icon="el-icon-edit"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        border
        fit
        highlight-current-row
        stripe
        size="mini"
        style="width: 100%"
        element-loading-text="给我一点时间"
        :header-cell-class-name="tableRowClassName"
      >
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handelUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handelDetail(scope.row)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handelDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: center; margin-top: 15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="text-align: center"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      :visible.sync="dialogState"
      :title="title"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="110px">
        <el-row style="text-align: center">
          <el-button type="primary" @click="submit" v-if="!dialogDisable"
            >提交</el-button
          >
          <el-button type="danger" @click="dialogState = false">取消</el-button>
        </el-row>
      </el-form></el-dialog
    >
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
export default {
  name: "menu1",
  components: {},
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
      },
      tableData: [],
      dialogState: false,
      dialogDisable: false,
      form: {},
      rules: {},
      total: 0,
      title: "新增",
    };
  },
  computed: {
    ...mapGetters(["size"]),
    getRoleLevel() {
      if (this.store.state.user.roleLevel === "admin") {
        return true;
      } else {
        return true;
      }
    },
    headers() {
      return {
        "X-Token": getToken(),
      };
    },
  },
  watch: {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "el-button--info is-active";
      }
      return "";
    },
    getList() {
      console.log(size);
    },
    submit() {},
    handleCreate() {
      this.dialogDisable = false;
      this.dialogState = true;
      this.title = "新增";
      this.$nextTick(() => {
        this.$refs.form.resetFields();
      });
    },
    handelUpdate(row) {
      this.dialogState = true;
      this.dialogDisable = false;
      this.title = "修改";
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.form = Object.assign({}, row);
        this.form.userId = this.$store.state.user.userId;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handelDetail(row) {
      this.title = "查看详情";
      this.dialogState = true;
      this.dialogDisable = true;
      this.$nextTick(() => {
        this.$refs.form.resetFields();
        this.form = Object.assign({}, row);
      });
    },
    handelDelete(row) {
      this.$confirm("确定要删除吗,此操作不可恢复?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {});
    },
    close() {
      this.dialogState = false;
      this.dialogDisable = false;
    },
  },
  created() {},
  mounted() {
    this.getList();
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>