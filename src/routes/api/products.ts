import { querySpread, type API } from 'sveltekit-zero-api'
// Import any Any generalized response-code (About 47 included)
import { Ok, Created, BadRequest, Accepted } from 'sveltekit-zero-api/http'

// We define what parameters the endpoint accepts
interface Post {
	// (?) makes a field optional
	query?: {
		stock?: number,
		location?: string
	},
	body: {
		productName: string,
		value: number
	}
}

// As an example of something you might have
type Product = {
	productName: string,
	value: number,
	stock: number,
	location: string
}
let products: Product[] = []

// We pass our Interface into API<> to enable type-safety
export const post = async (event: API<Post>) => {
	const { searchParams } = event.url

	// Both values will be strings, since we can't determine their types
	// - Only objects can have determinated value type. They get converted to an object if passed to API *read querySpread
	let { stock, location } = querySpread(searchParams)
	console.log({ location, stock });
	// Apply default values if they are not set
	location ??= 'Unknown location'
	stock ??= 1
	

	// Type-safe as expected
	const { productName, value } = await event.request.json()

	// Make sure we get the expected inputs
	if (!productName)
		return BadRequest({ error: 'productName is required' })
	if (!value)
		return BadRequest({ error: 'value is required' })
	if (productName.length < 3 || productName.length > 16)
		return BadRequest({ error: 'productName must be between 3 and 16 characters' })
	if (value < 0.50 || value > 1000.00)
		return BadRequest({ error: 'value must be between 0.50 and 100.00' })
	if (stock && typeof stock !== 'number')
		return BadRequest({ error: 'stock must be a number' })
	if (location && typeof location !== 'string')
		return BadRequest({ error: 'location must be a string' })
	if (location && location.length < 3 || location.length > 16)
		return BadRequest({ error: 'location must be between 3 and 16 characters' })
	
	// Check if already exists
	let exists = products.find(p => p.productName == productName)
	if (exists)
		return BadRequest({ error: `${productName} already exists` })

	// products is an array to simulate a database - don't actually do this unless you know what you're doing
	let product: Product = { productName, value, stock, location }	
	products.push(product)

	// We return Created (status 201) as a successful request
	return Created({
		// Returning newly created product
		body: product
	})
}

interface Get {
	query?: {
		productName: string
	}
}

export const get = async (event: API<Get>) => {
	const { searchParams } = event.url

	const { productName } = querySpread(searchParams)

	if (productName) {
		const item = products.find(p => p.productName == productName)
		if (!item)
			return BadRequest({ error: `${productName} does not exist` })
		return Accepted({ body: item })
	}

	return Ok({ body: products })
}
