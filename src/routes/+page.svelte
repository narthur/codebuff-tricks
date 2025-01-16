<script lang="ts">
	import type { PackageManager, Framework, SetupConfig } from '$lib/types';
	import { fade } from 'svelte/transition';  let currentStep = 0;
  let config: SetupConfig = {
    packageManager: 'npm',
    framework: 'react',
    typescript: true,
    deployment: 'render'
  };

  const deploymentPlatforms: DeploymentPlatform[] = ['render', 'netlify'];

	const packageManagers: PackageManager[] = ['npm', 'pnpm', 'yarn', 'bun'];
	const frameworks: Framework[] = [
		'react',
		'vue',
		'svelte',
		'angular',
		'solid',
		'nextjs',
		'sveltekit'
	];

	function nextStep() {    if (currentStep < 4) currentStep++;
	}

	function prevStep() {
		if (currentStep > 0) currentStep--;
	}

	function getSetupInstructions(): string[] {
		const { packageManager, framework, typescript } = config;
		const install =
			packageManager === 'npm'
				? 'npm install'
				: packageManager === 'pnpm'
					? 'pnpm install'
					: packageManager === 'yarn'
						? 'yarn'
						: 'bun install';

		const createCmd =
			packageManager === 'npm'
				? 'npm create'
				: packageManager === 'pnpm'
					? 'pnpm create'
					: packageManager === 'yarn'
						? 'yarn create'
						: 'bun create';

		const frameworkCmd =
			framework === 'react'
				? `${createCmd} vite@latest my-app -- --template ${typescript ? 'react-ts' : 'react'}`
				: framework === 'vue'
					? `${createCmd} vue@latest my-app ${typescript ? '--typescript' : ''}`
					: framework === 'svelte'
						? `${createCmd} svelte@latest my-app ${typescript ? '--typescript' : ''}`
						: framework === 'angular'
							? 'ng new my-app'
							: framework === 'solid'
								? `${createCmd} solid@latest my-app ${typescript ? '--typescript' : ''}`
								: framework === 'nextjs'
									? `${createCmd} next@latest my-app ${typescript ? '--typescript' : ''}`
									: `${createCmd} create-svelte@latest my-app ${typescript ? '--typescript' : ''}`;

		return [
			'# Install Codebuff globally',
			`${packageManager} ${packageManager === 'npm' ? 'install -g' : 'add -g'} codebuff`,
			'',
			'# Initialize git repository',
			'git init my-app',
			'',
			'# Create your project',
			frameworkCmd,
			'',
			'# Navigate to project directory',
			'cd my-app',
			'',
			'# Install dependencies',
			install,
			'',
			'# Start Codebuff in your project',
			'codebuff',
			'',
			'# Make initial commit',
			'git add .',
			'git commit -m "Initial commit"',
			'',
			'# Deploy to ' + config.deployment,
			...(config.deployment === 'render' ? [
				'# Visit render.com and create a new Web Service',
				'# Connect your GitHub repository',
				'# Build Command: ' + (config.framework === 'nextjs' ? 'npm run build' : 
								  config.framework === 'sveltekit' ? 'npm run build' : 
								  'npm run build'),
				'# Start Command: ' + (config.framework === 'nextjs' ? 'npm start' :
								  config.framework === 'sveltekit' ? 'node build' :
								  'npm run preview'),
				'# Auto-deploy on git push'
			] : [
				'# Install Netlify CLI',
				`${config.packageManager} ${config.packageManager === 'npm' ? 'install -g' : 'add -g'} netlify-cli`,
				'# Initialize Netlify',
				'netlify init',
				'# Deploy to Netlify',
				'netlify deploy --prod'
			])
		];
	}
</script>

