<script>
	import '$lib/app.css';
    import Navbar from '$lib/components/navbar.svelte';
</script>

<div class="bg-white h-screen flex flex-col">
	<Navbar />
	<slot />
</div>
