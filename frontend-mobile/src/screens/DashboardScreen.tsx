import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUploads: 0,
    analysesCompleted: 0,
    analysesPending: 0,
    successRate: 0,
  });
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  // Load dashboard data from API
  const loadDashboardData = async () => {
    try {
      setError(null);
      
      const response = await authService.getDashboardStats();
      
      if (response.status === 'success') {
        // Update stats to match API response structure
        setStats({
          totalUploads: response.stats?.total_uploads || 0,
          analysesCompleted: response.stats?.analyses_completed || 0,
          analysesPending: response.stats?.analyses_pending || 0,
          successRate: Math.round(((response.stats?.analyses_completed || 0) / Math.max(response.stats?.total_uploads || 1, 1)) * 100),
        });
        
        // Update recent uploads
        setRecentUploads(response.recent_uploads || []);
        
        // Update last analysis
        setLastAnalysis(response.last_analysis);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      // Set empty state on error
      setStats({
        totalUploads: 0,
        analysesCompleted: 0,
        analysesPending: 0,
        successRate: 0,
      });
      setRecentUploads([]);
      setLastAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Convert recentUploads to activity format for display
  const getRecentActivity = () => {
    if (recentUploads.length === 0 && lastAnalysis) {
      return [{
        id: lastAnalysis.id?.toString() || '1',
        type: 'analysis',
        title: 'Recent Analysis Completed',
        subtitle: `${lastAnalysis.classification} pattern detected with ${lastAnalysis.confidence}% confidence`,
        time: lastAnalysis.date || 'Recently',
      }];
    }
    
    return recentUploads.slice(0, 3).map((upload, index) => ({
      id: upload.id?.toString() || index.toString(),
      type: upload.status === 'Analyzed' ? 'analysis' : 'upload',
      title: upload.status === 'Analyzed' ? 'Analysis Completed' : 'Fingerprint Uploaded',
      subtitle: upload.status === 'Analyzed' 
        ? `Analysis completed with ${upload.confidence || 'unknown'}% confidence`
        : upload.status === 'Pending' ? 'Analysis in progress...' : upload.title,
      time: upload.date || 'Recently',
    }));
  };

  const quickActions = [
    {
      title: 'Upload Fingerprint',
      subtitle: 'Scan and analyze new fingerprint',
      action: () => navigation.navigate('Upload'),
      color: '#0066cc',
    },
    {
      title: 'View History',
      subtitle: 'See all your analyses',
      action: () => navigation.navigate('History'),
      color: '#4CAF50',
    },
    {
      title: 'Profile Settings',
      subtitle: 'Manage your account',
      action: () => navigation.navigate('Profile'),
      color: '#FF9800',
    },
  ];

  const recentActivity = getRecentActivity();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.username || 'User'}!</Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? '...' : stats.totalUploads}
            </Text>
            <Text style={styles.statLabel}>Total Uploads</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? '...' : stats.analysesCompleted}
            </Text>
            <Text style={styles.statLabel}>Analyses Completed</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? '...' : stats.analysesPending}
            </Text>
            <Text style={styles.statLabel}>Analyses Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {loading ? '...' : `${stats.successRate}%`}
            </Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={action.action}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </View>
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Text style={styles.actionIconText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading activity...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={loadDashboardData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : recentActivity.length > 0 ? (
          recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent activity</Text>
            <Text style={styles.emptySubtext}>Upload a fingerprint to get started!</Text>
          </View>
        )}
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
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
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
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default DashboardScreen;
