import csv
import io
from datetime import datetime
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from django.conf import settings
import os
from .models import FingerprintAnalysis, FingerprintImage


class ExportService:
    """Service class for handling data export functionality"""
    
    @staticmethod
    def generate_analysis_pdf(analysis_id, user):
        """Generate PDF report for a fingerprint analysis"""
        try:
            analysis = FingerprintAnalysis.objects.get(id=analysis_id, image__user=user)
        except FingerprintAnalysis.DoesNotExist:
            return None
            
        # Create PDF buffer
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        content = []
        
        # Title
        content.append(Paragraph("DabaFing - Fingerprint Analysis Report", title_style))
        content.append(Spacer(1, 20))
        
        # Analysis Information Table
        analysis_data = [
            ['Report Generated', datetime.now().strftime('%Y-%m-%d %H:%M:%S')],
            ['Analysis ID', str(analysis.id)],
            ['User', analysis.image.user.username],
            ['Fingerprint Title', analysis.image.title],
            ['Analysis Date', analysis.analysis_date.strftime('%Y-%m-%d %H:%M:%S')],
            ['Classification', analysis.classification],
            ['Ridge Count', str(analysis.ridge_count)],
            ['Confidence Score', f"{analysis.confidence_score * 100:.1f}%"],
            ['Processing Time', analysis.processing_time],
            ['Model Version', analysis.model_version.version_number if analysis.model_version else 'N/A'],
            ['Analysis Status', analysis.analysis_status],
            ['Validated', 'Yes' if analysis.is_validated else 'No']
        ]
        
        # Create table
        table = Table(analysis_data, colWidths=[2*inch, 3*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(table)
        content.append(Spacer(1, 20))
        
        # Fingerprint Details
        content.append(Paragraph("Fingerprint Details", styles['Heading2']))
        content.append(Spacer(1, 10))
        
        fingerprint_data = [
            ['Original Filename', analysis.image.original_filename or 'N/A'],
            ['Image Format', analysis.image.image_format or 'N/A'],
            ['Upload Date', analysis.image.upload_date.strftime('%Y-%m-%d %H:%M:%S')],
            ['Finger Position', analysis.image.get_finger_position_display()],
            ['Hand Type', analysis.image.get_hand_type_display()],
            ['Preprocessing Status', analysis.image.preprocessing_status]
        ]
        
        fingerprint_table = Table(fingerprint_data, colWidths=[2*inch, 3*inch])
        fingerprint_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(fingerprint_table)
        
        # Build PDF
        doc.build(content)
        buffer.seek(0)
        
        return buffer
    
    @staticmethod
    def generate_user_history_csv(user):
        """Generate CSV export of user's analysis history"""
        analyses = FingerprintAnalysis.objects.filter(
            image__user=user
        ).select_related('image', 'model_version').order_by('-analysis_date')
        
        # Create CSV buffer
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Headers
        writer.writerow([
            'Analysis ID',
            'Fingerprint Title', 
            'Classification',
            'Ridge Count',
            'Confidence Score (%)',
            'Analysis Date',
            'Processing Time',
            'Model Version',
            'Status',
            'Validated',
            'Finger Position',
            'Hand Type',
            'Upload Date'
        ])
        
        # Data rows
        for analysis in analyses:
            writer.writerow([
                analysis.id,
                analysis.image.title,
                analysis.classification,
                analysis.ridge_count,
                f"{analysis.confidence_score * 100:.1f}",
                analysis.analysis_date.strftime('%Y-%m-%d %H:%M:%S'),
                analysis.processing_time,
                analysis.model_version.version_number if analysis.model_version else 'N/A',
                analysis.analysis_status,
                'Yes' if analysis.is_validated else 'No',
                analysis.image.get_finger_position_display(),
                analysis.image.get_hand_type_display(),
                analysis.image.upload_date.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        return output.getvalue()
    
    @staticmethod
    def generate_bulk_analysis_pdf(analysis_ids, user):
        """Generate PDF report for multiple analyses"""
        analyses = FingerprintAnalysis.objects.filter(
            id__in=analysis_ids, 
            image__user=user
        ).select_related('image', 'model_version').order_by('-analysis_date')
        
        if not analyses.exists():
            return None
            
        # Create PDF buffer
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        content = []
        
        # Title
        content.append(Paragraph("DabaFing - Bulk Analysis Report", title_style))
        content.append(Spacer(1, 20))
        
        # Summary information
        content.append(Paragraph(f"Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
        content.append(Paragraph(f"User: {user.username}", styles['Normal']))
        content.append(Paragraph(f"Total Analyses: {analyses.count()}", styles['Normal']))
        content.append(Spacer(1, 20))
        
        # Create summary table
        table_data = [['ID', 'Title', 'Classification', 'Ridge Count', 'Confidence', 'Date', 'Status']]
        
        for analysis in analyses:
            table_data.append([
                str(analysis.id),
                analysis.image.title[:20] + '...' if len(analysis.image.title) > 20 else analysis.image.title,
                analysis.classification,
                str(analysis.ridge_count),
                f"{analysis.confidence_score * 100:.1f}%",
                analysis.analysis_date.strftime('%Y-%m-%d'),
                analysis.analysis_status
            ])
        
        # Create table
        table = Table(table_data, colWidths=[0.8*inch, 1.5*inch, 1.2*inch, 0.8*inch, 0.8*inch, 1*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 8),
            ('FONTSIZE', (0, 1), (-1, -1), 7),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(table)
        
        # Build PDF
        doc.build(content)
        buffer.seek(0)
        
        return buffer 