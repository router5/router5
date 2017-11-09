export function omitMeta(obj) {
    return {
        name: obj.name,
        params: obj.params,
        path: obj.path
    }
}
