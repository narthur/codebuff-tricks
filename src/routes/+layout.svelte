<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	let { children } = $props();

	function toggleTheme() {
		theme.update(t => (t === 'light' ? 'dark' : 'light'));
	}
</script>

<div class="relative">
	<button
		class="fixed right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"    onclick={toggleTheme}
		aria-label="Toggle dark mode"
	>
		{#if $theme === 'dark'}
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		{:else}
			<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		{/if}
	</button>

	{@render children()}
</div>
