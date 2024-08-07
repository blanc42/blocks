<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
    import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "$lib/components/ui/drawer";
    import * as Select from "$lib/components/ui/select";
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from "@sveltejs/kit";
    import { showDialog, showDrawer, tasks, friends } from "$lib/stores/Store";
    import { PlusIcon } from "lucide-svelte";
    import type { InsertTask } from "$lib/database/schema";

    let newTask = {
        title: '',
        description: '',
        chronos: 0,
        deadline: new Date(),
        accountabilityPartnerId: undefined
    };

    let isMobile: boolean;

    const addTask: SubmitFunction = () => {
        return async ({ update, result }) => {
            console.log(newTask);

            await update();
            if (result.type === 'success') {
                const newTaskData = result.data?.task;
                if (newTaskData) {
                    $tasks = [...$tasks, newTaskData];
                    $showDrawer = false;
                    $showDialog = false;
                }
            }
        };
    }

    function checkMobile() {
        isMobile = window.innerWidth <= 768;
    }

    $: if (typeof window !== 'undefined') {
        checkMobile();
        window.addEventListener('resize', checkMobile);
    }
    
</script>

{#if isMobile}
<Drawer open={$showDrawer} onOpenChange={(open) => $showDrawer = open}>
    <DrawerTrigger asChild>
        <Button on:click={()=> $showDrawer = true}>
            <PlusIcon class="w-4 h-4 md:hidden" />
            <p class="hidden md:block">Add Task</p>
        </Button>
    </DrawerTrigger>
    <DrawerContent>
        <DrawerHeader>
            <DrawerTitle>Add Task</DrawerTitle>
            <DrawerDescription>Create a new task here</DrawerDescription>
        </DrawerHeader>
        <div class="p-4">
            <form method="POST" action="/?/addTask" use:enhance={addTask} class="space-y-4">

                <div class="space-y-2">
                    <Label for="title">Title</Label>
                    <Input id="title" name="title" bind:value={newTask.title} required />
                </div>
                <div class="space-y-2">
                    <Label for="description">Description</Label>
                    <Input id="description" name="description" bind:value={newTask.description} />
                </div>
                <div class="space-y-2">
                    <Label for="chronos">Chronos</Label>
                    <Input id="chronos" name="chronos" type="number" bind:value={newTask.chronos} required />
                </div>
                <div class="space-y-2">
                    <Label for="deadline">Deadline</Label>
                    <Input id="deadline" name="deadline" type="datetime-local" bind:value={newTask.deadline} required />
                </div>
                <div class="space-y-2">
                    <Label for="accountabilityPartnerId">Accountability Partner</Label>
                    <select
                        id="accountabilityPartnerId"
                        name="accountabilityPartnerId"
                        bind:value={newTask.accountabilityPartnerId}
                        class="w-full p-2 border rounded"
                    >
                        <option value="">Select a friend</option>
                        {#each $friends as friend}
                            <option value={friend.friendId.toString()}>{friend.friendUsername}</option>
                        {/each}
                    </select>
                </div>
                <Button type="submit">Add Task</Button>
            </form>
        </div>
    </DrawerContent>
</Drawer>
{:else}
<Dialog open={$showDialog} onOpenChange={(open) => $showDialog = open}>





    <DialogTrigger asChild>
        <Button on:click={()=> $showDialog = true}>
            <PlusIcon class="w-4 h-4 md:hidden" />
            <p class="hidden md:block">Add Task</p>
        </Button>
    </DialogTrigger>
    <DialogContent>


        <!-- <Select.Root
        selected={undefined}
        onSelectedChange={(v) => {
          v && (newTask.accountabilityPartnerId = v.value.toString());
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select a friend" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="m@example.com" label="m@example.com" />
          <Select.Item value="m@google.com" label="m@google.com" />
          <Select.Item value="m@support.com" label="m@support.com" />
        </Select.Content>
      </Select.Root> -->



        <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>Create a new task here</DialogDescription>
        </DialogHeader>
        <form method="POST" action="/?/addTask" use:enhance={addTask} class="space-y-4">
            <div class="space-y-2">
                <Label for="title">Title</Label>
                <Input id="title" name="title" bind:value={newTask.title} required />
            </div>
            <div class="space-y-2">
                <Label for="description">Description</Label>
                <Input id="description" name="description" bind:value={newTask.description} />
            </div>
            <div class="space-y-2">
                <Label for="chronos">Chronos</Label>
                <Input id="chronos" name="chronos" type="number" bind:value={newTask.chronos} required />
            </div>
            <div class="space-y-2">
                <Label for="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="datetime-local" bind:value={newTask.deadline} required />
            </div>
            <div class="space-y-2">
                <Label for="accountabilityPartnerId">Accountability Partner</Label>
                <select
                    id="accountabilityPartnerId"
                    name="accountabilityPartnerId"
                    bind:value={newTask.accountabilityPartnerId}
                    class="w-full p-2 border rounded"
                >
                    <option value="">Select a friend</option>
                    {#each $friends as friend}
                        <option value={friend.friendId.toString()}>{friend.friendUsername}</option>
                    {/each}
                </select>
            </div>
            <Button type="submit">Add Task</Button>
        </form>
    </DialogContent>
</Dialog>
{/if}