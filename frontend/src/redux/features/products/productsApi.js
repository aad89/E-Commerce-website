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
            query: ({ category, color, minPrice, maxPrice, page = 1, limit = 10 }) => {
  const params = new URLSearchParams();

  if (category && category !== 'all') {
    params.append('category', category);
  }

  if (color && color !== 'all') {
    params.append('color', color);
  }

  if (minPrice !== undefined && minPrice !== '' && minPrice > 0) {
    params.append('minPrice', minPrice.toString());
  }

  if (maxPrice !== undefined && maxPrice !== '' && maxPrice > 0) {
    params.append('maxPrice', maxPrice.toString());
  }

  params.append('page', page.toString());
  params.append('limit', limit.toString());

  return `/?${params.toString()}`;
},
            providesTags : ["Products"]
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
