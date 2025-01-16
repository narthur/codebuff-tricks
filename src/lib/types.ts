export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
export type Framework = 'react' | 'vue' | 'svelte' | 'angular' | 'solid' | 'nextjs' | 'sveltekit';

export type DeploymentPlatform = 'render' | 'netlify';

export interface SetupConfig {
  packageManager: PackageManager;
  framework: Framework;
  typescript: boolean;
  deployment: DeploymentPlatform;
}
