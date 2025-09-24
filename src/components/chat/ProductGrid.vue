<template>
  <div v-if="products && products.length > 0" class="product-grid">
    <div class="product-grid__header">
      <q-icon name="shopping_cart" size="sm" color="primary" />
      <span class="product-grid__title">Products</span>
    </div>
    
    <div class="product-grid__container">
      <ProductCard
        v-for="(product, index) in products"
        :key="index"
        :product="product"
        class="product-grid__item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProductCard from './ProductCard.vue'
import type { ProductInfo } from '../../types'

interface Props {
  products?: ProductInfo[]
}

defineProps<Props>()
</script>

<style scoped>
.product-grid {
  margin: 16px 0;
}

.product-grid__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 4px;
}

.product-grid__title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
}

.product-grid__container {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

/* Responsive Grid Layout */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .product-grid__container {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .product-grid__container {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 14px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .product-grid__container {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .product-grid__container {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .product-grid__item {
    max-width: 100%;
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .product-grid {
    margin: 12px 0;
  }

  .product-grid__header {
    margin-bottom: 10px;
  }

  .product-grid__title {
    font-size: 13px;
  }

  .product-grid__container {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .product-grid__item {
    max-width: 100%;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .product-grid__title {
    color: #e0e0e0;
  }
}
</style>
