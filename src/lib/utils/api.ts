import {writable} from 'svelte/store';
import {serialize, deserialize} from 'bson';

export const endpoint = import.meta.env.DEV
    ? 'http://localhost:2300'
    : import.meta.env.VITE_CI
        ? 'https://api-ci.herewe.space'
        : 'https://api.herewe.space';

export const wsUrl = (channel: string) =>
    import.meta.env.DEV
        ? `ws://localhost:2300/chat/${channel}`
        : import.meta.env.VITE_CI
            ? `wss://api-ci.herewe.space/chat/${channel}`
            : `wss://api.herewe.space/chat/${channel}`;

export default function api(
    path: string,
    data: any = undefined,
    method = 'POST'
): Promise<{ data: any }> {
    return new Promise(async (resolve, reject) => {
        fetch(endpoint + path, {
            credentials: 'include',
            method: data ? method : 'GET',
            headers: {
                'Content-Type': 'application/bson',
                'Accept': 'application/bson'
            },
            body: data ? serialize(data) : undefined,
            redirect: 'follow',
            referrerPolicy: 'no-referrer'
        })
            .then(async (res) => deserialize(await res.arrayBuffer()))
            .then((res) => {
                if (import.meta.env.DEV) console.log(`API Call(${path}) : `, res);
                if (!res.error) resolve(res.data);
                else reject({...res, toString: () => `APIError(${res.code}): ${res.error}`});
            })
            .catch(reject);
    });
}

export function upload(files: FileList) {
    const progress = writable(0);
    const promise: Promise<any> & { progress?: any } = new Promise(async (resolve, reject) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        // support progress
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint + '/upload');
        xhr.send(formData);
        xhr.onload = () => {
            resolve(JSON.parse(xhr.response).data);
        };
        xhr.onerror = reject;
        xhr.onprogress = (e) => {
            progress.set(e.loaded / e.total);
        };
    });
    promise.progress = (cb: (progress: number) => void) => {
        progress.subscribe(cb);
        return promise;
    };
}
