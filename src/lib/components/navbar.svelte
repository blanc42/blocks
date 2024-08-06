
<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import AddTask from "$lib/components/addTask.svelte";
</script>

<nav class="bg-background border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/dashboard" class="text-xl font-bold">TaskMaster</a>
                </div>
                <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/dashboard" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Dashboard
                    </a>
                    <a href="/profile" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                        Profile
                    </a>
                </div>
            </div>
            <div class="flex items-center">
                <AddTask />
            </div>
        </div>
    </div>
</nav>
