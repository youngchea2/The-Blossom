/* [카탈로그 모듈] 카테고리 메뉴, 상품 카드, 상세 팝업 그리기. 모양 변경은 이 파일 + style.css. */
Shop.Catalog = (function(){
  var PH = "data:image/svg+xml;utf8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='#dfe7ea'/><text x='200' y='210' text-anchor='middle' font-size='24' fill='#7b8c92'>이미지 준비중</text></svg>");
  function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function img(src, cls, extra){
    return '<img class="' + cls + '" src="' + esc(src || PH) + '" alt="" loading="lazy" ' + (extra || "") + ' onerror="this.onerror=null;this.src=\'' + PH + '\'">';
  }

  function renderCategories(active){
    var html = '<li><a href="#/" class="' + (!active ? "on" : "") + '">전체</a></li>';
    Shop.Config.categories.forEach(function(c){
      html += '<li><a href="#/' + encodeURIComponent(c.name) + '" class="' + (c.name === active ? "on" : "") + '">' + esc(c.name) + '</a></li>';
    });
    document.getElementById("category-list").innerHTML = html;
  }

  function priceHtml(p){
    if(p.price == null) return '<div class="price ask">가격 문의</div>';
    if(!Shop.Auth.isBusiness()) return '<div class="price">' + Shop.Pricing.format(p.price) + '원</div>';
    return '<div class="price biz"><s>' + Shop.Pricing.format(p.price) + '원</s>' + Shop.Pricing.format(Shop.Pricing.businessPrice(p)) + '원 (사업자가)</div>';
  }
  function cartBtn(p){
    return p.price == null ? '<button type="button" disabled>가격 문의 상품</button>'
      : '<button type="button" class="primary" data-add="' + esc(p.id) + '">장바구니 담기</button>';
  }

  function renderProducts(active){
    document.getElementById("list-title").textContent = active || "전체 상품";
    var list = Shop.Products.filter(function(p){ return !active || p.category === active; });
    document.getElementById("product-grid").innerHTML = list.length ? list.map(function(p){
      return '<article class="card"><button type="button" class="open" data-open="' + esc(p.id) + '">' + img(p.images[0], "") +
        '<h3>' + esc(p.name) + '</h3></button><div class="body">' + (p.spec ? '<p>' + esc(p.spec) + '</p>' : '') +
        priceHtml(p) + cartBtn(p) + '</div></article>';
    }).join("") : "<p>이 카테고리에 등록된 상품이 없습니다.</p>";
  }

  function openDetail(id){
    var p = Shop.Cart.find(id); if(!p) return;
    var imgs = p.images.length ? p.images : [""];
    var d = document.getElementById("detail");
    d.innerHTML = '<button type="button" class="x" data-close="1">닫기 ✕</button><div class="dg"><div>' +
      img(imgs[0], "bigimg", 'id="big"') + '<div class="ths">' +
      imgs.map(function(s){ return img(s, "th", 'data-big="' + esc(s || PH) + '"'); }).join("") + '</div></div>' +
      '<div class="info"><h2>' + esc(p.name) + '</h2><p class="cat">' + esc(p.category) + '</p>' + (p.spec ? '<p>' + esc(p.spec) + '</p>' : '') +
      priceHtml(p) + '<p class="desc">' + esc(p.desc || "상세 설명 준비중입니다.") + '</p>' + cartBtn(p) + '</div></div>';
    d.showModal();
  }
  return { renderCategories:renderCategories, renderProducts:renderProducts, openDetail:openDetail, esc:esc };
})();
