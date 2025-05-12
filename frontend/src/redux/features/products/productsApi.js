import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from './../../../utils/baseUrl';

const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/products`,
        credentials: 'include',
    }),
    tagTypes: ["Products"],
    endpoints: (builder) => ({
       fetchAllProducts: builder.query({
  query: ({ category, color, minPrice, maxPrice, page = 1, limit = 8 }) => {
    const params = new URLSearchParams();

    // Add category filter if it's not 'all' or empty
    if (category && category !== 'all') {
      params.append('category', category);
    }

    // Add color filter if it's not 'all' or empty
    if (color && color !== 'all') {
      params.append('color', color);
    }

    // Add minPrice filter if it's defined and greater than 0
    if (minPrice !== undefined && minPrice !== '' && minPrice > 0) {
      params.append('minPrice', minPrice.toString());
    }

    // Add maxPrice filter if it's defined and greater than 0
    if (maxPrice !== undefined && maxPrice !== '' && maxPrice > 0) {
      params.append('maxPrice', maxPrice.toString());
    }

    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    console.log(params);
    // Return the query string with parameters
    return `/?${params.toString()}`;
  },
  providesTags: ["Products"],
}),

        fetchProductById: builder.query({
            query: (id) => `${id}`,
            providesTags: (result,error, id) => [{type: "Products", id}]
        }),
        AddProduct: builder.mutation({
            query : (newProduct)=>({
                url: '/create-product',
                method: "POST",
                body: newProduct,
                credentials: 'include'
            }),
            invalidatesTags : ["Products"]
        }),
        fetchRelatedProducts: builder.query({
            query: (id) => `/related/${id}`
        }),
        updateProduct: builder.mutation({
            query: ({id, ...rest}) => ({
                url: `/update-product/${id}`,
                method: "PATCH",
                body: rest,
                credentials: 'include',
            }),
            invalidatesTags: ["Products"]
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
                credentials: 'include',
            }),
            invalidatesTags: (result, error, id) => [{type: "Products", id}]
        })
    })
})

export const {useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation, useFetchRelatedProductsQuery} = productsApi;
export default productsApi;
