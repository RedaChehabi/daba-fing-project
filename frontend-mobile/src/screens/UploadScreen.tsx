import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../services/api';

const UploadScreen = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadFingerprint = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first.');
      return;
    }

    setIsUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add the image file to FormData
      formData.append('image', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: 'fingerprint.jpg',
      } as any);
      
      // Add additional metadata if needed
      formData.append('title', 'Mobile Upload');
      
      // Upload to backend
      const uploadResponse = await authService.uploadFingerprint(formData);
      
      // Start analysis
      const analysisResponse = await authService.analyzeFingerprint(uploadResponse.id);
      
      Alert.alert(
        'Upload Successful',
        'Your fingerprint has been uploaded and analysis has completed.',
        [
          {
            text: 'View Results',
            onPress: () => navigation.navigate('AnalysisDetail', { 
              analysisId: analysisResponse.id, 
              analysisData: analysisResponse 
            }),
          },
          {
            text: 'View History',
            onPress: () => navigation.navigate('History'),
          },
          { text: 'OK' },
        ]
      );
      
      setSelectedImage(null);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', 'Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const tips = [
    'Ensure the fingerprint is clearly visible',
    'Use good lighting for better quality',
    'Keep the finger flat and steady',
    'Clean the finger surface before scanning',
    'Avoid shadows and reflections',
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upload Fingerprint</Text>
        <Text style={styles.subtitle}>Take a photo or select from gallery</Text>
      </View>

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>📷</Text>
            <Text style={styles.placeholderSubtext}>No image selected</Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Text style={styles.actionButtonText}>📸 Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={pickImageFromGallery}>
          <Text style={styles.actionButtonText}>🖼️ Choose from Gallery</Text>
        </TouchableOpacity>

        {selectedImage && (
          <TouchableOpacity
            style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
            onPress={uploadFingerprint}
            disabled={isUploading}
          >
            <Text style={styles.uploadButtonText}>
              {isUploading ? 'Uploading...' : 'Upload & Analyze'}
            </Text>
          </TouchableOpacity>
        )}

        {selectedImage && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSelectedImage(null)}
          >
            <Text style={styles.clearButtonText}>Clear Selection</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tips Section */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>📋 Tips for Better Results</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Text style={styles.tipBullet}>•</Text>
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  imageContainer: {
    margin: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0066cc',
  },
  placeholderContainer: {
    width: 250,
    height: 250,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderText: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0066cc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
  },
  uploadButton: {
    backgroundColor: '#0066cc',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#f44336',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  tipsContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#0066cc',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
});

export default UploadScreen; 