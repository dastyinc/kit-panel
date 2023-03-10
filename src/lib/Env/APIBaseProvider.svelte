<script lang="ts" context="module">
    const cache = {};
</script>

<script lang="ts">
    import {onDestroy, onMount, setContext, tick} from "svelte";
    import {writable} from "svelte/store";
    import api from "$lib/utils/api";

    export let type: string, defaultValue = {}, noCache = false;

    const object = writable(<any>defaultValue);

    export let id: number, view = '', endpoint = '', nullable = false,
        load = true, ignore = false, loaded = false, store = object;
    let ts = Date.now();

    setContext(type, object);
    $: _endpoint = endpoint || `/${type}/${id}${view ? `?view=${view}` : ''}`;

    $: if ((nullable || id) && load) tick().then(() => {
        let _id = id + '@' + view;
        void ts;
        if (!cache[type]) cache[type] = new Map<number, Promise<any>>();
        if (cache[type].has(_id)) {
            loaded = false;
            cache[type].get(_id).then(async (r) => {
                await tick();
                await tick();
                object.set(r);
                await tick();
                loaded = true;
            });
        } else {
            loaded = false;
            const pr = new Promise(resolve => {
                api(_endpoint).then(async (r) => {
                    r.loaded = true;
                    await tick();
                    await tick();
                    object.set(r);
                    await tick();
                    loaded = true;
                    resolve(r);
                }).catch(async (error) => {
                    await tick();
                    await tick();
                    object.set({error, loaded: true});
                    await tick();
                    loaded = true;
                    if (ignore) resolve({error});
                })
            });
            if (!noCache) cache[type].set(_id, pr);
        }
    });

    onMount(() => {
        const refresh = () => ts++;
        window.addEventListener('authRefresh', refresh);
        return () => window.removeEventListener('authRefresh', refresh);
    })
</script>

<slot {...{[type]: $store}} {store} {loaded}/>
