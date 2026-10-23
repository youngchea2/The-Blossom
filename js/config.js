/* [설정] 사이트 설정. 카테고리/상품은 엑셀에서 자동 생성되므로 여기서 관리하지 않음. */
window.Shop = window.Shop || {};
Shop.Config = {
  siteName: "T-Bloss",
  bizDiscountRate: 0.1,                 // 사업자 기본 할인율 (엑셀 사업자가가 있으면 그 값 우선)
  categories: Shop.Categories || []     // js/data/categories.js 에서 읽음
};
