export const responseParamOptions = [
  {
    type: 'text',
    title: '响应参数',
    dataIndex: 'name',
  },
  {
    type: 'select',
    title: '类型',
    dataIndex: 'type',
    isNotNull: true,
    selectList: [
      { value: 'string', label: 'string' },
      { value: 'number', label: 'number' },
      { value: 'boolean', label: 'boolean' },
      { value: 'object', label: 'object' },
      { value: 'array', label: 'array' },
    ],
  },
  {
    type: 'text',
    title: '示例值',
    dataIndex: 'exampleValue',
    isNotNull: true,
  },
  {
    type: 'text',
    title: '备注',
    dataIndex: 'remark',
    isNotNull: true,
  },
]
