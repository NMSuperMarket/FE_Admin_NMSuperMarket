import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi hệ thống!</h1>
            <p className="text-gray-600 mb-4">
              Trang web gặp sự cố khi tải giao diện. Vui lòng thử tải lại trang hoặc liên hệ quản trị viên.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Tải lại trang
            </button>
            <details className="mt-6 p-4 bg-gray-100 rounded text-sm text-red-500 overflow-auto">
              <summary className="font-bold cursor-pointer text-gray-700">Chi tiết lỗi (Dành cho Dev)</summary>
              <pre className="mt-2 whitespace-pre-wrap">{this.state.error && this.state.error.toString()}</pre>
              <br />
              <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
