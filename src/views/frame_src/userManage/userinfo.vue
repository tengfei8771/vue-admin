<template>
  <div id="userinfo" class="app-container calendar-list-container">
    <el-row style="margin-bottom:5px" :gutter="20">
      <el-col :span="4">
        <el-input v-model="listQuery.Name" :size="size" placeholder="请输入用户姓名" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.UserAccount" :size="size" placeholder="请输入用户账号" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.UserPhone" :size="size" placeholder="请输入用户身份证号" />
      </el-col>
      <el-col :span="4">
        <el-input v-model="listQuery.OrgName" :size="size" placeholder="请输入用户组织机构名称" />
      </el-col>
      <el-col :span="6">
        <el-button :size="size" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        <el-button :size="size" type="primary" icon="el-icon-search" @click="handleCreate">新增</el-button>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table :data="tableData" border fit highlight-current-row stripe :size="size" style="width: 100%" element-loading-text="给我一点时间" :header-cell-class-name="tableRowClassName">
        <el-table-column label="用户姓名" prop="UserName" width="100" />
        <el-table-column label="账号" prop="UserAccount" width="100" />
        <el-table-column label="密码" prop="UserPassWord" />
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.UserSex|changeSex }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="UserPhone" />
        <el-table-column label="身份证号" prop="IdNumber" />
        <el-table-column label="所属单位" prop="OrgName" show-overflow-tooltip />
        <el-table-column label="用户权限" width="80">
          <template slot-scope="scope">
            {{ scope.row.UserRole|changeRole }}
          </template>
        </el-table-column>
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
    <el-dialog :visible.sync="dialogState" :title="title" :modal-append-to-body="false" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户姓名" prop="UserName">
              <el-input v-model="form.UserName" :size="size" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="登录账号" prop="UserAccount">
              <el-input v-model="form.UserAccount" :size="size" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录密码" prop="UserPassWord">
              <el-input v-model="form.UserPassWord" :size="size" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.UserSex" style="width:100%" :size="size">
                <el-option value="0" label="女" />
                <el-option value="1" label="男" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="form.UserPhone" :size="size" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户权限">
              <el-select v-model="form.UserRole" style="width:100%" :size="size">
                <el-option value="0" label="普通用户" />
                <el-option value="1" label="管理员" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号">
              <el-input v-model="form.IdNumber" :size="size" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户单位">
              <el-cascader v-model="form.OrgId" :size="size" :options="orgOptions" placeholder="请选择父级菜单" :props="parentSelectProp" :show-all-levels="false" style="width:100%" />
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
  getUserInfo,
  createUserInfo,
  updateUserInfo,
  deleteUserInfo
} from '@/api/user'
import { getOrgTree } from '@/api/org'
export default {
  name: 'Userinfo',
  components: {},
  filters: {
    changeRole(val) {
      if (val === '0') {
        return '管理员'
      } else {
        return '普通用户'
      }
    },
    changeSex(val) {
      if (val === 0) {
        return '男'
      } else {
        return '女'
      }
    }
  },
  data() {
    return {
      listQuery: {
        Name: '',
        UserAccount: '',
        UserPhone: '',
        IdNumber: '',
        OrgName: '',
        page: 1,
        limit: 10
      },
      tableData: [],
      dialogState: false,
      dialogDisable: false,
      form: {
        UserName: '',
        UserAccount: '',
        UserPassWord: '',
        UserSex: '',
        UserPhone: '',
        UserRole: '',
        IdNumber: ''
      },
      rules: {
        UserName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        UserAccount: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        UserPassWord: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少输入6个字符', trigger: 'blur' }
        ]
      },
      total: 0,
      title: '新增',
      orgOptions: [],
      parentSelectProp: {
        value: 'ID',
        label: 'OrgName',
        // lazy: true,
        checkStrictly: true,
        multiple: true,
        emitPath: false
        // lazyLoad(node, resolve) {
        //   let temp = {
        //     ParentMenuID: node.data.ID,
        //     page: 1,
        //     limit: 10000
        //   }
        //   getMenu(temp).then((res) => {
        //     if (res.data.items != null) {
        //       resolve(res.data.items)
        //     } else {
        //       resolve([])
        //     }
        //   })
        // }
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
    this.getOrgOptions()
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
    getList() {
      getUserInfo(this.listQuery).then((res) => {
        this.tableData = res.data.items
        this.total = res.data.total
      })
    },
    resetForm() {
      this.form = {
        UserName: '',
        UserAccount: '',
        UserPassWord: '',
        UserSex: '',
        UserPhone: '',
        UserRole: '',
        IdNumber: ''
      }
    },
    getOrgOptions() {
      getOrgTree().then((res) => {
        this.orgOptions = res.data.items
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        this.form.CreateBy = this.$store.state.user.userinfo.ID
        if (valid) {
          if (this.title === '新增') {
            this.form.CreateBy = this.$store.state.user.userinfo.ID
            createUserInfo(this.form).then((res) => {
              this.dialogState = false
              this.getList()
            })
          } else {
            updateUserInfo(this.form).then((res) => {
              this.dialogState = false
              this.getList()
            })
          }
        }
      })
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
          userId: row.ID
        }
        deleteUserInfo(temp).then((res) => {
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
