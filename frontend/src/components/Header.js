import React from 'react';
import { Store } from 'lucide-react';

export function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Store size={32} />
                    <h1>StoreHub</h1>
                </div>
                <p className="tagline">Modern Store Management System</p>
            </div>
        </header>
    );
}

// Add these styles to App.css
const headerStyles = `
.header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.logo h1 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .tagline {
    font-size: 1rem;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = headerStyles;
    document.head.appendChild(style);
}