<div class="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
	<div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-md md:max-w-2xl">
		<div class="mb-8">
			<h1 class="mb-2 text-2xl font-bold text-gray-900">Project Setup Wizard</h1>
			<div class="flex justify-between text-sm text-gray-500">
				<span>Step {currentStep + 1} of 5</span>
				<span>{Math.round(((currentStep + 1) / 5) * 100)}% complete</span>
			</div>
			<div class="mt-2 h-2 w-full rounded-full bg-gray-200">
				<div
					class="h-2 rounded-full bg-blue-600 transition-all duration-300"
					style="width: {((currentStep + 1) / 5) * 100}%"
				></div>
			</div>
		</div>

		{#if currentStep === 0}
			<div in:fade>
				<h2 class="mb-4 text-lg font-semibold">Choose your package manager</h2>
				<div class="space-y-2">
					{#each packageManagers as pm}
						<label class="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
							<input
								type="radio"
								name="packageManager"
								value={pm}
								bind:group={config.packageManager}
								class="h-4 w-4 text-blue-600"
							/>
							<span class="text-gray-900">{pm}</span>
						</label>
					{/each}
				</div>
			</div>
		{:else if currentStep === 1}
			<div in:fade>
				<h2 class="mb-4 text-lg font-semibold">Choose your framework</h2>
				<div class="space-y-2">
					{#each frameworks as fw}
						<label class="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
							<input
								type="radio"
								name="framework"
								value={fw}
								bind:group={config.framework}
								class="h-4 w-4 text-blue-600"
							/>
							<span class="text-gray-900">{fw}</span>
						</label>
					{/each}
				</div>
			</div>
		{:else if currentStep === 2}
			<div in:fade>
				<h2 class="mb-4 text-lg font-semibold">Use TypeScript?</h2>
				<div class="space-y-2">
					<label class="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
						<input
							type="radio"
							name="typescript"
							bind:group={config.typescript}
							value={true}
							class="h-4 w-4 text-blue-600"
						/>
						<span class="text-gray-900">Yes</span>
					</label>
					<label class="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
						<input
							type="radio"
							name="typescript"
							bind:group={config.typescript}
							value={false}
							class="h-4 w-4 text-blue-600"
						/>
						<span class="text-gray-900">No</span>
					</label>
				</div>
			</div>    {:else if currentStep === 3}
      <div in:fade>
        <h2 class="text-lg font-semibold mb-4">Choose your deployment platform</h2>
        <div class="space-y-2">
          {#each deploymentPlatforms as platform}
            <label class="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
              <input
                type="radio"
                name="deployment"
                value={platform}
                bind:group={config.deployment}
                class="h-4 w-4 text-blue-600"
              />
              <span class="text-gray-900 capitalize">{platform}</span>
            </label>
          {/each}
        </div>
      </div>
    {:else}
			<div in:fade>
				<h2 class="mb-4 text-lg font-semibold">Setup Instructions</h2>
				<div class="rounded-lg bg-gray-900 p-4 text-gray-100 relative">
					<button
						on:click={() => {
							const text = getSetupInstructions().join('\n');
							navigator.clipboard.writeText(text);
						}}
						class="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
					>
						Copy
					</button>
					<pre class="whitespace-pre-wrap font-mono text-sm">{getSetupInstructions().join('\n')}</pre>
				</div>
				<div class="mt-4 flex justify-between items-center">
					<p class="text-sm text-gray-600">
						Copy these commands to set up your new project with Codebuff!
					</p>
					<button
						on:click={() => {
							const text = getSetupInstructions().join('\n');
							const blob = new Blob([text], { type: 'text/plain' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = 'setup-project.sh';
							document.body.appendChild(a);
							a.click();
							document.body.removeChild(a);
							URL.revokeObjectURL(url);
						}}
						class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
					>
						Download Script
					</button>
				</div>
			</div>
		{/if}

		<div class="mt-8 flex justify-between">
			<button
				on:click={prevStep}
				class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
				disabled={currentStep === 0}
			>
				Previous
			</button>
			{#if currentStep < 4}
				<button
					on:click={nextStep}
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					{currentStep === 3 ? 'Show Instructions' : 'Next'}
				</button>
			{/if}
		</div>
	</div>
</div>
