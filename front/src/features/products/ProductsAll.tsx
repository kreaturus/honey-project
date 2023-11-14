import React, { memo } from 'react';
import { useAppSelector } from '@/store/hook';
import { selectAllProducts } from '@/features/products/productsSlice';
import ProductItem from '@/features/products/components/ProductItem';
import { IProduct } from '@/types';
import { useTranslation } from 'next-i18next';
import cls from './components/products.module.scss';

const ProductsAll = () => {
  const products = useAppSelector(selectAllProducts);
  const { t } = useTranslation('common');
  return (
    <div className={cls.container}>
      <h2 className={cls.title}>{t('all-products')}</h2>
      <div className={cls.list}>
        {products.map((el: IProduct) => (
          <ProductItem
            key={el._id}
            _id={el._id}
            title={el.title}
            price={el.actualPrice}
            image={el.image}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ProductsAll);
