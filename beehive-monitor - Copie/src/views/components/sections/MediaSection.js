import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { PlayCircle, Video, CalendarDays } from 'lucide-react-native';

import Card from '../common/Card';
import CustomButton from '../common/CustomButton';
import CustomModal from '../common/CustomModal';
import { WebView } from 'react-native-webview';
import VideoPlayer from 'react-native-video';

import { useTranslation } from 'react-i18next';
import { fetchStreamUrlForHive, fetchAudioStreamUrlForHive } from '../../../models/sensorModel';

const { width } = Dimensions.get('window');

export default function MediaSection({ theme }) {
  const { t } = useTranslation();

  const [tab, setTab] = useState('audio');
  const [picker, setPicker] = useState(false);

  const [videoUrl, setVideoUrl] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const hiveCode = "ALPHA001"; // Ruche statique pour test

  const handleWatchLive = async () => {
    const url = await fetchStreamUrlForHive(hiveCode);
    if (url) {
      setVideoUrl(url);
      setShowVideo(true);
    } else {
      alert("Aucun flux vidéo disponible pour cette ruche.");
    }
  };

  const handleListenLive = async () => {
    const url = await fetchAudioStreamUrlForHive(hiveCode);
    if (url) {
      setAudioUrl(url);
      setShowAudio(true);
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

      {/* Content */}
      {tab === 'audio' ? (
        <View style={styles.ct}>
          <View style={[styles.ph, { backgroundColor: theme.background }]}>
            <PlayCircle color={theme.primary} size={40} />
          </View>
          <CustomButton title={t('listenLive')} iconName={PlayCircle} onPress={handleListenLive} theme={theme} style={{ marginBottom: 10 }} />
          <CustomButton title={t('listenRecording')} variant="secondary" iconName={CalendarDays} onPress={() => setPicker(true)} theme={theme} />
        </View>
      ) : (
        <View style={styles.ct}>
          <View style={[styles.ph, { backgroundColor: theme.background }]}>
            <Video color={theme.primary} size={40} />
          </View>
          <CustomButton title={t('watchLive')} iconName={Video} onPress={handleWatchLive} theme={theme} style={{ marginBottom: 10 }} />
          <CustomButton title={t('viewRecording')} variant="secondary" iconName={CalendarDays} onPress={() => setPicker(true)} theme={theme} />
        </View>
      )}

      {/* Date picker modale */}
      <CustomModal
        visible={picker}
        onClose={() => setPicker(false)}
        title={t('chooseDateTime')}
        theme={theme}
      >
        <Text style={{ color: theme.text, textAlign: 'center', marginBottom: 15 }}>
          Date & time picker to integrate
        </Text>
        <CustomButton title={t('validate')} onPress={() => setPicker(false)} theme={theme} />
      </CustomModal>

      {/* Video modal */}
      <CustomModal
        visible={showVideo}
        onClose={() => setShowVideo(false)}
        title={t('liveVideo')}
        theme={theme}
      >
        {videoUrl && Platform.OS !== 'web' ? (
          <WebView
            source={{ uri: videoUrl }}
            style={{ width: '100%', height: 200 }}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        ) : (
          <Text style={{ color: theme.text, textAlign: 'center' }}>
            {Platform.OS === 'web'
              ? 'Le flux en direct n’est pas supporté sur navigateur.'
              : 'Chargement du flux vidéo…'}
          </Text>
        )}
      </CustomModal>

      {/* Audio modal */}
      <CustomModal
        visible={showAudio}
        onClose={() => setShowAudio(false)}
        title={t('liveAudio')}
        theme={theme}
      >
        {audioUrl ? (
          <VideoPlayer
            source={{ uri: audioUrl }}
            audioOnly={true}
            controls={true}
            paused={false}
            style={{ width: '100%', height: 60, backgroundColor: 'black' }}
          />
        ) : (
          <Text style={{ color: theme.text, textAlign: 'center' }}>Chargement du flux audio…</Text>
        )}
      </CustomModal>
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
    marginBottom: 15,
  },
});
