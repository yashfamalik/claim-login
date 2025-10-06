(function (global) {
  "use strict";

  const d = (sel, root = document) => root.querySelector(sel);
  const da = (sel, root = document) => root.querySelectorAll(sel);

  // Built-in small SVG set for template bullets
  const SVG = {
    shield: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    users: `<svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"/>
</svg>`,
    lightning: `<svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"/>
</svg>`,
    star: `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.245 4.174C11.4765 3.50808 11.5922 3.17513 11.7634 3.08285C11.9115 3.00298 12.0898 3.00298 12.238 3.08285C12.4091 3.17513 12.5248 3.50808 12.7563 4.174L14.2866 8.57639C14.3525 8.76592 14.3854 8.86068 14.4448 8.93125C14.4972 8.99359 14.5641 9.04218 14.6396 9.07278C14.725 9.10743 14.8253 9.10947 15.0259 9.11356L19.6857 9.20852C20.3906 9.22288 20.743 9.23007 20.8837 9.36432C21.0054 9.48051 21.0605 9.65014 21.0303 9.81569C20.9955 10.007 20.7146 10.2199 20.1528 10.6459L16.4387 13.4616C16.2788 13.5829 16.1989 13.6435 16.1501 13.7217C16.107 13.7909 16.0815 13.8695 16.0757 13.9507C16.0692 14.0427 16.0982 14.1387 16.1563 14.3308L17.506 18.7919C17.7101 19.4667 17.8122 19.8041 17.728 19.9793C17.6551 20.131 17.5108 20.2358 17.344 20.2583C17.1513 20.2842 16.862 20.0829 16.2833 19.6802L12.4576 17.0181C12.2929 16.9035 12.2106 16.8462 12.1211 16.8239C12.042 16.8043 11.9593 16.8043 11.8803 16.8239C11.7908 16.8462 11.7084 16.9035 11.5437 17.0181L7.71805 19.6802C7.13937 20.0829 6.85003 20.2842 6.65733 20.2583C6.49056 20.2358 6.34626 20.131 6.27337 19.9793C6.18915 19.8041 6.29123 19.4667 6.49538 18.7919L7.84503 14.3308C7.90313 14.1387 7.93218 14.0427 7.92564 13.9507C7.91986 13.8695 7.89432 13.7909 7.85123 13.7217C7.80246 13.6435 7.72251 13.5829 7.56262 13.4616L3.84858 10.6459C3.28678 10.2199 3.00588 10.007 2.97101 9.81569C2.94082 9.65014 2.99594 9.48051 3.11767 9.36432C3.25831 9.23007 3.61074 9.22289 4.31559 9.20852L8.9754 9.11356C9.176 9.10947 9.27631 9.10743 9.36177 9.07278C9.43726 9.04218 9.50414 8.99359 9.55657 8.93125C9.61593 8.86068 9.64887 8.76592 9.71475 8.57639L11.245 4.174Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    check: `<svg width="20px" height="20px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="currentColor" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"/>
</svg>`
  };

  // Enhanced Custom Logo Collection - Support for 12 dynamic logos
  const CUSTOM_LOGO_MAP = {
    "logo1": "<svg width='50' height='57' viewBox='0 0 50 57' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_2157_3055)'><path fill-rule='evenodd' clip-rule='evenodd' d='M26.5567 1.13184C29.9936 3.35073 33.6995 5.13663 37.5877 6.44775C40.4729 7.43566 43.5306 7.84111 46.5784 7.63989L49.7402 7.35693L49.8957 10.4834C50.4753 21.9827 48.5905 31.9744 44.637 39.8601C40.5234 48.0566 34.1998 53.9802 26.0808 56.9907H23.9698C16.0299 54.1379 9.75814 48.3767 5.59265 40.0735C1.70989 32.2759 -0.28804 22.21 0.0323824 10.2051L0.112488 7.12036L3.23189 7.27808C6.62253 7.49464 10.0261 7.15128 13.3016 6.26221C16.8481 5.24462 20.1594 3.55724 23.0509 1.29419L24.7426 0L26.5567 1.13184Z' fill='#3AAF3C'/><path fill-rule='evenodd' clip-rule='evenodd' d='M24.9225 3.66919C33.1121 8.77173 40.5054 11.1931 46.8573 10.6272C47.9647 32.7026 39.6855 48.7478 25.0074 54.1843C10.8381 49.0911 2.45528 33.6072 3.07728 10.2886C10.5271 10.6689 17.8403 9.08716 24.9225 3.66919Z' fill='white'/><path fill-rule='evenodd' clip-rule='evenodd' d='M24.936 7.56567C31.7544 11.8193 37.9131 13.8325 43.2001 13.3594C44.1425 31.7424 37.2252 45.7512 25.0067 50.2832C13.1935 46.0435 6.21961 32.4985 6.73794 13.0811C12.9438 13.4011 19.0365 12.0791 24.936 7.56567Z' fill='#3AAF3C'/><path fill-rule='evenodd' clip-rule='evenodd' d='M17.4959 23.0681H18.8482V22.1404C18.8437 20.4916 19.489 18.9052 20.6483 17.7151C21.2079 17.1281 21.8838 16.6603 22.6343 16.3405C23.3848 16.0207 24.1939 15.8557 25.0116 15.8557C25.8294 15.8557 26.6385 16.0207 27.389 16.3405C28.1395 16.6603 28.8154 17.1281 29.375 17.7151C30.5327 18.9063 31.1776 20.4919 31.1751 22.1404V23.0681H32.5133C32.7799 23.0681 33.0357 23.1721 33.2247 23.3573C33.4136 23.5424 33.5204 23.7937 33.5217 24.0562V36.5388C33.5204 36.8013 33.4136 37.0526 33.2247 37.2378C33.0357 37.4229 32.7799 37.5269 32.5133 37.5269H17.4959C17.2297 37.5269 16.9744 37.4228 16.7862 37.2375C16.5979 37.0522 16.4922 36.8009 16.4922 36.5388V24.0562C16.4922 23.9264 16.5181 23.798 16.5686 23.6781C16.619 23.5582 16.693 23.4493 16.7862 23.3575C16.8794 23.2658 16.99 23.193 17.1118 23.1434C17.2335 23.0937 17.3641 23.0681 17.4959 23.0681ZM22.976 30.1004C23.2292 30.3092 23.467 30.5356 23.6876 30.7776C24.3601 29.7181 25.1048 28.7045 25.9164 27.7439C28.1216 25.1184 27.1227 25.6241 30.1855 25.6241L29.7567 26.0879C28.7185 27.2513 27.7733 28.492 26.9295 29.7989C25.8643 31.3054 24.8965 32.8764 24.0315 34.5025L23.7677 35.0081L23.5226 34.4932C23.0891 33.565 22.5415 32.6926 21.8922 31.8955C21.3062 31.172 20.6062 30.5456 19.8189 30.0401C20.2195 28.7505 22.1184 29.4092 22.9666 30.1189L22.976 30.1004ZM20.7331 23.0681H29.2572V22.1404C29.2601 20.9786 28.8078 19.8604 27.9944 19.0186C27.6112 18.6134 27.1474 18.2903 26.6318 18.0694C26.1161 17.8485 25.5598 17.7345 24.9975 17.7345C24.4352 17.7345 23.8789 17.8485 23.3633 18.0694C22.8477 18.2903 22.3838 18.6134 22.0006 19.0186C21.1844 19.8608 20.7302 20.981 20.7331 22.1451V23.0728V23.0681Z' fill='white'/></g><defs><clipPath id='clip0_2157_3055'><rect width='50' height='57' fill='white'/></clipPath></defs></svg>", // Protection Shield
    "logo2": "<svg width='49' height='57' viewBox='0 0 49 57' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_2157_3060)'><path fill-rule='evenodd' clip-rule='evenodd' d='M26.0257 1.13184C29.3938 3.35073 33.0255 5.13663 36.836 6.44775C39.6634 7.43566 42.66 7.8411 45.6469 7.63989L48.7455 7.35693L48.8979 10.4834C49.4659 21.9827 47.6187 31.9744 43.7443 39.8555C39.713 48.0566 33.5158 53.9802 25.5592 56.9861H23.4905C15.714 54.1333 9.56302 48.3721 5.48084 40.0688C1.67111 32.2759 -0.282236 22.21 0.0317777 10.2051L0.114899 7.12036L3.1673 7.27808C6.49013 7.49464 9.82561 7.15128 13.0356 6.26221C16.5104 5.24264 19.7551 3.55545 22.59 1.29419L24.2478 0L26.0257 1.13184ZM24.4417 8.95264C30.6897 12.9326 36.3327 14.8159 41.1768 14.3799C42.0219 31.543 35.7047 44.6611 24.5064 48.8962C13.6868 44.9302 7.29104 32.2666 7.76668 14.1062C13.4512 14.4077 19.0342 13.1785 24.4417 8.95264ZM21.0153 28.5789C21.4464 28.9483 21.8535 29.3449 22.2344 29.7664C23.3856 27.9019 24.6615 26.1181 26.0534 24.4272C29.8585 19.8118 28.7225 20.1133 34.0007 20.1133L33.248 20.9297C31.2663 23.1626 29.4453 25.5343 27.7989 28.0269C25.9685 30.6856 24.3089 33.459 22.8301 36.3301L22.3683 37.2161L21.9481 36.3162C21.2017 34.6796 20.2572 33.1419 19.1358 31.7378C18.1241 30.4538 16.9162 29.3391 15.557 28.4351C16.245 26.1667 19.5237 27.3311 20.9922 28.5789H21.0153ZM24.4233 3.66919C32.4491 8.77173 39.6945 11.1931 45.9193 10.6272C47.0045 32.7026 38.8864 48.7432 24.5064 54.1843C10.6205 49.0864 2.40535 33.6072 3.01491 10.2886C10.3157 10.6689 17.4826 9.08716 24.4233 3.66919Z' fill='url(#paint0_linear_2157_3060)'/></g><defs><linearGradient id='paint0_linear_2157_3060' x1='24.4989' y1='0' x2='24.4989' y2='56.9861' gradientUnits='userSpaceOnUse'><stop stop-color='#484CFA'/><stop offset='1' stop-color='#093182'/></linearGradient><clipPath id='clip0_2157_3060'><rect width='49' height='57' fill='white'/></clipPath></defs></svg>", // Sparkles
    "logo3": "<svg width='58' height='57' viewBox='0 0 58 57' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_2157_3062)'><path fill-rule='evenodd' clip-rule='evenodd' d='M20.3441 26.1134H22.2972V21.916C22.2972 19.6516 23.2082 17.5933 24.6733 16.1013V16.0994C26.1389 14.6079 28.1624 13.6813 30.3884 13.6813C32.6135 13.6813 34.636 14.6079 36.1016 16.0994L36.1035 16.1013C37.5686 17.5928 38.4796 19.6521 38.4796 21.9156V26.1129L40.0358 26.1134C40.3823 26.1134 40.6659 26.4021 40.6659 26.7547V40.3021C40.6659 40.6547 40.3818 40.9434 40.0353 40.9434H20.3441C19.9976 40.9434 19.7135 40.6542 19.7135 40.3021V26.7547C19.7135 26.4021 19.9971 26.1134 20.3441 26.1134ZM7.87405 10.6656C7.0334 11.7258 6.25695 12.8517 5.48521 14.2476C2.65929 19.361 1.46228 25.1666 1.94986 30.8406C2.42659 36.3824 4.51382 41.8057 8.26299 46.3421C9.60963 47.9715 11.0544 49.4078 12.5734 50.65C17.8183 54.942 24.0319 57.0584 30.2289 56.9984C36.4282 56.9383 42.5998 54.7003 47.7616 50.2825C49.2669 48.9942 50.6782 47.5315 51.9696 45.8968C54.9886 42.0747 56.9314 37.5915 57.6672 32.861C58.3903 28.2149 57.9481 23.336 56.2186 18.616C54.5727 14.1223 52.0583 10.1209 48.7727 6.9885C45.6409 4.0026 41.8167 1.80354 37.3812 0.712166C35.9921 0.370153 34.578 0.146787 33.1374 0.0521572C31.6921 -0.0424729 30.2142 -0.0107694 28.7 0.159757C27.7508 0.266396 27.0674 1.13488 27.1717 2.10088C27.2765 3.06639 28.1298 3.76243 29.0786 3.65579C30.3922 3.50784 31.6723 3.47998 32.9212 3.56212C34.1739 3.64426 35.3898 3.83496 36.5703 4.12606C40.3964 5.06707 43.6995 6.96688 46.406 9.54831C49.3032 12.3108 51.5259 15.853 52.9863 19.8409C54.5024 23.9782 54.8909 28.2495 54.2589 32.3105C53.6169 36.4362 51.9191 40.3511 49.2777 43.6944C48.1124 45.1696 46.8606 46.4709 45.5432 47.5983C41.0162 51.4733 35.6164 53.436 30.202 53.4889C24.7866 53.5412 19.3453 51.6818 14.7371 47.9119C13.3706 46.7937 12.0839 45.5183 10.9001 44.0854C7.63521 40.135 5.81609 35.3948 5.39883 30.5384C4.97025 25.5547 6.02047 20.4567 8.50088 15.9688C9.24948 14.6141 10.0165 13.5329 10.8671 12.4905L11.1186 19.5498C11.1522 20.5192 11.9517 21.2772 12.9038 21.2426C13.8558 21.208 14.6011 20.3948 14.5671 19.4259L14.1659 8.17642C14.1324 7.20658 13.3328 6.44906 12.3808 6.48316C12.3213 6.48556 12.2628 6.49085 12.2052 6.49853V6.49709L1.49013 8.02895C0.545637 8.16201 -0.114232 9.0497 0.0165145 10.0109C0.146789 10.9726 1.01906 11.6441 1.96402 11.511L7.87405 10.6656ZM25.4408 26.1134H35.3355V21.8699C35.3355 20.4851 34.7786 19.226 33.8832 18.3138L33.8822 18.3143C32.9859 17.4021 31.7483 16.8348 30.3884 16.8348C29.0276 16.8348 27.7905 17.4017 26.8937 18.3134C25.9978 19.2256 25.4413 20.4851 25.4413 21.8699V26.1134H25.4408ZM30.4281 33.5262L31.4268 38.2164L28.6896 38.228L29.4925 33.4748C28.7449 33.2303 28.2025 32.5175 28.2025 31.675C28.2025 30.6321 29.0333 29.7867 30.0585 29.7867C31.0827 29.7867 31.9139 30.6321 31.9139 31.675C31.9135 32.5896 31.2758 33.3524 30.4281 33.5262Z' fill='url(#paint0_linear_2157_3062)'/></g><defs><linearGradient id='paint0_linear_2157_3062' x1='29.0001' y1='-0.000366211' x2='29.0001' y2='56.9996' gradientUnits='userSpaceOnUse'><stop stop-color='#D97706'/><stop offset='1' stop-color='#FFD83A'/></linearGradient><clipPath id='clip0_2157_3062'><rect width='58' height='57' fill='white'/></clipPath></defs></svg>", // Security Lock
    "logo4": "<svg width='52' height='57' viewBox='0 0 52 57' fill='none' xmlns='http://www.w3.org/2000/svg'><g clip-path='url(#clip0_2157_3068)'><path fill-rule='evenodd' clip-rule='evenodd' d='M25.9111 0C35.6069 6.13 44.3661 9.0301 51.8835 8.34451C53.1964 34.8304 43.3899 50.472 26.0116 57C9.22952 50.8899 -0.696948 35.9214 0.0392583 7.9428C8.86397 8.40342 17.5217 6.50063 25.9111 0ZM25.9214 3.27258C34.5038 8.69844 42.2574 11.2659 48.9117 10.6587C50.0734 34.1031 41.3933 47.949 26.0111 53.727C11.1558 48.3187 2.36833 35.0698 3.02036 10.303C10.8322 10.7112 18.4956 9.02686 25.9214 3.27258Z' fill='url(#paint0_linear_2157_3068)'/><path fill-rule='evenodd' clip-rule='evenodd' d='M29.8267 28.5096L37.425 36.1873V39.7984H33.83V37.0839H30.8512V34.1126H28.0005L27.1765 31.4349C25.8639 32.3078 24.2716 32.8192 22.5558 32.8192C18.0618 32.8192 14.417 29.314 14.417 24.9911C14.417 20.6683 18.0618 17.1631 22.5558 17.1631C27.0499 17.1631 30.6941 20.6685 30.6941 24.9911C30.6941 26.2566 30.3813 27.4516 29.8267 28.5096ZM21.3861 22.4832C22.188 22.4832 22.839 23.132 22.839 23.9324C22.839 24.7328 22.188 25.3816 21.3861 25.3816C20.5836 25.3816 19.9331 24.7328 19.9331 23.9324C19.9329 23.132 20.5836 22.4832 21.3861 22.4832Z' fill='url(#paint1_linear_2157_3068)'/></g><defs><linearGradient id='paint0_linear_2157_3068' x1='26.0007' y1='0' x2='26.0007' y2='57' gradientUnits='userSpaceOnUse'><stop stop-color='#FF0000'/><stop offset='1' stop-color='#990000'/></linearGradient><linearGradient id='paint1_linear_2157_3068' x1='25.921' y1='17.1631' x2='25.921' y2='39.7984' gradientUnits='userSpaceOnUse'><stop stop-color='#FF0000'/><stop offset='1' stop-color='#990000'/></linearGradient><clipPath id='clip0_2157_3068'><rect width='52' height='57' fill='white'/></clipPath></defs></svg>", // Lightning Fast
    "logo5": "<svg width='59' height='54' viewBox='0 0 59 54' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M37.5577 12.7784C37.4614 14.0123 37.3874 15.2132 37.2689 16.4107C37.1538 17.5723 36.9842 18.7293 36.8556 19.8898C36.821 20.205 36.7576 20.391 36.3696 20.3893C32.6452 20.3758 28.9201 20.3805 25.1951 20.3781C25.1376 20.3781 25.0801 20.3576 25.0061 20.3435C24.9134 19.9643 24.8564 19.571 24.7202 19.2077C24.1573 17.7079 22.6065 16.8175 21.0692 17.0857C19.5336 17.3534 18.3133 18.7052 18.315 20.2948C18.3186 24.217 18.3544 28.1399 18.426 32.0615C18.4559 33.7186 19.8946 35.0739 21.5505 35.1367C23.2633 35.2019 24.7719 33.9299 24.975 32.2335C25.0237 31.8261 25.022 31.4129 25.0466 30.9404C26.3075 31.1963 27.1087 30.3604 28.0849 29.7294C29.3991 31.1176 30.8601 31.6095 32.3951 30.2372C32.9246 30.7079 33.39 31.1212 33.9336 31.6037C33.9395 31.5767 33.9307 31.69 33.8913 31.7915C31.5181 37.9913 27.7004 43.0212 21.9867 46.5284C21.5223 46.8137 21.1831 46.826 20.7047 46.5642C16.3874 44.2028 13.2916 40.6891 11.0276 36.3841C8.9256 32.3861 7.61486 28.1129 6.92926 23.6752C6.40449 20.2772 6.16265 16.8357 5.79226 13.4141C5.75411 13.0607 5.78287 12.8265 6.24483 12.7796C11.2671 12.2713 15.9319 10.6482 20.255 8.08134C21.2018 7.519 21.8334 7.48378 22.8031 8.06901C26.9443 10.5672 31.4864 11.9484 36.2727 12.5559C36.6825 12.6076 37.0869 12.6962 37.5577 12.7784Z' fill='url(#paint0_linear_2157_3129)'/><path d='M38.6443 20.3341C38.8579 17.9703 39.0628 15.6247 39.2852 13.2808C39.4202 11.8591 38.781 11.0602 37.3676 10.9082C32.097 10.3412 27.1546 8.79389 22.6512 5.95228C21.8975 5.47682 21.1867 5.47271 20.433 5.94524C16.4632 8.43583 12.1711 10.09 7.54392 10.8566C6.93873 10.9569 6.32651 11.0115 5.71839 11.0943C4.48219 11.2628 3.86996 11.993 3.96623 13.2532C4.13528 15.4638 4.27851 17.6785 4.53091 19.8803C5.02105 24.1565 5.89448 28.3558 7.36489 32.4119C9.18748 37.4394 11.7779 41.9845 15.9742 45.4236C17.312 46.5201 18.8417 47.3865 20.3038 48.3263C21.0611 48.8129 21.8171 48.7119 22.5913 48.25C28.7371 44.5796 32.8795 39.2638 35.4546 32.6532C35.8748 31.5737 35.8713 31.5719 37.0142 31.5719C37.9029 31.5719 38.7916 31.5719 39.8124 31.5719C39.4138 32.6303 39.0692 33.6117 38.6777 34.5738C36.4953 39.9382 33.376 44.6488 28.9525 48.4431C26.8693 50.2299 24.5953 51.7308 22.1622 52.9975C21.7326 53.2212 21.3504 53.193 20.9178 53.0134C14.1557 50.2017 9.3489 45.3297 6.03595 38.8899C3.71676 34.3818 2.3256 29.5721 1.41342 24.605C0.454874 19.3908 0.0698105 14.1261 0.000546043 8.83204C-0.0141286 7.70033 0.262342 7.42738 1.39288 7.43442C8.53592 7.47845 14.9077 5.18098 20.6877 1.0844C21.4825 0.520891 21.6938 0.524413 22.4757 1.10729C26.8288 4.35216 31.7554 6.17945 37.0934 6.93431C38.7165 7.16382 40.3647 7.22487 42.003 7.33699C43.0067 7.40566 43.3425 7.70561 43.2879 8.69058C43.1394 11.359 42.9739 14.0269 42.7884 16.693C42.7719 16.9301 42.6011 17.189 42.4338 17.378C41.7805 18.1176 40.9852 18.7603 40.4633 19.5798C39.9808 20.3364 39.4408 20.5119 38.6443 20.3341Z' fill='url(#paint1_linear_2157_3129)'/><path d='M20.1138 29.3619C20.1027 29.2616 20.0833 29.1671 20.0833 29.0726C20.0815 26.798 20.0821 24.5228 20.0821 22.1514C20.3674 22.1514 20.6151 22.1514 20.8628 22.1514C27.0814 22.1514 33.2999 22.1379 39.5179 22.1661C40.4694 22.1702 41.0886 21.8779 41.5993 21.0379C43.5687 17.7977 47.2878 16.1207 51.0064 16.7106C54.7261 17.3005 57.8113 20.1527 58.7006 23.8237C60.0524 29.403 56.2804 34.8872 50.6025 35.4907C46.5869 35.9174 43.5152 34.2873 41.395 30.8852C40.9255 30.1315 40.3837 29.747 39.4809 29.7734C37.997 29.8163 36.5101 29.7646 35.0256 29.7957C34.4862 29.8069 34.1751 29.6255 34.0002 29.1172C33.3222 27.1484 33.0322 27.6767 31.8542 28.4633C30.2505 29.5339 30.6696 29.5733 29.1329 28.3312C28.9943 28.2191 28.847 28.1164 28.7208 27.9919C28.3252 27.6016 27.9395 27.6227 27.5093 27.9543C27.0397 28.3165 26.5331 28.6306 26.0559 28.9833C25.625 29.3009 25.2617 29.2592 24.9183 28.8518C24.6506 28.5343 24.3642 28.232 24.086 27.9232C23.7619 27.564 23.4144 27.5493 23.0435 27.851C22.5674 28.2384 22.0703 28.6024 21.6171 29.0144C21.1763 29.4136 20.6961 29.4999 20.1138 29.3619ZM51.4713 28.856C52.9904 28.8472 54.2084 27.6057 54.199 26.0748C54.1896 24.5428 52.9628 23.3295 51.4308 23.3365C49.8981 23.3436 48.7001 24.5674 48.7118 26.1147C48.7224 27.6538 49.9422 28.8648 51.4713 28.856Z' fill='url(#paint2_linear_2157_3129)'/><defs><linearGradient id='paint0_linear_2157_3129' x1='21.669' y1='7.64465' x2='21.669' y2='46.7519' gradientUnits='userSpaceOnUse'><stop stop-color='#300A90'/><stop offset='1' stop-color='#0E032A'/></linearGradient><linearGradient id='paint1_linear_2157_3129' x1='21.6468' y1='0.665894' x2='21.6468' y2='53.1567' gradientUnits='userSpaceOnUse'><stop stop-color='#300A90'/><stop offset='1' stop-color='#0E032A'/></linearGradient><linearGradient id='paint2_linear_2157_3129' x1='39.529' y1='16.5939' x2='39.529' y2='35.5574' gradientUnits='userSpaceOnUse'><stop stop-color='#300A90'/><stop offset='1' stop-color='#0E032A'/></linearGradient></defs></svg>", // Target Precision
    "logo6": "<svg width='51' height='51' viewBox='0 0 51 51' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M49.0842 10.6688C48.1402 11.2103 47.2878 11.6967 46.4381 12.1869C40.8843 15.3894 35.3328 18.5947 29.7758 21.7912C29.5337 21.9301 29.4378 22.0834 29.4378 22.3635C29.4444 30.9638 29.4433 39.5635 29.4444 48.1637C29.4444 48.2563 29.4571 48.3484 29.4692 48.5116C29.6274 48.4322 29.7537 48.3771 29.8723 48.3087C31.8838 47.1502 33.8947 45.9906 35.9057 44.831C36.4803 44.4996 36.896 44.5261 37.1116 44.9093C37.3311 45.2992 37.1541 45.6449 36.5674 45.9834C34.1594 47.373 31.7487 48.7592 29.3473 50.1598C29.017 50.3522 28.7198 50.3947 28.3531 50.2789C19.1298 47.3609 9.90375 44.4511 0.678227 41.5397C0.140609 41.3699 0.00661876 41.1918 0.00661876 40.6348C0.00551596 31.4005 0.007721 22.1656 1.35576e-06 12.9312C-0.000550047 12.4989 0.167076 12.2398 0.537619 12.0269C6.77289 8.44062 13.0026 4.84382 19.2335 1.24977C19.8648 0.885846 20.5006 0.52964 21.1265 0.15634C21.4143 -0.0156978 21.6905 -0.0421657 22.0131 0.0592924C31.237 2.97511 40.4631 5.88542 49.6886 8.79683C50.3144 8.99423 50.4049 9.11884 50.4049 9.78163C50.4054 16.8964 50.4054 24.0117 50.4049 31.1264C50.4049 31.2478 50.4181 31.3729 50.3933 31.4898C50.3205 31.8311 50.111 32.0407 49.7525 32.0567C49.42 32.0715 49.1377 31.8146 49.0947 31.4672C49.0782 31.3338 49.0854 31.1976 49.0854 31.0625C49.0848 24.4743 49.0848 17.8856 49.0848 11.2974C49.0842 11.1248 49.0842 10.9528 49.0842 10.6688ZM1.32668 13.6376C1.32668 13.8758 1.32668 14.0357 1.32668 14.1956C1.32668 22.7688 1.32833 31.342 1.31896 39.9147C1.31841 40.2395 1.40829 40.3845 1.72534 40.4837C10.3879 43.206 19.0471 45.9388 27.7075 48.6688C27.8271 48.7063 27.9517 48.7294 28.0973 48.7653C28.105 48.6015 28.1144 48.4951 28.1144 48.3881C28.1149 39.7476 28.1127 31.1071 28.1221 22.4661C28.1227 22.165 28.0212 22.0492 27.7466 21.9638C24.72 21.0181 21.6977 20.0598 18.6738 19.1064C18.0871 18.9217 17.4982 18.7436 16.8625 18.5478C16.8625 18.7849 16.8625 18.9586 16.8625 19.1323C16.8625 21.2249 16.8641 23.3175 16.8625 25.41C16.8619 26.23 16.3932 26.5084 15.6775 26.1142C14.6965 25.5733 13.698 25.0599 12.7451 24.4738C12.1243 24.0922 11.5133 23.918 10.7992 24.0988C10.5268 24.1677 10.2385 24.1749 9.95613 24.2019C9.22222 24.2725 8.9796 24.047 8.97905 23.296C8.97795 21.0821 8.96085 18.8677 8.99173 16.6538C8.99835 16.168 8.83624 15.9822 8.39236 15.8515C6.89144 15.4087 5.4032 14.9246 3.91055 14.4548C3.07628 14.1923 2.24366 13.9276 1.32668 13.6376ZM48.0476 9.70057C47.8386 9.62283 47.7201 9.57265 47.5977 9.53405C44.3058 8.49355 41.0117 7.46022 37.7237 6.40704C37.3702 6.29401 37.1017 6.32489 36.7819 6.51016C30.9089 9.90901 25.0293 13.2963 19.1513 16.6863C18.7466 16.9201 18.3441 17.1583 17.8897 17.4241C18.0513 17.488 18.1456 17.5327 18.2437 17.5636C21.6001 18.6234 24.9582 19.6777 28.3112 20.7468C28.5969 20.8378 28.8125 20.808 29.0678 20.6608C34.8718 17.305 40.6803 13.9574 46.4877 10.6082C46.984 10.322 47.478 10.032 48.0476 9.70057ZM28.9068 3.66878C28.7876 3.61253 28.7303 3.57724 28.6674 3.55739C26.4299 2.85049 24.1934 2.14084 21.9508 1.44993C21.7986 1.40306 21.5759 1.44883 21.4319 1.53154C15.2215 5.10187 9.01654 8.68103 2.81105 12.2602C2.68092 12.3352 2.55796 12.4218 2.37655 12.5381C2.57285 12.6114 2.68203 12.6583 2.79562 12.6941C4.86613 13.3476 6.94161 13.9866 9.00496 14.6627C9.41852 14.7977 9.72951 14.7509 10.0962 14.538C15.6527 11.32 21.2174 8.11474 26.7794 4.90613C27.4759 4.50415 28.1695 4.09777 28.9068 3.66878ZM11.3264 15.3558C11.5188 15.4313 11.6148 15.476 11.7146 15.5074C13.039 15.9248 14.3685 16.3279 15.6869 16.7646C16.0012 16.8688 16.2388 16.8379 16.5173 16.6769C22.7294 13.0856 28.9459 9.50152 35.1608 5.91464C35.2457 5.86557 35.3207 5.79885 35.4403 5.71117C35.2595 5.64776 35.1365 5.60034 35.0108 5.56064C33.6996 5.14599 32.385 4.74015 31.0776 4.31226C30.7975 4.22073 30.5825 4.24058 30.3233 4.39001C25.058 7.43651 19.7866 10.4725 14.5168 13.5113C13.4785 14.1101 12.4413 14.7106 11.3264 15.3558ZM10.3261 16.4812C10.3261 18.625 10.3261 20.6956 10.3261 22.8174C10.7408 22.7677 11.1268 22.7346 11.5078 22.6718C11.9136 22.6045 12.2676 22.6839 12.6249 22.894C13.4035 23.3517 14.2003 23.7773 14.991 24.2141C15.1492 24.3012 15.313 24.3789 15.5021 24.4754C15.5214 24.3613 15.538 24.3106 15.538 24.2604C15.5396 22.3051 15.5452 20.3498 15.5281 18.3945C15.527 18.2738 15.3748 18.0874 15.2535 18.0455C14.4131 17.756 13.5623 17.4947 12.7143 17.2272C11.9335 16.9813 11.151 16.7387 10.3261 16.4812Z' fill='url(#paint0_linear_2288_3510)'/><path d='M48.4674 35.0022C48.4674 35.8122 48.4227 36.6255 48.4779 37.4317C48.5645 38.7021 48.093 39.7575 47.3293 40.7103C45.8168 42.5978 43.9183 44.0447 41.914 45.3581C41.3675 45.716 40.7439 45.7209 40.187 45.3575C38.2935 44.1218 36.5009 42.7571 35.0308 41.0208C34.6504 40.5714 34.2914 40.0751 34.0537 39.5413C33.8238 39.0252 33.66 38.4363 33.6468 37.875C33.5999 35.8916 33.6286 33.9066 33.6308 31.9215C33.6314 31.2901 33.8326 31.0795 34.4761 31.0552C36.6608 30.9736 38.6591 30.2954 40.5096 29.159C40.8906 28.9252 41.2082 28.9186 41.5931 29.1557C43.453 30.3042 45.4645 30.9836 47.6646 31.0541C48.2391 31.0723 48.4652 31.3089 48.4669 31.8829C48.4691 32.9229 48.4669 33.9628 48.4674 35.0022ZM47.1479 32.42C47.0674 32.3885 47.0316 32.3681 46.993 32.3604C46.9136 32.3444 46.8336 32.3312 46.7531 32.3235C44.8425 32.1426 43.0692 31.5289 41.405 30.5932C41.1282 30.4377 40.9374 30.4592 40.6728 30.607C39.0175 31.53 37.2574 32.1459 35.3606 32.318C35.0319 32.3477 34.9387 32.4657 34.942 32.7889C34.9575 34.3808 34.9669 35.9732 34.9415 37.5646C34.9294 38.3023 35.14 38.9447 35.5635 39.5298C36.9646 41.4668 38.8603 42.8492 40.8062 44.1704C40.9231 44.2498 41.1927 44.2365 41.3163 44.1538C43.1282 42.9463 44.8574 41.6367 46.2469 39.935C46.8529 39.1929 47.1997 38.3768 47.1622 37.3754C47.1065 35.8933 47.1479 34.4078 47.1479 32.924C47.1479 32.7514 47.1479 32.5788 47.1479 32.42Z' fill='url(#paint1_linear_2288_3510)'/><path d='M38.2666 37.557C38.6223 37.2102 38.9173 36.9223 39.2586 36.5893C39.6148 36.9847 39.9831 37.3927 40.3741 37.8261C41.2216 36.9427 42.0101 36.1206 42.8295 35.2665C43.1829 35.6795 43.4514 35.9932 43.72 36.3064C43.742 36.2849 43.7646 36.2634 43.7867 36.2414C43.7845 36.2673 43.7933 36.3031 43.7795 36.3175C42.8223 37.2841 41.8684 38.2545 40.9007 39.2112C40.6398 39.4693 40.2445 39.4781 39.9798 39.23C39.4003 38.6885 38.8428 38.1227 38.2666 37.557Z' fill='url(#paint2_linear_2288_3510)'/><defs><linearGradient id='paint0_linear_2288_3510' x1='25.2042' y1='0' x2='25.2042' y2='50.3428' gradientUnits='userSpaceOnUse'><stop stop-color='#1FA2F3'/><stop offset='1' stop-color='#7E1590'/></linearGradient><linearGradient id='paint1_linear_2288_3510' x1='41.0541' y1='28.9807' x2='41.0541' y2='45.6283' gradientUnits='userSpaceOnUse'><stop stop-color='#1FA2F3'/><stop offset='1' stop-color='#7E1590'/></linearGradient><linearGradient id='paint2_linear_2288_3510' x1='41.027' y1='35.2665' x2='41.027' y2='39.4106' gradientUnits='userSpaceOnUse'><stop stop-color='#1FA2F3'/><stop offset='1' stop-color='#7E1590'/></linearGradient></defs></svg>", // Premium Diamond
  };

  // Dynamic logo settings that can be updated via controller
  let customLogos = {
    logo1: { url: null, name: "Protection Shield", category: "security" },
    logo2: { url: null, name: "Sparkles", category: "premium" },
    logo3: { url: null, name: "Security Lock", category: "security" },
    logo4: { url: null, name: "Lightning Fast", category: "speed" },
    logo5: { url: null, name: "Target Precision", category: "accuracy" },
    logo6: { url: null, name: "Premium Diamond", category: "premium" }
  };

  function ensureInstance(o) {
    // Allows calling with or without `new`
    if (!(o instanceof Object)) return {};
    return o;
  }

  // Utility function for color manipulation
  function getLighterColor(color, amount = 0.2) {
    if (!color || typeof color !== "string") return color;

    // Remove # if present
    let hex = color.replace("#", "");

    // If 3-digit hex, convert to 6-digit
    if (hex.length === 3) {
      hex = hex.split("").map(char => char + char).join("");
    }

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Lighten each component
    const lighten = (value) => Math.max(0, Math.min(255, Math.floor(value + (255 - value) * amount)));

    // Convert back to hex
    const toHex = (n) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
  }

  function getDarkerColor(color, amount = 0.2) {
    if (!color || typeof color !== "string") return color;

    // Remove # if present
    let hex = color.replace("#", "");

    // If 3-digit hex, convert to 6-digit
    if (hex.length === 3) {
      hex = hex.split("").map(char => char + char).join("");
    }

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Darken each component
    const darken = (value) => Math.max(0, Math.min(255, Math.floor(value * (1 - amount))));

    // Convert back to hex
    const toHex = (n) => {
      const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
  }

  function Template1(containerId, options = {}) {
    // Allow use with `new` or plain function call:
    const self = ensureInstance(this);

    // ---------- State ----------
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return self || {};
    }

    // Define default settings from controller as permanent defaults
    const DEFAULT_SETTINGS = {
      // Template selection
      activeTemplate: "template1",
      isEnabled: true,

      // Content defaults for each template
      template1: {
        title: "Shipping Protection",
        description: "100% guarantee & protect your order from damage, loss, or theft",
        isEnabled: true,
      },
      template2: {
        title: "Advanced Protection",
        description: "Comprehensive coverage for your order",
        inlinePoint1: "Secure Coverage",
        inlinePoint2: "Instant Claims",
        inlinePoint3: "Trusted by 50k+",
        protectionAddedText: "Protection Added",
        protectionMessageTitle: "Your order is now protected",
        protectionMessageSubtext: "If your package is lost, stolen, or damaged, we'll replace it or provide a full refund — no questions asked.",
        isEnabled: true,
      },
      template3: {
        title: "Premium Protection",
        description: "Elite protection service for your orders",
        confirmationMessage: "Your order is now protected!",
        badgeText: "Protected",
        isEnabled: true,
      },

      // Selection modes
      selectionMode: "toggle", // "toggle" | "checkbox" | "button"

      // Icon settings
      iconAsset: {
        type: "logo",
        name: "logo1",
        url: null
      },

      // Icon style
      iconStyle: {
        size: 24,
        color: "#111111",
        background: "#F5F5F5",
        borderColor: "#E5E7EB",
        borderRadius: 9999,
        autoTheme: true
      },

      // Button block settings
      buttonBlock: {
        buttonLabel: "Protected checkout + $12.11",
        buttonHref: "https://example.com/cta",
        paragraph: "One-line supporting text below the button."
      },

      // Protected checkout + $12.11 control settings
      enableProtectionControl: {
        enabled: true,
        backgroundColor: "#49ae78",
        textColor: "#000000",
        disabledBackgroundColor: "#d1d5db",
        disabledTextColor: "#6b7280",
        enabledText: "Protection Enabled",
        disabledText: "Protected checkout + $12.11",
        showText: false,
        borderRadius: 24,
        borderWidth: 0,
        borderColor: "transparent",
        fontSize: 12,
        padding: "6px 12px",
        transition: "all 0.3s ease",
        hoverEffect: true,
        activeEffect: true
      },

      // Logo settings
      logoSettings: {
        showLogo: true,
        logoUrl: "",
        alt: "Brand Logo",
        maxWidth: 160,
        maxHeight: 48
      },

      // Color settings (using Green-Yellow theme as default)
      colors: {
        useGradient: true,
        backgroundColor: "#72D9A3",
        gradientStart: "#72D9A3",
        gradientEnd: "#F3EEA5",
        iconBackground: "#A8ECD9", // Lighter version of #72D9A3
        textColor: "#336B4A", // Darker version of #72D9A3
        toggleEnabled: "#5CC992", // Darker version of #72D9A3
        toggleDisabled: "#e5e7eb",
        buttonBg: "#5CC992", // Darker version of #72D9A3
        buttonText: "#ffffff",
        badgeBg: "#5CC992", // Darker version of #72D9A3
        badgeText: "#ffffff",
        // SVG color control - single variable to control all SVG colors
        svgColor: "#ffffff", // Lighter than text for better contrast
      }
    };

    // Merge options with default settings
    const mergedOptions = {
      activeTemplate: options.activeTemplate || DEFAULT_SETTINGS.activeTemplate,
      isEnabled: options.isEnabled !== undefined ? options.isEnabled : DEFAULT_SETTINGS.isEnabled,
      selectionMode: options.selectionMode || DEFAULT_SETTINGS.selectionMode,
      iconAsset: { ...DEFAULT_SETTINGS.iconAsset, ...options.iconAsset },
      iconStyle: { ...DEFAULT_SETTINGS.iconStyle, ...options.iconStyle },
      buttonBlock: { ...DEFAULT_SETTINGS.buttonBlock, ...options.buttonBlock },
      enableProtectionControl: { ...DEFAULT_SETTINGS.enableProtectionControl, ...options.enableProtectionControl },
      logoSettings: { ...DEFAULT_SETTINGS.logoSettings, ...options.logoSettings },
      colors: { ...DEFAULT_SETTINGS.colors, ...options.colors }
    };

    // Set content based on active template
    const activeTemplate = mergedOptions.activeTemplate;
    const templateContent = DEFAULT_SETTINGS[activeTemplate] || DEFAULT_SETTINGS.template1;
    const contentOptions = {};
    Object.keys(templateContent).forEach(key => {
      contentOptions[key] = options[key] !== undefined ? options[key] : templateContent[key];
    });

    // defaults
    let state = {
      containerId,
      container,
      activeTemplate: mergedOptions.activeTemplate,
      isEnabled: mergedOptions.isEnabled,
      protectionPrice: +options.protectionPrice || 0,
      onToggle: options.onToggle || (() => { }),

      // content (merged with template defaults)
      title: contentOptions.title,
      description: contentOptions.description,
      confirmationMessage: contentOptions.confirmationMessage || "Your order is now protected!",
      badgeText: contentOptions.badgeText || "Protected",
      // CTA Button removed per requirements

      // template 2/3 specific content
      inlinePoints: options.inlinePoints || [
        { text: contentOptions.inlinePoint1 || "Secure Coverage Customers", icon: "shield" },
        { text: contentOptions.inlinePoint2 || "Instant Claims", icon: "lightning" },
        { text: contentOptions.inlinePoint3 || "Trusted by 50k+", icon: "star" }
      ],
      protectionAddedText: contentOptions.protectionAddedText || "Protection Added",
      protectionMessage: {
        title: contentOptions.protectionMessageTitle || "Your order is now protected",
        subtext: contentOptions.protectionMessageSubtext || "If your package is lost, stolen, or damaged, we'll replace it or provide a full refund — no questions asked."
      },

      // legacy content
      bulletPoints: options.bulletPoints || [
        "🛡️ Protection against damage during shipping",
        "📦 Coverage for lost or stolen packages",
        "💰 Fast reimbursement process"
      ],
      additionalParagraphs: options.additionalParagraphs || [
        "Our shipping protection ensures your order arrives safely. If anything goes wrong, we'll make it right.",
        "Join thousands of satisfied customers who shop with confidence knowing their orders are protected."
      ],

      // colors
      colors: mergedOptions.colors,

      // selection
      selectionMode: mergedOptions.selectionMode,

      // Enable Protection toggle control settings - Enhanced
      enableProtectionControl: mergedOptions.enableProtectionControl,

      // logo
      logoSettings: mergedOptions.logoSettings,

      // icon
      iconAsset: mergedOptions.iconAsset,
      iconStyle: mergedOptions.iconStyle,

      // button block (button selection mode)
      buttonBlock: mergedOptions.buttonBlock
    };

    // Attach instance to container for proxy getInstance support
    container._template1Instance = api;

    // ---------- Helpers ----------
    function iconHTML() {
      if (state.iconAsset.type === "custom" && state.iconAsset.url) {
        return `
          <div class="T1_icon-custom">
            <img src="${state.iconAsset.url}" style="width:100%;height:100%;object-fit:contain" alt="Custom icon"/>
          </div>`;
      }

      // Use enhanced custom logo system
      const logoKey = state.iconAsset.name || "logo1";
      const logo = customLogos[logoKey];

      if (logo && logo.url) {
        // Use uploaded custom logo with enhanced styling
        return `
          <div class="T1_icon-custom T1_icon-uploaded" data-logo-category="${logo.category || 'default'}">
            <img src="${logo.url}" style="width:100%;height:100%;object-fit:contain" alt="${logo.name}"/>
            <div class="T1_icon-overlay" style="opacity:0"></div>
          </div>`;
      } else {
        // Use actual SVG with enhanced styling
        const svgContent = CUSTOM_LOGO_MAP[logoKey] || CUSTOM_LOGO_MAP["logo1"];
        return `
          <div class="T1_icon-custom" data-logo-category="${logo.category || 'default'}">
            ${svgContent}
          </div>`;
      }
    }

    function svg(name) {
      return SVG[name] || SVG.shield;
    }

    function logoHTML() {
      const { showLogo, logoUrl, alt, maxWidth, maxHeight } = state.logoSettings;
      if (!showLogo || !logoUrl) return "";
      return `
        <div class="T1_logo-container" style="max-width:${maxWidth}px;max-height:${maxHeight}px;overflow:hidden;margin-right:8px">
          <img src="${logoUrl}" alt="${alt}" style="max-width:100%;max-height:100%;object-fit:contain"/>
        </div>`;
    }

    function checkboxHTML() {
      // Make text color slightly darker for better readability
      const darkerTextColor = getDarkerColor(state.colors.textColor, 0.2);
      return `
        <input type="checkbox" class="T1_checkbox" id="T1_protection_checkbox" ${state.isEnabled ? "checked" : ""}/>
        <label for="T1_protection_checkbox" style="cursor:pointer;margin-left:4px;font-size:12px;color:${darkerTextColor};"></label>
      `;
    }

    function toggleHTML() {
      return `
                <div class="T1_toggle">
                <input type="checkbox" class="T1_toggle-checkbox" ${state.isEnabled ? "checked" : ""}>
                <div class="toggle-track">
                    <div class="toggle-handle"></div>
                </div>
                </div>
            `;
    }


    function inlinePointsHTML() {
      // Apply SVG color from theme settings
      const svgColor = state.colors.svgColor || getLighterColor(state.colors.textColor, 0.3);
      // Make text color slightly darker for better readability
      const darkerTextColor = getDarkerColor(state.colors.textColor, 0.2);
      return `
        <div class="T1_inline-points">
          ${state.inlinePoints
          .map(
            (p) => `
            <div class="T1_inline-point" style="color: ${darkerTextColor}">
              ${svg(p.icon)}
              <span>${p.text}</span>
            </div>`
          )
          .join("")}
        </div>`;
    }

    function injectStyles() {
      const id = "T1_template-styles";
      d(`#${id}`)?.remove();
      const s = document.createElement("style");
      s.id = id;
      const c = state.colors;
      const is = state.iconStyle;
      const ls = state.logoSettings;
      const toggleEnabledColor = state.colors.toggleEnabled;
     
      // Calculate text color based on background luminance
  const backgroundColor = c.useGradient ? c.gradientStart : c.backgroundColor;
  const textColor = getContrastTextColor(backgroundColor);

  // Use the calculated text color
  const darkerTextColor = getDarkerColor(textColor, 0.2);
  const svgDarkerColor = getDarkerColor(textColor, 0.1);

      s.textContent = `
    .T1_shipping-protection {
      background: ${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};
      border-radius: 8px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      transition: 0.3s;
      color: ${textColor}; /* Apply dynamic text color */
    }
    .T1_shipping-protection svg, .T1_template2-container svg, .T1_template3-container svg {
      color: ${svgDarkerColor};
    }
    .T1_icon-container {
      width: 55px;
      height: 55px;
      background: ${c.iconBackground};
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .T1_inner-icon {
      width: 24px;
      height: 24px;
      background: #fff;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .T1_content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
      .T1_content, .T1_inline-point, .T1_protection-message, .T1_bullet-points, .T1_additional-paragraphs {
      color: ${darkerTextColor};
    }
    .T1_title {
      font-weight: 500;
      font-size: 14px;
      color: ${darkerTextColor};
      margin: 0;
    }
    .T1_description {
      font-weight: 400;
      font-size: 12px;
      color: ${darkerTextColor};
      margin: 0;
      line-height: 1.4;
    }
    .T1_toggle {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      width: 44px;
      height: 24px;
      accent-color: ${toggleEnabledColor};
    }
    .T1_toggle input[type="checkbox"] {
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      margin: 0;
      cursor: pointer;
      z-index: 2;
    }
    .T1_toggle .toggle-track {
      width: 100%;
      height: 100%;
      border-radius: 9999px;
      background-color: ${c.toggleDisabled};
      position: absolute;
      transition: background-color 0.3s;
    }
    .T1_toggle input[type="checkbox"]:checked + .toggle-track {
      background-color: ${toggleEnabledColor};
    }
    .T1_toggle .toggle-handle {
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: white;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.3s;
      z-index: 1;
    }
    .T1_toggle input[type="checkbox"]:checked + .toggle-track .toggle-handle {
      transform: translateX(20px);
    }
    .T1_template2-container, .T1_template3-container {
      background: ${c.useGradient ? `linear-gradient(135deg, ${c.gradientStart}, ${c.gradientEnd})` : c.backgroundColor};
      border-radius: 8px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .T1_main-widget {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .T1_controls-section {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .T1_inline-points {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .T1_inline-point {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: ${darkerTextColor};
      font-weight: 500;
    }
    .T1_inline-point-icon {
      width: 16px;
      height: 16px;
      fill: ${darkerTextColor};
    }
    .T1_protection-added {
      background: ${c.iconBackground};
      border-radius: 6px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: ${darkerTextColor};
    }
    .T1_protection-message {
      background: ${c.iconBackground};
      border-radius: 6px;
      padding: 12px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .T1_protection-message-title {
      font-size: 14px;
      font-weight: 600;
      color: ${darkerTextColor};
      margin: 0 0 4px;
    }
    .T1_protection-message-subtext {
      font-size: 12px;
      color: ${darkerTextColor};
      line-height: 1.4;
      margin: 0;
      opacity: 0.8;
    }
    .T1_bullet-points {
      list-style: none;
      padding: 0;
      margin: 8px 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .T1_additional-paragraphs p {
      font-size: 12px;
      color: ${darkerTextColor};
      line-height: 1.4;
      margin: 0;
    }
    .T1_confirmation-message {
      font-size: 12px;
      color: ${toggleEnabledColor};
      font-weight: 500;
      margin-top: 4px;
      display: none;
      transition: opacity 0.3s;
    }
    .T1_confirmation-message.T1_visible {
     display: block;
    }
    .T1_badge {
      position: absolute;
      top: -12px;
    right: -12px;
      background: ${c.badgeBg};
      color: ${c.badgeText};
      font-size: 10px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: none;
      transform: scale(0.8);
      transition: 0.3s;
      z-index: 10;
    }
    .T1_badge.T1_visible {
      display: block;
      transform: scale(1);
    }
    .T1_checkbox {
      width: 18px;
      height: 18px;
      accent-color: ${toggleEnabledColor};
      cursor: pointer;
    }
    .T1_button-mode {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      padding: 12px;
      border-radius: 8px;
      
    }
 .T1_protection-button {
      background: ${c.buttonBg};
      color: ${getContrastTextColor(c.buttonBg)};
      border: 0;
      border-radius: 6px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    .T1_protection-button:hover {
      opacity: 0.9;
    }
    .T1_button-description {
      font-size: 12px;
      color: ${c.textColor};
      margin: 0;
      text-align: center;
      line-height: 1.4;
    }
    .T1_logo-container {
      max-width: ${ls.maxWidth}px;
      max-height: ${ls.maxHeight}px;
      overflow: hidden;
      margin-right: 8px;
    }
    .T1_logo-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .T1_icon-custom {
      width: ${is.size}px;
      height: ${is.size}px;
      color: ${is.color};
      display: flex;
      align-items: center;
    }
    .T1_icon-uploaded {
      background: linear-gradient(135deg, ${is.background}, ${getLighterColor(is.background)});
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .T1_icon-custom:hover {
      transform: scale(1.1);
    }
    .T1_icon-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2));
      transition: opacity 0.3s ease;
    }
    .T1_icon-uploaded:hover .T1_icon-overlay {
      opacity: 1;
    }
    .T1_icon-custom[data-logo-category="security"] {
      border-color: #10b981;
    }
    .T1_icon-custom[data-logo-category="premium"] {
      border-color: #8b5cf6;
    }
    .T1_icon-custom[data-logo-category="speed"] {
      border-color: #f59e0b;
    }
    .T1_icon-custom[data-logo-category="accuracy"] {
      border-color: #ef4444;
    }
    .T1_icon-custom[data-logo-category="shipping"] {
      border-color: #3b82f6;
    }
  `;
      document.head.appendChild(s);
    }



    function render() {
      if (state.selectionMode === "button") return renderButtonMode();
      return renderTemplate();
    }

    function renderButtonMode() {
      state.container.innerHTML = `
        <div class="T1_button-mode">
          ${logoHTML()}
          <a href="${state.buttonBlock.buttonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>
          <p class="T1_button-description">${state.buttonBlock.paragraph}</p>
        </div>`;
    }

    function renderTemplate() {
      const t = state.activeTemplate;
      if (t === "template1") return renderT1();
      if (t === "template2") return renderT2();
      return renderT3();
    }

    function renderT1() {
      state.container.innerHTML = `
        <div class="T1_shipping-protection">
          ${logoHTML()}
          <div class="T1_icon-container">${iconHTML()}</div>
          <div class="T1_content">
            <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
            <p class="T1_description">${state.description}</p>
            <!-- Confirmation message removed from Template 1 -->
          </div>
          ${state.selectionMode === "checkbox" ? checkboxHTML() : toggleHTML()}
        </div>`;
    }

    function renderT2() {
      const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
      const showDetail = isSwitch && state.isEnabled;
      const showCheckoutMsg = state.selectionMode === "button" || !state.isEnabled;

      state.container.innerHTML = `
        <div class="T1_template2-container">
          <div class="T1_main-widget">
            ${logoHTML()}
            <div class="T1_icon-container">${iconHTML()}</div>
            <div class="T1_content">
              <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
              <p class="T1_description">${state.description}</p>
              
            </div>
              <div class="T1_controls-section">
            ${state.selectionMode === "toggle" ? toggleHTML() : ""}
            ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
            ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
          </div>
          </div>

          ${inlinePointsHTML()}

        

          ${showDetail ? `
            <div class="T1_protection-added">
              ${svg("check")}
              <span>${state.protectionAddedText} (+$${state.protectionPrice.toFixed(2)})</span>
            </div>

            <div class="T1_protection-message">
              ${svg("shield")}
              <div class="T1_protection-message-content">
                <p class="T1_protection-message-title">${state.protectionMessage.title}</p>
                <p class="T1_protection-message-subtext">${state.protectionMessage.subtext}</p>
              </div>
            </div>
          ` : ""}

          ${showCheckoutMsg ? `<div class="T1_checkout-button-message">${state.checkoutButtonMessage}</div>` : ""}
        </div>`;
    }

    function renderT3() {
      const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
      const showBadge = isSwitch && state.isEnabled;

      state.container.innerHTML = `
        <div class="T1_template3-container">
          <div class="T1_main-widget" style="position:relative;">
            ${logoHTML()}
            <div class="T1_icon-container">${iconHTML()}</div>
            <div class="T1_content">
              <p class="T1_title">${state.title} ($${state.protectionPrice.toFixed(2)})</p>
              <p class="T1_description">${state.description}</p>
           
            </div>
            
            <div class="T1_badge ${showBadge ? "T1_visible" : ""}">${state.badgeText}</div>
            
                      <div class="T1_controls-section">
            ${state.selectionMode === "toggle" ? toggleHTML() : ""}
            ${state.selectionMode === "checkbox" ? checkboxHTML() : ""}
            ${state.selectionMode === "button" ? `<a href="${state.ctaButtonHref}" class="T1_protection-button">${state.buttonBlock.buttonLabel}</a>` : ""}
          </div>
          </div>
   <div class="T1_confirmation-message ${state.isEnabled ? "T1_visible" : ""}">${state.confirmationMessage}</div>
        </div>`;
    }

    function bindEvents() {
      if (state.selectionMode === "button") {
        const btn = d(".T1_protection-button", state.container);
        if (btn) {
          btn.addEventListener("click", (e) => {
            const href = btn.getAttribute("href") || "";
            if (href === "#" || href.includes("example.com")) {
              e.preventDefault();
              toggleEnabled();
            }
          });
        }
        return;
      }

      // Templates 2/3 bind only active control
      if (state.activeTemplate === "template2" || state.activeTemplate === "template3") {
        if (state.selectionMode === "toggle") bindToggle();
        else if (state.selectionMode === "checkbox") bindCheckbox();
        bindButtons(); // template 2 may render button as well
      } else {
        bindToggle();
        bindCheckbox();
        bindButtons();
      }
    }

    function bindToggle() {
      const toggle = d(".T1_toggle", state.container);
      if (!toggle) return;

      const checkbox = d(".T1_toggle-checkbox", toggle);
      checkbox.addEventListener("change", () => {
        state.isEnabled = checkbox.checked;
        updateUI();
        state.onToggle(state.isEnabled);
      });
    }


    function bindCheckbox() {
      const cb = d(".T1_checkbox", state.container);
      if (!cb) return;
      cb.addEventListener("change", (e) => {
        state.isEnabled = !!e.target.checked;
        updateUI();
        state.onToggle(state.isEnabled);
      });
    }

    function bindButtons() {
      da(".T1_protection-button", state.container).forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const href = btn.getAttribute("href") || "";
          if (href === "#" || href.includes("example.com")) {
            e.preventDefault();
            toggleEnabled();
          }
        });
      });
    }

    function toggleEnabled() {
      state.isEnabled = !state.isEnabled;
      updateUI();
      state.onToggle(state.isEnabled);
    }

    function updateUI() {
      const t = d(".T1_toggle", state.container);
      if (t) {
        t.classList.toggle("T1_enabled", state.isEnabled);
        t.classList.toggle("T1_disabled", !state.isEnabled);
        t.setAttribute("aria-checked", state.isEnabled);
      }

      const cb = d(".T1_checkbox", state.container);
      if (cb) cb.checked = state.isEnabled;

      const msg = d(".T1_confirmation-message", state.container);
      if (msg) msg.classList.toggle("T1_visible", state.isEnabled);

      const badge = d(".T1_badge", state.container);
      if (badge) {
        const isSwitch = state.selectionMode === "toggle" || state.selectionMode === "checkbox";
        badge.classList.toggle("T1_visible", isSwitch && state.isEnabled);
      }

      // Template 2 relies on conditional sections -> re-render & re-bind
      if (state.activeTemplate === "template2") {
        render();
        bindEvents();
      }
    }

    // ---------- Public API ----------
    function updatePrice(price) {
      state.protectionPrice = +price || 0;
      const title = d(".T1_title", state.container);
      if (title) title.textContent = `${state.title} ($${state.protectionPrice.toFixed(2)})`;
    }

    function updateEnabled(enabled) {
      state.isEnabled = !!enabled;
      updateUI();
    }

    function getEnabled() {
      return !!state.isEnabled;
    }

    function updateActiveTemplate(template) {
      state.activeTemplate = template;
      render();
      bindEvents();
    }

    function updateContentSettings(settings = {}) {
      const keys = [
        "title",
        "description",
        "protectionPrice",
        "isEnabled",
        "confirmationMessage",
        "badgeText",
        // CTA button fields removed
        "bulletPoints",
        "additionalParagraphs",
        "protectionAddedText",
        "protectionMessageTitle",
        "protectionMessageSubtext",
        // "checkoutButtonMessage",
        "inlinePoints"
      ];
      keys.forEach((k) => {
        if (settings[k] !== undefined) state[k] = settings[k];
      });
      // template 2 message structure
      if (settings.protectionMessageTitle !== undefined)
        state.protectionMessage.title = settings.protectionMessageTitle;
      if (settings.protectionMessageSubtext !== undefined)
        state.protectionMessage.subtext = settings.protectionMessageSubtext;

      render();
      bindEvents();
    }

    function updateColorSettings(colors = {}) {
  Object.keys(colors).forEach((k) => {
    if (k in state.colors) state.colors[k] = colors[k];
  });
  injectStyles(); // Re-inject styles to update text color
  render(); // Re-render to apply changes
  bindEvents();
}


    function updateSelectionMode({ mode } = {}) {
      if (mode) state.selectionMode = mode;
      render();
      bindEvents();
    }

    function updateLogoSettings(logoSettings = {}) {
      state.logoSettings = { ...state.logoSettings, ...logoSettings };
      render();
      bindEvents();
    }

    function updateIconAsset(iconAsset = {}) {
      state.iconAsset = { ...state.iconAsset, ...iconAsset };
      render();
      bindEvents();
    }

    function updateIconStyle(iconStyle = {}) {
      state.iconStyle = { ...state.iconStyle, ...iconStyle };
      injectStyles();
      render();
      bindEvents();
    }

    function updateButtonBlock(buttonBlock = {}) {
      state.buttonBlock = { ...state.buttonBlock, ...buttonBlock };
      render();
      bindEvents();
    }

    function updateCustomLogos(logoUpdates = {}) {
      Object.keys(logoUpdates).forEach(logoKey => {
        if (customLogos[logoKey]) {
          customLogos[logoKey] = { ...customLogos[logoKey], ...logoUpdates[logoKey] };
        }
      });
      render();
      bindEvents();
    }

    function getCustomLogos() {
      return { ...customLogos };
    }

    function updateEnableProtectionControl(controlSettings = {}) {
      state.enableProtectionControl = { ...state.enableProtectionControl, ...controlSettings };
      render();
      bindEvents();
    }

    function getEnableProtectionControl() {
      return { ...state.enableProtectionControl };
    }

    function uploadCustomLogo(logoKey, file) {
      return new Promise((resolve, reject) => {
        if (!file || !customLogos[logoKey]) {
          reject(new Error('Invalid logo key or file'));
          return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
        if (!validTypes.includes(file.type)) {
          reject(new Error('Invalid file type. Please upload a valid image file.'));
          return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          reject(new Error('File size too large. Please upload an image smaller than 5MB.'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const originalLogo = { ...customLogos[logoKey] };
          customLogos[logoKey].url = e.target.result;
          customLogos[logoKey].name = file.name.split('.')[0] || customLogos[logoKey].name;
          customLogos[logoKey].uploadedAt = new Date().toISOString();
          customLogos[logoKey].fileSize = file.size;
          customLogos[logoKey].fileType = file.type;

          render();
          bindEvents();

          resolve({
            logoKey,
            logo: { ...customLogos[logoKey] },
            original: originalLogo,
            success: true
          });
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
    }

    function resetCustomLogo(logoKey) {
      if (!customLogos[logoKey]) {
        return { success: false, error: 'Invalid logo key' };
      }

      const originalEmoji = CUSTOM_LOGO_MAP[logoKey];
      customLogos[logoKey] = {
        emoji: originalEmoji,
        url: null,
        name: customLogos[logoKey].name,
        category: customLogos[logoKey].category
      };

      render();
      bindEvents();

      return { success: true, logoKey, logo: { ...customLogos[logoKey] } };
    }

    function bulkUploadLogos(logoFiles) {
      return Promise.allSettled(
        Object.entries(logoFiles).map(([logoKey, file]) =>
          uploadCustomLogo(logoKey, file)
        )
      );
    }

    function exportLogos() {
      const exportData = {
        timestamp: new Date().toISOString(),
        logos: { ...customLogos },
        version: '1.0'
      };

      return exportData;
    }

    function importLogos(importData) {
      try {
        if (!importData || !importData.logos) {
          throw new Error('Invalid import data');
        }

        Object.keys(importData.logos).forEach(logoKey => {
          if (customLogos[logoKey]) {
            customLogos[logoKey] = { ...customLogos[logoKey], ...importData.logos[logoKey] };
          }
        });

        render();
        bindEvents();

        return { success: true, imported: Object.keys(importData.logos).length };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }

    function destroy() {
      if (state.container) state.container.innerHTML = "";
      d("#T1_template-styles")?.remove();
    }

    // build API object
    function api() { }
    const apiObj = {
      // rendering lifecycle
      render,
      destroy,

      // getters/setters
      updatePrice,
      updateEnabled,
      getEnabled,
      updateActiveTemplate,
      updateContentSettings,
      updateColorSettings,
      updateSelectionMode,
      updateLogoSettings,
      updateIconAsset,
      updateIconStyle,
      updateButtonBlock,
      updateCustomLogos,
      getCustomLogos,
      updateEnableProtectionControl,
      getEnableProtectionControl,

      // Enhanced logo management
      uploadCustomLogo,
      resetCustomLogo,
      bulkUploadLogos,
      exportLogos,
      importLogos,

      // Utility methods
      getAllAvailableLogos: () => Object.keys(customLogos),
      getLogoByKey: (key) => customLogos[key] ? { ...customLogos[key] } : null,
      validateLogoKey: (key) => !!customLogos[key],
      getLogoCategories: () => [...new Set(Object.values(customLogos).map(logo => logo.category))],
      getLogosByCategory: (category) =>
        Object.entries(customLogos)
          .filter(([, logo]) => logo.category === category)
          .reduce((acc, [key, logo]) => ({ ...acc, [key]: logo }), {})
    };

    // ---------- Init ----------
    injectStyles();
    render();
    bindEvents();

    // expose on container for proxy getInstance
    container._template1Instance = apiObj;

    // return instance (works with or without `new`)
    return apiObj;
  }


  // New aded for text
  function getLuminance(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.substr(1, 2), 16) / 255;
  const g = parseInt(hexColor.substr(3, 2), 16) / 255;
  const b = parseInt(hexColor.substr(5, 2), 16) / 255;

  // Apply gamma correction
  const gammaCorrect = (value) =>
    value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);

  const rLinear = gammaCorrect(r);
  const gLinear = gammaCorrect(g);
  const bLinear = gammaCorrect(b);

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function getContrastTextColor(backgroundColor) {
  const luminance = getLuminance(backgroundColor);
  // Use light text for dark backgrounds and vice versa
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}


  // CommonJS / UMD-ish export
  if (typeof module !== "undefined" && module.exports) {
    module.exports = Template1;
  } else {
    global.Template1 = Template1;

    // Global proxy (drop-in replacement, same API)
    global.Template1.proxy = {
      updateContentSettings(settings) {
        warnNoInstance("updateContentSettings", "settings");
      },
      updateColorSettings(colors) {
        warnNoInstance("updateColorSettings", "colors");
      },
      updateActiveTemplate(template) {
        warnNoInstance("updateActiveTemplate", "template");
      },
      updateSelectionMode(settings) {
        warnNoInstance("updateSelectionMode", "settings");
      },
      updateLogoSettings(logoSettings) {
        warnNoInstance("updateLogoSettings", "logoSettings");
      },
      updateIconAsset(iconAsset) {
        warnNoInstance("updateIconAsset", "iconAsset");
      },
      updateIconStyle(iconStyle) {
        warnNoInstance("updateIconStyle", "iconStyle");
      },
      updateButtonBlock(buttonBlock) {
        warnNoInstance("updateButtonBlock", "buttonBlock");
      },
      updateCustomLogos(logoUpdates) {
        warnNoInstance("updateCustomLogos", "logoUpdates");
      },
      getCustomLogos() {
        warnNoInstance("getCustomLogos", "");
        return {};
      },
      updateEnableProtectionControl(controlSettings) {
        warnNoInstance("updateEnableProtectionControl", "controlSettings");
      },
      getEnableProtectionControl() {
        warnNoInstance("getEnableProtectionControl", "");
        return {};
      },
      uploadCustomLogo(logoKey, file) {
        warnNoInstance("uploadCustomLogo", "logoKey, file");
        return Promise.reject(new Error('No instance available'));
      },
      resetCustomLogo(logoKey) {
        warnNoInstance("resetCustomLogo", "logoKey");
        return { success: false, error: 'No instance available' };
      },
      bulkUploadLogos(logoFiles) {
        warnNoInstance("bulkUploadLogos", "logoFiles");
        return Promise.reject(new Error('No instance available'));
      },
      exportLogos() {
        warnNoInstance("exportLogos", "");
        return null;
      },
      importLogos(importData) {
        warnNoInstance("importLogos", "importData");
        return { success: false, error: 'No instance available' };
      },
      getAllAvailableLogos() {
        warnNoInstance("getAllAvailableLogos", "");
        return [];
      },
      getLogoByKey(key) {
        warnNoInstance("getLogoByKey", "key");
        return null;
      },
      validateLogoKey(key) {
        warnNoInstance("validateLogoKey", "key");
        return false;
      },
      getLogoCategories() {
        warnNoInstance("getLogoCategories", "");
        return [];
      },
      getLogosByCategory(category) {
        warnNoInstance("getLogosByCategory", "category");
        return {};
      },
      getInstance(containerId) {
        const el = document.getElementById(containerId);
        return el?._template1Instance || null;
      },
      setActiveInstance(instance) {
        if (!instance) return;
        const methods = [
          "updateContentSettings",
          "updateColorSettings",
          "updateActiveTemplate",
          "updateSelectionMode",
          "updateLogoSettings",
          "updateIconAsset",
          "updateIconStyle",
          "updateButtonBlock",
          "updateCustomLogos",
          "getCustomLogos",
          "updateEnableProtectionControl",
          "getEnableProtectionControl",
          "uploadCustomLogo",
          "resetCustomLogo",
          "bulkUploadLogos",
          "exportLogos",
          "importLogos",
          "getAllAvailableLogos",
          "getLogoByKey",
          "validateLogoKey",
          "getLogoCategories",
          "getLogosByCategory"
        ];
        methods.forEach((m) => {
          if (typeof instance[m] === "function") {
            this[m] = instance[m].bind(instance);
          }
        });
        console.info("Active Template1 instance set for proxy access.");
      }
    };

    function warnNoInstance(fn, argName) {
      console.warn("No Template1 instance found. Please create an instance first or use an existing instance.");
      console.info(`Example:
const template = Template1("your-container-id"); // or: new Template1("your-container-id")
template.${fn}(${argName});`);
    }
  }
})(typeof window !== "" ? window : globalThis);
