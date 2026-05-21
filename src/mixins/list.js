import { sessionStore } from '@/utils'

export default {
  data () {
    return {
      __searchRecord: {}
    }
  },
  methods: {
    // authorityFilter,
    // 保存搜索记录
    saveSearchRecord (data) {
      sessionStore.set(`search_record-${this.$route.path}`, data)
    },

    // 获取搜索条件
    getSearchRecord () {
      for (const key in this.__searchRecord) {
        if (Object.hasOwnProperty.call(this.__searchRecord, key) && Object.hasOwnProperty.call(this, key)) {
          this[key] = this.__searchRecord[key]
        }
      }
    },
    searchFilter (filers) {
      const reg = new RegExp('(?<=:multiple)')
      for (const key in filers) {
        if (reg.test(key)) {
          this.$set(this.searchData, key.slice(0, key.indexOf(':multiple')), filers[key])
        } else {
          this.$set(this.searchData, key, filers[key][0])
        }
      }
      this.search()
    },
    searchSort (sort) {
      if (sort.order) {
        this.searchData.sortFieldList = [sort.prop]
        this.searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
      } else {
        this.searchData.sortFieldList = []
        this.searchData.sortTypeList = []
      }
      this.search()
    }
  },
  created () {
    if (this.$route.params && Object.hasOwnProperty.call(this.$route.params, 'back')) {
      this.__searchRecord = sessionStore.get(`search_record-${this.$route.path}`)
      if (this.__searchRecord) {
        this.getSearchRecord()
      }
    }
  }
}
