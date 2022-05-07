/* eslint-disable */
import { createZeroApi } from 'sveltekit-zero-api'
import type onWatch from 'sveltekit-zero-api/onWatch'

// Creating API entry-point to routes and exporting it below
const routes = createZeroApi<typeof onWatch>({
	// Deal with Error
	onError: async (err) => console.error('[API]', err)
});

/*
	routes.api   is eqv. to   /src/routes/api
	change it based on your API directory - or other desires.

	If you modified 'routes', remember to change the watch({ watchDir })
*/
export default routes.api