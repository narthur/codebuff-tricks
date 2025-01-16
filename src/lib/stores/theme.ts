import { browser } from '$app/environment';
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark';

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
	if (!browser) return 'light';
	
	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') return stored;
	
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme = writable<Theme>(getInitialTheme());

// Update document class and localStorage when theme changes
if (browser) {
	theme.subscribe(value => {
		localStorage.setItem('theme', value);
		if (value === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	});
}
