<template>
  <div id="roleForUser" class="app-container calendar-list-container">
    <el-row style="margin-bottom:5px" :gutter="20">
      <el-col :span="6">
        <el-button :size="size" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">角色列表</div>
          <el-table ref="table" :data="tableData" border fit highlight-current-row stripe :size="size" style="width: 100%" element-loading-text="给我一点时间" :header-cell-class-name="tableRowClassName">
            <el-table-column width="50">
              <template slot-scope="scope">
                <el-radio v-model="radioVal" :label="scope.$index" @change.native="getCurrentRow(scope.row)">{{ "" }}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" prop="RoleName" />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="primary">
                    更多菜单<i class="el-icon-arrow-down el-icon--right" />
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
          </el-table>
          <div style="text-align: center; margin-top: 15px">
            <el-pagination :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: center" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">未授权用户</div>
          <div style="text-align:center">
            <el-table ref="roleNotAuthorized" :data="roleNotAuthorized" border fit highlight-current-row stripe :size="size" style="width: 100%" element-loading-text="给我一点时间" :header-cell-class-name="tableRowClassName">
              <el-table-column type="selection" />
              <el-table-column label="账号" prop="UserAccount" />
              <el-table-column label="姓名" prop="UserName" />
            </el-table>
            <el-button :size="size" type="primary" @click="submitRoleForMenu(0)">授权</el-button>
          </div>
          <div style="text-align: center; margin-top: 15px">
            <el-pagination :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: center" @size-change="handleSizeChangeAuthorized" @current-change="handleCurrentChangeAuthorized" />
          </div>
        </el-card>

      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header">已授权用户</div>
          <div style="text-align:center">
            <el-table ref="roleAuthorized" :data="roleAuthorized" border fit highlight-current-row stripe :size="size" style="width: 100%" element-loading-text="给我一点时间" :header-cell-class-name="tableRowClassName">
              <el-table-column type="selection" />
              <el-table-column label="账号" prop="UserAccount" />
              <el-table-column label="姓名" prop="UserName" />
            </el-table>
            <el-button :size="size" type="primary" @click="submitRoleForMenu(1)">解除授权</el-button>
          </div>
          <div style="text-align: center; margin-top: 15px">
            <el-pagination :current-page="1" :page-sizes="[10, 20, 30, 50]" :page-size="1" layout="total, sizes, prev, pager, next, jumper" :total="total" style="text-align: center" @size-change="handleSizeChangeNotAuthorized" @current-change="handleCurrentChangeNotAuthorized" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { getRoles, cancelRoleForUser, roleForUser } from '@/api/role'
import { getRoleAuthorized, getRoleNotAuthorized } from '@/api/user'
export default {
  name: 'RoleForUser',
  components: {},
  filters: {},
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      listQueryRole: {
        page: 1,
        limit: 10
      },
      listQueryNotRole: {
        page: 1,
        limit: 10
      },
      tableData: [],
      rules: {
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      total: 0,
      roleTotal: 0,
      notRoleTotal: 0,
      title: '新增',
      menuTree: [],
      radioVal: '',
      roleForUser: {
        RoleID: '',
        UserID: []
      },
      roleNotAuthorized: [],
      roleAuthorized: []
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
    resetRoleForUser() {
      this.roleForUser = {
        RoleID: '',
        UserID: []
      }
    },
    getRoleUser() {
      getRoleAuthorized(this.listQueryRole).then((res) => {
        this.roleAuthorized = res.data.items
        this.roleTotal = res.data.total
      })
    },
    getNotRoleUser() {
      getRoleNotAuthorized(this.listQueryNotRole).then((res) => {
        this.roleNotAuthorized = res.data.items
        this.notRoleTotal = res.data.total
      })
    },
    getCurrentRow(row) {
      this.resetRoleForUser()
      this.listQueryRole.roleId = row.ID
      this.listQueryNotRole.roleId = row.ID
      this.roleForUser.RoleID = row.ID
      this.getRoleUser()
      this.getNotRoleUser()
    },
    getList() {
      this.resetRoleForUser()
      getRoles(this.listQuery).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
      })
    },
    submitRoleForMenu(flag) {
      if (this.roleForUser.RoleID) {
        console.log(this.roleForMenuForm)
        console.log(this.$refs.roleAuthorized.selection)
        console.log(this.$refs.roleNotAuthorized.selection)
        if (flag) {
          // 解除授权逻辑
          if (this.$refs.roleAuthorized.selection) {
            this.roleForUser.UserID = this.$refs.roleAuthorized.selection.map(
              (item) => {
                return item.ID
              }
            )
            // 解除授权请求
            cancelRoleForUser(this.roleForUser)
              .then()
              .then(() => {
                this.getRoleUser()
                this.getNotRoleUser()
              })
          } else {
            this.$alert('请选择已授权用户！', '错误', {
              confirmButtonText: '确定'
            })
          }
        } else {
          // 授权逻辑
          if (this.$refs.roleNotAuthorized.selection) {
            this.roleForUser.UserID =
              this.$refs.roleNotAuthorized.selection.map((item) => {
                return item.ID
              })
            console.log(this.roleForUser)
            roleForUser(this.roleForUser).then((res) => {
              this.getRoleUser()
              this.getNotRoleUser()
            })
          } else {
            this.$alert('请选择未授权用户！', '错误', {
              confirmButtonText: '确定'
            })
          }
        }
      } else {
        this.$alert('请选择角色', '错误', {
          confirmButtonText: '确定'
        })
      }
    },
    submitNotRoleForMenu() {},
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChangeAuthorized(val) {
      this.listQueryRole.limit = val
      this.getRoleUser()
    },
    handleCurrentChangeAuthorized(val) {
      this.listQueryRole.page = val
      this.getRoleUser()
    },
    handleSizeChangeNotAuthorized(val) {
      this.listQueryNotRole.limit = val
      this.getNotRoleUser()
    },
    handleCurrentChangeNotAuthorized(val) {
      this.listQueryNotRole.page = val
      this.getNotRoleUser()
    },
    handelDetail(row) {
      this.title = '查看详情'
      this.dialogState = true
      this.dialogDisable = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = Object.assign({}, row)
      })
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
