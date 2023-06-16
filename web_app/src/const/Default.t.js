export const UploadImageTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];//支持的图片类型
export const UploadAudioTypes = ['audio/x-m4a'];//支持的音频类型
export const TextConfigComponent = ['lmo-input', 'lmo-switch', 'lmo-input-number', 'lmo-select'];//编辑器文字相关配置支持的组件
export const ColorConfigComponent = ['lmo-color-picker'];//编辑器颜色相关配置支持的组件
export const ColorOption = [{label: '渐变色调', value: 'Gradient'}, {label: '单色调', value: 'Monotone'}, {label: '主题色', value: 'Theme'}];//编辑器颜色类型选项
export const renderColorOptionExcludeKey = ['more', 'type'];//渲染color对象时排除的key