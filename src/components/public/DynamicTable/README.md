## 配置动态表格
说明： 继承el-table所有的功能。用法和原生el-table基本保持一致，减少开发使用难度。只需增加dynamicOptions参数

示例：
  ```vue
<el-table
    ... 和原生el-table保持一致
    :dynamicOptions.sync="dynamicOptions"
>
  ... 和原生el-table保持一致
</el-table>
```

配置项
```js
@param { Object } dynamicOptions
@param { Array } columns - 表格列配置数组对象, 不传默认不使用动态列表
@param { String | Number } uuid - 用于缓存的唯一标识 不传默认不使用动态列表
@param { String } to - 将配置弹窗渲染在哪个表头,不传默认不使用动态列表

dynamicOptions:{
      to: '操作', // 将配置弹窗渲染在哪个表头,不传默认不使用动态列表 (使用动态列表必填)
      uuid: 'gitList', //  用于缓存的唯一标识 不传默认不使用动态列表 (使用动态列表必填)
      columns: [ // 列默认配置
        {
        label: '仓库地址',
        checked: false,
        disabled: false
      },
        {
        label: '操作',
        checked: true,
        disabled: true
      }
    ]
}
```
