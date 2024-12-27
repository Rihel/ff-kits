import { defaultTailwindConfig } from './common.tailwind.config.js'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./packages/client-kits/src/**/*.{js,ts,jsx,tsx}'],
  ...defaultTailwindConfig,
}
