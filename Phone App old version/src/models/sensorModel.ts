import { supabase } from '../supabaseClient';

/**
 * Fetch the most recent sensor readings (temperature, humidity, weight).
 *
 * @returns An object containing:
 *          - temp | the latest temperature in °C (or null if none)  
 *          - hum  | the latest relative-humidity value in % (or null if none)  
 *          - wt   | the latest weight measurement in kg (or null if none)
 *
 * The query:
 *   1. Targets the 'sensor_data' table.
 *   2. Selects only the three columns we care about.
 *   3. Orders rows by 'created_at' descending so the newest row is first.
 *   4. Limits the result set to a single row.
 *   5. Calls '.single()' so 'data' is a plain object rather than an array.
 * If any column is missing, we fall back to 'null' to keep the return type stable.
 */
export const fetchLatestSensorValues = async (): Promise<{temp:number|null, hum:number|null, wt:number|null}> => {
  const { data } = await supabase
    .from('sensor_data')
    .select('temperature, humidity, weight')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return { temp: data?.temperature ?? null, hum: data?.humidity ?? null, wt: data?.weight ?? null };
};

export const fetchStreamUrlForHive = async (hiveCode) => {
  const { data, error } = await supabase
    .from('camera_streams')
    .select('stream_url')
    .eq('hive_code', hiveCode)
    .eq('is_active', true)
    .single();

  return data?.stream_url ?? null;
};

export const fetchAudioStreamUrlForHive = async (hiveCode) => {
  const { data, error } = await supabase
    .from('audio_streams')
    .select('stream_url')
    .eq('hive_code', hiveCode)
    .eq('is_active', true)
    .limit(1);

  if (error) {
    console.error('Erreur récupération audio stream:', error.message);
    return null;
  }

  return data?.[0]?.stream_url ?? null;
};


/**
 * Open a realtime subscription to every INSERT/UPDATE/DELETE event
 * on the 'sensor_data' table.
 *
 * @param cb – Callback that receives the *entire* new row whenever a
 *             change occurs.
 */
export const subscribeTemperature = (cb: (t: number) => void) =>
  supabase
    .channel('realtime:public:sensor_data')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'sensor_data' },
      payload => payload.new && cb(payload.new)
    )
    .subscribe();
