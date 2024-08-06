<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from '@sveltejs/kit';

  let email = "test@test.com";
  let password = "1234567890";

  const handleSubmit : SubmitFunction= () => {
      return async ({ update }) => {
          await update();
      };
  };
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>

<h2>Login</h2>
<p>Enter your email and password to login</p>

<form method="POST" use:enhance={handleSubmit}>
  <div class="grid gap-4">
      <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" name="email" type="email" bind:value={email} required />
      </div>
      <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" name="password" type="password" bind:value={password} required />
      </div>
      <Button type="submit">Login</Button>
  </div>
</form>

<div class="mt-4 text-center">
  <a href="/auth/signup" class="text-sm text-primary hover:underline">Don't have an account? Sign up</a>
</div>