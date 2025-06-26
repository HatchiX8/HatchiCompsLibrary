import { globalIgnores } from 'eslint/config';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,

  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      // Vue
      'vue/multi-word-component-names': 'off',

      // JS基本風格
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-eval': 'error',
      'spaced-comment': ['warn', 'always'],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-empty': 'warn',
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-parens': ['error', 'as-needed'],
      'prefer-arrow-callback': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'consistent-return': 'warn',
      'no-debugger': 'error',
      'default-case': 'warn',

      'func-names': ['error', 'always'], // 不接受匿名函式
      // 'max-depth': ['warn', 3], // 先關閉(禁用巢狀結構)
      // 'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }], // 先關閉(禁用魔法數字)
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**'])
);
