<script lang="ts">
    import AccountProvider from "$lib/Env/AccountProvider.svelte";
    import TestEnv from "$lib/Env/TestEnv.svelte";
</script>

{#if import.meta.env.DEV}
    <AccountProvider me let:account>
        {#if account.loaded}
            <TestEnv {account}>
                <slot/>
            </TestEnv>
        {/if}
    </AccountProvider>
{:else}
    <slot/>
{/if}
