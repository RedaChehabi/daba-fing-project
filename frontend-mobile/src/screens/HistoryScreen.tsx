import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface AnalysisItem {
  id: string;
  fingerprint_id: string;
  classification: string;
  confidence: number;
  analysis_date: string;
  status: string;
}

const HistoryScreen = ({ navigation }: any) => {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadAnalysisHistory = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockData: AnalysisItem[] = [
        {
          id: '1',
          fingerprint_id: 'fp_001',
          classification: 'Loop',
          confidence: 92.5,
          analysis_date: new Date().toISOString(),
          status: 'completed',
        },
        {
          id: '2',
          fingerprint_id: 'fp_002',
          classification: 'Whorl',
          confidence: 87.3,
          analysis_date: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed',
        },
        {
          id: '3',
          fingerprint_id: 'fp_003',
          classification: 'Arch',
          confidence: 94.1,
          analysis_date: new Date(Date.now() - 172800000).toISOString(),
          status: 'completed',
        },
      ];
      setAnalyses(mockData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load analysis history');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalysisHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'processing':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const renderAnalysisItem = ({ item }: { item: AnalysisItem }) => (
    <TouchableOpacity
      style={styles.analysisItem}
      onPress={() => navigation.navigate('AnalysisDetail', { analysisId: item.id })}
    >
      <View style={styles.analysisHeader}>
        <Text style={styles.fingerprintId}>Fingerprint {item.fingerprint_id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.analysisDetails}>
        <Text style={styles.classification}>Classification: {item.classification}</Text>
        <Text style={styles.confidence}>Confidence: {item.confidence.toFixed(1)}%</Text>
        <Text style={styles.date}>{formatDate(item.analysis_date)}</Text>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Analysis History</Text>
      <Text style={styles.emptySubtitle}>
        Upload and analyze fingerprints to see your history here
      </Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.uploadButtonText}>Upload Fingerprint</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading analysis history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis History</Text>
        <Text style={styles.subtitle}>
          {analyses.length} analysis{analyses.length !== 1 ? 'es' : ''} completed
        </Text>
      </View>

      <FlatList
        data={analyses}
        renderItem={renderAnalysisItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={analyses.length === 0 ? styles.emptyContainer : styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  analysisItem: {
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
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fingerprintId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  analysisDetails: {
    gap: 4,
  },
  classification: {
    fontSize: 14,
    color: '#333',
  },
  confidence: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HistoryScreen; 