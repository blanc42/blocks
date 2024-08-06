<script lang="ts">
    let tasks: string[] = [];
    let newTask = '';

    async function fetchTasks() {
        const response = await fetch('/api/tasks');
        const data = await response.json();
        tasks = data.tasks;
    }

    async function addTask() {
        if (newTask.trim()) {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: newTask }),
            });
            if (response.ok) {
                newTask = '';
                await fetchTasks();
            }
        }
    }

    fetchTasks();
</script>

<h1>Task Manager</h1>

<form on:submit|preventDefault={addTask}>
    <input bind:value={newTask} placeholder="Enter a new task" />
    <button type="submit">Add Task</button>
</form>

<ul>
    {#each tasks as task}
        <li>{task}</li>
    {/each}
</ul>