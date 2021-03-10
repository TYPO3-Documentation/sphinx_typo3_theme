// T3Docs

// ensure our own namespace
if (typeof window.T3Docs === 'undefined') {
  window.T3Docs = {};
}

// toggle expand-collapse state of menu item
function toggleCurrent(event) { 'use strict';
  event.preventDefault();
  const link = event.currentTarget.parentElement;
  const element = link.parentElement;
  const siblings = element.parentElement.parentElement.querySelectorAll('li.current');
  for (let i = 0; i < siblings.length; i++) {
    if (siblings[i] !== element) {
      siblings[i].classList.remove('current');
    }
  }
  element.classList.toggle('current');
}

// add toggle icon to a-tags of menu items in .toc navigations
function makeMenuExpandable() { 'use strict';
  const tocs = document.getElementsByClassName('toc');
  for (let i = 0; i < tocs.length; i++) {
    let links = tocs[i].getElementsByTagName('a');
    for (let ii = 0; ii < links.length; ii++) {
      if (links[ii].nextSibling) {
        let expand = document.createElement('span');
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
  const tables = document.querySelectorAll('.rst-content table.docutils');
  for (let i = 0; i < tables.length; i++) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('table-responsive');
    tables[i].parentNode.insertBefore(wrapper, tables[i]);
    wrapper.appendChild(tables[i]);
  }
}
makeTablesResponsive();


/* global autocomplete:false, Search:false */
if (!!autocomplete && !!Search) {
  // add autocompletion to search field
  document.addEventListener('DOMContentLoaded', function () { 'use strict';
    const searchform = document.getElementById("search-form");
    const searchinput = document.getElementById("searchinput");
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
          let suggestions = window.T3Docs.autocomplete.filter(function (entry) {
            return entry.label.toLowerCase().startsWith(text.toLowerCase());
          });
          update(suggestions);
        },
        minLength: 4,
        emptyMsg: 'No elements found',
        render: function (item) {
          const div = document.createElement("div");
          div.textContent = item.label;
          return div;
        },
        onSelect: function (item) {
          searchinput.value = item.label;
          searchform.submit();
        }
      });
    }
  });
}


jQuery(document).ready(function () { 'use strict';

  function setVersionContent(content) {
    const options = document.createElement('dl');
    options.innerHTML = content;
    const versionOptions = document.getElementById("toc-version-options");
    versionOptions.innerHTML = '';
    versionOptions.appendChild(options);
  }

  const versionNode = document.getElementById("toc-version");
  if (versionNode) {
    versionNode.addEventListener('click', function () {
      const versionWrapper = document.getElementById("toc-version-wrapper");
      versionWrapper.classList.toggle('toc-version-wrapper-active');
      const versionOptions = document.getElementById("toc-version-options");
      if (!versionOptions.dataset.ready) {
        const versionsUri = 'https://docs.typo3.org/services/ajaxversions.php?url=' + encodeURI(document.URL);
        jQuery.ajax({
          url: versionsUri,
          success: function (result) {
            setVersionContent(result);
            const versionOptions = document.getElementById("toc-version-options");
            versionOptions.dataset.ready = true;
          },
          error: function () {
            setVersionContent('<p>No data available.</p>');
            const versionOptions = document.getElementById("toc-version-options");
            versionOptions.dataset.ready = true;
          }
        });
      }
    });
  }

  jQuery('#btnEditOnGitHub').mouseenter(function () { jQuery('#btnHowToEdit').show();});
  jQuery('#btnHowToEdit').parent().mouseleave(function () {jQuery('#btnHowToEdit').hide();});

});
