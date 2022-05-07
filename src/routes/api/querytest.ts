import { querySpread, type API } from 'sveltekit-zero-api'
import { Ok } from 'sveltekit-zero-api/http'

type Types = {
	dateISO: Date | string,
	date: Date,
	number: number,
	string: string,
	boolean: boolean,
	array: any[],
	object: { a: number, b: string, d: boolean, e: any[] },
	null: null,
	undefined: undefined
}

interface Post {
	query: Types
	body: Types
}

// get
export const post = async (event: API<Post>) => {
	const { dateISO, date, number, string, boolean, array, object, null: null_, undefined: undefined_ } = querySpread(event.url.searchParams)
	const { dateISO: dateISO_, date: date_, number: number_, string: string_, boolean: boolean_, array: array_, object: object_, null: null__, undefined: undefined__ } = await event.request.json()
	console.log('query', { dateISO, date, number, string, boolean, array, object, null: null_, undefined: undefined_ })
	console.log('body', { dateISO: dateISO_, date: date_, number: number_, string: string_, boolean: boolean_, array: array_, object: object_, null: null__, undefined: undefined__ })
	return Ok({
		body: { 
			query: { dateISO, date, number, string, boolean, array, object, null: null_, undefined: undefined_ },
			body: { dateISO: dateISO_, date: date_, number: number_, string: string_, boolean: boolean_, array: array_, object: object_, null: null__, undefined: undefined__ }
		}
	})
}