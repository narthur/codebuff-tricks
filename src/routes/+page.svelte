<script lang="ts">
	import type { PackageManager, Framework, SetupConfig, DeploymentPlatform } from '$lib/types';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-bash';

	// Remove any default Prism background
	const style = document.createElement('style');
	style.textContent = `
		code[class*="language-"],
		pre[class*="language-"] {
			background: none;
		}
	`;
	document.head.appendChild(style);

	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let currentStep = 0;
	let config: SetupConfig = {
		packageManager: 'npm',
		framework: 'react',
		typescript: true,
		deployment: 'render'
	};

	// Load state from URL on mount (browser-only)
	onMount(() => {
		if (typeof window === 'undefined') return;
		const params = new URLSearchParams($page.url.search);
		const step = parseInt(params.get('step') || '0');
		const pm = params.get('pm');
		const fw = params.get('fw');
		const ts = params.get('ts');
		const deploy = params.get('deploy');

		if (pm && packageManagers.includes(pm as PackageManager)) {
			config.packageManager = pm as PackageManager;
		}
		if (fw && frameworks.includes(fw as Framework)) {
			config.framework = fw as Framework;
		}
		if (ts !== null) {
			config.typescript = ts === 'true';
		}
		if (deploy && deploymentPlatforms.includes(deploy as DeploymentPlatform)) {
			config.deployment = deploy as DeploymentPlatform;
		}
		if (step >= 0 && step <= 4) {
			currentStep = step;
		}
	});

	// Update URL when state changes
	$: if (typeof window !== 'undefined') {
		const params = new URLSearchParams();
		params.set('step', currentStep.toString());
		params.set('pm', config.packageManager);
		params.set('fw', config.framework);
		params.set('ts', config.typescript.toString());
		params.set('deploy', config.deployment);
		goto(`?${params.toString()}`, { replaceState: true, keepfocus: true });
	}

	const deploymentPlatforms: DeploymentPlatform[] = [
		'vercel',
		'netlify',
		'render',
		'cloudflare',
		'github-pages'
	];

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

	function nextStep() {
		if (currentStep < 4) currentStep++;
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
			...(config.deployment === 'vercel'
				? [
						'# Install Vercel CLI',
						`${config.packageManager} ${config.packageManager === 'npm' ? 'install -g' : 'add -g'} vercel`,
						'# Deploy to Vercel',
						'vercel'
					]
				: config.deployment === 'render'
					? [
							'# Visit render.com and create a new Web Service',
							'# Connect your GitHub repository',
							'# Build Command: ' +
								(config.framework === 'nextjs'
									? 'npm run build'
									: config.framework === 'sveltekit'
										? 'npm run build'
										: 'npm run build'),
							'# Start Command: ' +
								(config.framework === 'nextjs'
									? 'npm start'
									: config.framework === 'sveltekit'
										? 'node build'
										: 'npm run preview'),
							'# Auto-deploy on git push'
						]
					: config.deployment === 'netlify'
						? [
								'# Install Netlify CLI',
								`${config.packageManager} ${config.packageManager === 'npm' ? 'install -g' : 'add -g'} netlify-cli`,
								'# Initialize Netlify',
								'netlify init',
								'# Deploy to Netlify',
								'netlify deploy --prod'
							]
						: config.deployment === 'cloudflare'
							? [
									'# Install Cloudflare Pages via Wrangler',
									`${config.packageManager} ${config.packageManager === 'npm' ? 'install -g' : 'add -g'} wrangler`,
									'# Login to Cloudflare',
									'wrangler login',
									'# Deploy to Cloudflare Pages',
									'wrangler pages deploy dist'
								]
							: [
									'# Configure GitHub Pages in your repository settings',
									'# Add deploy script to package.json:',
									'# "deploy": "gh-pages -d dist"',
									'',
									'# Install gh-pages package',
									`${packageManager} ${packageManager === 'npm' ? 'install' : 'add'} -D gh-pages`,
									'',
									'# Build and deploy',
									'npm run build',
									'npm run deploy'
								])
		];
	}
</script>

