'use strict';

var globalCsrfToken = void 0;

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $('domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoMemeScore') === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
    loadDomosFromServer();
  });

  return false;
};

var deleteDomo = function deleteDomo(e, id, csrf) {
  e.preventDefault();

  $('domoMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteDomo', 'id=' + id + '&_csrf=' + csrf, loadDomosFromServer);
};

var DomoForm = function DomoForm(props) {
  return React.createElement(
    'form',
    {
      id: 'domoForm',
      onSubmit: handleDomo,
      name: 'domoForm',
      action: '/maker',
      method: 'POST',
      className: 'domoForm'
    },
    React.createElement(
      'label',
      { htmlFor: 'name' },
      'Name: '
    ),
    React.createElement('input', { id: 'domoName', type: 'text', name: 'name', placeholder: 'Domo Name' }),
    React.createElement(
      'label',
      { htmlFor: 'age' },
      'Age: '
    ),
    React.createElement('input', { id: 'domoAge', type: 'text', name: 'age', placeholder: 'Domo Age' }),
    React.createElement(
      'label',
      { htmlFor: 'memeScore' },
      'Meme Score: '
    ),
    React.createElement('input', { id: 'domoMemeScore', type: 'text', name: 'memeScore', placeholder: 'Domo Meme Score' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: globalCsrfToken }),
    React.createElement('input', { className: 'makeDomoSubmit', type: 'submit', value: 'Make Domo' })
  );
};

var DomoList = function DomoList(props) {
  return React.createElement(
    'div',
    { className: 'domoList' },
    props.domos.length === 0 ?
    // If there are no domos, render this header
    React.createElement(
      'h3',
      { className: 'emptyDomo' },
      'No Domos yet'
    ) :
    // Else, map domos to divs
    props.domos.map(function (domo) {
      return React.createElement(
        'div',
        { key: domo._id, className: 'domo' },
        React.createElement('img', { src: '/assets/img/domoface.jpeg', alt: 'domo face', className: 'domoFace' }),
        React.createElement(
          'h3',
          { className: 'domoName' },
          'Name: ',
          domo.name
        ),
        React.createElement(
          'h3',
          { className: 'domoAge' },
          'Age: ',
          domo.age
        ),
        React.createElement(
          'h3',
          { classNAme: 'domoMemeScore' },
          'Memes: ',
          domo.memeScore,
          '/10'
        ),
        React.createElement('br', null),
        React.createElement('hr', null),
        React.createElement(
          'button',
          { onClick: function onClick(e) {
              deleteDomo(e, domo._id, globalCsrfToken);
            } },
          'DELETE'
        )
      );
    })
  );
};

var loadDomosFromServer = function loadDomosFromServer() {
  sendAjax('GET', '/getDomos', null, function (data) {
    ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
  });
};

var setup = function setup(csrf) {
  globalCsrfToken = csrf;

  ReactDOM.render(React.createElement(DomoForm, null), document.querySelector('#makeDomo'));

  ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector('#domos'));

  loadDomosFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

/* eslint-disable no-undef no-unused-vars */
var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
