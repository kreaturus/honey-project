import { createAsyncThunk } from '@reduxjs/toolkit';
import { IProductMutationNew, IProductView, ValidationError } from '@/types';
import axiosApi from '@/axiosApi';
import {
  useProductsAdminTranslation,
  useProductTranslation,
} from '@/features/products/productHook';
import { isAxiosError } from 'axios';

export const fetchAllProductsForAdmin = createAsyncThunk<IProductView[]>(
  'adminProducts/fetchAdmin',
  async () => {
    const productsResponse = await axiosApi.get<IProductView[]>('/admin');
    return useProductsAdminTranslation(productsResponse.data, 'ru');
  },
);

export const fetchAllProductsForAdminByCategory = createAsyncThunk<IProductView[], string>(
  'adminProducts/fetchByCategoryAdmin',
  async (id) => {
    const productsResponse = await axiosApi.get<IProductView[]>(`/admin?category=${id}`);
    return useProductsAdminTranslation(productsResponse.data, 'ru');
  },
);

export const fetchOneProductForAdmin = createAsyncThunk<IProductView, string>(
  'adminProducts/fetchOneByAdmin',
  async (id) => {
    const productResponse = await axiosApi.get<IProductView>(`/admin/${id}`);
    return useProductTranslation(productResponse.data, 'ru');
  },
);

export const patchActiveProducts = createAsyncThunk<void, string>(
  'adminProducts/patchProducts',
  async (id) => {
    await axiosApi.patch(`/admin/${id}`);
  },
);

export const patchHitProducts = createAsyncThunk<void, string>(
  'adminProducts/patchHitProducts',
  async (id) => {
    await axiosApi.patch(`/admin/${id}/hit`);
  },
);

export const createProduct = createAsyncThunk<
  void,
  IProductMutationNew,
  { rejectValue: ValidationError }
>('adminProducts/createProduct', async (productMutation, { rejectWithValue }) => {
  const formData = new FormData();
  formData.append('translations', JSON.stringify(productMutation.translations));

  formData.append('category', productMutation.category);
  formData.append('oldPrice', productMutation.oldPrice.toString());
  formData.append('actualPrice', productMutation.actualPrice.toString());
  formData.append('amount', productMutation.amount.toString());

  if (productMutation.image) {
    formData.append('image', productMutation.image);
  }
  try {
    await axiosApi.post('/admin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (e) {
    if (isAxiosError(e) && e.response && e.response.status === 400) {
      return rejectWithValue(e.response.data);
    }
    throw e;
  }
});
