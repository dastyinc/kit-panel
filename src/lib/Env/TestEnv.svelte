<script lang="ts">
    import {Input, ThemeProvider} from 'nunui';
    import Box from "$lib/Box";
    import TestEnvInner from "$lib/Env/TestEnvInner.svelte";

    export let account;
    let channel = 'test';
</script>

<ThemeProvider primary="#de5095" onPrimary="#000000" onSurface="#ffffff" surface="#000000">
    <span style="z-index: 1;position: relative">
        <Input placeholder="Channel" bind:value={channel}/>
    </span>
    <main>
        <nav>
            <Box background="#1c1c1e" expand>
                {#key channel}
                    <TestEnvInner {channel} {account}>
                        <slot/>
                    </TestEnvInner>
                {/key}
            </Box>
        </nav>
    </main>
</ThemeProvider>

<style lang="scss">
  @import url(//spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css);

  main {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font: normal 16px 'Spoqa Han Sans Neo', 'sans-serif';
    background: #222222;
    color: white;

    nav {
      width: 21.8%;
      max-width: 26.25rem;
      min-width: 23.75rem;
      max-height: 88%;
      overflow-y: auto;
      scroll-behavior: smooth;

      * {
        -webkit-tap-highlight-color: transparent;
      }
    }
  }
</style>
