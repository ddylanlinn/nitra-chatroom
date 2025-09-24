<template>
  <q-card
    class="product-card"
    flat
    bordered
  >
    <!-- Product Image -->
    <q-card-section v-if="product.imageLink" class="product-card__image-section">
      <div class="product-card__image-container">
        <img
          :src="product.imageLink"
          :alt="product.name"
          class="product-card__image"
          @error="handleImageError"
        />
      </div>
    </q-card-section>

    <!-- Product Info -->
    <q-card-section class="product-card__info">
      <div class="product-card__header">
        <h6 class="product-card__name text-weight-medium">
          {{ product.name }}
        </h6>
        <div class="product-card__price text-primary text-weight-bold">
          {{ product.price }}
        </div>
      </div>

      <!-- Product Details -->
      <div class="product-card__details">
        <div v-if="product.vendor" class="product-card__detail">
          <q-icon name="store" size="sm" />
          <span>{{ product.vendor }}</span>
        </div>
        <div v-if="product.brand" class="product-card__detail">
          <q-icon name="label" size="sm" />
          <span>{{ product.brand }}</span>
        </div>
        <div v-if="product.unitOfMeasure" class="product-card__detail">
          <q-icon name="scale" size="sm" />
          <span>{{ product.unitOfMeasure }}</span>
        </div>
      </div>
    </q-card-section>

    <!-- Actions -->
    <q-card-actions class="product-card__actions">
      <q-btn
        v-if="product.productLink"
        :href="product.productLink"
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        outline
        size="sm"
        icon="open_in_new"
        label="View Product"
        class="product-card__link-btn"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProductInfo } from '../../types'

interface Props {
  product: ProductInfo
}

const props = defineProps<Props>()

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.product-card {
  max-width: 320px;
  margin: 8px 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-card__image-section {
  padding: 0;
}

.product-card__image-container {
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.product-card__image:hover {
  transform: scale(1.05);
}

.product-card__info {
  padding: 16px;
}

.product-card__header {
  margin-bottom: 12px;
}

.product-card__name {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  color: #333;
}

.product-card__price {
  font-size: 18px;
  line-height: 1.2;
}

.product-card__details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-card__detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #666;
}

.product-card__detail .q-icon {
  color: #999;
}

.product-card__actions {
  padding: 8px 16px 16px;
  justify-content: flex-end;
}

.product-card__link-btn {
  min-width: 120px;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .product-card {
    max-width: 100%;
    margin: 8px 0;
  }

  .product-card__image-container {
    height: 120px;
  }

  .product-card__info {
    padding: 12px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .product-card__image-container {
    background: #2a2a2a;
  }

  .product-card__name {
    color: #e0e0e0;
  }

  .product-card__detail {
    color: #ccc;
  }

  .product-card__detail .q-icon {
    color: #888;
  }
}

/* Responsive Design */
/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .product-card {
    max-width: 320px;
  }

  .product-card__image-container {
    height: 180px;
  }

  .product-card__name {
    font-size: 16px;
    min-height: 45px;
  }

  .product-card:hover {
    transform: translateY(-4px);
  }
}

/* Desktop (1024px - 1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .product-card {
    max-width: 300px;
  }

  .product-card__image-container {
    height: 160px;
  }

  .product-card__name {
    min-height: 42px;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .product-card {
    max-width: 280px;
  }

  .product-card__image-container {
    height: 140px;
  }

  .product-card__name {
    font-size: 15px;
    min-height: 40px;
  }
}

/* Mobile Large (480px - 767px) */
@media (min-width: 480px) and (max-width: 767px) {
  .product-card {
    max-width: 100%;
  }

  .product-card__image-container {
    height: 120px;
  }

  .product-card__name {
    font-size: 14px;
    min-height: 36px;
  }

  .product-card:hover {
    transform: translateY(-1px);
  }
}

/* Mobile Small (up to 479px) */
@media (max-width: 479px) {
  .product-card {
    max-width: 100%;
    border-radius: 6px;
    margin: 6px 0;
  }

  .product-card__image-container {
    height: 100px;
  }

  .product-card__name {
    font-size: 14px;
    min-height: 32px;
    line-height: 1.3;
  }

  .product-card__vendor,
  .product-card__brand {
    font-size: 12px;
  }

  .product-card__price {
    font-size: 15px;
  }

  /* Disable hover effects on touch devices */
  .product-card:hover {
    transform: none;
    box-shadow: none;
  }

  /* Add touch feedback instead */
  .product-card:active {
    transform: scale(0.98);
  }

  /* Card sections responsive spacing */
  .product-card :deep(.q-card__section) {
    padding: 12px 14px;
  }

  .product-card :deep(.q-card__actions) {
    padding: 8px 14px 12px;
  }

  .product-card__no-image .q-icon {
    font-size: 2rem;
  }
}
</style>
