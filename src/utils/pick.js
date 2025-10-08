/** Pick keys from an object */
module.exports = (obj, keys = []) => {
    const out = {};
    keys.forEach((k) => { if (obj[k] !== undefined) out[k] = obj[k]; });
    return out;
};