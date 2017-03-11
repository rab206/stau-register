'use strict';var peopleMap={},peopleList=[],attendeeList=[],peopleField=document.getElementById('people'),dataList=document.getElementById('peopleList'),addedPeople=document.getElementById('addedPeople'),totalField=document.getElementById('total');document.getElementById('date').valueAsDate=new Date;var xhr=new XMLHttpRequest;xhr.open('GET','https://spreadsheets.google.com/feeds/list/1j9z1tQwSwxclM-ucThVbraR_JaQcvnwnPoDGFLGUFfU/2/public/values?alt=json'),xhr.onload=function(){200===xhr.status?onComplete(JSON.parse(xhr.response)):alert('Request failed.  Returned status of '+xhr.status)},xhr.send();function onComplete(c){var d=new Date(c.feed.updated.$t);document.getElementById('lastUpdated').textContent=d.toDateString();var f=c.feed.entry.filter((k)=>{return!!k.gsx$firstname.$t.trim()});f=f.map((k)=>{var l=k.gsx$firstname.$t.trim()+' '+k.gsx$surname.$t.trim(),m={name:l,balance:k.gsx$balance.$t};return peopleMap[l]=m,m}),f.sort(function(l,m){var n=l.name.toUpperCase(),o=m.name.toUpperCase();return n<o?-1:n>o?1:0});var g='<!--[if lte IE 9]><select data-datalist="peopleList"><![endif]-->';f.map((k)=>{peopleList.push(k.name),g+=`<option value="${k.name}">`}),g+='<!--[if lte IE 9]></select><![endif]-->',dataList.innerHTML=g,peopleField.placeholder='type name...';var h=!!(document.createElement('datalist')&&window.HTMLDataListElement);if(!h){var i=document.createElement('script');i.type='text/javascript',i.id='polyfill',i.src='datalist-polyfill.js',document.body.appendChild(i);document.body.insertAdjacentHTML('beforeend','<style>.datalist-polyfill{list-style:none;display:none;background:#fff;box-shadow:0 2px 2px #999;position:absolute;left:0;top:0;margin:0;padding:0;max-height:300px;overflow-y:auto}.datalist-polyfill:empty{display:none!important}.datalist-polyfill>li{padding:3px;font:13px "Lucida Grande",Sans-Serif}.datalist-polyfill__active{background:#3875d7;color:#fff}</style>')}}document.getElementById('form').onkeypress=(c)=>{13==c.keyCode&&c.preventDefault()};function capitalize(c){if(c){var d=c.split(' ');c='',d.map((f)=>{c+=f[0].toUpperCase()+f.slice(1)+' '}),c=c.trim()}return c}document.getElementById('addPerson').onclick=addPerson,peopleField.oninput=()=>{var c=peopleField.value;c=capitalize(c),peopleList.includes(c)&&addPerson()};function addPerson(){var c=capitalize(peopleField.value);if(c&&!attendeeList.includes(c)){var d='New person',f='';peopleMap[c]&&(d=peopleMap[c].balance,d='\xA3'+d,d.includes('(')&&(f='red',d='-&pound;'+d.substring(2,d.length-1))),attendeeList.push(c),attendeeList.sort();var g=attendeeList.indexOf(c);0<g?document.getElementById(attendeeList[g-1]).insertAdjacentHTML('afterend',`<tr id="${c}" class="stripe-dark ${f}">
          <td class="pa3">${c}</td>
          <td class="pa3">${d}</td>
          <td class="pa3"><input onClick="removePerson(this, '${c}')" class="b ph3 pv2 input-reset ba b--black bg-white grow pointer f6" type="button" value="Remove"></td>
        </tr>`):addedPeople.insertAdjacentHTML('afterbegin',`<tr id="${c}" class="stripe-dark ${f}">
          <td class="pa3">${c}</td>
          <td class="pa3">${d}</td>
          <td class="pa3"><input onClick="removePerson(this, '${c}')" class="b ph3 pv2 input-reset ba b--black bg-white grow pointer f6" type="button" value="Remove"></td>
        </tr>`),totalField.textContent=attendeeList.length}peopleField.value='',peopleField.focus()}function removePerson(c,d){c.parentElement.parentElement.remove(),attendeeList.splice(attendeeList.indexOf(d),1),totalField.textContent=attendeeList.length}document.getElementById('form').addEventListener('submit',(c)=>{c.preventDefault();var f=document.getElementById('date').value,g=document.getElementById('comment').value,h=`Register for  ${f}`,i=`Hi Treasurer,\r\n
Here is the register for ${f}.\r\n
\r\n
Comment: ${g}\r\n
\r\n
Register;
${attendeeList.join('\r\n')}\r\n
\r\n
Thanks`;window.location.href='mailto:'+'treasurer@stalbansultimate.co.uk'+'?subject='+h+'&body='+encodeURIComponent(i),document.getElementById('warning').classList.remove('dn')});
//# sourceMappingURL=index.js.map
