// ─────────────────────────────────────────────────────────────────────────────
// AddEditHiveModal.js
// Modal that lets the user create a new hive or edit an existing one.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import CustomModal from '../common/CustomModal';
import CustomButton from '../common/CustomButton';
import { useHiveSession } from '../../../presenters/useHiveSession';

export default function AddEditHiveModal({
  visible,          // boolean -> show / hide modal
  onClose,          // callback -> close modal
  onSaveHive,       // callback({ id?, name, code, password })
  hiveToEdit,       // existing hive object if editing
  theme,
}) {
  const { t } = useTranslation();
  const { login } = useHiveSession();
  // ----------------------------- Local form state --------------------------- //
  const [name,     setName]     = useState('');
  const [code,     setCode]     = useState('');
  const [pwd,      setPwd]      = useState('');
  const [show,     setShow]     = useState(false);

  /* Prefill the form when the modal opens in "edit" mode */
  useEffect(() => {
    if (hiveToEdit) {
      // Split "Hive Alpha" -> name = Hive Alpha
      setName(hiveToEdit.name.split(' (')[0]);
      setCode(hiveToEdit.code ?? '');
      setPwd(hiveToEdit.password ?? '');
    } else {
      // Reset form when adding a new hive
      setName('');
      setCode('');
      setPwd('');
    }
    setShow(false); // always hide password by default
  }, [hiveToEdit, visible]);

  /* Validate and forward data to parent */
  const save = async () => {
  if (!name.trim() || !code.trim() || !pwd.trim()) return;

  try {
    let hiveUuid = hiveToEdit?.id;

    if (!hiveToEdit) {
      hiveUuid = await login(code, pwd);
    }

    onSaveHive?.({
      id:   hiveUuid,
      name: name.trim(),
      code: code.trim(),
      password: pwd,
    });

    onClose();
  } catch (e) {
    console.error('Save Hive failed', e);
  }
};

  // ------------------------------- Rendering -------------------------------- //
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      title={hiveToEdit ? `${t('addHiveModalTitleEdit')}` : `${t('addHiveModalTitleNew')}`}
      theme={theme}
    >
      <ScrollView>
        {/* Text fields: Name, Code */}
        {[
          { lbl: `${t('hiveNameLabel')}`, val: name,     set: setName,     ph: `${t('hiveNamePlaceholder')}` },
          { lbl: `${t('hiveCodeLabel')}`,       val: code,     set: setCode,     ph: `${t('hiveCodePlaceholder')}` },
        ].map(i => (
          <View key={i.lbl} style={{ marginBottom: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '500', marginBottom: 5 }}>
              {i.lbl}
            </Text>
            <TextInput
              value={i.val}
              onChangeText={i.set}
              placeholder={i.ph}
              style={[
                styles.in,
                { backgroundColor: theme.background, color: theme.text, borderColor: theme.borderColor },
              ]}
              placeholderTextColor={theme.subtleText}
            />
          </View>
        ))}

        {/* Password field with eye-toggle */}
        <Text style={{ color: theme.text, fontWeight: '500', marginBottom: 5 }}>
          {t('passwordLabel')}
        </Text>
        <View style={[styles.row, { borderColor: theme.borderColor }]}>
          <TextInput
            style={[
              styles.inp,
              { backgroundColor: theme.background, color: theme.text },
            ]}
            secureTextEntry={!show}
            value={pwd}
            onChangeText={setPwd}
            placeholder={t('accessPasswordPlaceholder')}
            placeholderTextColor={theme.subtleText}
          />
          <TouchableOpacity onPress={() => setShow(!show)} style={styles.eye}>
            {show ? (
              <EyeOff size={20} color={theme.subtleText} />
            ) : (
              <Eye size={20} color={theme.subtleText} />
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title={hiveToEdit ? `${t('save')}` : `${t('add')}`}
          onPress={save}
          theme={theme}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  in:  { 
    borderWidth: 1, 
    borderRadius: 8, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, 
    paddingHorizontal: 12, 
    fontSize: 14 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderRadius: 8 
  },
  inp: { 
    flex: 1, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, 
    paddingHorizontal: 12, 
    fontSize: 14 
  },
  eye: { 
    position: 'absolute', 
    right: 0, 
    padding: 12 
  },
});
