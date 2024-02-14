export const requestParamOptions = [
  {
    type: 'text',
    title: '请求参数',
    dataIndex: 'name',
    isOnly: true,
    isNotNull: true,
  },
  {
    type: 'select',
    title: '必填',
    dataIndex: 'required',
    isNotNull: true,
    selectList: [
      { value: 'true', label: 'true' },
      { value: 'false', label: 'false' },
    ],
  },
  {
    type: 'select',
    title: '数据类型',
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
    type: 'select',
    title: '请求类型',
    dataIndex: 'requestType',
    isNotNull: true,
    selectList: [
      { value: 'path', label: 'path' },
      { value: 'body', label: 'body' },
    ],
  },
  {
    type: 'text',
    title: '备注',
    dataIndex: 'remark',
    isNotNull: true,
  },
]
