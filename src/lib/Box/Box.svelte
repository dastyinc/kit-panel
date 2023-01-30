<script lang="ts">
    import Expand from "$lib/Expand";

    export let style = "", hoverScale = false, hoverCursor = false, _fade = false, expand = false;
    export let blur = false, shadow = false, textCenter = false, background = '', bindWidth = false;
    export let onClick = () => null;
</script>

<div class="box" class:hoverScale {style} on:click={onClick} style:cursor={hoverCursor ? 'cursor' : ''}
     style:box-shadow={shadow ? '0 10px 10px 0 rgba(0, 0, 0, 0.3)' : ''} style:text-align={textCenter ? 'center' : ''}>
    <div class="background" class:blur style:background={background}></div>
    <main style="position:relative;">
        {#if expand}
            <Expand {bindWidth}>
                <slot/>
            </Expand>
        {:else}
            <slot/>
        {/if}
    </main>
</div>

<style lang="scss">
  .box {
    height: fit-content;
    border-radius: 20px;
    transition: 0.2s;
    position: relative;
    z-index: 10;

    .hoverScale:hover {
      scale: 1.04;
    }
  }

  .background {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 20px;

    &.blur {
      backdrop-filter: blur(10px);
    }
  }
</style>
