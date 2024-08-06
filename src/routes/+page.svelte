<script lang="ts">
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import type { SelectTask } from '$lib/database/schema';
    import type { SubmitFunction } from "@sveltejs/kit";
    import { tasks, ktaTasks } from '$lib/stores/Store';
    export let data: PageData;


    $tasks = data.tasks;
    $ktaTasks = data.ktaTasks;
   

    const completeTask: SubmitFunction = () => {
        return async ({ update, result }) => {
            await update();
            if (result.type === 'success') {
                const updatedTask = result.data?.task;
                if (updatedTask) {
                    $tasks = $tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                }
            }
        };
    }


</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Dashboard</h1>

    <Tabs>
        <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="kta">Keep Them Accountable</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
            <h2 class="text-2xl font-semibold mt-8 mb-2">Unfinished Tasks</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Complete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each $tasks.filter(task => !task.isCompleted && new Date(task.deadline) > new Date()) as task}
                        <TableRow>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{new Date(task.deadline).toLocaleString()}</TableCell>
                            <TableCell>
                                <form method="POST" action="?/completeTask" use:enhance={completeTask}>
                                    <input type="hidden" name="taskId" value={task.id}>
                                    <Checkbox name="completed" />
                                </form>
                            </TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>

            <h2 class="text-2xl font-semibold mt-8 mb-2">Overdue Tasks</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Complete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each $tasks.filter(task => !task.isCompleted && new Date(task.deadline) <= new Date()) as task}
                        <TableRow>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{new Date(task.deadline).toLocaleString()}</TableCell>
                            <TableCell>
                                <form method="POST" action="?/completeTask" use:enhance={completeTask}>
                                    <input type="hidden" name="taskId" value={task.id}>
                                    <Checkbox name="completed" />
                                </form>
                            </TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </TabsContent>
        <TabsContent value="kta">
            <h2 class="text-2xl font-semibold mb-2">Tasks to Keep Accountable</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Chronos</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each $ktaTasks as task}
                        <TableRow>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.chronos}</TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </TabsContent>
    </Tabs>
</div>
