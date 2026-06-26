"""create analysis_results table

Revision ID: 003_analysis_results
Revises: 
Create Date: 2026-06-26
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_analysis_results'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create the analysis_results table per BACKEND_STRUCTURE.md §1."""
    op.create_table(
        'analysis_results',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('video_id', sa.String(36), sa.ForeignKey('videos.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('dtw_score', sa.Float, nullable=False),
        sa.Column('processed_video_path', sa.String(255), nullable=False),
        sa.Column('graph_json', sa.Text, nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.CheckConstraint('dtw_score >= 0 AND dtw_score <= 100', name='ck_analysis_dtw_score_bounds'),
    )


def downgrade() -> None:
    """Drop the analysis_results table."""
    op.drop_table('analysis_results')
