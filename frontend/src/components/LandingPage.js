import React from 'react';
import { Store, ShoppingCart, Package, Users, TrendingUp, Shield, Zap, ArrowRight } from 'lucide-react';

export function LandingPage({ onNavigate }) {
    return (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="hero-background">
                    <div className="hero-gradient"></div>
                    <div className="floating-elements">
                        <div className="floating-element element-1">
                            <Package size={24} />
                        </div>
                        <div className="floating-element element-2">
                            <ShoppingCart size={20} />
                        </div>
                        <div className="floating-element element-3">
                            <Store size={28} />
                        </div>
                        <div className="floating-element element-4">
                            <Users size={22} />
                        </div>
                    </div>
                </div>
                
                <div className="hero-content">
                    <div className="hero-badge">
                        <span>✨ Modern Store Management</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Welcome to <span className="gradient-text">StoreHub</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        The ultimate platform for managing your store operations, 
                        tracking inventory, and delivering exceptional customer experiences.
                    </p>
                    
                    <div className="hero-buttons">
                        <button 
                            className="btn-primary hero-btn"
                            onClick={() => onNavigate('customer')}
                        >
                            <ShoppingCart size={20} />
                            Shop Now
                            <ArrowRight size={16} />
                        </button>
                        
                        <button 
                            className="btn-secondary hero-btn"
                            onClick={() => onNavigate('admin')}
                        >
                            <Package size={20} />
                            Admin Dashboard
                        </button>
                    </div>
                    
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Products</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Orders</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">99.9%</div>
                            <div className="stat-label">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose StoreHub?</h2>
                        <p>Everything you need to run a successful online store</p>
                    </div>
                    
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <TrendingUp size={32} />
                            </div>
                            <h3>Real-time Analytics</h3>
                            <p>Track your sales, inventory, and customer behavior with powerful analytics and insights.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Secure & Reliable</h3>
                            <p>Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Zap size={32} />
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Optimized performance ensures your customers have the best shopping experience.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Package size={32} />
                            </div>
                            <h3>Inventory Management</h3>
                            <p>Effortlessly manage your products, stock levels, and automated reorder points.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <ShoppingCart size={32} />
                            </div>
                            <h3>Seamless Shopping</h3>
                            <p>Provide your customers with an intuitive and enjoyable shopping experience.</p>
                        </div>
                        
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users size={32} />
                            </div>
                            <h3>Customer Support</h3>
                            <p>24/7 customer support to help you and your customers whenever needed.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Transform Your Business?</h2>
                        <p>Join thousands of successful store owners who trust StoreHub</p>
                        <div className="cta-buttons">
                            <button 
                                className="btn-primary cta-btn"
                                onClick={() => onNavigate('customer')}
                            >
                                Start Shopping
                            </button>
                            <button 
                                className="btn-outline cta-btn"
                                onClick={() => onNavigate('admin')}
                            >
                                Manage Store
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}