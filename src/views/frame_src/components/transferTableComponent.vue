<template>
  <div id="transferTableComponent" class="app-container calendar-list-container">
    <!-- <el-row style="margin-bottom:5px" :gutter="20">
      <el-col :span="3">
        <el-input :size="size" placeholder="请输入" />
      </el-col>
      <el-col :span="6">
        <el-button :size="size" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-col>
    </el-row> -->
    <el-card class="box-card">
      <el-transfer
        v-model="value4"
        style="text-align: left; display: inline-block"
        filterable
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :titles="['Source', 'Target']"
        :button-texts="['到左边', '到右边']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}'
        }"
        :data="data"
        @change="handleChange"
      >
        <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
        <el-button slot="left-footer" class="transfer-footer" size="small">操作</el-button>
        <el-button slot="right-footer" class="transfer-footer" size="small">操作</el-button>
      </el-transfer>
      <!-- <el-table :data="tableData" border fit highlight-current-row stripe :size="size" style="width: 100%" element-loading-text="给我一点时间" :header-cell-class-name="tableRowClassName">
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary">
                更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" divided>
                <el-dropdown-item>
                  <el-button size="mini" type="primary" @click="handelUpdate(scope.row)">修改</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button size="mini" type="primary" @click="handelDetail(scope.row)">详情</el-button>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-button size="mini" type="danger" @click="handelDelete(scope.row)">删除</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table> -->
      <div style="text-align: center; margin-top: 15px">
        <el-pagination :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: center" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
export default {
  name: 'TransferTableComponent',
  components: {},
  filters: {},
  data() {
    const generateData = (_) => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        })
      }
      return data
    }
    return {
      data: generateData(),
      listQuery: {
        page: 1,
        limit: 10
      },
      tableData: [],
      dialogDisable: false,
      form: {},
      rules: {},
      total: 0,
      title: '新增'
    }
  },
  computed: {
    ...mapGetters(['size']),
    getRoleLevel() {
      if (this.store.state.user.roleLevel === 'admin') {
        return true
      } else {
        return true
      }
    },
    headers() {
      return {
        'X-Token': getToken()
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    this.getList()
  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'el-button--primary is-active'
      }
      return ''
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys)
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
