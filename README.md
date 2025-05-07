# @karl/eslint-config

Karl的个人ESLint配置，提供开箱即用的JavaScript、TypeScript、Vue代码规范。

## 特性

- 🔄 基于ESLint扁平配置（Flat Config）
- 📝 支持JavaScript、TypeScript
- 🖼️ 支持Vue框架
- 🧩 集成Prettier格式化
- 🧹 自动整理未使用的导入
- 📋 规范化import语句顺序

## 安装

```bash
# npm
npm install -D eslint @karl/eslint-config

# yarn
yarn add -D eslint @karl/eslint-config

# pnpm
pnpm add -D eslint @karl/eslint-config
```

## 使用方法

在项目根目录创建`eslint.config.js`文件：

```js
// eslint.config.js
import karlConfig from '@karl/eslint-config'

export default karlConfig()
```

## 特性

- 基于ESLint 9.x扁平配置格式
- 内置集成插件：
  - eslint-plugin-vue - Vue.js支持
  - eslint-plugin-import-x - 导入语句规范
  - eslint-plugin-unused-imports - 清理未使用的导入
  - eslint-plugin-prettier - 与Prettier集成

## VS Code设置

在VS Code中使用时，确保安装了ESLint扩展，并在`settings.json`中添加以下配置：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.experimental.useFlatConfig": true
}
```

## 许可证

MIT
