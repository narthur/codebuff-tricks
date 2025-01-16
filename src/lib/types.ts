export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type Framework = 'react' | 'vue' | 'svelte' | 'angular' | 'solid';

export interface SetupConfig {
  packageManager: PackageManager;
  framework: Framework;
  typescript: boolean;
}
