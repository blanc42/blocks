<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "$lib/components/ui/dialog";
    import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "$lib/components/ui/drawer";
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from "@sveltejs/kit";
    import { showDialog, showDrawer, tasks } from "$lib/stores/Store";
    import { PlusIcon, PlusSquare } from "lucide-svelte";


    let newTask = {
        title: '',
        description: '',
        chronos: 0,
        deadline: '',
        accountabilityPartnerId: ''
    };

    let isMobile: boolean;

    const addTask: SubmitFunction = () => {
        return async ({ update, result }) => {
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
            <DrawerTitle>
                Add Task
            </DrawerTitle>
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
                    <Label for="accountabilityPartnerId">Partner ID</Label>
                    <Input id="accountabilityPartnerId" name="accountabilityPartnerId" bind:value={newTask.accountabilityPartnerId} required />
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
                <Label for="accountabilityPartnerId">Partner ID</Label>
                <Input id="accountabilityPartnerId" name="accountabilityPartnerId" bind:value={newTask.accountabilityPartnerId} required />
            </div>
            <Button type="submit">Add Task</Button>
        </form>
    </DialogContent>
</Dialog>
{/if}