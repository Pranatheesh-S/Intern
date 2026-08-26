import React from 'react';
import { RotateCcw, AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Interactive Activity Error Caught by Boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReloadPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const fallbackTitle = this.props.title || "Interactive Activity Encountered an Issue";
      const fallbackSubtitle = this.props.subtitle || "A rendering or WebGL glitch occurred in this component. You can reload this activity safely without losing your progress.";

      return (
        <div style={{
          width: '100%',
          minHeight: this.props.minHeight || '340px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid #FCD34D',
            padding: '2.25rem 2rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(245, 158, 11, 0.1)',
            position: 'relative'
          }}>
            {/* Warning Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#FEF3C7',
              border: '2px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.2)'
            }}>
              <AlertTriangle size={32} color="#D97706" />
            </div>

            {/* Title & Description */}
            <h3 style={{ 
              margin: '0 0 0.6rem 0', 
              color: '#92400E', 
              fontSize: '1.35rem', 
              fontWeight: 900,
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
              {fallbackTitle}
            </h3>
            
            <p style={{ 
              margin: '0 auto 1.5rem auto', 
              color: '#475569', 
              fontSize: '0.95rem', 
              lineHeight: 1.55,
              fontWeight: 500,
              maxWidth: '440px'
            }}>
              {fallbackSubtitle}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.8rem 1.6rem',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(217, 119, 6, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <RotateCcw size={16} /> Reload Activity
              </button>

              <button
                onClick={this.handleReloadPage}
                style={{
                  padding: '0.8rem 1.4rem',
                  borderRadius: '16px',
                  border: '1.5px solid #CBD5E1',
                  background: '#F8FAFC',
                  color: '#334155',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#E2E8F0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
              >
                <RefreshCw size={15} /> Refresh App
              </button>
            </div>

            {/* Collapsible Error Trace (For Devs) */}
            {this.state.error && (
              <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                <button
                  onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 0',
                    margin: '0 auto'
                  }}
                >
                  {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {this.state.showDetails ? 'Hide technical error details' : 'Show technical error details'}
                </button>

                {this.state.showDetails && (
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    background: '#0F172A',
                    color: '#F87171',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    maxHeight: '140px',
                    lineHeight: 1.4
                  }}>
                    <strong>Error:</strong> {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <pre style={{ margin: '0.5rem 0 0 0', color: '#94A3B8', whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
