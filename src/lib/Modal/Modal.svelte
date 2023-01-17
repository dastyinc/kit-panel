<script lang="ts">
    import {fade} from "svelte/transition";
    import Box from "$lib/Box";

    export let showModal = false;
</script>

{#if showModal}
    <div class="modal" on:click={() => showModal = false} transition:fade>
        <Box center bindWidth background="#ffffff" style="padding: 3.125rem;">
            <div on:click|stopPropagation>
                <slot/>
            </div>
        </Box>
    </div>
{/if}

<style lang="scss">
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999999999;
  }
</style>
