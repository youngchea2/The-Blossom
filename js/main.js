/* [시작 파일] 모듈 연결, 버튼 동작. 기능 로직은 modules/ 안에 둔다. */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  function currentCategory(){
    var h = location.hash.replace(/^#\/?/, "");
    try{ return h ? decodeURIComponent(h) : null; }catch(e){ return null; }
  }
  function hit(e, attr){ var el = e.target.closest && e.target.closest("[" + attr + "]"); return el ? el.getAttribute(attr) : null; }

  function renderHeader(){
    var u = Shop.Auth.getUser();
    $("user-info").textContent = u ? u.name + (Shop.Auth.isBusiness() ? " (사업자)" : "") : "";
    $("btn-login").textContent = u ? "로그아웃" : "로그인(데모)";
    $("cart-count").textContent = Shop.Cart.count();
  }
  function renderCart(){
    $("cart-items").innerHTML = Shop.Cart.detailed().map(function(x){
      return '<div class="cart-row"><span>' + Shop.Catalog.esc(x.product.name) + ' × ' + x.qty + '</span><span>' +
        Shop.Pricing.format(x.unit * x.qty) + '원 <button type="button" data-del="' + Shop.Catalog.esc(x.product.id) + '">삭제</button></span></div>';
    }).join("") || "<p>장바구니가 비어 있습니다.</p>";
    $("cart-total").textContent = Shop.Pricing.format(Shop.Cart.total());
  }
  function renderAll(){
    var c = currentCategory();
    Shop.Catalog.renderCategories(c); Shop.Catalog.renderProducts(c);
    renderHeader(); renderCart();
  }

  window.addEventListener("hashchange", renderAll);
  $("btn-login").addEventListener("click", function(){ Shop.Auth.getUser() ? Shop.Auth.logout() : Shop.Auth.demoLogin(); renderAll(); });
  $("btn-cart").addEventListener("click", function(){ $("cart-panel").hidden = false; });
  $("btn-cart-close").addEventListener("click", function(){ $("cart-panel").hidden = true; });
  $("btn-checkout").addEventListener("click", function(){ alert("주문/결제 기능은 추후 구현 예정입니다."); });
  document.addEventListener("click", function(e){
    var add = hit(e, "data-add"), del = hit(e, "data-del"), open = hit(e, "data-open"), big = hit(e, "data-big");
    if(add){ Shop.Cart.add(add); renderHeader(); renderCart(); }
    if(del){ Shop.Cart.remove(del); renderHeader(); renderCart(); }
    if(open) Shop.Catalog.openDetail(open);
    if(big && $("big")) $("big").src = big;
    if(hit(e, "data-close") || e.target.id === "detail") $("detail").close();
  });
  renderAll();
})();
