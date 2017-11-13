let globalCsrfToken;

const handleDomo = (e) => {
  e.preventDefault();

  $('domoMessage').animate({ width: 'hide' }, 350);

  if ($('#domoName').val() === '' || $('#domoAge').val() === '' || $('#domoMemeScore') === '') {
    handleError('RAWR! All fields are required');
    return false;
  }

  sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function() {
    loadDomosFromServer();
  });

  return false;
};

const deleteDomo = (e, id, csrf) => {
  e.preventDefault();

  $('domoMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', '/deleteDomo', `id=${id}&_csrf=${csrf}`, loadDomosFromServer);
}

const DomoForm = (props) => {
  return (
    <form
      id='domoForm'
      onSubmit={handleDomo}
      name='domoForm'
      action='/maker'
      method='POST'
      className='domoForm'
    >
      <label htmlFor='name'>Name: </label>
      <input id='domoName' type='text' name='name' placeholder='Domo Name' />
      <label htmlFor='age'>Age: </label>
      <input id='domoAge' type='text' name='age' placeholder='Domo Age' />
      <label htmlFor='memeScore'>Meme Score: </label>
      <input id='domoMemeScore' type='text' name='memeScore' placeholder='Domo Meme Score' />
      <input type='hidden' name='_csrf' value={globalCsrfToken} />
      <input className='makeDomoSubmit' type='submit' value='Make Domo' />
    </form>
  );
};

const DomoList = (props) => {
  return (
    <div className='domoList'>
      {
        (props.domos.length === 0) ?
        // If there are no domos, render this header
        <h3 className='emptyDomo'>No Domos yet</h3> :
        // Else, map domos to divs
        props.domos.map(domo =>
          <div key={domo._id} className='domo'>
            <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
            <h3 className='domoName'>Name: {domo.name}</h3>
            <h3 className='domoAge'>Age: {domo.age}</h3>
            <h3 classNAme='domoMemeScore'>Memes: {domo.memeScore}/10</h3>
            <br/>
            <hr/>
            <button onClick={(e) => { deleteDomo(e, domo._id, globalCsrfToken); }}>
              DELETE
            </button>
          </div>
        )
      }
    </div>
  );
}

const loadDomosFromServer = () => {
  sendAjax('GET', '/getDomos', null, (data) => {
    ReactDOM.render(
      <DomoList domos={data.domos}/>,
      document.querySelector('#domos')
    );
  });
};

const setup = (csrf) => {
  globalCsrfToken = csrf;

  ReactDOM.render(
    <DomoForm />,
    document.querySelector('#makeDomo')
  );

  ReactDOM.render(
    <DomoList domos={[]} />,
    document.querySelector('#domos')
  );

  loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function(){
  getToken();
});

