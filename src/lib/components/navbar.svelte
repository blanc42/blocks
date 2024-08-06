<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import AddTask from "$lib/components/addTask.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Avatar from "$lib/components/ui/avatar";
    import { PlusIcon } from "lucide-svelte";
    import { goto } from "$app/navigation";
</script>

<nav class="bg-background border-b">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-xl font-bold">TaskMaster</a>
                </div>

            </div>
            <div class="flex items-center gap-2">
                <AddTask />
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Avatar.Root>
                            <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
                            <Avatar.Fallback>CN</Avatar.Fallback>
                        </Avatar.Root>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-48">
                        <DropdownMenu.Group>
                            <DropdownMenu.Item on:click={() => goto("/profile")}>
                                Profile
                            </DropdownMenu.Item>
                            <DropdownMenu.Item on:click={() => goto("/login")}>
                                Login
                            </DropdownMenu.Item>
                            <DropdownMenu.Item on:click={() => goto("/signup")}>
                                Signup
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item on:click={() => {
                                console.log("logout");
                                // Add actual logout logic here
                            }}>
                                Logout
                            </DropdownMenu.Item>
                        </DropdownMenu.Group>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>
    </div>
</nav>
