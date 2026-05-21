import { ref, reactive, onUnmounted, onMounted } from 'vue'
import { useApp } from '@/hooks/useApp'
import { get, isArray, isFunction, isObject, noop } from '@/utils'
import { Message } from 'element-ui'
import { PAGE_CONF } from '@/utils/conf'

export function useRequest (service, opt = {}) {
  const options = Object.assign({
    dataKey: ['data', 'records'],
    totalKey: ['data', 'total'],
    rowMapCallback: null,
    canPolling: false,
    pollingInterval: 1000 * 10,
    pollingPauseCondition: noop,
    pollingCallback: noop,
    immediate: false
  }, opt)

  let timeout = null
  const loading = ref(false)
  const data = ref([])
  const total = ref(0)

  const run = async (polling) => {
    loading.value = !(polling === 'polling')

    if (options.canPolling && polling === 'polling') {
      if (isArray(options.pollingCallback)) {
        options.pollingCallback.forEach(cd => {
          cd()
        })
      } else if (isFunction(options.pollingCallback)) {
        options.pollingCallback()
      }

      if (options.pollingPauseCondition()) {
        if (timeout !== null) {
          clearTimeout(timeout)
          timeout = null
        }
        timeout = setTimeout(run, options.pollingInterval, 'polling')
        return
      }
    }

    const [error, response] = await to(service())
    loading.value = false

    if (isObject(error)) {
      Message.error(error.message)
    } else {
      data.value = options.rowMapCallback ? get(response, options.dataKey, []).map(options.rowMapCallback) : get(response, options.dataKey, [])
      total.value = get(response, options.totalKey, 0)
    }

    if (options.canPolling) {
      if (timeout !== null) {
        clearTimeout(timeout)
        timeout = null
      }
      timeout = setTimeout(run, options.pollingInterval, 'polling')
    }
  }

  onUnmounted(() => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
  })

  onMounted(() => {
    if (options.immediate) {
      void run()
    }
  })

  return {
    loading,
    data,
    total,
    run
  }
}

export function useTable (service, searchData, opt = {}) {
  searchData.pageSize = PAGE_CONF.pageSize

  const { refs } = useApp()
  const multipleSelection = ref([])

  const { data, loading, run, total } = useRequest(service, {
    canPolling: true,
    pollingPauseCondition: () => multipleSelection.value.length > 0,
    ...opt
  })

  function search () {
    refs.table.clearSelection()
    searchData.currentPage = 1
    void run()
  }

  function filterChange (filers) {
    const reg = new RegExp('(?<=:multiple)')
    for (const key in filers) {
      if (reg.test(key)) {
        searchData[key.slice(0, key.indexOf(':multiple'))] = filers[key]
      } else {
        searchData[key] = filers[key][0]
      }
    }
    search()
  }

  function sortChange (sort) {
    if (sort.order) {
      searchData.sortFieldList = [sort.prop]
      searchData.sortTypeList = [sort.order === 'ascending' ? 2 : 1]
    } else {
      searchData.sortFieldList = []
      searchData.sortTypeList = []
    }
    search()
  }

  function selectionChange (v) {
    multipleSelection.value = v
  }

  const tableListeners = {
    'filter-change': filterChange,
    'sort-change': sortChange,
    'selection-change': selectionChange
  }

  const tableProps = reactive({
    data
  })

  return {
    tableProps,
    tableListeners,
    multipleSelection,
    search,
    data,
    loading,
    run,
    total
  }
}
