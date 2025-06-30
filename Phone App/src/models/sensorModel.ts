import { supabase } from '../supabaseClient';

export async function fetchLastSnapshot(hiveId: string) {
  const { data, error } = await supabase
    .from('sensor_data')
    .select('temperature, humidity, weight')
    .eq('hive_id', hiveId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function subscribeLiveSensors(
  hiveId: string,
  cb: (row: any) => void
) {
  return supabase
    .channel('realtime:public:sensor_data')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'sensor_data',
        filter: `hive_id=eq.${hiveId}`,
      },
      payload => payload.new && cb(payload.new)
    )
    .subscribe();
}

export async function fetchCameraStreamUrl(hiveId: string) {
  const { data, error } = await supabase
    .from('camera_streams')
    .select('stream_url')
    .eq('hive_id', hiveId)
    .eq('is_active', true)
    .maybeSingle();

  if (error) throw error;
  return data?.stream_url ?? null;
}

export async function fetchAudioStreamUrl(hiveId: string) {
  const { data, error } = await supabase
    .from('audio_streams')
    .select('stream_url')
    .eq('hive_id', hiveId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.stream_url ?? null;
}

export async function fetchSeries(
  hiveId: string,
  range: '24h' | '7d' | '30d'
) {
  const param = {
    '24h':  { since: '24 hours', bucket: '1 hour'  },
    '7d':   { since: '7 days',   bucket: '1 day'   },
    '30d':  { since: '30 days',  bucket: '3 days'  },
  }[range];

  const { data, error } = await supabase.rpc('sensor_buckets', {
    p_hive:   hiveId,
    p_since:  param.since,
    p_bucket: param.bucket,
  });

  if (error) throw error;

  return {
    labels: data.map((r: any) => r.lbl),
    temps:  data.map((r: any) => Number(r.avg_temp)),
    hums:   data.map((r: any) => Number(r.avg_hum)),
  };
}