!function(e){function t(t,n,a){var s=e.createElement("ul"),f=null;s.id=r,s.className=o,e.body.appendChild(s);for(var c=0,u=e.createDocumentFragment(),d=0;d<a.length;d++){var p=a[d],v=e.createElement("li");v.innerText=p.value,u.appendChild(v)}s.appendChild(u);var h=s.childNodes,y=function(e){for(var t=0;t<h.length;t++)e(h[t])},m=function(e,t,n){e.addEventListener?e.addEventListener(t,n,!1):e.attachEvent("on"+t,n)};n.parentNode.removeChild(n),m(t,"focus",function(){s.scrollTop=0,c=0}),m(t,"blur",function(e){setTimeout(function(){s.style.display="none",y(function(e){e.className=""})},100)});var g=function(){s.style.top=t.offsetTop+t.offsetHeight+"px",s.style.left=t.offsetLeft+"px",s.style.width=t.offsetWidth+"px"},T=function(e){t.value=e.innerText,i(t,"change"),setTimeout(function(){s.style.display="none"},100)},N=function(e){s.style.display="block",g(),f=[],y(function(e){var n=t.value.toLowerCase(),o=n.length&&e.innerText.toLowerCase().indexOf(n)>-1;o&&f.push(e),e.style.display=o?"block":"none"})};m(t,"keyup",N),m(t,"focus",N),y(function(e){m(e,"mouseover",function(t){y(function(t){t.className=e==t?l:""})}),m(e,"mouseout",function(t){e.className=""}),m(e,"mousedown",function(t){T(e)})}),m(window,"resize",g),m(t,"keydown",function(e){var t=s.querySelector("."+l);if(f.length){var n=f[f.length-1],o=(n.offsetTop+n.offsetHeight,38==e.keyCode),a=40==e.keyCode;if(o||a)if(a&&!t)f[0].className=l;else if(t){for(var i=null,r=null,c=0;c<f.length;c++){var u=f[c];if(u==t){i=f[c-1],r=f[c+1];break}}t.className="",o&&(i?(i.className=l,i.offsetTop<s.scrollTop&&(s.scrollTop-=i.offsetHeight)):f[f.length-1].className=l),a&&(r?(r.className=l,r.offsetTop+r.offsetHeight>s.scrollTop+s.offsetHeight&&(s.scrollTop+=r.offsetHeight)):f[0].className=l)}!t||13!=e.keyCode&&9!=e.keyCode||T(t)}})}for(var n="data-datalist",o="datalist-polyfill",l="datalist-polyfill__active",a=e.querySelectorAll("input[list]"),i=function(t,n){var o;e.createEvent?(o=e.createEvent("HTMLEvents"),o.initEvent(n,!0,!0),t.dispatchEvent(o)):(o=e.createEventObject(),o.eventType=n,t.fireEvent("on"+n,o))},s=0;s<a.length;s++){var f=a[s],r=f.getAttribute("list"),c=e.getElementById(r);if(!c)return void console.error("No datalist found for input: "+r);var u=e.querySelector("select["+n+'="'+r+'"]'),d=u||c,p=d.getElementsByTagName("option");t(f,c,p),u&&u.parentNode.removeChild(u)}}(document);