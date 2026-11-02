// src/model/keys.ts
const prefix = "data:alemonjs-roco";
const rocoKeys = { base: (data) => `${prefix}${data ?? ""}` };

export { rocoKeys };