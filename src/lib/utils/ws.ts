import ReconnectingWebSocket from 'reconnecting-websocket';
import {writable, readable} from "svelte/store";
import type {Writable, Readable} from "svelte/store";
import {wsUrl} from "$lib/utils/api";
import {makeStoreNotNull, wsStore} from "$lib/utils/store";

interface wsWrapper {
    ws: ReconnectingWebSocket;
    uid: string;
    message: Readable<any>;
    error: Readable<any>;
    send: (data: any) => any;
    close: () => any;
    unsubscribe: () => any;
}

interface wsConn extends Promise<wsWrapper> {
    conn: any;
}

const pending = new Map<string, wsConn>();
const stores = new Map<string, wsWrapper>();
const count = new Map<string, number>();
const pingTimeouts = new Map<string, number>();


function setPingTimeout(id: string, closeWs: any) {
    clearTimeout(pingTimeouts.get(id));
    pingTimeouts.set(id, <any>setTimeout(() => {
        closeWs();
    }, 21000));
}

export default function (channel: string, type?: string) {
    const id = type ? channel + ':' + type : channel;
    count.set(id, (count.get(id) || 0) + 1);

    if (pending.has(id)) return pending.get(id);
    const pr = new Promise<wsWrapper>((resolve, reject) => {
        if (stores.has(id)) {
            resolve(<wsWrapper>stores.get(id));
            return;
        }

        const ws = new ReconnectingWebSocket(wsUrl(channel) + (type ? '?virtual=1&type=' + type : ''));

        const message = makeStoreNotNull(readable(<any>null, (set) => {
            ws.addEventListener('message', (e) => {
                set(JSON.parse(e.data));
            });

            return () => unsubscribe();
        }));

        const error = readable(<any>null, (set) => {
            ws.addEventListener('error', (e) => {
                set(e);
            });
        });

        const send = (data: any) => ws.send(JSON.stringify(data));
        const close = () => ws.close();
        const unsubscribe = () => {
            count.set(id, (count.get(id) || 0) - 1);
            console.log(id, count.get(id));
            if (count.get(id) === 0) {
                ws.close();
                stores.delete(id);
                pending.delete(id);
            }
        }

        const uidReader = (e: MessageEvent) => {
            const data = JSON.parse(e.data);
            if (data.type === "CONNECT") {
                const uid = data.id;
                ws.removeEventListener('message', uidReader);
                const res = {ws, message, error, send, close, uid, unsubscribe};
                stores.set(id, res);
                setPingTimeout(id, () => {
                    ws.close();
                });
                resolve(res);
            }
            if (data.type === "ERROR") {
                reject(data);
            }
        }

        wsStore(message, 'PING').subscribe(() => {
            send({type: 'PONG'});
            setPingTimeout(id, () => {
                ws.close();
            });
        });

        ws.addEventListener('message', uidReader);
    });

    const res = {
        ...pr,
        conn: (handler: any, errorHandler?: any) => {
            let unsub: () => any;
            pr.then((res) => {
                unsub = res.unsubscribe;
                handler(res)?.then()
            }).catch(errorHandler);
            return () => unsub && unsub();
        },
    }

    pending.set(id, res);
    return res;
}
