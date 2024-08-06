<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { enhance } from "$app/forms";

    import type { SubmitFunction } from '@sveltejs/kit';
    
    let username = "test";
    let email = "test@test.com";
    let password = "1234567890";
    let taskTitle = "";
    let taskDescription = "";
    let taskChronos = 1;
    let taskDeadline = "";

    const handleSubmit: SubmitFunction = () => {
        return async ({ update, result }) => {
            await update();
            if (result.status === 200) {
                console.log(result);
            }
        };
    };

    // export let form;
</script>

<svelte:head>
    <title>Sign Up</title>
</svelte:head>

<h2>Sign Up</h2>
<p>Create your account</p>

<form method="POST" use:enhance={handleSubmit}>
    <div class="grid gap-4">
        <div class="grid gap-2">
            <Label for="username">Username</Label>
            <Input id="username" name="username" type="text" bind:value={username} required />
        </div>
        <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" name="email" type="email" bind:value={email} required />
        </div>
        <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" name="password" type="password" bind:value={password} required />
        </div>
        
        <Button type="submit">Sign Up and Create Task</Button>
    </div>
</form>

<div class="mt-4 text-center">
    <a href="/auth/login" class="text-sm text-primary hover:underline">Already have an account? Log in</a>
</div>