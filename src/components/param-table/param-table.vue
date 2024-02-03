<script lang="ts" setup>
import { h, onMounted, ref } from 'vue'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

const props = defineProps({
  options: Array,
})

const options = ref(props.options)
const tablData = defineModel()

const columns = ref([])
const dataSource = ref([])

watch(dataSource, (newValue, oldValue) => {
  // 判断是不是编辑数据变化
  if (newValue.isEdit !== oldValue.isEdit)
    return

  if (newValue.editData !== oldValue.editData)
    return
  // 更新数据
  tablData.value = dataSource.value.map((item) => {
    const object = {}
    options.value.forEach((option) => {
      object[option.dataIndex] = item[option.dataIndex]
    })
    return object
  })
})

onMounted(() => {
  // 加载配置
  buildColumns()
  buildDataSource()
})

// 根据配置构建表格列对象
function buildColumns() {
  columns.value = options.value.map(option => ({
    title: option.title,
    dataIndex: option.dataIndex,
  }))
  columns.value.push({
    title: '操作',
    dataIndex: 'operation',
  })
}

// 根据配置构建数据源
function buildDataSource() {
  dataSource.value = tablData.value.map((item) => {
    const object: ParamTableDataSourceItem = { isEdit: false, editData: {} }
    options.value.forEach((option) => {
      object[option.dataIndex] = item[option.dataIndex]
      object.editData[option.dataIndex] = item[option.dataIndex]
    })
    return object
  })
}

function onSave(index: number) {
  const { editData } = dataSource.value[index]
  if (!editData.headerKey || !editData.headerExampleValue || !editData.remark) {
    Modal.error({
      title: '错误',
      content: '请求名称、示例值、备注不能为空',
    })
    return
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
  dataSource.value = dataSource.value.map((item, i) => {
    if (i === index) {
      item.isEdit = false
      options.value.forEach((option) => {
        item[option.dataIndex] = item.editData[option.dataIndex]
      })
    }
    return item
  })
}

function onCancelSave(index: number) {
  // 如果是新增的数据，直接删除
  for (let i = 0; i < options.value.length; i++) {
    const option = options.value[i]
    if (!dataSource.value[index][option.dataIndex]) {
      onDelete(index)
      return
    }
  }
  dataSource.value[index].isEdit = false
  options.value.forEach((option) => {
    dataSource.value[index].editData[option.dataIndex] = dataSource.value[index][option.dataIndex]
  })
}

function onDelete(index: number) {
  const arr = []
  for (let i = 0; i < dataSource.value.length; i++) {
    if (i === index)
      continue
    arr.push(dataSource.value[i])
  }
  dataSource.value = arr
}
function handleAdd() {
  const newData: ParamTableDataSourceItem = {
    headerKey: '',
    headerExampleValue: '',
    remark: '',
    isEdit: true,
    editData: {
      headerKey: '',
      headerExampleValue: '',
      remark: '',
    },
  }
  dataSource.value.push(newData)
}
</script>

<template>
  {{ dataSource }}
  <a-table
    bordered :data-source="dataSource"
    :columns="columns" size="middle" :pagination="{ hideOnSinglePage: true }"
  >
    <template #bodyCell="{ column, index, record }">
      <template v-if="record.isEdit">
        <template v-for="option in options" :key="option">
          <template v-if="column.dataIndex === option.dataIndex">
            <a-form-item-rest>
              <a-input v-model:value="dataSource[index].editData[option.dataIndex]" />
            </a-form-item-rest>
          </template>
        </template>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <a-space>
          <template v-if="record.isEdit">
            <a-button type="primary" shape="circle" style="background-color: #52c41a" :icon="h(CheckOutlined)" @click="onSave(index)" />
            <a-button type="primary" style="background-color: #faad14" shape="circle" :icon="h(CloseOutlined)" @click="onCancelSave(index)" />
          </template>
          <template v-else>
            <a-button
              type="primary" shape="circle" :icon="h(EditOutlined)" @click="record.isEdit = true"
            /><a-button
              type="primary" danger shape="circle" :icon="h(DeleteOutlined)" @click="onDelete(index)"
            />
          </template>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-button class="mt-3" type="primary" @click="handleAdd">
    新增
  </a-button>
</template>

<style lang="less" scoped>
</style>
