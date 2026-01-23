export const assets = {
    list: {},

    load(name, src, w = 1, h = 1) {
        const img = new Image();
        img.src = src;

        this.list[name] = { img, w, h };
    },

    get(name) {
        return this.list[name];
    }
};
