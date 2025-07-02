// -----------------------------------------------------------------------------
// CustomModal.js
// Thin wrapper around <Modal> that provides a standard sheet with a title bar
// and close button (X icon). Renders children below the header.
// -----------------------------------------------------------------------------
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';

export default function CustomModal({ visible, onClose, title, children, theme }) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      {/* Dimmed overlay */}
      <View style={styles.overlay}>
        {/* Modal content container */}
        <View style={[styles.content, { backgroundColor: theme.cardBackground }]}>
          {/* Header bar */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          {/* Caller-supplied content */}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  content: { 
    width: '90%', 
    borderRadius: 12, 
    padding: 20 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 15 
  },
  title: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
});
