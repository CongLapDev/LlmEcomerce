import { Row, Col, Card, Typography, Button, Carousel, Avatar, Space } from "antd";
import { ProductCardv2 } from "../../../components";
import { useEffect, useState, useRef, useMemo } from "react";
import APIBase from "../../../api/ApiBase";
import style from "./style.module.scss";
import useAuth from "../../../secure/useAuth";
import { Link, useNavigate } from "react-router-dom";
import banner1 from '../../../assets/image/banner1.jpg';
import banner2 from '../../../assets/image/banner2.jpg';

const { Title, Text } = Typography;

// Category icons mapping
const getCategoryIcon = (categoryName) => {
    const iconMap = {
        'Laptop': '💻',
        'Smartphone': '📱',
        'Software': '💿',
        'Speaker': '🔊',
        'Display': '🖥️',
        'Accessories': '⌚',
    };
    return iconMap[categoryName] || '📦';
};

/**
 * Home Component - Main landing page with optimized performance
 * 
 * Optimized Version (Senior Performance Engineer Edition):
 * - Fixed multiple re-renders: useEffect now depends ONLY on authState
 * - Fixed duplicate API calls: using useRef guard (hasFetchedRef)
 * - Optimized network load: using Promise.all for parallel fetching
 * - Stable Derived State: isAuthenticated and userName are memoized
 */
function Home() {
    const navigate = useNavigate();
    const [authState, user, hasRole] = useAuth();
    
    const [newests, setNewests] = useState({ content: [] });
    const [accessories, setAccessories] = useState({ content: [] });
    const [monitors, setmonitors] = useState({ content: [] });
    const [categories, setCategories] = useState([]);
    
    // FETCH GUARD: useRef prevents double-fetching even during component mount/update cycles
    const hasFetchedRef = useRef(false);

    /**
     * Optimized Products & Categories Fetcher
     * Trigger: authState transitions to Loaded (1)
     * Reason: Once auth is settled, we know if we are a guest or a user without ambiguity
     */
    useEffect(() => {
        // Wait for auth loading to finish
        if (authState !== 1) return;

        // Skip if already successfully fetched
        if (hasFetchedRef.current) return;

        /**
         * Fetch everything in parallel - Single burst of network activity
         */
        const fetchAllData = async () => {
            try {
                console.log("[Home] 🚀 Single-Burst Data Initialized (authState: 1)");
                
                const [newestPayload, accessoriesPayload, monitorsPayload, categoriesPayload] = await Promise.all([
                    APIBase.get("api/v2/product?orderBy=id&order=DESC&page=0&size=8"),
                    APIBase.get("api/v2/product?orderBy=id&order=DESC&page=0&size=8&category=7"),
                    APIBase.get("api/v2/product?orderBy=id&order=DESC&page=0&size=8&category=6"),
                    APIBase.get("api/v1/category/1")
                ]);

                // Batch state updates - React 18 automatically batches these
                setNewests(newestPayload.data);
                setAccessories(accessoriesPayload.data);
                setmonitors(monitorsPayload.data);

                const rootCategory = categoriesPayload.data;
                if (rootCategory && rootCategory.children) {
                    const topCategories = rootCategory.children.slice(0, 6).map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        icon: getCategoryIcon(cat.name)
                    }));
                    setCategories(topCategories);
                }

                // Mark successful completion - this will prevent any further re-fetch from this instance
                hasFetchedRef.current = true;
                console.log("[Home] ✓ All data batches loaded successfully");

            } catch (err) {
                console.error("[Home] ❌ Error loading data:", err);
            }
        };

        fetchAllData();
    }, [authState]); // STRICT: Depends ONLY on authState transition

    // Derived State - Logic moved to render scope for lightweight identity checks
    const isAuthenticated = useMemo(() => authState === 1 && user && hasRole("USER"), [authState, user, hasRole]);
    const userName = useMemo(() => user ? `${user.firstname || ""} ${user.lastname || ""}`.trim() : "", [user]);

    const carouselContent = useMemo(() => [
        {
            image: banner1,
            title: "Latest Tech Collection",
            subtitle: "Discover cutting-edge technology",
            buttonText: "Shop Now"
        },
        {
            image: banner2,
            title: "Premium Quality",
            subtitle: "Best deals on top brands",
            buttonText: "Explore"
        }
    ], []);
    
    return (
        <div className={style.homeContainer}>
            {/* Hero Section with Carousel */}
            <div className={style.heroSection}>
                <Carousel autoplay effect="fade" className={style.heroCarousel} autoplaySpeed={5000}>
                    {carouselContent.map((item, index) => (
                        <div key={index} className={style.heroSlide}>
                            <img src={item.image} alt={item.title} className={style.heroImage}/>
                            <div className={style.heroOverlay}>
                                <div className={style.heroContent}>
                                    <Title level={1} className={style.heroTitle}>{item.title}</Title>
                                    <Text className={style.heroSubtitle}>{item.subtitle}</Text>
                                    <Button 
                                        type="primary" 
                                        size="large"
                                        className={style.heroButton}
                                        onClick={() => navigate('/product/search')}
                                    >
                                        {item.buttonText}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Welcome Message (Authenticated only) */}
            {isAuthenticated && userName && (
                <Row justify="center" className={style.welcomeSection}>
                    <Col xs={24} sm={22} md={20} lg={18}>
                        <Card className={style.welcomeCard}>
                            <Title level={3} style={{ margin: 0 }}>Welcome back, {userName}! 👋</Title>
                            <Text type="secondary">Ready to shop? Browse our latest products below.</Text>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Category Grid */}
            {categories.length > 0 && (
                <div className={style.categorySection}>
                    <Row justify="center">
                        <Col xs={24} sm={22} md={20} lg={18}>
                            <div className={style.sectionHeader}>
                                <Title level={2} className={style.sectionTitle}>Shop by Category</Title>
                            </div>
                            <Row gutter={[16, 16]} justify="start" className={style.categoryGrid}>
                                {categories.map((category) => (
                                    <Col xs={8} sm={6} md={4} lg={4} key={category.id} className={style.categoryItemWrapper}>
                                        <Link to={`/product/search?category=${category.id}`} className={style.categoryItem}>
                                            <Avatar size={64} className={style.categoryAvatar}>
                                                <span className={style.categoryIcon}>{category.icon}</span>
                                            </Avatar>
                                            <Text className={style.categoryLabel}>{category.name}</Text>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Product Sections */}
            {[
                { title: "New Arrivals", data: newests, link: '/product/search?orderBy=id&order=DESC' },
                { title: "Trending Monitors", data: monitors, link: '/product/search?category=6' },
                { title: "Featured Accessories", data: accessories, link: '/product/search?category=7' }
            ].map((section, sIndex) => (
                <div key={sIndex} className={`${style.productSection} ${sIndex === 1 ? style.productSectionAlt : ""}`}>
                    <Row justify="center">
                        <Col xs={24} sm={22} md={20} lg={18}>
                            <div className={style.sectionHeader}>
                                <Title level={2} className={style.sectionTitle}>{section.title}</Title>
                                <Button type="link" onClick={() => navigate(section.link)}>See All →</Button>
                            </div>
                            <Row gutter={[16, 24]} className={style.productGrid}>
                                {section.data.content.map((product, pIndex) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={product.id || pIndex}>
                                        <ProductCardv2 
                                            data={product} 
                                            className={style.productCard}
                                            showBadge={sIndex === 0 && pIndex < 3}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </div>
            ))}
        </div>
    );
}

export default Home;