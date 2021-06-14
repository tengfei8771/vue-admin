<template>
  <div id="roleForUser" class="app-container calendar-list-container">
    <el-row style="margin-bottom:5px" :gutter="20">
      <el-col :span="6">
        <el-button :size="size" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        <el-button :size="size" type="primary" icon="el-icon-search" @click="handleCreate">新增</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
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
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">授权菜单</div>
          <transferTableComponent />
          <div style="text-align:center">
            <el-button :size="size" type="primary" @click="submitRoleForMenu">授权</el-button>
          </div>

        </el-card>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogState" :title="title" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="RoleName">
              <el-input v-model="form.RoleName" :size="size" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align:center">
          <el-button v-if="!dialogDisable" type="primary" @click="submit">提交</el-button>
          <el-button type="danger" @click="dialogState=false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import {
  getRoles,
  deleteRole,
  updateRole,
  addRole,
  roleForMenu
} from '@/api/role'
import { getMenubyRole } from '@/api/menu'
import transferTableComponent from '@/views/frame_src/components/transferTableComponent.vue'
export default {
  name: 'RoleForUser',
  components: { transferTableComponent },
  filters: {},
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10
      },
      tableData: [],
      dialogState: false,
      dialogDisable: false,
      form: {
        RoleName: ''
      },
      rules: {
        RoleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      total: 0,
      title: '新增',
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'MenuName'
      },
      radioVal: '',
      roleForMenuForm: {
        RoleID: '',
        MenuID: []
      }
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
    resetRoleForMenuForm() {
      this.roleForMenuForm = {
        RoleID: '',
        MenuID: []
      }
    },
    resetForm() {
      this.form = {
        RoleName: ''
      }
    },
    getCurrentRow(row) {
      this.resetRoleForMenuForm()
      let temp = {
        roleId: row.ID
      }
      this.roleForMenuForm.RoleID = row.ID
      getMenubyRole(temp).then((res) => {
        // this.$refs.menuTree.setCheckedKeys(res.data.items.MenuID,true)
      })
    },
    getList() {
      this.resetRoleForMenuForm()
      getRoles(this.listQuery).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let temp = Object.assign({}, this.form)
          temp.CreateBy = this.$store.state.user.userinfo.ID
          console.log(temp)
          if (this.title === '新增') {
            addRole(temp).then((res) => {
              this.dialogState = false
              this.getList()
            })
          } else {
            updateRole(temp).then((res) => {
              this.dialogState = false
              this.getList()
            })
          }
        }
      })
    },
    submitRoleForMenu() {
      if (this.roleForMenuForm.RoleID) {
        console.log(this.roleForMenuForm)
        roleForMenu(this.roleForMenuForm)
      } else {
        this.$alert('请选择角色', '错误', {
          confirmButtonText: '确定'
        })
      }
    },
    handleCreate() {
      this.dialogDisable = false
      this.dialogState = true
      this.resetForm()
      this.title = '新增'
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    handelUpdate(row) {
      this.dialogState = true
      this.dialogDisable = false
      this.resetForm()
      this.title = '修改'
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = Object.assign({}, row)
        this.form.CreateBy = this.$store.state.user.ID
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handelDetail(row) {
      this.title = '查看详情'
      this.dialogState = true
      this.dialogDisable = true
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = Object.assign({}, row)
      })
    },
    handelDelete(row) {
      this.$confirm('确定要删除吗,此操作不可恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let temp = {
          ID: row.ID
        }
        deleteRole(temp).then((res) => {
          this.getList()
        })
      })
    },
    close() {
      this.dialogState = false
      this.dialogDisable = false
    }
  }
}
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
</style>