<div class="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
	<div class="mx-auto mb-12 max-w-3xl text-center">
		<h1 class="mb-4 flex items-center justify-center text-4xl font-bold text-gray-900">
			Get Started with <img src="/codebuff-logo.svg" alt="Codebuff" class="ml-5 inline h-16" />
		</h1>
		<div class="mb-6">
			<span
				class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20"
			>
				Unofficial Tool
			</span>
		</div>
		<p class="mx-auto max-w-2xl text-lg text-gray-600">
			A community-built wizard to help you set up new projects with Codebuff. Choose your tech
			stack, and get the exact commands needed to start coding with AI assistance.
		</p>
		<p class="mt-2 text-sm text-gray-500">
			This is an unofficial tool created by me, <a
				href="https://nathanarthur.com"
				class="text-blue-600 hover:underline">Nathan Arthur</a
			>. Visit <a href="https://codebuff.com" class="text-blue-600 hover:underline">codebuff.com</a>
			for the official documentation.
		</p>
	</div>

	<div class="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-6 shadow-md md:max-w-2xl">
		<div class="mb-8">
			<h2 class="mb-2 text-2xl font-bold text-gray-900">Project Setup</h2>
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
			</div>
		{:else if currentStep === 3}
			<div in:fade>
				<h2 class="mb-4 text-lg font-semibold">Choose your deployment platform</h2>
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
							<span class="capitalize text-gray-900">{platform}</span>
						</label>
					{/each}
				</div>
			</div>
		{:else}
			<div in:fade
				on:introend={() => {
					if (typeof window !== 'undefined') {
						Prism.highlightAll();
					}
				}}
			>
				<h2 class="mb-4 text-lg font-semibold">Setup Instructions</h2>
				<div class="relative rounded-lg bg-gray-900 p-4 text-gray-100 [&_.token.comment]:text-gray-400 [&_.token.function]:text-blue-400 [&_.token.operator]:text-gray-300 [&_.token.punctuation]:text-gray-300 [&_.token.string]:text-emerald-300 [&_.token.command]:text-blue-300">
					<button
						on:click={() => {
							const text = getSetupInstructions().join('\n');
							navigator.clipboard.writeText(text);
						}}
						class="absolute right-2 top-2 rounded bg-gray-700 px-2 py-1 text-xs hover:bg-gray-600"
					>
						Copy
					</button>
					<pre class="whitespace-pre-wrap font-mono text-sm"><code class="language-bash">{getSetupInstructions().join('\n')}</code></pre>
				</div>
				<div class="mt-4 space-y-4">
					<div class="flex items-center justify-between">
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
							class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Download Script
						</button>
					</div>

					<div class="rounded-lg border border-gray-200 p-4">
						<p class="mb-3 text-sm text-gray-600">
							Share these instructions with others:
						</p>
						<div class="flex items-center space-x-2">
							<input
								type="text"
								readonly
								value={window.location.href}
								class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600"
							/>
							<button
								on:click={() => {
									navigator.clipboard.writeText(window.location.href);
								}}
								class="inline-flex items-center rounded-md bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
							>
								<svg class="mr-1.5 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
									<path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
									<path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
								</svg>
								Copy URL
							</button>
						</div>
					</div>
				</div>
				<div class="mt-6 border-t border-gray-200 pt-4">
					<h3 class="text-sm font-medium text-gray-900">Found an issue with these instructions?</h3>
					<div class="mt-3 flex space-x-4">
						<a
							href={`https://github.com/narthur/codebuff-tricks/issues/new?title=${encodeURIComponent(
								`Setup instructions issue for ${config.framework} with ${config.packageManager}`
							)}&body=${encodeURIComponent(
								`I found an issue with the setup instructions for the following configuration.

Configuration URL:
${window.location.href}

Configuration Details:

Configuration:
- Package Manager: ${config.packageManager}
- Framework: ${config.framework}
- TypeScript: ${config.typescript ? 'Yes' : 'No'}
- Deployment: ${config.deployment}

Generated Commands:
\`\`\`bash
${getSetupInstructions().join('\n')}
\`\`\`

Issue Description:
[Please describe the issue you found with these instructions]
`
							)}`}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
						>
							<svg class="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"/>
							</svg>
							Report an issue
						</a>
						<a
							href="https://github.com/narthur/codebuff-tricks/fork"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
						>
							<svg class="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
								<path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
							</svg>
							Fork and contribute
						</a>
					</div>
					<p class="mt-2 text-xs text-gray-500">
						Help us improve these instructions by reporting issues or submitting pull requests on GitHub.
					</p>
				</div>
			</div>
		{/if}

		<div class="mt-8 flex justify-between">
			<button
				on:click={prevStep}
				class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
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

	<div class="mx-auto mt-12 max-w-3xl text-center">
		<div class="rounded-lg bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-gray-900">Support This Project</h2>
			<p class="mb-6 text-gray-600">
				If you found this tool helpful, you can support its development in these ways:
			</p>
			<div class="flex justify-center space-x-4">
				<a
					href="https://ko-fi.com/narthur"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center rounded-md bg-[#FF5E5B] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff4542] focus:outline-none focus:ring-2 focus:ring-[#FF5E5B] focus:ring-offset-2"
				>
					<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
						<path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/>
					</svg>
					Buy me a coffee
				</a>
				<a
					href="https://codebuff.com/referrals/ref-6d348d54-80f1-4155-903b-2cc6c57dd12f"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					<svg class="mr-2 h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M12 4L4 8l8 4 8-4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4"/>
					</svg>
					Try Codebuff with my referral
				</a>
			</div>
		</div>
	</div>
</div>
