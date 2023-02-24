import { useEffect, EffectCallback } from "react";

export const useOnMount = (callback: EffectCallback) => useEffect(callback, []);
