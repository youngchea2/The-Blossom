/* [장바구니 모듈 - 기본 동작만] 가격 문의 상품은 담을 수 없음. 결제·서버 저장은 나중에 추가. */
Shop.Cart = (function(){
  var KEY = "shop_cart";
  function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch(e){ return []; } }
  function save(items){ localStorage.setItem(KEY, JSON.stringify(items)); }
  function find(id){ return Shop.Products.filter(function(q){ return q.id === id; })[0]; }
  function add(id){
    var p = find(id); if(!p || p.price == null) return;
    var items = load(), it = items.filter(function(x){ return x.id === id; })[0];
    if(it) it.qty++; else items.push({id:id, qty:1});
    save(items);
  }
  function remove(id){ save(load().filter(function(x){ return x.id !== id; })); }
  function count(){ return load().reduce(function(s,x){ return s + x.qty; }, 0); }
  function detailed(){
    return load().map(function(x){
      var p = find(x.id);
      return p && p.price != null ? {product:p, qty:x.qty, unit:Shop.Pricing.priceFor(p)} : null;
    }).filter(Boolean);
  }
  function total(){ return detailed().reduce(function(s,x){ return s + x.unit * x.qty; }, 0); }
  // TODO(나중에): 주문 생성, 결제 연동, 서버 검증(가격은 서버에서 다시 계산해야 안전)
  return { add:add, remove:remove, count:count, detailed:detailed, total:total, find:find };
})();
