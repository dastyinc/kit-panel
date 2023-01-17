<script lang="ts">
    import TestEnv from "$lib/Env/TestEnv.svelte";
</script>

{#if import.meta.env.DEV}
    <TestEnv>
        <slot/>
    </TestEnv>
{:else}
    <slot/>
{/if}
