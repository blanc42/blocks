<script lang="ts">
    import { enhance } from '$app/forms';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "$lib/components/ui/table";
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { PageData } from './$types';
    import { friends } from '$lib/stores/Store';

    export let data: PageData;
    let addFriendError: string | null = null;

    const handleAddFriend: SubmitFunction = () => {
        return async ({ result, formElement }) => {
            if (result.type === 'failure') {
                addFriendError = result.data?.error || 'An error occurred';
            } else {
                addFriendError = null;
            }
            formElement.reset();
        };
    };

    const handleFriendRequest: SubmitFunction = () => {
        return async ({ result, update }) => {
            await update();
            if (result.type === 'success' && result.data?.friend) {
                $friends = [...$friends, result.data.newFriend];
            }
        };
    };
</script>

<svelte:head>
    <title>Friends</title>
</svelte:head>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Friends</h1>

    <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">Add a Friend</h2>
        <form method="POST" action="?/addFriend" use:enhance={handleAddFriend} class="flex gap-4 items-end">
            <div class="flex-grow">
                <Label for="username" class="mb-2">Friend's Username</Label>
                <Input type="text" id="username" name="username" placeholder="Enter username" required />
            </div>
            <Button type="submit">Add Friend</Button>
        </form>
        {#if addFriendError}
            <p class="text-red-500 mt-2">{addFriendError}</p>
        {/if}
    </div>

    {#if data.pendingRequests.length > 0}
        <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-4">Friend Requests</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each data.pendingRequests as request}
                        <TableRow>
                            <TableCell>{request.senderUsername}</TableCell>
                            <TableCell>
                                <form method="POST" action="?/acceptFriendRequest" use:enhance={handleFriendRequest} class="inline-block mr-2">
                                    <input type="hidden" name="requestId" value={request.id} />
                                    <Button type="submit" variant="outline">Accept</Button>
                                </form>
                                <form method="POST" action="?/ignoreFriendRequest" use:enhance={handleFriendRequest} class="inline-block">
                                    <input type="hidden" name="requestId" value={request.id} />
                                    <Button type="submit" variant="outline">Ignore</Button>
                                </form>
                            </TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </div>
    {/if}

    <div>
        <h2 class="text-2xl font-semibold mb-4">Your Friends</h2>
        {#if data.friends.length > 0}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Chronos Owed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each data.friends as friend}
                        <TableRow>
                            <TableCell>{friend.username}</TableCell>
                            <TableCell>{friend.chronosOwed || 0}</TableCell>
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        {:else}
            <p class="text-gray-500">You haven't added any friends yet.</p>
        {/if}
    </div>
</div>