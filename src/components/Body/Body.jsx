import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Card, Row, Col } from 'react-bootstrap';
import "./Body.css";

const Body = () => {
    const products = [
        {
            image: 'products/1.jpg',
            title: 'Beautya Capture Total Dreamskin Care & Perfect',
            description: 'Plumping Gloss - Instant And Long-Term Volume Effect 24h Hydration',
            price: '$76.00'
        },
        {
            image: 'products/2.jpg',
            title: 'Hydrating Rose Water Toner',
            description: 'Alcohol-free Facial Toner with Natural Rose Extract for All Skin Types',
            price: '$45.00'
        },
        {
            image: 'products/3.jpg',
            title: 'Vitamin C Brightening Serum',
            description: 'Advanced Formula with 20% Vitamin C for Dark Spots and Even Skin Tone',
            price: '$89.00'
        },
        {
            image: 'products/4.jpg',
            title: 'Hyaluronic Acid Moisturizer',
            description: 'Deep Hydration Cream with 72-Hour Moisture Lock Technology',
            price: '$65.00'
        },
        {
            image: 'products/5.webp',
            title: 'Retinol Night Repair Cream',
            description: 'Anti-aging Formula with Pure Retinol and Peptide Complex',
            price: '$95.00'
        },
        {
            image: 'products/6.webp',
            title: 'Green Tea Clay Mask',
            description: 'Purifying Face Mask for Deep Cleansing and Pore Refinement',
            price: '$52.00'
        },
        {
            image: 'products/7.webp',
            title: 'Niacinamide Pore Minimizer',
            description: 'Advanced Pore-reducing Serum with 10% Niacinamide and Zinc',
            price: '$58.00'
        }
    ];

    const getItemsToShow = () => {
        const width = window.innerWidth;
        if (width >= 1200) return 4;     // xl: >= 1200px - 4 sản phẩm
        if (width >= 992) return 3;      // lg: >= 992px - 3 sản phẩm
        if (width >= 768) return 2;      // md: >= 768px - 2 sản phẩm
        return 1;                        // sm & xs: < 768px - 1 sản phẩm
    };

    const [startIndex, setStartIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(getItemsToShow());
    const [isAnimating, setIsAnimating] = useState(false);
    
    const getVisibleProducts = () => {
        const visibleProducts = [];
        for (let i = 0; i < itemsToShow; i++) {
            const index = (startIndex + i) % products.length;
            visibleProducts.push(products[index]);
        }
        return visibleProducts;
    };

    const handlePrevClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        
        setTimeout(() => {
            setStartIndex(current => {
                const newIndex = current - 1;
                return newIndex < 0 ? products.length - 1 : newIndex;
            });
            setIsAnimating(false);
        }, 300);
    };
    
    const handleNextClick = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        
        setTimeout(() => {
            setStartIndex(current => {
                const newIndex = current + 1;
                return newIndex >= products.length ? 0 : newIndex;
            });
            setIsAnimating(false);
        }, 300);
    };

    useEffect(() => {
        const handleResize = () => {
            setItemsToShow(getItemsToShow());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="body-container">
            {/* Slider Section */}
            <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
                data-bs-interval="2000"
            >
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="0"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="1"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>

                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            src="/slider/1.jpg"
                            className="d-block w-100"
                            alt="Natural skincare products showcase"
                            loading="lazy"
                        />
                        <div className="carousel-caption d-block">
                            <h1 className="slider-title">Unlock Your Natural Glow</h1>
                            <button
                                className="btn btn-outline-light slider-btn"
                                onClick={() => window.location.href = '/products'}
                            >
                                Know More
                            </button>
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img
                            src="/slider/2.webp"
                            className="d-block w-100"
                            alt="Slide 2"
                        />
                        <div className="carousel-caption d-block">
                            <h1 className="slider-title">Discover Your True Beauty</h1>
                            <button
                                className="btn btn-outline-light slider-btn"
                                onClick={() => window.location.href = '/products'}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="carousel-item">
                        <img
                            src="/slider/3.webp"
                            className="d-block w-100"
                            alt="Slide 3"
                        />
                        <div className="carousel-caption d-block">
                            <h1 className="slider-title">Experience Premium Beauty</h1>
                            <button
                                className="btn btn-outline-light slider-btn"
                                onClick={() => window.location.href = '/products'}
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Products Categories Section */}
            <div className="container mt-5">
                <h2 className="text-center mb-4">Products&apos; Categories</h2>
                <div className="row">
                    <div className="col-md-4 text-center">
                        <img
                            src="/products/1.jpg"
                            className="img-fluid category-img"
                            alt="Women Make Up"
                        />
                        <h5 className="mt-3">Dưỡng ẩm</h5>
                    </div>
                    <div className="col-md-4 text-center">
                        <img
                            src="/products/2.jpg"
                            className="img-fluid category-img"
                            alt="Women Skincare"
                        />
                        <h5 className="mt-3">Sữa rửa mặt</h5>
                    </div>
                    <div className="col-md-4 text-center">
                        <img
                            src="/products/3.jpg"
                            className="img-fluid category-img"
                            alt="Gifts & Sets"
                        />
                        <h5 className="mt-3">Kem chống nắng</h5>
                    </div>
                </div>

                {/* Virtual Skincare Analysis Banner */}
                <div className="row mt-5">
                    <div className="col-md-12">
                        <div className="card text-white" style={{ backgroundColor: "#3D021E" }}>
                            <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between">
                                <div className="text-section" style={{ flex: "1" }}>
                                    <h3 className="card-title">NEW Virtual Skincare Analysis</h3>
                                    <p className="card-text">
                                        Looking For A Full Skincare Routine? Our NEW Virtual Skincare Analysis Tool
                                        Evaluates Your Skin And Provides The Most Personalized Recommendations.
                                    </p>
                                    <p className="card-text fw-bold">Scan With Your Phone To Get Started</p>
                                    <button className="btn btn-outline-light mt-3">Answer A Few Questions</button>
                                </div>
                                <div className="image-section mt-3 mt-md-0" style={{ flex: "1" }}>
                                    <img
                                        src="/newVisual/newVisual.jpg"
                                        alt="Virtual Skincare Analysis"
                                        className="img-fluid"
                                        style={{
                                            width: "100%",
                                            height: "300px",
                                            objectFit: "cover"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Best Sellers Section */}
            <div className="container mt-5 mb-5">
                <h2 className="text-center mb-4">Our Best Sellers</h2>
                <div className="position-relative product-slider">
                    <Row className="justify-content-center flex-nowrap">
                        {getVisibleProducts().map((product, index) => (
                            <Col 
                                key={index}
                                className="px-2"
                                style={{ 
                                    flex: `0 0 ${100/itemsToShow}%`, 
                                    maxWidth: `${100/itemsToShow}%`,
                                    minWidth: "200px" // Đảm bảo sản phẩm không bị quá nhỏ
                                }}
                            >
                                <Card className={`h-100 product-card ${isAnimating ? 'sliding-out' : 'sliding-in'}`}>
                                    <Card.Img variant="top" src={product.image} />
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="text-left">{product.title}</Card.Title>
                                        <Card.Text className="text-left">{product.description}</Card.Text>
                                        <Card.Text className="text-left mt-auto fw-bold">{product.price}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    
                    <button 
                        className="slider-nav-button prev"
                        onClick={handlePrevClick}
                        disabled={isAnimating}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    <button 
                        className="slider-nav-button next"
                        onClick={handleNextClick}
                        disabled={isAnimating}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Body;
