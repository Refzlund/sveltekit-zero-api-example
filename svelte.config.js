import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import watchAPI from 'sveltekit-zero-api/watch'
import path from 'path'

if (process.env.NODE_ENV !== 'production') {
    watchAPI({})
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$src: path.resolve('src')
				}
			}
		}
	}
};

export default config;
