import { useEffect, useState } from 'react';
import { fetchLatestSensorValues, subscribeTemperature } from '../models/sensorModel';

/**
 * React hook acting as the "Presenter" in an MVP architecture.
 *
 * Exposes three pieces of state—temperature, humidity, and weight—sourced from Supabase.
 * It :
 *    1. Pulls the most recent snapshot when the component mounts.
 *    2. Opens a realtime subscription so the UI updates instantly on change.
 *
 * @returns An object with the current values:
 *          - temp | latest temperature in °C (or null)  
 *          - hum  | latest relative-humidity in % (or null)  
 *          - wt   | latest weight in kg (or null)
 */
export const useSensorPresenter = () => {
  const [temp, setTemp] = useState<number|null>(null);
  const [hum,  setHum ] = useState<number|null>(null);
  const [wt,   setWt  ] = useState<number|null>(null);

  useEffect(() => {
    (async () => {
      const { temp, hum, wt } = await fetchLatestSensorValues();
      setTemp(temp); setHum(hum); setWt(wt);
    })();
    const ch = subscribeTemperature(({ temperature, humidity, weight }) => {
      setTemp(temperature);
      setHum(humidity);
      setWt(weight);
    });
    return () => ch.unsubscribe();
  }, []);// Empty dependency array → run once on mount.

  return { temp, hum, wt };
};
