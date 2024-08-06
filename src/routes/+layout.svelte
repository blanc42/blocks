<script>
	import '$lib/app.css';
    import Navbar from '$lib/components/navbar.svelte';
    import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<div class="bg-white h-screen flex flex-col dark:bg-[#1f1f1f]">
	<Navbar />
	<slot />
</div>
