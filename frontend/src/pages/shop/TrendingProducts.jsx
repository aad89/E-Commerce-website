import React, { useState, useEffect } from 'react';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';  // Import the hook
import ProductCards from './ProductCards';  // Your existing component

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8); // Initially showing 8 products

    // Fetch products with the query
    const { data: { products = [], totalProducts = 0 } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: '',  // Specify any filter if needed, e.g., 'trending' if your API supports this
        color: '', 
        minPrice: '', 
        maxPrice: '',
        page: 1, // Adjust based on pagination
        limit: visibleProducts,
    });

    // Load more products when the button is clicked
    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4); // Load more products
    }

    // Ensure the button displays only if more products are available to load
    const hasMoreProducts = visibleProducts < totalProducts;  // Compare with totalProducts from API response

    if (isLoading) return <div>Loading trending products...</div>;
    if (error) return <div>Error loading trending products</div>;

    return (
        <section className='section__container product__container'>
            <h2 className='section__header'>Trending Products</h2>
            <p className='section__subheader mb-4'>
                Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Women's Fashion Products.
            </p>
        
            <div className='mt-12'>
                <ProductCards products={products.slice(0, visibleProducts)} /> {/* Display only visible products */}
            </div>

            {/* Display the Load More button if more products are available */}
            {hasMoreProducts && (
                <div className='product__btn'>
                    <button className='btn' onClick={loadMoreProducts}>Load More</button>
                </div>
            )}
        </section>
    )
}

export default TrendingProducts;
