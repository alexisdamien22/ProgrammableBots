export const assets = {
    list: {},

    load(name, src, w = 1, h = 1) {
        if (this.list[name]) return Promise.resolve(this.list[name]);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.list[name] = { img, w, h };
                resolve(this.list[name]); // asset ready
            };
            img.onerror = (ev) => reject(new Error(`Failed to load ${src}`));
            img.src = src;
        });
    },

    get(name) {
        return this.list[name];
    }
};
