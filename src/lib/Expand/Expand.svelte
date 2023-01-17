<script lang="ts">
    import {tweened} from "svelte/motion";
    import {quartOut} from "svelte/easing";

    export let bindWidth = false;
    let clientHeight = 0, clientWidth = 0;
    const height = tweened(clientHeight, {duration: 400, easing: quartOut});

    $: $height = clientHeight;
</script>


<main style:height="{$height}px" style:width={bindWidth ? `${clientWidth}px` : ''}
      style="position: relative;overflow:hidden;margin: -1.875rem;padding:1.875rem;width: 100%;">
    <div style="position: absolute;width:calc(100% - 3.75rem);" bind:clientHeight>
        <div style="position: relative" bind:clientWidth style:width={bindWidth ? 'fit-content' : ''}>
            <slot/>
        </div>
    </div>
</main>
