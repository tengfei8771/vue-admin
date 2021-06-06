<template>
  <div id="menuinfo" class="app-container calendar-list-container">
    <el-row style="margin-bottom:5px" :gutter="20">
      <el-col :span="3">
        <el-input v-model="listQuery.test" :size="size" placeholder="请输入" />
      </el-col>
      <el-col :span="6">
        <el-button :size="size" type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        <el-button :size="size" type="primary" icon="el-icon-search" @click="handleCreate">新增</el-button>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        border
        fit
        highlight-current-row
        stripe
        :size="size"
        style="width: 100%"
        element-loading-text="给我一点时间"
        :header-cell-class-name="tableRowClassName"
lazy
        row-key="ID"
        :load="load"
      >
        <el-table-column label="菜单ID" prop="ID" />
        <el-table-column label="菜单名称" prop="MenuName" />
        <el-table-column label="菜单路由" prop="MenuRoute" />
        <el-table-column label="菜单路径" prop="MenuPath" />
        <el-table-column label="菜单图标" align="center">
          <template slot-scope="scope">
            <span><i v-if="scope.row.MenuIcon!=null" :class="`el-icon-${scope.row.MenuIcon}`" /></span>
          </template>
        </el-table-column>
        <el-table-column label="菜单序号" prop="MenuSortNo" />
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            {{ scope.row.IsUse|changeSate }}
          </template>
        </el-table-column>
        <el-table-column label="是否显示">
          <template slot-scope="scope">
            {{ scope.row.IsHidden|changeSate }}
          </template>
        </el-table-column>
        <el-table-column label="是否渲染上级">
          <template slot-scope="scope">
            {{ scope.row.IsRender|changeSate }}
          </template>
        </el-table-column>
        <el-table-column label="是否无页面">
          <template slot-scope="scope">
            {{ scope.row.IsLayout|changeSate }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="primary">
                更多菜单<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
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
            <el-form-item label="菜单名称" prop="MenuName">
              <el-input v-model="form.MenuName" :size="size" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="父级菜单">
              <el-cascader v-model="form.MenuParentID" :size="size" :options="parentSelectOption" placeholder="请选择父级菜单" :props="parentSelectProp" :show-all-levels="false" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单路由" prop="MenuRoute">
              <el-input v-model="form.MenuRoute" :size="size" placeholder="请输入菜单路由" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单物理路径">
              <el-input v-model="form.MenuPath" :size="size" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标">
              <el-row>
                <el-col :span="16">
                  <!-- <i :class="`el-icon-${form.MenuIcon}`" v-if="form.MenuIcon"></i> -->
                  <el-input v-model="form.MenuIcon" :size="size" placeholder="请选择图标" readonly />
                </el-col>
                <el-col :span="6" :offset="2">
                  <el-button type="primary" :size="size" @click="drawer=true">选择图标</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单序号">
              <el-input v-model="form.MenuSortNo" :size="size" placeholder="请输入菜单序号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="是否启用" prop="IsUse">
              <el-select v-model="form.IsUse" :size="size" style="width:100%">
                <el-option v-for="(item,key) in selectOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否显示" prop="IsHidden">
              <el-select v-model="form.IsHidden" :size="size" style="width:100%">
                <el-option v-for="(item,key) in selectOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>

          <el-col :span="12">
            <el-form-item label="是否渲染上级页面" prop="IsRender">
              <el-select v-model="form.IsRender" :size="size" style="width:100%">
                <el-option v-for="(item,key) in selectOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为无页面菜单">
              <el-select v-model="form.IsLayout" :size="size" style="width:100%">
                <el-option v-for="(item,key) in selectOptions" :key="key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align:center">
          <el-button v-if="!dialogDisable" type="primary" @click="submit">提交</el-button>
          <el-button type="danger" @click="dialogState=false">取消</el-button>
        </el-row>
      </el-form>
    </el-dialog>

    <el-drawer title="图标选择" :visible.sync="drawer" :direction="direction">
      <iconSelectComponent @getIcon="getIcon" />
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import { getMenu, createMenu, updateMenu, deleteMenu } from '@/api/menu'
import iconSelectComponent from '@/views/frame_src/components/iconSelectComponent'
export default {
  name: 'Menuinfo',
  components: { iconSelectComponent },
  filters: {
    changeSate(val) {
      if (val === 0) {
        return '否'
      } else if (val === 1) {
        return '是'
      }
    }
  },
  data() {
    return {
      listQuery: {
        ParentMenuID: 0,
        page: 1,
        limit: 10
      },
      selectOptions: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      tableData: [],
      dialogState: false,
      dialogDisable: false,
      form: {
        MenuName: null,
        MenuParentID: null,
        MenuRoute: null,
        MenuPath: null,
        MenuIcon: null,
        MenuSortNo: null,
        IsUse: 1,
        IsHidden: 1,
        IsRender: 0,
        IsLayout: 1
      },
      rules: {
        MenuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        MenuRoute: [
          { required: true, message: '请输入菜单路由', trigger: 'blur' }
        ],
        MenuPath: [],
        MenuIcon: [],
        MenuSortNo: [],
        IsUse: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        IsHidden: [
          { required: true, message: '请选择是否隐藏', trigger: 'blur' }
        ],
        IsRender: [
          {
            required: true,
            message: '请选择是否渲染上级菜单',
            trigger: 'blur'
          }
        ],
        IsLayout: [
          { required: true, message: '请选择是否有页面', trigger: 'blur' }
        ]
      },
      total: 0,
      title: '新增',
      drawer: false,
      direction: 'rtl',
      parentSelectOption: [],
      parentSelectProp: {
        value: 'ID',
        label: 'MenuName',
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          let temp = {
            ParentMenuID: node.data.ID,
            page: 1,
            limit: 10000
          }
          getMenu(temp).then((res) => {
            if (res.items != null) {
              resolve(res.items)
            } else {
              resolve([])
            }
          })
        }
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
  created() { },
  mounted() {
    this.getList()
  },
  beforeCreate() { },
  beforeMount() { },
  beforeUpdate() { },
  updated() { },
  beforeDestroy() { },
  destroyed() { },
  activated() { },

  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'el-button--primary is-active'
      }
      return ''
    },
    getList() {
      getMenu(this.listQuery).then((res) => {
        this.tableData = res.items
        this.parentSelectOption = res.items
        this.total = res.total
      })
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.MenuParentID != null) {
            this.form.MenuParentID = this.form.MenuParentID[0]
          }
          if (this.title === '新增') {
            createMenu(this.form).then(res => {
              this.dialogState = false
            })
          } else {
            updateMenu(this.form).then(res => {
              this.dialogState = false
            })
          }
        }
      })
    },
    resetForm() {
      this.form = {
        MenuName: null,
        MenuParentID: null,
        MenuRoute: null,
        MenuPath: null,
        MenuIcon: null,
        MenuSortNo: null,
        IsUse: 1,
        IsHidden: 1,
        IsRender: 0,
        IsLayout: 1
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
      this.title = '修改'
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = Object.assign({}, row)
        this.form.CreateBy = this.$store.state.user.userId
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
        deleteMenu(temp)
      })
    },
    close() {
      this.dialogState = false
      this.dialogDisable = false
    },
    getChildrenMenuNode(parentID) {
      let temp = {
        ParentMenuID: parentID,
        page: 1,
        limit: 10000
      }
      getMenu(temp).then((res) => {
        if (res.items != null) {
          return res.items
        } else {
          return []
        }
      })
    },
    load(tree, treeNode, resolve) {
      let temp = {
        ParentMenuID: tree.ID,
        page: 1,
        limit: 10000
      }
      getMenu(temp).then((res) => {
        if (res.items != null) {
          resolve(res.items)
        } else {
          resolve([])
        }
      })
    },
    getIcon(iconClassName) {
      this.drawer = false
      this.form.MenuIcon = iconClassName
    }
  }
}
</script>
<style lang='scss' >
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
</style>
