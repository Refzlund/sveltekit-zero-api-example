<script lang="ts">
	import api from '$src/api'
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { flip } from 'svelte/animate'
	import type { ResponseBody } from 'sveltekit-zero-api'
	import type { SvelteErrorResponse, SvelteResponse } from 'sveltekit-zero-api/http'
	
	let errors: [number, string][] = []
	function error(message: string) {
		handleError({body: { error: message }})
	}
	function handleError(response: SvelteErrorResponse) {
		errors = [...errors, [Date.now().valueOf(), response.body.error]]
		setTimeout(() => { errors.shift(); errors = errors; }, 2000);
	}

	let products: ResponseBody<typeof api.products.get, 200> = []

	async function getProducts() {
		products = await api.products.get().error(handleError).$.ok(res => res.body)
	}

	let productName, value, location, stock
	async function addProduct() {
		if(!productName || !value)
			return error('Please fill-in product name and value')
		if(productName.length < 3)
			return error('Product name must be at least 3 characters')
		api.products.post({ body: { productName, value }, query: { location, stock } })
			.error(handleError)
			.created(res => {
				products = [...products, res.body]
				productName = value = location = stock = ''
			})
	}

	onMount(async () => {
		await getProducts()
		api.querytest.post({ 
			query: { 
				dateISO: new Date().toISOString(),
				date: new Date(),
				number: Math.random(),
				string: 'string',
				boolean: true,
				array: [1, 2, 3],
				object: { a: 1, b: "c&o=p;", d: false, e: [true, 0] },
				null: null,
				undefined: undefined
			},
			body: {
				dateISO: new Date().toISOString(),
				date: new Date(),
				number: Math.random(),
				string: 'string',
				boolean: true,
				array: [1, 2, 3],
				object: { a: 1, b: "c&o=p;", d: false, e: [true, 0] },
				null: null,
				undefined: undefined
			}
		})
		.ok(r => console.log(r.body))
	})

	
	
</script>


<div class="errors">
	{#each errors as [time, error] (time)}
		<div in:fly={{y:20}} out:fly={{y:-20, duration: 1500}} animate:flip={{duration: 2500}}>{error}</div>
	{/each}
</div>

<section>

	<div style="align-self: center;">
		<h3>Add product</h3>
		<form>
			<label>
				<span>Product name</span>
				<input type="text" name="productName" bind:value={productName} placeholder="Product name" required />
			</label>
			<label>
				<span>Value</span>
				<input type="number" name="value" bind:value={value} placeholder="Value" required />
			</label>
			<label>
				<span>Stock</span>
				<input type="number" name="value" bind:value={stock} placeholder="Stock" />
			</label>
			<label>
				<span>Location</span>
				<input type="text" name="location" bind:value={location} placeholder="Location" />
			</label>
			<button on:click|preventDefault={addProduct}>Add</button>
		</form>
	</div>

	<div>
		<div>
			<h3>List products</h3>
			<button on:click={getProducts}>Refresh</button>
		</div>
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Value</th>
					<th>Stock</th>
					<th>Location</th>
				</tr>
			</thead>
			<tbody>
				{#each products as product}
					<tr>
						<td>{product.productName}</td>
						<td>€{product.value}</td>
						<td>{product.stock}</td>
						<td>{product.location}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

</section>

<style>

	section {
		padding: 30px;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 500px));
		gap: 40px;
		width: 100vw;
		height: 100vh;
		justify-content: center;
	}

	div > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	button {
		height: 30px;
	}

	table {
		width: 100%;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.errors {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.errors > div {
		background: hsla(0, 100%, 50%, 0.4);
		color: white;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
	}
	
	input {
		padding: 2px;
		background-color: hsl(0,0%,15%);
		color: white;
		font-size: 1rem;
		margin-left: auto;
	}

	label {
		display: flex;
		gap: 15px;
		align-items: center;
	}


	form {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin-top: 5px;
	}

	button {
		background-color: hsl(240, 58%, 35%);
		color: white;
	}

	button:hover {
		cursor: pointer;
	}

	:global(:root) {
		font-size: 15px;
		color: white;
	}

	:global(body) {
		background-color: hsl(0,0%,10%);
		
		font-family: Verdana, Geneva, Tahoma, sans-serif;
		
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
</style>