<template>
  <div id="iconSelectComponent" class="icons-container">
    <div class="grid">
      <div v-for="item of elementIcons" :key="item" @click="handleClipboard(generateElementIconCode(item),item,$event)">
        <el-tooltip placement="top">
          <div slot="content">
            {{ generateElementIconCode(item) }}
          </div>
          <div class="icon-item">
            <i :class="'el-icon-' + item" />
            <span>{{ item }}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import elementIcons from '@/views/base_src/icons/element-icons'
import clipboard from '@/utils/clipboard'
export default {
  name: 'IconSelectComponent',
  components: {},
  data() {
    return {
      elementIcons
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

  },
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleClipboard(text, item, event) {
      clipboard(text, event)
      this.$emit('getIcon', item)
    }
  }
}
</script>
<style lang='scss' scoped>
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
