import {
  defineConfig,
  presetIcons,
  presetMini,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
// import { safelist } from './src/utils/config/uno-safelist';
import { themeColors } from './src/utils/index';

export default defineConfig({
  presets: [
    presetMini(),
    presetIcons({
      collections: {
        clarity: () => import('@iconify-json/clarity/icons.json'),
        mdi: () => import('@iconify-json/mdi/icons.json'),
      },
    }),
    // 你也可以加入 presetAttributify(), presetIcons() ...等
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // safelist,
  theme: themeColors,
});
