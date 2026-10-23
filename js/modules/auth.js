/* [로그인 모듈 - 틀만] 나중에 서버 로그인으로 교체. 다른 모듈은 getUser()/isBusiness()만 쓰므로 이 파일 안쪽만 고치면 됨.
   지금은 "데모 로그인"으로 사업자 가격 표시만 확인 가능. (보안 기능 아님: 브라우저 값은 누구나 조작 가능) */
Shop.Auth = (function(){
  var KEY = "shop_user";
  function getUser(){ try{ return JSON.parse(localStorage.getItem(KEY)); }catch(e){ return null; } }
  function isBusiness(){ var u = getUser(); return !!(u && u.type === "business" && u.approved); }
  // TODO(나중에): 서버 API 로 아이디/비밀번호 검증, 사업자등록번호 승인 확인
  function demoLogin(){ localStorage.setItem(KEY, JSON.stringify({name:"데모 사업자", type:"business", approved:true})); }
  function logout(){ localStorage.removeItem(KEY); }
  return { getUser:getUser, isBusiness:isBusiness, demoLogin:demoLogin, logout:logout };
})();
