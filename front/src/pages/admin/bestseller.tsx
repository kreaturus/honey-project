import React, { ChangeEvent, useEffect } from 'react';
import { MyPage } from '@/components/common/types';
import ProtectedRoute from '@/components/UI/protectedRoute/ProtectedRoute';
import cls from '@/styles/adminBestsellers.module.scss';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { selectAllProductsForAdmin } from '@/features/productAdmin/productsAdminSlice';
import { apiUrl } from '@/constants';
import { selectCategories } from '@/features/categories/categoriesSlice';
import {
  fetchAllProductsForAdmin,
  fetchAllProductsForAdminByCategory,
} from '@/features/productAdmin/productsAdminThunk';
import plusIcon from '@/assets/images/plusIcon.png';
import { wrapper } from '@/store/store';
import axiosApi from '@/axiosApi';
import { fetchCategories } from '@/features/categories/categoriesThunk';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const BestsellerAdminPage: MyPage = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectAllProductsForAdmin);
  const categories = useAppSelector(selectCategories);

  useEffect(() => {
    dispatch(fetchAllProductsForAdmin());
  }, [dispatch]);

  const categoryChangeHandle = async (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = event.target.value;

    if (categoryId !== '') {
      await dispatch(fetchAllProductsForAdminByCategory(categoryId));
    } else {
      await dispatch(fetchAllProductsForAdmin());
    }
  };

  return (
    <ProtectedRoute>
      <div className={cls.container}>
        <div className={cls.bestseller}>
          <h1 className={cls.bestseller_main_title}>Хиты</h1>
          <div className={cls.bestseller_activeBest}></div>
          <div className={cls.adminProductsNav}>
            <h3 className={cls.bestseller_title}>Все товары</h3>
            <select onChange={categoryChangeHandle}>
              <option value="">Отфильтровать по категории</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="findProduct"
              id="findProduct"
              placeholder="Найти по названию"
            />
            <div className={cls.adminProductsPagination}>
              <a className={cls.arrowToLeft} href="#"></a>
              <p>
                Страница: <span>1</span> из <span>12</span>
              </p>
              <a className={cls.arrowToRight} href="#"></a>
            </div>
          </div>
          <div className={cls.adminBestsellersTable}>
            <table>
              <thead>
                <tr>
                  <th>Фотография</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>Статус</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody className={cls.adminBestsellersTable_body}>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className={cls.imageTd}>
                      <img src={apiUrl + '/' + product.image} alt="image" />
                    </td>
                    <td>{product.title}</td>
                    <td>{product.category.title}</td>
                    <td>{product.actualPrice}</td>
                    <td>
                      <span
                        className={
                          product.isActive
                            ? cls.adminBestsellersTable_active
                            : cls.adminBestsellersTable_inactive
                        }
                      >
                        {product.isActive ? 'Активен' : 'Не активен'}
                      </span>
                    </td>
                    <td>
                      <button className={cls.adminBestsellersTable_addBtn}>
                        <img src={plusIcon.src} alt="Plus Icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

BestsellerAdminPage.Layout = 'Admin';

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ locale }) => {
  axiosApi.defaults.headers.common['Accept-Language'] = locale ?? 'ru';
  await store.dispatch(fetchCategories(''));

  return {
    props: {
      name: 'Products',
      ...(await serverSideTranslations(locale ?? 'ru', ['common'])),
    },
  };
});

export default BestsellerAdminPage;
