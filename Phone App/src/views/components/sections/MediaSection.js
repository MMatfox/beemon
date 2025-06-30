import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { PlayCircle, Video, CalendarDays } from 'lucide-react-native';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import { WebView } from 'react-native-webview';
import VideoPlayer from 'react-native-video';

import { useTranslation } from 'react-i18next';
import { fetchCameraStreamUrl, fetchAudioStreamUrl } from '../../../models/sensorModel';

const { width } = Dimensions.get('window');

export default function MediaSection({ hiveId, theme }) {
  const { t } = useTranslation();

  const [tab, setTab] = useState('audio');
  const [picker, setPicker] = useState(false);

  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleWatchLive = async () => {
    console.log(hiveId)
    const url = await fetchCameraStreamUrl(hiveId);
    console.log(url)
    if (url) {
      setVideoUrl(url);
      setAudioUrl(null); // désactive l’audio si actif
    } else {
      alert("Aucun flux vidéo disponible pour cette ruche.");
    }
  };

  const handleListenLive = async () => {
    const url = await fetchAudioStreamUrl(hiveId);
    if (url) {
      setAudioUrl(url);
      setVideoUrl(null); // désactive la vidéo si active
    } else {
      alert("Aucun flux audio disponible pour cette ruche.");
    }
  };

  return (
    <Card title={t('multimediaStream')} iconName={PlayCircle} theme={theme}>
      {/* Tabs */}
      <View style={styles.tabs}>
        {['audio', 'video'].map(k => (
          <TouchableOpacity
            key={k}
            style={[styles.tab, tab === k && { borderBottomColor: theme.primary }]}
            onPress={() => setTab(k)}
          >
            <Text style={[styles.txt, { color: tab === k ? theme.primary : theme.subtleText }]}>
              {k === 'audio' ? t('audio') : t('video')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenu audio ou vidéo */}
      {tab === 'audio' ? (
        <View style={styles.ct}>
          <View style={[styles.ph, { backgroundColor: theme.background }]}>
            {audioUrl ? (
              <VideoPlayer
                source={{ uri: audioUrl }}
                audioOnly={true}
                controls={true}
                paused={false}
                style={{ width: '100%', height: 60, backgroundColor: 'black' }}
              />
            ) : (
              <PlayCircle color={theme.primary} size={40} />
            )}
          </View>
          <CustomButton title={t('listenLive')} iconName={PlayCircle} onPress={handleListenLive} theme={theme} style={{ marginBottom: 10 }} />
        </View>
      ) : (
        <View style={styles.ct}>
        <View style={[styles.ph, { backgroundColor: theme.background }]}>
            {videoUrl ? (
                // === REMPLACEZ WebView PAR VideoPlayer ===
                <VideoPlayer
                    source={{ uri: videoUrl }}
                    style={{ width: '100%', height: '100%' }}
                    controls={true} // Affiche les contrôles (play/pause, etc.)
                    paused={false}  // Démarre la lecture automatiquement
                    resizeMode="contain" // Ajuste la vidéo aux dimensions
                />
            ) : (
                <Video color={theme.primary} size={40} />
            )}
        </View>
        <CustomButton title={t('watchLive')} iconName={Video} onPress={handleWatchLive} theme={theme} style={{ marginBottom: 10 }} />
    </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  txt: {
    fontSize: 15,
    fontWeight: '500',
  },
  ct: {
    alignItems: 'center',
  },
  ph: {
    width: width - 90,
    aspectRatio: 16 / 9,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 15,
  },
});
