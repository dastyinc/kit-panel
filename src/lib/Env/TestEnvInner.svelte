<script lang="ts">
    import {setContext} from "svelte";
    import api from "$lib/utils/api";
    import throttle from "$lib/utils/throttle";
    import ws from "$lib/utils/ws";
    import {wsStore} from "$lib/utils/store";

    export let channel, account;


    setContext('account', account);
    setContext('channel', channel);
    setContext('utils', {
        api, throttle, ws, wsStore
    });
</script>
