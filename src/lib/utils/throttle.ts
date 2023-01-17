export default function throttle(f: (...args: any[]) => void, ms: number = 100) {
    let lastExecution = 0, timer: number | null = null;

    const wrapper = (...args: any[]) => {
        const now = Date.now();
        if (now - lastExecution >= ms) {
            lastExecution = now;
            f(...args);
        } else {
            if (timer) clearTimeout(timer);
            timer = <any>setTimeout(() => {
                lastExecution = Date.now();
                f(...args);
                timer = null;
            }, ms - (now - lastExecution));
        }
    }

    return wrapper;
}
