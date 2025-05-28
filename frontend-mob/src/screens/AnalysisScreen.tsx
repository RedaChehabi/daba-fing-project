import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { AnalysisResult } from '../types';

const AnalysisScreen = ({ navigation, route }: any) => {
  const { analysisId, analysisData } = route.params;

  // Mock analysis data - replace with actual API call
  const mockAnalysis: AnalysisResult = analysisData || {
    id: analysisId,
    fingerprint_id: 'fp_001',
    classification: 'Loop',
    ridge_count: 45,
    confidence: 92.5,
    analysis_date: new Date().toISOString(),
    status: 'completed',
    processing_time: '2.3s',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#4CAF50';
    if (confidence >= 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Results</Text>
        <Text style={styles.subtitle}>Fingerprint {mockAnalysis.fingerprint_id}</Text>
      </View>

      <View style={styles.content}>
        {/* Classification Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pattern Classification</Text>
          <Text style={styles.classificationValue}>{mockAnalysis.classification}</Text>
          <Text style={styles.cardSubtitle}>Primary pattern type detected</Text>
        </View>

        {/* Confidence Score Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Confidence Score</Text>
          <View style={styles.confidenceContainer}>
            <Text style={[styles.confidenceValue, { color: getConfidenceColor(mockAnalysis.confidence) }]}>
              {mockAnalysis.confidence.toFixed(1)}%
            </Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { 
                    width: `${mockAnalysis.confidence}%`,
                    backgroundColor: getConfidenceColor(mockAnalysis.confidence)
                  }
                ]} 
              />
            </View>
          </View>
          <Text style={styles.cardSubtitle}>Analysis reliability score</Text>
        </View>

        {/* Ridge Count Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ridge Count</Text>
          <Text style={styles.ridgeValue}>{mockAnalysis.ridge_count}</Text>
          <Text style={styles.cardSubtitle}>Total ridge lines detected</Text>
        </View>

        {/* Technical Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Technical Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Analysis Date:</Text>
            <Text style={styles.detailValue}>{formatDate(mockAnalysis.analysis_date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Processing Time:</Text>
            <Text style={styles.detailValue}>{mockAnalysis.processing_time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusCompleted]}>
              {mockAnalysis.status.charAt(0).toUpperCase() + mockAnalysis.status.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Algorithm:</Text>
            <Text style={styles.detailValue}>DabaFing v1.0</Text>
          </View>
        </View>

        {/* Quality Metrics Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Metrics</Text>
          <View style={styles.qualityGrid}>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Image Quality</Text>
              <Text style={styles.qualityValue}>Good</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Ridge Clarity</Text>
              <Text style={styles.qualityValue}>Excellent</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Completeness</Text>
              <Text style={styles.qualityValue}>95%</Text>
            </View>
            <View style={styles.qualityItem}>
              <Text style={styles.qualityLabel}>Noise Level</Text>
              <Text style={styles.qualityValue}>Low</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Export Results</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Share Analysis</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    padding: 16,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  classificationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confidenceBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  ridgeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  statusCompleted: {
    color: '#4CAF50',
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  qualityItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  qualityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0066cc',
  },
  secondaryButtonText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AnalysisScreen; 