<script  setup>
import { h, ref } from 'vue'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

const { options, mode, showOperate } = defineProps({
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
    default: true,
  },
})
const MODE = {
  SHOW: 'show',
  EDIT: 'edit',
}

const tableData = defineModel({
  type: Array,
  default: () => [],
})

const columns = ref([])
const dataSource = ref([])
const editSource = ref([])

onMounted(() => {
  // 加载配置
  buildColumns()
  buildDataSource()

  watch(dataSource, () => {
    tableData.value = [...dataSource.value]
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
  }))
  if (!(mode.toLowerCase() === MODE.EDIT) && showOperate) {
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
  dataSource.value = [...data]
  editSource.value = [...data.map(item => ({ isEdit: mode.toLowerCase() === MODE.EDIT, isAdd: false, date: { ...item } }))]
}

function onSave(index) {
  const editData = editSource.value[index].date
  for (const optionsKey in options) {
    const option = options[optionsKey]
    if (!editData[option.dataIndex]) {
      Modal.error({
        title: '错误',
        content: `${option.title}不能为空`,
      })
      return
    }
  }
  for (let i = 0; i < dataSource.value.length; i++) {
    if (i === index)
      continue

    const item = dataSource.value[i]
    if (item.headerKey === editData.headerKey) {
      Modal.error({
        title: '错误',
        content: '请求名称不能有重复',
      })
      return
    }
  }

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

  dataSource.value = [...date]
  editSource.value = [...editDate]
}
function onAdd() {
  const object = { }
  for (let i = 0; i < editSource.value.length; i++) {
    if (editSource.value[i].isAdd) {
      Modal.error({
        title: '错误',
        content: '请先保存新增的数据',
      })
      return
    }
  }

  options.forEach((option) => {
    object[option.dataIndex] = ''
  })
  dataSource.value = [...dataSource.value, { ...object }]
  editSource.value = [...editSource.value, { isEdit: true, isAdd: true, date: { ...object } }]
}
</script>

<template>
  <a-table
    bordered :data-source="dataSource"
    :columns="columns" size="middle" :pagination="{ hideOnSinglePage: true }"
  >
    <template #bodyCell="{ column, index }">
      <template v-if="mode.toLowerCase() === MODE.EDIT || editSource[index].isEdit">
        <template v-for="option in options" :key="option">
          <template v-if="column.dataIndex === option.dataIndex">
            <a-form-item-rest>
              <a-input v-model:value="editSource[index].date[option.dataIndex]" />
            </a-form-item-rest>
          </template>
        </template>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <template v-if="editSource[index].isEdit">
            <a-button type="primary" shape="circle" style="background-color: #52c41a" :icon="h(CheckOutlined)" @click="onSave(index)" />
            <a-button type="primary" style="background-color: #faad14" shape="circle" :icon="h(CloseOutlined)" @click="onCancelSave(index)" />
          </template>
          <template v-else>
            <a-button
              type="primary" shape="circle" :icon="h(EditOutlined)" @click="editSource[index].isEdit = true"
            /><a-button
              type="primary" danger shape="circle" :icon="h(DeleteOutlined)" @click="onDelete(index)"
            />
          </template>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-button class="mt-3" type="primary" @click="onAdd">
    新增
  </a-button>
</template>

<style lang="less" scoped>
</style>
