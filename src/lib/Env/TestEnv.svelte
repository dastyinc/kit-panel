<script lang="ts">
    import {ThemeProvider} from 'nunui';
    import {setContext} from 'svelte';
    import api from "$lib/utils/api";
    import throttle from "$lib/utils/throttle";
    import ws from "$lib/utils/ws";
    import {wsStore} from "$lib/utils/store";
    import Box from "$lib/Box";

    export let account;

    setContext('channel', 'test');
    setContext('account', account);
    setContext('utils', {
        api, throttle, ws, wsStore
    });
</script>

<ThemeProvider primary="#de5095" onPrimary="#000000" onSurface="#ffffff" surface="#000000">
    <main>
        <nav>
            <Box blur background="radial-gradient(circle at 0 0, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4) 128%)"
                 style="margin-bottom: 10px; padding: 1.5rem 1.875rem 1.875rem 1.875rem;">
                <slot/>
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
    background: black;
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
