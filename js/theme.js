// T3Docs

// ensure our own namespace
if (typeof window.T3Docs === 'undefined') {
  window.T3Docs = {};
}

// toggle expand-collapse state of menu item
function toggleCurrent(event) { 'use strict';
  event.preventDefault();
  var link = event.currentTarget.parentElement;
  var element = link.parentElement;
  var siblings = element.parentElement.parentElement.querySelectorAll('li.current');
  for (var i = 0; i < siblings.length; i++) {
    if (siblings[i] !== element) {
      siblings[i].classList.remove('current');
    }
  }
  element.classList.toggle('current');
}

// add toggle icon to a-tags of menu items in .toc navigations
function makeMenuExpandable() { 'use strict';
  var tocs = document.getElementsByClassName('toc');
  for (var i = 0; i < tocs.length; i++) {
    var links = tocs[i].getElementsByTagName('a');
    for (var ii = 0; ii < links.length; ii++) {
      if (links[ii].nextSibling) {
        var expand = document.createElement('span');
        expand.classList.add('toctree-expand');
        expand.addEventListener('click', toggleCurrent, true);
        links[ii].prepend(expand);
      }
    }
  }
}
makeMenuExpandable();


// wrap tables to make them responsive
function makeTablesResponsive() { 'use strict';
  var tables = document.querySelectorAll('.rst-content table.docutils');
  for (var i = 0; i < tables.length; i++) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('table-responsive');
    tables[i].parentNode.insertBefore(wrapper, tables[i]);
    wrapper.appendChild(tables[i]);
  }
}
makeTablesResponsive();


/* global autocomplete:false, Search:false */
// add autocompletion to search field
document.addEventListener('DOMContentLoaded', function () { 'use strict';
  var searchform = document.getElementById("search-form");
  var searchinput = document.getElementById("searchinput");
  if (searchform && searchinput) {
    autocomplete({
      input: searchinput,
      fetch: function (text, update) {
        if (typeof window.T3Docs.autocomplete === 'undefined') {
          window.T3Docs.autocomplete = [];
          Object.keys(Search._index.terms).forEach(function (item, index) {
            window.T3Docs.autocomplete[index] = { label: item };
          });
        }
        var suggestions = window.T3Docs.autocomplete.filter(function (entry) {
          return entry.label.toLowerCase().startsWith(text.toLowerCase());
        });
        update(suggestions);
      },
      minLength: 4,
      emptyMsg: 'Not found in word stems',
      render: function (item) {
        var div = document.createElement("div");
        div.textContent = item.label;
        return div;
      },
      onSelect: function (item) {
        searchinput.value = item.label;
        searchform.submit();
      },
      disableAutoSelect: true
    });
  }
});


jQuery(document).ready(function () { 'use strict';

  function setVersionContent(content) {
    var options = document.createElement('dl');
    options.innerHTML = content;
    var versionOptions = document.getElementById("toc-version-options");
    versionOptions.innerHTML = '';
    versionOptions.appendChild(options);
  }

  // Display settings FullWidth: value, checkbox, element
  jQuery("#dsCogwheel" ).click(function() {
    jQuery("#dsPanel" ).slideToggle();
  });
  var
    body = document.getElementsByTagName('body')[0],
    vPermanent,
    vFullWidth,
    vCbsTheme,
    selectedStorage,
    cbPermanent = document.querySelector('#cbPermanent'),
    cbFullWidth = document.querySelector('#cbFullWidth'),
    rbCbsThemeDark = document.querySelector('#rbCbsThemeDark'),
    rbCbsThemeLight = document.querySelector('#rbCbsThemeLight'),
    elFullWidth = document.getElementsByClassName('page-main-inner')[0]
    ;

  function dsLoad() {
    vPermanent = localStorage.getItem('displaySettingsPermanent') === 'true';
    selectedStorage = vPermanent ? localStorage : sessionStorage;
    vFullWidth = selectedStorage.getItem('displaySettingsFullWidth') === 'true';
    vCbsTheme = selectedStorage.getItem('displaySettingsCbsTheme') || 'dark';
  }
  function dsSet() {
    if (elFullWidth) { elFullWidth.style.width = vFullWidth ? '99999px' : ''; }
    if (cbPermanent) { cbPermanent.checked = vPermanent; }
    if (cbFullWidth) { cbFullWidth.checked = vFullWidth; }
    if (body && vCbsTheme) { body.dataset.cbsTheme = vCbsTheme; }
    if (rbCbsThemeDark && vCbsTheme) { rbCbsThemeDark.checked = (vCbsTheme=='dark')};
    if (rbCbsThemeLight && vCbsTheme) { rbCbsThemeLight.checked = (vCbsTheme=='light')};
  }
  function dsSave() {
    vPermanent = !! cbPermanent.checked;
    vFullWidth = !! cbFullWidth.checked;
    vCbsTheme = (!!body.dataset.cbsTheme && body.dataset.cbsTheme) || 'dark';
    selectedStorage = vPermanent ? localStorage : sessionStorage;
    selectedStorage.setItem('displaySettingsFullWidth', vFullWidth ? 'true' : 'false');
    selectedStorage.setItem('displaySettingsCbsTheme', vCbsTheme);
    localStorage.setItem('displaySettingsPermanent', vPermanent ? 'true' : 'false');
  }
  jQuery(cbPermanent).change(function() {
    dsSave();
    dsSet();
  });
  jQuery(rbCbsThemeDark).change(function() {
    if (rbCbsThemeDark.checked) {
      body.dataset.cbsTheme = rbCbsThemeDark.value;
      dsSave();
      dsSet();
    }
  });
  jQuery(rbCbsThemeLight).change(function() {
    if (rbCbsThemeLight.checked) {
      body.dataset.cbsTheme = rbCbsThemeLight.value;
      dsSave();
      dsSet();
    }
  });
  jQuery(cbFullWidth).change(function() {
    dsSave();
    dsSet();
  });
  dsLoad();
  dsSet();

  var versionNode = document.getElementById("toc-version");
  if (versionNode) {
    versionNode.addEventListener('click', function () {
      var versionWrapper = document.getElementById("toc-version-wrapper");
      versionWrapper.classList.toggle('toc-version-wrapper-active');
      var versionOptions = document.getElementById("toc-version-options");
      if (!versionOptions.dataset.ready) {
        var versionsUri = 'https://docs.typo3.org/services/ajaxversions.php?url=' + encodeURI(document.URL);
        jQuery.ajax({
          url: versionsUri,
          success: function (result) {
            setVersionContent(result);
            var versionOptions = document.getElementById("toc-version-options");
            versionOptions.dataset.ready = true;
          },
          error: function () {
            setVersionContent('<p>No data available.</p>');
            var versionOptions = document.getElementById("toc-version-options");
            versionOptions.dataset.ready = true;
          }
        });
      }
    });
  }

  // start with collapsed menu on a TYPO3 Exceptions page
  jQuery('li.toctree-l1.current').filter(":contains('TYPO3 Exceptions')").removeClass('current');

  // fill in version hints
  if (!!DOCUMENTATION_OPTIONS && !!DOCUMENTATION_OPTIONS.URL_ROOT) {
    var coll = document.getElementsByClassName('version-hints-inner');
    if (!!coll && coll.length==1 && coll[0].dataset && coll[0].dataset.runAjax==='yes') {
      jQuery.ajax({
        url: DOCUMENTATION_OPTIONS.URL_ROOT+"_static/ajax-version-hints.html",
        success: function (texthtml) {
          jQuery(".version-hints-inner").html(texthtml);
        }
      });
    }
  }

});
