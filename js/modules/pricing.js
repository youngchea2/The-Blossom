/* [가격 모듈] 일반가/사업자가 계산. 가격이 비어 있으면(null) '가격 문의' 상품. */
Shop.Pricing = (function(){
  function format(n){ return n.toLocaleString("ko-KR"); }
  function businessPrice(p){
    if(p.price == null) return null;
    return p.bizPrice != null ? p.bizPrice : Math.round(p.price * (1 - Shop.Config.bizDiscountRate) / 10) * 10;
  }
  function priceFor(p){ return Shop.Auth.isBusiness() ? businessPrice(p) : p.price; }
  return { format:format, businessPrice:businessPrice, priceFor:priceFor };
})();
