// Image size interface for responsive images
export interface ImageSize {
  url: string;
  width: number;
  height: number;
}

// Complete image sizes object
export interface ImageSizes {
  thumbnail: string;
  "thumbnail-width": number;
  "thumbnail-height": number;
  medium: string;
  "medium-width": number;
  "medium-height": number;
  medium_large: string;
  "medium_large-width": number;
  "medium_large-height": number;
  large: string;
  "large-width": number;
  "large-height": number;
  "1536x1536": string;
  "1536x1536-width": number;
  "1536x1536-height": number;
  "2048x2048": string;
  "2048x2048-width": number;
  "2048x2048-height": number;
  woocommerce_thumbnail: string;
  "woocommerce_thumbnail-width": number;
  "woocommerce_thumbnail-height": number;
  woocommerce_single: string;
  "woocommerce_single-width": number;
  "woocommerce_single-height": number;
  woocommerce_gallery_thumbnail: string;
  "woocommerce_gallery_thumbnail-width": number;
  "woocommerce_gallery_thumbnail-height": number;
  lightbox: string;
  "lightbox-width": number;
  "lightbox-height": number;
  search_results: string;
  "search_results-width": number;
  "search_results-height": number;
  blog_entry: string;
  "blog_entry-width": number;
  "blog_entry-height": number;
  blog_post: string;
  "blog_post-width": number;
  "blog_post-height": number;
  blog_post_full: string;
  "blog_post_full-width": number;
  "blog_post_full-height": number;
  blog_related: string;
  "blog_related-width": number;
  "blog_related-height": number;
  shop_catalog: string;
  "shop_catalog-width": number;
  "shop_catalog-height": number;
  shop_single: string;
  "shop_single-width": number;
  "shop_single-height": number;
  shop_single_thumbnail: string;
  "shop_single_thumbnail-width": number;
  "shop_single_thumbnail-height": number;
  shop_category: string;
  "shop_category-width": number;
  "shop_category-height": number;
  shop_cart: string;
  "shop_cart-width": number;
  "shop_cart-height": number;
  gallery: string;
  "gallery-width": number;
  "gallery-height": number;
}

// Image object interface
export interface SliderImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: ImageSizes;
}

// Button interface for CTA buttons
export interface SliderButton {
  label: string;
  url: string;
  target: "_blank" | "_self" | "";
}

// Title object interface
export interface SliderTitle {
  rendered: string;
}

// Content object interface
export interface SliderContent {
  rendered: string;
  protected: boolean;
}

// GUID interface
export interface SliderGuid {
  rendered: string;
}

// Meta information
export interface SliderMeta {
  _acf_changed: boolean;
}

// ACF (Advanced Custom Fields) data
export interface SliderACF {
  title: string;
  image: SliderImage;
  description: string;
  offer: string;
  buttontext1: SliderButton;
  buttontext2: SliderButton;
}

// Links interface for WordPress API links
export interface SliderLinks {
  self: Array<{
    href: string;
    targetHints?: {
      allow: string[];
    };
  }>;
  collection: Array<{
    href: string;
  }>;
  about: Array<{
    href: string;
  }>;
  author: Array<{
    embeddable: boolean;
    href: string;
  }>;
  "wp:featuredmedia": Array<{
    embeddable: boolean;
    href: string;
  }>;
  "wp:attachment": Array<{
    href: string;
  }>;
  curies: Array<{
    name: string;
    href: string;
    templated: boolean;
  }>;
}

// Main slider/banner interface
export interface SliderBanner {
  id: number;
  date: string;
  date_gmt: string;
  guid: SliderGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "draft" | "private";
  type: string;
  link: string;
  title: SliderTitle;
  content: SliderContent;
  author: number;
  featured_media: number;
  template: string;
  meta: SliderMeta;
  class_list: string[];
  acf: SliderACF;
  _links: SliderLinks;
}

// Simplified interface for UI components
export interface BannerSlide {
  id: number;
  title: string;
  description: string;
  offer?: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  buttons: {
    primary?: SliderButton;
    secondary?: SliderButton;
  };
  status: "active" | "inactive";
}

// API Response interface
export interface SlidersResponse {
  slides: SliderBanner[];
  total: number;
  totalPages: number;
}

// Hook return interface
export interface UseSliderReturn {
  slides: BannerSlide[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
}

// Slider configuration
export interface SliderConfig {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  infinite?: boolean;
  fadeEffect?: boolean;
}

// Transform function type
export type SliderTransformer = (apiSliders: SliderBanner[]) => BannerSlide[];

// Additional slider/banner types for extended API support
export interface ExtendedSliderResponse {
  sliders: SliderBanner[];
  banners: SliderBanner[];
  total: number;
  page: number;
  totalPages: number;
}

// Utility type for transforming API data to UI data
export type SliderTransformFunction = (apiSlider: SliderBanner) => BannerSlide;
