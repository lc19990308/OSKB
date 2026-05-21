import '@/components/public/Info'
import '@/components/public/ListGroup'
import '@/components/public/SearchArea'
import LevelTag from '@/components/public/LevelTag/index.vue'
import IconButton from '@/components/public/IconButton/index.vue'
import Panel from '@/components/public/Panel/index.vue'
import Pagination from '@/components/public/Pagination/index.vue'
import Empty from '@/components/public/Empty/index.vue'
import LevelGroup from '@/components/public/LevelGroup'
import { popup } from '@/components/public/Popup'
import DynamicTable from '@/components/public/DynamicTable'
import Sticky from '@/components/public/Sticky'
import Dot from '@/components/public/Dot'
import OssProgress from '@/components/public/Progress'
import OssTableFilter from '@/components/public/DynamicTable/TableFilter'
import OssTableSort from '@/components/public/DynamicTable/TableSort'
import OssButtonSearch from '@/components/public/ButtonSearch'
import { Table } from 'element-ui'
import MarkTag from '@/views/home/public/modules/MarkTag.vue'
import AuditTag from '@/views/home/public/modules/AuditTag.vue'

export default {
  install (Vue) {
    Vue.prototype.$popup = popup
    Vue.component('MarkTag', MarkTag)
    Vue.component('AuditTag', AuditTag)
    Vue.component('OssButtonSearch', OssButtonSearch)
    Vue.component('OssTableFilter', OssTableFilter)
    Vue.component('OssTableSort', OssTableSort)
    Vue.component('OssDot', Dot)
    Vue.component('OssProgress', OssProgress)
    Vue.component('level-tag', LevelTag)
    Vue.component('icon-button', IconButton)
    Vue.component('panel', Panel)
    Vue.component('pagination', Pagination)
    Vue.component('empty', Empty)
    Vue.component('LevelGroup', LevelGroup)
    Vue.component('ElTableHost', Table)
    Vue.component('ElTable', DynamicTable)
    Vue.component('Sticky', Sticky)
  }
}
