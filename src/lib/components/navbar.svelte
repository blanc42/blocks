<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import AddTask from "$lib/components/addTask.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import * as Avatar from "$lib/components/ui/avatar";
    import { goto } from "$app/navigation";
    import Sun from "lucide-svelte/icons/sun";
  import Moon from "lucide-svelte/icons/moon";
 
    import { toggleMode } from "mode-watcher";
    import { ModeWatcher } from "mode-watcher";
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
                <Button on:click={toggleMode} variant="outline" size="icon">
                    <Sun
                      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                    />
                    <Moon
                      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                    />
                    <span class="sr-only">Toggle theme</span>
                  </Button>
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
