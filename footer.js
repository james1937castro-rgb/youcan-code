
document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector(".categories-style-1");
  if (!list) return;
  const items = list.querySelectorAll(".category-item");
  const isMobile = window.innerWidth <= 768;
  if ((isMobile && items.length > 3) || (!isMobile && items.length > 5)) {
    list.classList.add("category-slider");
  } else {
    list.classList.add("category-slider", "fallback");
  }
});

/* -------------------------------------------------
   🔹 تعديل نص زر الشراء
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.product-actions a.button').forEach(function (btn) {
    btn.innerHTML = `
      شراء الآن
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="margin-right: 6px;">
        <path d="M0 1a1 1 0 0 1 1-1h1.22a.5.5 0 0 1 .49.37L3.89 4H14a1 1 0 0 1 .96 1.27l-1.5 6A1 1 0 0 1 12.5 12H5a1 1 0 0 1-1-.78L2.01 2H1a1 1 0 0 1-1-1zm4.14 4l1.25 5h7.11l1.2-5H4.14zM5.5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
      </svg>
    `;
  });
});

/* -------------------------------------------------
   🔹 إضافة نسبة الخصم للمنتجات
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('.products-grid .product-item, .products-slider .product-item').forEach(function(product, index) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'discount_pp';
    let savedDiscount = localStorage.getItem(`discount_${index}`);
    if (!savedDiscount) {
      savedDiscount = Math.floor(Math.random() * (37 - 15 + 1)) + 15;
      localStorage.setItem(`discount_${index}`, savedDiscount);
    }
    discountSpan.textContent = `-${savedDiscount}%`;
    product.appendChild(discountSpan);
  });
});

/* -------------------------------------------------
   🔹 إنشاء أزرار الأسهم للتصنيفات
-------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".categories-style-1.category-slider");
  if (!slider) return;
  const wrapper = document.createElement("div");
  wrapper.classList.add("categories-wrapper");
  slider.parentNode.insertBefore(wrapper, slider);
  wrapper.appendChild(slider);

  const rightArrow = document.createElement("button");
  rightArrow.className = "cat-arrow right";
  rightArrow.innerHTML = "‹";

  const leftArrow = document.createElement("button");
  leftArrow.className = "cat-arrow left";
  leftArrow.innerHTML = "›";

  wrapper.appendChild(leftArrow);
  wrapper.appendChild(rightArrow);

  leftArrow.addEventListener("click", () => {
    slider.scrollBy({ left: -150, behavior: "smooth" });
  });
  rightArrow.addEventListener("click", () => {
    slider.scrollBy({ left: 150, behavior: "smooth" });
    const otherButton = document.getElementById("otherButton");
    if (otherButton) otherButton.click();
  });
});

(function(){
  const TITLE = "تنبيه";
  const MESSAGE = "لا يمكن عرض الصفحة ";
  const BUTTON_TEXT = "موافق";

  let modalVisible = false;
  let browsingAllowed = true; // افتراض: عند الدخول مسموح بالتصفح
  let lastTriggerAt = 0;
  const MIN_RETRIGGER_INTERVAL = 600; // منع تريجرات سريعة جداً

  function createModal(){
    if (document.getElementById('__antiInspect_backdrop')) return;
    document.documentElement.classList.add('__ai_no_select');

    const bd = document.createElement('div'); bd.id = '__antiInspect_backdrop';
    const md = document.createElement('div'); md.id = '__antiInspect_modal';
    md.innerHTML = `
      <h2>${TITLE}</h2>
      <p>${MESSAGE}</p>
      <div style="text-align:left;">
        <button id="__ai_ok">${BUTTON_TEXT}</button>
      </div>
    `;
    bd.appendChild(md);
    document.body.appendChild(bd);

    document.getElementById('__ai_ok').addEventListener('click', function(){
      const b = document.getElementById('__antiInspect_backdrop');
      if (b) b.remove();
      document.documentElement.classList.remove('__ai_no_select');
      modalVisible = false;
      browsingAllowed = true; // بعد موافق يسمح بتصفح عادي
    });

    modalVisible = true;
    browsingAllowed = false;
  }

  function trigger(reason){
    const now = Date.now();
    if (now - lastTriggerAt < MIN_RETRIGGER_INTERVAL) return;
    lastTriggerAt = now;

    if (modalVisible) return;
    try { createModal(); } catch(e){}
    console.warn('anti-inspect triggered:', reason || 'unknown');
  }

  // 1) فقط event contextmenu (زر أيمن) يظهر المودال
  window.addEventListener('contextmenu', function(e){
    e.preventDefault();
    trigger('contextmenu');
    return false;
  }, true);

  // 2) جميع الاختصارات الشائعة لفتح DevTools أو عرض المصدر
  window.addEventListener('keydown', function(e){
    // دعم Ctrl (Windows/Linux) و Meta (Mac)
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // F12
    if (e.key === 'F12') { e.preventDefault(); trigger('F12'); return false; }

    // Ctrl/Cmd + Shift + I / J / K (Chrome/Firefox devtools)
    if (ctrl && shift && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'K' || e.key === 'k')) {
      e.preventDefault(); trigger('CtrlShift_IJK'); return false;
    }

    // Ctrl/Cmd + U (view source)
    if (ctrl && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); trigger('CtrlU'); return false; }

    // Ctrl/Cmd + Shift + C (inspect element)
    if (ctrl && shift && (e.key === 'C' || e.key === 'c')) { e.preventDefault(); trigger('CtrlShiftC'); return false; }

    // بعض متصفحات: Ctrl+Shift+K (firefox console)
    if (ctrl && shift && (e.key === 'K' || e.key === 'k')) { e.preventDefault(); trigger('CtrlShiftK'); return false; }
  }, true);

  // 3) منع اختيارات النسخ والسحب (اختياري لكن مفيد)
  try {
    window.addEventListener('copy', function(e){ e.preventDefault(); }, true);
    document.addEventListener('selectstart', function(e){ e.preventDefault(); }, true);
    document.addEventListener('dragstart', function(e){ e.preventDefault(); }, true);
  } catch(e){}

  // 4) كشف فتح DevTools عبر console.toString trick (يلتقط فتح DevTools من القوائم أيضاً)
  (function(){
    const obj = { toString: function(){ trigger('console_open'); return ''; } };
    setInterval(function(){ try{ console.log('%c', obj); }catch(e){} }, 2000);
  })();

  // 5) كشف التوقف/البريكبوينت (breakpoint pause) كمكمّل
  (function(){
    let last = performance.now();
    setInterval(function(){
      const now = performance.now();
      if (now - last > 300) { trigger('perf_pause'); }
      last = now;
    }, 100);
  })();

  // ملاحظة مهمة: الكود يمنع و/أو يعترض اختصارات محاولة فتح DevTools ويعرض المودال.
  // لكنه لا يمكنه منع مطوّر محترف من الوصول إلى الكود تمامًا (كما ذكرت سابقًا).
  // هذه الوسائل تضيف طبقة إزعاج/حماية للمستخدم العادي فقط.
})();



