import i18n from 'i18next';

/**
 * rnd – Return a random floating-point number between 𝑚𝑖𝑛 and 𝑚𝑎𝑥
 *       with one decimal place of precision.
 *
 * @param min | inclusive lower bound
 * @param max | inclusive upper bound
 * @returns   | e.g. 23.7
 */
export const rnd = (min, max) => parseFloat((min + Math.random() * (max - min)).toFixed(1));

/**
 * Build a dataset compatible with 'react-native-chart-kit'
 * for three different time-windows:
 *
 *   - '24h' |   24 hourly samples, labelled every 3 h (e.g. "12h")
 *   - '7d'  |   7 daily samples,  labelled "J 1"…"J 7"
 *   - '30d' |   30 daily samples, labelled every 5th day ("J5", "J10", …)
 *
 * Each dataset includes:
 *   – Temperature series (°C)  in red
 *   – Humidity    series (%)   in blue
 *
 * @param range – '24h' | '7d' | '30d'
 * @returns     – Object with '{labels, datasets, legend}' fields
 */
export function generateChartDataForRange(
  range: '24h' | '7d' | '30d',
  t: (key: string) => string
) {
  const dAbbr = i18n.t('day');
  const hAbbr = i18n.t('hour');

  let n, label;
  if (range === '7d') {
    n = 7; 
    label = (_, i) => `${dAbbr.toUpperCase()} ${i + 1}`;
  }
  else if (range === '30d') {
    n = 30; 
    label = (_, i) => (i % 5 === 0 ? `${dAbbr.toUpperCase()}${i + 1}` : ''); 
  }
  else {                      
    n = 24; 
    label = (_, i) => {
      const h = new Date(Date.now() - (n - 1 - i) * 3600000).getHours();
      return h % 3 === 0 ? `${h}${hAbbr.toLowerCase()}` : '';
    }; 
  }

  const labels = Array.from({ length: n }).map(label);
  const temp = Array.from({ length: n }).map(() => rnd(20, 35));
  const hum  = Array.from({ length: n }).map(() => rnd(45, 80));

  return {
    labels,
    datasets: [
      { 
        data: temp, 
        color: o => `rgba(248,113,113,${o})`, 
        strokeWidth: 2 
      },
      { 
        data: hum,  
        color: o => `rgba(96,165,250,${o})`,  
        strokeWidth: 2 
      },
    ],
    legend: [`${i18n.t('temperature')} (°C)`, `${i18n.t('humidity')} (%)`],
  };
}
