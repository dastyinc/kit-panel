<script lang="ts">
    import {tweened} from "svelte/motion";
    import {quartOut} from "svelte/easing";

    export let bindWidth = false, dur = 400;
    let clientHeight = 0, clientWidth = 0;
    const height = tweened(clientHeight, {duration: dur, easing: quartOut});

    $: $height = clientHeight;
</script>


<main style:height="{$height}px" style:width={bindWidth ? `${clientWidth}px` : ''}>
    <div style="position: absolute;width:100%;" bind:clientHeight>
        <div style="position: relative" bind:clientWidth style:width={bindWidth ? 'fit-content' : ''}>
            <slot/>
        </div>
    </div>
</main>

<style lang="scss">
  main {
    position: relative;
    overflow: hidden;
    width: 100%;
    border-radius: 20px;
  }
</style>