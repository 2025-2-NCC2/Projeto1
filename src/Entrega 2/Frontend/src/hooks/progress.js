import { useMemo } from "react";

export const progressoKg = useMemo(() => {
  const metaKg = Number(sessionData?.foodGoal) || 0;
  const atualKg = Number(grupos?.current_food_collection) || 0;
  return metaKg > 0 ? Math.min(100, Math.round((atualKg / metaKg) * 100)) : 0;
}, [grupos]);

export const progressoBRL = useMemo(() => {
  const metaBRL = Number(sessionData?.monetaryTarget) || 0;
  const atualBRL = Number(grupos?.current_money_collection) || 0;
  return metaBRL > 0 ? Math.min(100, Math.round((atualBRL / metaBRL) * 100)) : 0;
}, [grupos]);