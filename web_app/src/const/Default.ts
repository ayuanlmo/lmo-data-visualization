//支持的图片类型
export const UploadImageTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'] as const;
//支持的音频类型
export const UploadAudioTypes = ['audio/x-m4a'] as const;
//编辑器文字相关配置支持的组件
export const TextConfigComponent = ['input', 'switch', 'input-number', 'select'] as const;
//编辑器颜色相关配置支持的组件
export const ColorConfigComponent = ['color-picker'] as const;
//编辑器颜色类型选项
export const ColorOption = [{label: '渐变色调', value: 'Gradient'}, {
    label: '单色调',
    value: 'Monotone'
}, {label: '主题色', value: 'Theme'}] as const;
//渲染color对象时排除的key
export const renderColorOptionExcludeKey = ['more', 'type'] as const;
