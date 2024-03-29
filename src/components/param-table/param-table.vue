<script  setup>
import { h, ref } from 'vue'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

const { options, mode, showOperate, showAdd } = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'show',
  },
  showOperate: {
    type: Boolean,
    default: false,
  },
  showAdd: {
    type: Boolean,
    default: false,
  },
})
const MODE = {
  SHOW: 'show',
  EDIT: 'edit',
}
const INPUT_TYPE = {
  TEXT: 'text',
  SELECT: 'select',
}
// 是否是表格数据更新（防止侦听器进入无限递归）
let isTableDataUpdate = false
let isDataSourceUpdate = false

const tableData = defineModel({
  type: Array,
  default: () => [],
})

const columns = ref([])
const dataSource = ref([])
const editSource = ref([])

function init() {
  buildColumns()
  buildDataSource()
}

onMounted(() => {
  // 加载配置
  init()
  watch(tableData, () => {
    if (isDataSourceUpdate) {
      isDataSourceUpdate = false
      return
    }
    isTableDataUpdate = true
    init()
  })
  watch(dataSource, () => {
    if (isTableDataUpdate) {
      isTableDataUpdate = false
    }
    else {
      isDataSourceUpdate = true
      tableData.value = [...dataSource.value]
    }
  })
  // 如果是编辑模式，实时改变数据
  if (mode.toLowerCase() === MODE.EDIT) {
    watch(editSource, (newValue) => {
      dataSource.value = [...newValue.map((item) => {
        return item.date
      })]
    }, { deep: true })
  }
})

// 根据配置构建表格列对象
function buildColumns() {
  columns.value = options?.map(option => ({
    title: option.title,
    dataIndex: option.dataIndex,
    inputType: option.type,
    selectList: option.selectList,
  }))
  if (showOperate) {
    columns.value.push({
      title: '操作',
      dataIndex: 'operation',
    })
  }
}

// 根据配置构建数据源
function buildDataSource() {
  const data = tableData.value?.map((item) => {
    const object = {}
    options.forEach((option) => {
      object[option.dataIndex] = item[option.dataIndex]
    })
    return object
  })

  // 给编辑数据默认值
  const editData = [...data.map(item => ({ isEdit: mode.toLowerCase() === MODE.EDIT, isAdd: false, date: { ...item } }))]

  for (const optionsKey in options) {
    const option = options[optionsKey]
    if (INPUT_TYPE.TEXT.toLowerCase() === option.type) {
      editData.forEach((item) => {
        item.date[option.dataIndex] = item.date[option.dataIndex] || ''
      })
    }
    else if (INPUT_TYPE.TEXT.toLowerCase() === option.type) {
      editData.forEach((item) => {
        item.date[option.dataIndex] = item.date[option.dataIndex] || option.selectList[0].value
      })
    }
  }

  dataSource.value = [...data]
  editSource.value = editData
}

function onSave(index) {
  const editData = editSource.value[index].date
  for (const optionsKey in options) {
    const option = options[optionsKey]
    if (option.isNotNull && !editData[option.dataIndex]) {
      Modal.error({
        title: '错误',
        content: `${option.title}不能为空`,
      })
      return
    }

    // 如果是唯一的，判断是否有重复
    if (option.isOnly) {
      for (let i = 0; i < dataSource.value.length; i++) {
        if (i === index)
          continue
        const item = dataSource.value[i]
        if (item[option.dataIndex] === editData[option.dataIndex]) {
          Modal.error({
            title: '错误',
            content: `${option.title}不能有重复`,
          })
          return
        }
      }
    }
  }

  isDataSourceUpdate = true
  // 更新数据
  dataSource.value = editSource.value.map((item, i) => {
    if (i === index) {
      item.isEdit = false
      item.isAdd = false
    }
    return item.date
  })
}

function onCancelSave(index) {
  // 如果是新增的数据，直接删除
  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    if (!dataSource.value[index][option.dataIndex]) {
      onDelete(index)
      return
    }
  }
  // 取消编辑
  editSource.value[index].isEdit = false
  options.forEach((option) => {
    // 恢复原始数据
    editSource.value[index].date[option.dataIndex] = dataSource.value[index][option.dataIndex]
  })
}

function onDelete(index) {
  const date = dataSource.value.filter((item, i) => i !== index)
  const editDate = editSource.value.filter((item, i) => i !== index)

  isDataSourceUpdate = true
  dataSource.value = [...date]
  editSource.value = [...editDate]
}
function onAdd() {
  const object = { }
  if (mode.toLowerCase() !== MODE.EDIT) {
    for (let i = 0; i < editSource.value.length; i++) {
      if (editSource.value[i].isAdd) {
        Modal.error({
          title: '错误',
          content: '请先保存新增的数据',
        })
        return
      }
    }
  }

  options.forEach((option) => {
    if (INPUT_TYPE.TEXT.toLowerCase() === option.type)
      object[option.dataIndex] = ''

    else if (INPUT_TYPE.SELECT.toLowerCase() === option.type)
      object[option.dataIndex] = option.selectList[0].value || ''
  })

  isDataSourceUpdate = true
  dataSource.value = [...dataSource.value, { ...object }]
  editSource.value = [...editSource.value, { isEdit: true, isAdd: true, date: { ...object } }]
}
</script>

<template>
  <a-table
    bordered :data-source="dataSource"
    :columns="columns" size="middle" :pagination="{ hideOnSinglePage: true }"
  >
    <template #bodyCell="{ index, column }">
      <template v-if="mode.toLowerCase() === MODE.EDIT || editSource[index].isEdit">
        <template v-for="option in options" :key="option">
          <template v-if="column.dataIndex === option.dataIndex">
            <a-form-item-rest v-if="column.inputType === INPUT_TYPE.TEXT">
              <a-input v-model:value="editSource[index].date[option.dataIndex]" placeholder="请输入内容" />
            </a-form-item-rest>
            <a-form-item-rest v-else-if="column.inputType === INPUT_TYPE.SELECT">
              <a-select
                v-model:value="editSource[index].date[option.dataIndex]"
                :options="column.selectList"
              />
            </a-form-item-rest>
          </template>
        </template>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <template v-if="mode.toLowerCase() !== MODE.EDIT && editSource[index].isEdit">
            <a-button type="primary" shape="circle" style="background-color: #52c41a" :icon="h(CheckOutlined)" @click="onSave(index)" />
            <a-button type="primary" style="background-color: #faad14" shape="circle" :icon="h(CloseOutlined)" @click="onCancelSave(index)" />
          </template>
          <template v-else>
            <a-button
              v-if="mode.toLowerCase() !== MODE.EDIT" type="primary" shape="circle" :icon="h(EditOutlined)" @click="editSource[index].isEdit = true"
            />
            <a-button
              type="primary" danger shape="circle" :icon="h(DeleteOutlined)" @click="onDelete(index)"
            />
          </template>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-button v-if="showAdd" class="mt-3" type="primary" @click="onAdd">
    新增
  </a-button>
</template>

<style lang="less" scoped>
</style>
