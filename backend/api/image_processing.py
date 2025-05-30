import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import os
from typing import Tuple, Dict, Any, Optional
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import tempfile
import json
from .models import FingerprintImage


class FingerprintImageProcessor:
    """
    Advanced fingerprint image processing service for preprocessing,
    enhancement, noise reduction, and ridge detection.
    """
    
    def __init__(self):
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp']
        
    def preprocess_image(self, image_path: str) -> Dict[str, Any]:
        """
        Complete preprocessing pipeline for fingerprint images
        """
        try:
            # Load image
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                raise ValueError("Unable to load image")
            
            # Store original for comparison
            original_shape = img.shape
            
            # Apply preprocessing steps
            processed_img = self._normalize_image(img)
            processed_img = self._reduce_noise(processed_img)
            processed_img = self._enhance_contrast(processed_img)
            processed_img = self._apply_gaussian_filter(processed_img)
            
            # Generate enhanced image path
            enhanced_path = self._save_enhanced_image(processed_img, image_path)
            
            # Calculate quality metrics
            quality_metrics = self._calculate_quality_metrics(img, processed_img)
            
            return {
                'success': True,
                'enhanced_image_path': enhanced_path,
                'original_shape': original_shape,
                'processed_shape': processed_img.shape,
                'quality_metrics': quality_metrics,
                'preprocessing_steps': [
                    'normalization',
                    'noise_reduction', 
                    'contrast_enhancement',
                    'gaussian_filtering'
                ]
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'quality_metrics': None
            }
    
    def _normalize_image(self, img: np.ndarray) -> np.ndarray:
        """Normalize image intensity values to 0-255 range"""
        # Apply histogram equalization for better contrast
        normalized = cv2.equalizeHist(img)
        
        # Additional normalization
        normalized = cv2.normalize(normalized, None, 0, 255, cv2.NORM_MINMAX)
        
        return normalized
    
    def _reduce_noise(self, img: np.ndarray) -> np.ndarray:
        """Remove noise from fingerprint image"""
        # Apply median filter to remove salt-and-pepper noise
        denoised = cv2.medianBlur(img, 3)
        
        # Apply bilateral filter to reduce noise while preserving edges
        denoised = cv2.bilateralFilter(denoised, 9, 75, 75)
        
        return denoised
    
    def _enhance_contrast(self, img: np.ndarray) -> np.ndarray:
        """Enhance contrast for better ridge visibility"""
        # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(img)
        
        return enhanced
    
    def _apply_gaussian_filter(self, img: np.ndarray) -> np.ndarray:
        """Apply Gaussian filter for smoothing"""
        # Apply slight Gaussian blur to smooth out minor artifacts
        filtered = cv2.GaussianBlur(img, (3, 3), 0)
        
        return filtered
    
    def _save_enhanced_image(self, processed_img: np.ndarray, original_path: str) -> str:
        """Save the enhanced image and return its path"""
        try:
            # Generate enhanced filename
            base_name = os.path.splitext(os.path.basename(original_path))[0]
            enhanced_filename = f"{base_name}_enhanced.png"
            
            # Save to temporary location first
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                cv2.imwrite(temp_file.name, processed_img)
                
                # Save to Django storage
                with open(temp_file.name, 'rb') as f:
                    enhanced_path = default_storage.save(
                        f'enhanced_fingerprints/{enhanced_filename}',
                        ContentFile(f.read())
                    )
                
                # Clean up temp file
                os.unlink(temp_file.name)
                
            return enhanced_path
            
        except Exception as e:
            print(f"Error saving enhanced image: {str(e)}")
            return original_path
    
    def _calculate_quality_metrics(self, original: np.ndarray, processed: np.ndarray) -> Dict[str, float]:
        """Calculate image quality metrics"""
        try:
            # Calculate sharpness using Laplacian variance
            sharpness = cv2.Laplacian(processed, cv2.CV_64F).var()
            
            # Calculate contrast
            contrast = processed.std()
            
            # Calculate brightness
            brightness = processed.mean()
            
            # Calculate noise level (difference between original and processed)
            noise_level = np.mean(np.abs(original.astype(float) - processed.astype(float)))
            
            # Calculate ridge clarity (using local binary patterns)
            ridge_clarity = self._calculate_ridge_clarity(processed)
            
            # Overall quality score (0-100)
            quality_score = min(100, max(0, (sharpness / 1000) * 30 + (contrast / 100) * 25 + 
                                        (ridge_clarity / 100) * 35 + (100 - noise_level) * 0.1))
            
            return {
                'sharpness': round(sharpness, 2),
                'contrast': round(contrast, 2),
                'brightness': round(brightness, 2),
                'noise_level': round(noise_level, 2),
                'ridge_clarity': round(ridge_clarity, 2),
                'overall_quality': round(quality_score, 2)
            }
            
        except Exception as e:
            print(f"Error calculating quality metrics: {str(e)}")
            return {
                'sharpness': 0.0,
                'contrast': 0.0,
                'brightness': 0.0,
                'noise_level': 0.0,
                'ridge_clarity': 0.0,
                'overall_quality': 0.0
            }
    
    def _calculate_ridge_clarity(self, img: np.ndarray) -> float:
        """Calculate ridge clarity using local binary patterns"""
        try:
            # Apply Sobel operator to detect edges (ridges)
            sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
            
            # Calculate gradient magnitude
            gradient_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
            
            # Calculate ridge clarity as percentage of strong gradients
            strong_gradients = np.sum(gradient_magnitude > np.percentile(gradient_magnitude, 75))
            total_pixels = gradient_magnitude.size
            
            clarity = (strong_gradients / total_pixels) * 100
            
            return min(100, clarity)
            
        except Exception as e:
            print(f"Error calculating ridge clarity: {str(e)}")
            return 0.0
    
    def detect_ridges_and_minutiae(self, image_path: str) -> Dict[str, Any]:
        """
        Advanced ridge detection and minutiae extraction
        """
        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                raise ValueError("Unable to load image")
            
            # Preprocess for ridge detection
            processed = self._normalize_image(img)
            processed = self._reduce_noise(processed)
            
            # Ridge detection using oriented filters
            ridges = self._detect_ridge_patterns(processed)
            
            # Minutiae detection
            minutiae = self._detect_minutiae_points(processed)
            
            # Ridge counting
            ridge_count = self._count_ridges(processed)
            
            # Core and delta detection
            core_points, delta_points = self._detect_core_delta_points(processed)
            
            return {
                'success': True,
                'ridge_count': ridge_count,
                'minutiae_points': minutiae,
                'core_points': core_points,
                'delta_points': delta_points,
                'ridge_pattern_analysis': ridges
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'ridge_count': 0,
                'minutiae_points': [],
                'core_points': [],
                'delta_points': []
            }
    
    def _detect_ridge_patterns(self, img: np.ndarray) -> Dict[str, Any]:
        """Detect ridge patterns using Gabor filters"""
        try:
            # Apply Gabor filters at different orientations
            orientations = [0, 45, 90, 135]
            responses = []
            
            for angle in orientations:
                # Create Gabor kernel
                kernel = cv2.getGaborKernel((21, 21), 5, np.radians(angle), 2*np.pi*0.1, 0.5, 0, ktype=cv2.CV_32F)
                
                # Apply filter
                response = cv2.filter2D(img, cv2.CV_8UC3, kernel)
                responses.append(response)
            
            # Combine responses
            combined_response = np.mean(responses, axis=0)
            
            # Analyze dominant orientation
            dominant_orientation = self._calculate_dominant_orientation(responses, orientations)
            
            return {
                'dominant_orientation': dominant_orientation,
                'ridge_frequency': self._estimate_ridge_frequency(img),
                'pattern_strength': float(np.std(combined_response))
            }
            
        except Exception as e:
            print(f"Error in ridge pattern detection: {str(e)}")
            return {
                'dominant_orientation': 0,
                'ridge_frequency': 0,
                'pattern_strength': 0
            }
    
    def _detect_minutiae_points(self, img: np.ndarray) -> list:
        """Detect minutiae points (ridge endings and bifurcations)"""
        try:
            # Apply thinning to get skeleton
            kernel = np.ones((3, 3), np.uint8)
            thinned = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)
            
            # Apply threshold
            _, binary = cv2.threshold(thinned, 127, 255, cv2.THRESH_BINARY)
            
            # Skeleton extraction
            skeleton = cv2.ximgproc.thinning(binary)
            
            # Find minutiae points
            minutiae = []
            height, width = skeleton.shape
            
            for i in range(1, height-1):
                for j in range(1, width-1):
                    if skeleton[i, j] == 255:  # White pixel (ridge)
                        # Count neighbors
                        neighbors = [
                            skeleton[i-1, j-1], skeleton[i-1, j], skeleton[i-1, j+1],
                            skeleton[i, j-1],                     skeleton[i, j+1],
                            skeleton[i+1, j-1], skeleton[i+1, j], skeleton[i+1, j+1]
                        ]
                        
                        neighbor_count = sum(1 for n in neighbors if n == 255)
                        
                        # Minutiae detection
                        if neighbor_count == 1:  # Ridge ending
                            minutiae.append({'type': 'ending', 'x': int(j), 'y': int(i)})
                        elif neighbor_count >= 3:  # Bifurcation
                            minutiae.append({'type': 'bifurcation', 'x': int(j), 'y': int(i)})
            
            return minutiae[:50]  # Limit to top 50 minutiae points
            
        except Exception as e:
            print(f"Error in minutiae detection: {str(e)}")
            return []
    
    def _count_ridges(self, img: np.ndarray) -> int:
        """Count ridges between core and delta points"""
        try:
            # Apply edge detection
            edges = cv2.Canny(img, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter contours by area and shape
            ridge_contours = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if 50 < area < 1000:  # Filter by reasonable ridge area
                    ridge_contours.append(contour)
            
            return len(ridge_contours)
            
        except Exception as e:
            print(f"Error in ridge counting: {str(e)}")
            return 0
    
    def _detect_core_delta_points(self, img: np.ndarray) -> Tuple[list, list]:
        """Detect core and delta points in fingerprint"""
        try:
            # Apply Harris corner detection
            corners = cv2.cornerHarris(img, 2, 3, 0.04)
            
            # Threshold for corner detection
            corners = cv2.dilate(corners, None)
            
            # Find coordinates of corners
            corner_coords = np.where(corners > 0.01 * corners.max())
            
            # Analyze corner patterns for core/delta classification
            core_points = []
            delta_points = []
            
            for i in range(min(10, len(corner_coords[0]))):  # Limit to top 10 points
                y, x = corner_coords[0][i], corner_coords[1][i]
                
                # Simple heuristic: points in center area more likely to be core
                height, width = img.shape
                if width * 0.3 < x < width * 0.7 and height * 0.3 < y < height * 0.7:
                    core_points.append({'x': int(x), 'y': int(y)})
                else:
                    delta_points.append({'x': int(x), 'y': int(y)})
            
            return core_points[:3], delta_points[:3]  # Limit to 3 each
            
        except Exception as e:
            print(f"Error in core/delta detection: {str(e)}")
            return [], []
    
    def _calculate_dominant_orientation(self, responses: list, orientations: list) -> float:
        """Calculate dominant ridge orientation"""
        try:
            max_response = 0
            dominant_angle = 0
            
            for i, response in enumerate(responses):
                response_strength = np.mean(response)
                if response_strength > max_response:
                    max_response = response_strength
                    dominant_angle = orientations[i]
            
            return float(dominant_angle)
            
        except Exception as e:
            print(f"Error calculating dominant orientation: {str(e)}")
            return 0.0
    
    def _estimate_ridge_frequency(self, img: np.ndarray) -> float:
        """Estimate ridge frequency in the fingerprint"""
        try:
            # Apply FFT to estimate frequency
            f_transform = np.fft.fft2(img)
            f_shift = np.fft.fftshift(f_transform)
            
            # Calculate magnitude spectrum
            magnitude_spectrum = np.log(np.abs(f_shift) + 1)
            
            # Find dominant frequency
            height, width = magnitude_spectrum.shape
            center_y, center_x = height // 2, width // 2
            
            # Calculate average frequency in a region around center
            region = magnitude_spectrum[center_y-20:center_y+20, center_x-20:center_x+20]
            avg_frequency = np.mean(region)
            
            return float(avg_frequency)
            
        except Exception as e:
            print(f"Error estimating ridge frequency: {str(e)}")
            return 0.0


class FingerprintMerger:
    """
    Service for merging left, middle, and right parts of fingerprints
    """
    
    def __init__(self):
        self.processor = FingerprintImageProcessor()
    
    def merge_fingerprint_parts(self, left_path: str, middle_path: Optional[str], right_path: str) -> Dict[str, Any]:
        """
        Merge fingerprint parts into a complete fingerprint
        """
        try:
            # Load images
            left_img = cv2.imread(left_path, cv2.IMREAD_GRAYSCALE)
            right_img = cv2.imread(right_path, cv2.IMREAD_GRAYSCALE)
            
            if left_img is None or right_img is None:
                raise ValueError("Unable to load left or right image")
            
            middle_img = None
            if middle_path:
                middle_img = cv2.imread(middle_path, cv2.IMREAD_GRAYSCALE)
            
            # Preprocess all parts
            left_processed = self.processor._normalize_image(left_img)
            right_processed = self.processor._normalize_image(right_img)
            
            if middle_img is not None:
                middle_processed = self.processor._normalize_image(middle_img)
                merged = self._merge_three_parts(left_processed, middle_processed, right_processed)
            else:
                merged = self._merge_two_parts(left_processed, right_processed)
            
            # Save merged image
            merged_path = self._save_merged_image(merged)
            
            # Calculate merge quality
            merge_quality = self._calculate_merge_quality(merged)
            
            return {
                'success': True,
                'merged_image_path': merged_path,
                'merge_quality': merge_quality,
                'merged_dimensions': merged.shape
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'merged_image_path': None
            }
    
    def _merge_two_parts(self, left: np.ndarray, right: np.ndarray) -> np.ndarray:
        """Merge left and right fingerprint parts"""
        # Resize images to same height
        target_height = min(left.shape[0], right.shape[0])
        left_resized = cv2.resize(left, (int(left.shape[1] * target_height / left.shape[0]), target_height))
        right_resized = cv2.resize(right, (int(right.shape[1] * target_height / right.shape[0]), target_height))
        
        # Create overlap region for seamless blending
        overlap_width = 20
        
        # Concatenate with overlap
        total_width = left_resized.shape[1] + right_resized.shape[1] - overlap_width
        merged = np.zeros((target_height, total_width), dtype=np.uint8)
        
        # Place left part
        merged[:, :left_resized.shape[1]] = left_resized
        
        # Blend overlap region
        left_overlap = left_resized[:, -overlap_width:]
        right_overlap = right_resized[:, :overlap_width]
        
        blended_overlap = cv2.addWeighted(left_overlap, 0.5, right_overlap, 0.5, 0)
        
        # Place blended overlap
        merged[:, left_resized.shape[1]-overlap_width:left_resized.shape[1]] = blended_overlap
        
        # Place right part
        merged[:, left_resized.shape[1]:] = right_resized[:, overlap_width:]
        
        return merged
    
    def _merge_three_parts(self, left: np.ndarray, middle: np.ndarray, right: np.ndarray) -> np.ndarray:
        """Merge left, middle, and right fingerprint parts"""
        # First merge left and middle
        left_middle = self._merge_two_parts(left, middle)
        
        # Then merge result with right
        merged = self._merge_two_parts(left_middle, right)
        
        return merged
    
    def _save_merged_image(self, merged_img: np.ndarray) -> str:
        """Save merged image and return path"""
        try:
            merged_filename = f"merged_fingerprint_{np.random.randint(1000, 9999)}.png"
            
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
                cv2.imwrite(temp_file.name, merged_img)
                
                with open(temp_file.name, 'rb') as f:
                    merged_path = default_storage.save(
                        f'merged_fingerprints/{merged_filename}',
                        ContentFile(f.read())
                    )
                
                os.unlink(temp_file.name)
                
            return merged_path
            
        except Exception as e:
            print(f"Error saving merged image: {str(e)}")
            return ""
    
    def _calculate_merge_quality(self, merged_img: np.ndarray) -> Dict[str, float]:
        """Calculate quality metrics for merged image"""
        try:
            # Calculate seamlessness (edge continuity)
            edges = cv2.Canny(merged_img, 50, 150)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Calculate overall quality metrics
            quality_metrics = self.processor._calculate_quality_metrics(merged_img, merged_img)
            
            # Add merge-specific metrics
            quality_metrics['edge_continuity'] = round((1 - edge_density) * 100, 2)
            quality_metrics['merge_success'] = round(min(100, quality_metrics['overall_quality'] + 
                                                       quality_metrics['edge_continuity']) / 2, 2)
            
            return quality_metrics
            
        except Exception as e:
            print(f"Error calculating merge quality: {str(e)}")
            return {'merge_success': 0.0} 