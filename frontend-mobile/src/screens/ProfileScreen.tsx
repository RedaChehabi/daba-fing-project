import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, refreshUser } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.username || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [profileStats, setProfileStats] = useState([
    { label: 'Total Uploads', value: '0' },
    { label: 'Success Rate', value: '0%' },
    { label: 'Member Since', value: 'Recently' },
  ]);

  // Load user statistics
  useEffect(() => {
    const loadUserStats = async () => {
      try {
        setLoading(true);
        const response = await authService.getDashboardStats();
        
        if (response.status === 'success') {
          const totalUploads = response.stats?.total_uploads || 0;
          const analysesCompleted = response.stats?.analyses_completed || 0;
          const successRate = totalUploads > 0 
            ? Math.round((analysesCompleted / totalUploads) * 100)
            : 0;
          
          // Get member since date from user data or estimate
          const memberSince = user?.id ? 'Jan 2024' : 'Recently'; // Could be enhanced with real join date
          
          setProfileStats([
            { label: 'Total Uploads', value: totalUploads.toString() },
            { label: 'Success Rate', value: `${successRate}%` },
            { label: 'Member Since', value: memberSince },
          ]);
        }
      } catch (error) {
        console.error('Error loading user stats:', error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    loadUserStats();
  }, [user]);

  // Update edited fields when user changes
  useEffect(() => {
    setEditedUsername(user?.username || '');
    setEditedEmail(user?.email || '');
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement profile update API call
      Alert.alert(
        'Profile Update',
        'Profile update functionality will be implemented when the backend supports it.',
        [{ text: 'OK' }]
      );
      setEditModalVisible(false);
      
      // For now, just refresh user data
      await refreshUser();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Choose how you would like to change your password:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset via Email',
          onPress: () => {
            Alert.alert(
              'Password Reset',
              'Password reset functionality will be implemented when the backend supports it.',
              [{ text: 'OK' }]
            );
          }
        },
        {
          text: 'Change Now',
          onPress: () => {
            Alert.alert(
              'Change Password',
              'In-app password change functionality will be implemented when the backend supports it.',
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const handlePrivacySettings = () => {
    Alert.alert(
      'Privacy Settings',
      'Configure your privacy preferences:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Data Export',
          onPress: () => {
            Alert.alert('Data Export', 'Data export functionality will be available soon.');
          }
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert('Account Deletion', 'Account deletion will be implemented when the backend supports it.');
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleHelpSupport = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'FAQ',
          onPress: () => {
            Alert.alert('FAQ', 'Frequently Asked Questions will be available in the next update.');
          }
        },
        {
          text: 'Contact Support',
          onPress: () => {
            Linking.openURL('mailto:support@dabafing.com?subject=DabaFing Mobile App Support');
          }
        },
        {
          text: 'User Guide',
          onPress: () => {
            Alert.alert('User Guide', 'User guide will be available in the next update.');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
        <Text style={styles.role}>{user?.role || 'Regular'} User</Text>
      </View>

      <View style={styles.content}>
        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Text style={styles.statValue}>
                  {loading ? '...' : stat.value}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Get notified when analysis is complete
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#0066cc' }}
              thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Analysis</Text>
              <Text style={styles.settingDescription}>
                Automatically analyze uploaded fingerprints
              </Text>
            </View>
            <Switch
              value={autoAnalysis}
              onValueChange={setAutoAnalysis}
              trackColor={{ false: '#767577', true: '#0066cc' }}
              thumbColor={autoAnalysis ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handlePrivacySettings}>
            <Text style={styles.actionButtonText}>Privacy Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleHelpSupport}>
            <Text style={styles.actionButtonText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>DabaFing v1.0.0</Text>
          <Text style={styles.footerText}>© 2024 DabaFing Technologies</Text>
        </View>
      </View>

      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setEditModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={editedUsername}
              onChangeText={setEditedUsername}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Email"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '600',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#999',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen; 