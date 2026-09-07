import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application ErrorBoundary Caught]', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-royal/10 text-royal shadow-subtle border border-royal/20">
            <AlertTriangle size={32} className="text-gold-500" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
            Unable to load this page right now
          </h2>
          <p className="mt-2.5 max-w-md text-sm text-charcoal/75 leading-relaxed">
            We encountered a temporary issue while retrieving this information. Please try again or return to the homepage.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleRetry}
              className="btn-royal inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <RefreshCw size={15} /> Try Again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-sm"
            >
              <Home size={15} /> Return Home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
