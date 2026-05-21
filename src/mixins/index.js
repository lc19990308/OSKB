import filters from '@/utils/filters'
import { authorityFilter, matching, get, createStrSuffix, isArray, isString, isNumber, isFunction } from '@/utils'
import { utilizeDifficultyOptions } from '@/store/constant'

export default {
  data () {
    return {
      utilizeDifficultyOptions
    }
  },
  computed: {
    projectMixin () {
      return this.$store.state.home.project
    },
    projectListMixin () {
      return this.$store.state.home.projectList.map(item => ({ text: item.name, ...item })) || []
    },
    openscaToken () {
      return this.$store.state.home.openscaToken
    }
  },
  methods: {
    isArray,
    isString,
    isNumber,
    isFunction,
    authorityFilter,
    matching,
    get,
    createStrSuffix
  },
  filters
}
