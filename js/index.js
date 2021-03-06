'use strict';

var peopleMap = {}; // object of all people, name and balance
var peopleList = [];
var attendeeList = []; // list of all attendees
var peopleField = document.getElementById('people'); // field where person's name is entered
var dataList = document.getElementById('peopleList'); // list of people to show in drop down
var addedPeople = document.getElementById('addedPeople'); // table to show added people
var totalField = document.getElementById('total');

// initialise the date field to today
document.getElementById('date').valueAsDate = new Date();

// fetch the data from google spreadsheets
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://spreadsheets.google.com/feeds/list/1930OIvsDqXdQPBVBq5TpwGENVjHrZ11XBeF_WF4t7VY/1/public/values?alt=json', true);
xhr.onload = function() {
  if (xhr.status === 200) {
    localStorage.setItem('people', xhr.response);
    onComplete(JSON.parse(xhr.response));
  }
  else {
    alert('Request failed.  Returned status of ' + xhr.status);
  }
};
xhr.onerror = function() {
  var data = localStorage.getItem('people');
  if (data) {
    onComplete(JSON.parse(data));
  }
};
xhr.send();

function compareNames(nameA, nameB) {
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

function comparePeople(a, b) {
  if (!a.surname || b.surname) {
    result = compareNames(a.name.toUpperCase(), b.name.toUpperCase());
  }
  var result = compareNames(a.surname.toUpperCase(), b.surname.toUpperCase());
  if (result === 0) {
    result = compareNames(a.name.toUpperCase(), b.name.toUpperCase());
  }
  return result;
}

// callback when google sheet loads
function onComplete(data) {
  // show the last updated date
  var lastUpdated = new Date(data.feed.updated.$t);
  document.getElementById("lastUpdated").textContent = lastUpdated.toDateString();
  document.getElementById("spreadsheet").href = data.feed.link[0].href;

  // only keep the row if the name is not empty
  var people = data.feed.entry.filter(p => {
    console.log(p.gsx$fullname);
    return p.gsx$fullname && p.gsx$fullname.$t.trim() && p.gsx$fullname.$t.trim() != '-';
  });
  // extract the data we want (full name and balance) and discard the rest
  people = people.map(p => {
    var name = p.gsx$fullname.$t.trim();
    name = name.replace(/\"/g, "'");
    name = name.replace(/[ ]{1,}/g, " ");
    var newP = {
      name,
      surname: p.gsx$surname.$t,
      balance: p.gsx$currentbalance.$t
    };
    peopleMap[name] = newP;
    return newP;
  });

  // sort the names alphabetically
  people.sort(comparePeople);
  var options = '<!--[if lte IE 9]><select data-datalist="peopleList"><![endif]-->'; // populate list of options
  people.map(p => {
    peopleList.push(p.name);
    options += `<option value="${p.name}">`;
  });
  options += "<!--[if lte IE 9]></select><![endif]-->";
  dataList.innerHTML = options;
  peopleField.placeholder = "type name...";

  var datalistSupported = !!(document.createElement('datalist') && window.HTMLDataListElement);

  if (!datalistSupported) {
    var polyfill = document.createElement("script");
    polyfill.type = "text/javascript";
    polyfill.id = "polyfill";
    polyfill.src = "datalist-polyfill.js";
    document.body.appendChild(polyfill);
    var style = '<style>.datalist-polyfill{list-style:none;display:none;background:#fff;box-shadow:0 2px 2px #999;position:absolute;left:0;top:0;margin:0;padding:0;max-height:300px;overflow-y:auto}.datalist-polyfill:empty{display:none!important}.datalist-polyfill>li{padding:3px;font:13px "Lucida Grande",Sans-Serif}.datalist-polyfill__active{background:#3875d7;color:#fff}</style>';
    document.body.insertAdjacentHTML('beforeend', style);
    // add on blur event as oninput is not triggered by datalist polyfill
    peopleField.onblur = updateInput;
  }
}

// prevent enter key submit of the form
document.getElementById('form').onkeypress = (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
  }
};

// capitalize all words
function capitalize(name) {
  if (name) {
    var words = name.split(' ');
    name = "";
    words.map((w) => {
      if (w.length > 0) {
        name += w[0].toUpperCase() + w.slice(1) + " ";
      }
    });
    name = name.trim();
  }
  return name;
}

// add the current person to the attendee list
document.getElementById('addPerson').onclick = addPerson;

// if the field value matches a person's name in the list
// then add the person immediately
// this works on clicking on a element in the list or just typing the full name
peopleField.oninput = updateInput;

function updateInput() {
  var val = peopleField.value;
  val = capitalize(val);
  if (peopleList.includes(val)) {
    addPerson();
  }
}

// add a person to the table and to the list of attendees
function addPerson() {
  var name = capitalize(peopleField.value);
  // if they're not already on the list add them
  if (name && attendeeList.filter(p => {return p.name === name}).length === 0) {
    // if the person exists in the spreadsheet we show their balance, if not we show "New person"
    var balance = "New person";
    var person;

    // highlight the people with a negative balance
    var rowClass = "";
    if (peopleMap[name]) {
      person = peopleMap[name];
      balance = person.balance;
      balance = "£" + balance;
      if (balance.includes('(')) {
        rowClass = "red";
        balance = "-&pound;" + balance.substring(2, balance.length - 1);
      }
    }
    else {
      person = {
        name,
        surname: name,
        balance,
        newPerson: true,
      };
    }
    attendeeList.push(person);

    addedPeople.insertAdjacentHTML("afterbegin",
      `<tr id="${name}" class="stripe-dark ${rowClass}">
          <td class="pa3">${name}</td>
          <td class="pa3">${balance}</td>
          <td class="pa3"><input onClick="removePerson(this, '${name}')" class="b ph3 pv2 input-reset ba b--black bg-white grow pointer f6" type="button" value="Remove"></td>
        </tr>`);
        
    // add the person to the table
    totalField.textContent = attendeeList.length;
  }
  // reset the search field
  peopleField.value = "";
  peopleField.focus();
}

// remove an attendee
// element is the button clicked on, name is the name of the person
function removePerson(element, name) {
  // delete from table
  element.parentElement.parentElement.remove();
  // delete from attendee list
  attendeeList = attendeeList.filter(p => { return p.name != name });
  totalField.textContent = attendeeList.length;
}

function getAttendeeList() {
  var newPeople = [];
  var attendeeString = "";
  attendeeList.sort(comparePeople);
  attendeeList.forEach(p => {
    if (p.newPerson) {
      newPeople.push(p);
    }
    else {
      attendeeString += p.name + "\r\n";
    }
  });
  if (newPeople.length > 0) {
    attendeeString += "\r\nNew People; \r\n";
    newPeople.forEach(p => {
      attendeeString += p.name + "\r\n";
    });
  }
  return attendeeString;
}

// on submit prevent page submit and open email app instead
document.getElementById('form').addEventListener("submit", (e) => {
  // prevent page submit
  e.preventDefault();

  // construct the mail to request
  var email = 'treasurer@stalbansultimate.co.uk';
  var date = document.getElementById('date').value;
  var comment = document.getElementById('comment').value;
  var subject = `Register for  ${date}`;
  var emailBody =
    `Hi Treasurer,\r\n
Here is the register for ${date}.\r\n
\r\n
Comment: ${comment}\r\n
\r\n
Register;
${getAttendeeList()}\r\n
\r\n
Thanks`;
  window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + encodeURIComponent(emailBody);
  // show the warning that email has been opened
  document.getElementById('warning').classList.remove('dn');
});
/* global navigator */
// add service worker so requests are cached offline and we get add to homescreen functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
