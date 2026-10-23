/* [고급형 화면 전용 모듈] index_premium.html 에서만 불러옵니다 (index.html 에는 영향 없음).
   catalog.js 의 카테고리/상품 그리기를 고급형 모양으로 교체하고, 검색·정렬·전체카테고리 메뉴를 담당합니다.
   상품 데이터(엑셀), 가격 계산, 장바구니, 로그인은 기존 모듈을 그대로 사용합니다. */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var C = Shop.Catalog, fmt = Shop.Pricing.format;
  var state = { sort: "default", q: "" };
  var PH = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><rect width='600' height='600' fill='#f3f3f3'/><text x='300' y='310' text-anchor='middle' font-size='28' fill='#aaa'>이미지 준비중</text></svg>").replace(/'/g, "%27");
  var CART = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>';

  function norm(s){ return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, ""); }
  function rerender(){ window.dispatchEvent(new Event("hashchange")); }   // main.js 가 화면을 다시 그림
  function closeMega(){ $("pm-mega").hidden = true; $("pm-all").setAttribute("aria-expanded", "false"); }

  /* ---- 카테고리: 가로 메뉴 + 전체카테고리 펼침 ---- */
  C.renderCategories = function(active){
    var cur = state.q ? null : active;
    function link(name, on){
      var href = name ? "#/" + encodeURIComponent(name) : "#/";
      return '<li><a href="' + href + '" class="' + (on ? "on" : "") + '">' + C.esc(name || "전체") + '</a></li>';
    }
    var html = link("", !cur && !state.q);
    Shop.Config.categories.forEach(function(c){ html += link(c.name, c.name === cur); });
    $("pm-nav-list").innerHTML = html; $("pm-mega-list").innerHTML = html;
    var on = document.querySelector("#pm-nav-list a.on");
    if(on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "center"});
    closeMega();
  };

  /* ---- 상품 목록 ---- */
  function byPrice(dir){      // 가격 없는(문의) 상품은 항상 맨 뒤
    return function(x, y){
      var a = Shop.Pricing.priceFor(x), b = Shop.Pricing.priceFor(y);
      if(a == null && b == null) return 0;
      if(a == null) return 1;
      if(b == null) return -1;
      return dir * (a - b);
    };
  }
  function priceLine(p){
    if(p.price == null) return '<div class="pm-price ask">가격 문의</div>';
    if(Shop.Auth.isBusiness())
      return '<div class="pm-price biz"><s>' + fmt(p.price) + '원</s>' + fmt(Shop.Pricing.businessPrice(p)) + '원 <small>사업자가</small></div>';
    return '<div class="pm-price">' + fmt(p.price) + '원</div><button type="button" class="pm-member" data-login="1">사업자 회원가 보기 ›</button>';
  }
  function card(p){
    var id = C.esc(p.id), src = (p.images && p.images[0]) || PH;
    var add = p.price == null ? '<button type="button" class="pm-add" disabled>가격 문의 상품</button>'
      : '<button type="button" class="pm-add" data-add="' + id + '">' + CART + ' 담기</button>';
    return '<article class="pm-card">' +
      '<button type="button" class="pm-img" data-open="' + id + '" aria-label="' + C.esc(p.name) + ' 상세보기">' +
        '<img src="' + C.esc(src) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + PH + '\'"></button>' + add +
      '<div class="pm-cat">' + C.esc(p.category) + '</div>' +
      '<h3 class="pm-h"><button type="button" class="pm-name" data-open="' + id + '">' + C.esc(p.name) + '</button></h3>' +
      priceLine(p) + (p.spec ? '<div class="pm-spec">규격 : ' + C.esc(p.spec) + '</div>' : '') + '</article>';
  }
  C.renderProducts = function(active){
    var q = norm(state.q);
    var list = Shop.Products.filter(function(p){
      if(q) return norm([p.name, p.spec, p.category, p.desc].join(" ")).indexOf(q) >= 0;   // 검색은 전체 카테고리에서
      return !active || p.category === active;
    });
    if(state.sort === "low") list.sort(byPrice(1));
    else if(state.sort === "high") list.sort(byPrice(-1));
    else if(state.sort === "name") list.sort(function(x, y){ return x.name.localeCompare(y.name, "ko"); });
    $("list-title").textContent = q ? "“" + state.q.trim() + "” 검색 결과" : (active || "전체 상품");
    $("pm-count").textContent = list.length;
    $("product-grid").innerHTML = list.length ? list.map(card).join("") : '<p class="pm-empty">조건에 맞는 상품이 없습니다.</p>';
  };

  /* ---- 이벤트 ---- */
  $("pm-q").addEventListener("input", function(){ state.q = this.value; rerender(); });
  $("pm-sort").addEventListener("change", function(){ state.sort = this.value; rerender(); });
  $("pm-all").addEventListener("click", function(){
    var open = $("pm-mega").hidden;
    $("pm-mega").hidden = !open; this.setAttribute("aria-expanded", String(open));
  });
  $("pm-join").addEventListener("click", function(){ alert("회원가입은 추후 구현 예정입니다."); });
  document.addEventListener("click", function(e){
    var t = e.target;
    if(t.closest && t.closest("[data-login]")) $("btn-login").click();         // main.js 의 로그인(데모) 동작 재사용
    if(t.closest && !t.closest(".pm-nav")) closeMega();
  });
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeMega(); });
})();
