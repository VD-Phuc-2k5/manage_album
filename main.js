var urlAlbums = 'http://localhost:3000/albums';

//notification
const handleNotification = (mess, i, status) => {
    var overlay = document.querySelector('#overlay');
    var exitBtn = document.querySelector('#exit-btn');
    var message = document.querySelector('.form_message');
    var formIcon = document.querySelector('.form_icon');
    var formNotification = document.querySelector('.form');

    message.textContent = mess;
    formIcon.innerHTML = i;
    if (status === 'error') {
        formIcon.classList.remove('success');
        formNotification.classList.remove('success');
    }

    if (status === 'success') {
        formIcon.classList.remove('error');
        formNotification.classList.remove('error');
    }

    formIcon.classList.add(status);
    formNotification.classList.add(status);

    overlay.style = 'display: flex';
    overlay.addEventListener('click', () => {
        overlay.style = 'display: none';
    });

    exitBtn.addEventListener('click', () => {
        overlay.style = 'display: none';
    });
}

// error notification
const errorMessage = () => {
    var mess = 'Một số lỗi đã xảy ra, vui lòng kiểm tra lại!';
    var icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    var status = 'error';
    handleNotification(mess, icon, status);
};
// Success notification
const  successMessage = (message) => {
    var mess = message;
    var icon = '<i class="fa-solid fa-circle-check"></i>';
    var status ='success';
    handleNotification(mess, icon, status);
}

const insertBtn = document.querySelector('.insert-btn'); // button (+) => Open Create Image Form
const backBtn = document.querySelector('.back-btn'); // button (Back) => exit  Create Image Form
const createAlbumForm = document.querySelector('.create_img_form'); //Create Image Form
const saveAlbum = document.querySelector('#save-btn'); // save button for Create Image Form
const listAlbum = document.querySelector('#list-albums');

//open Create Image Form
insertBtn.addEventListener('click', () => {
    createAlbumForm.classList.add('active');
    setTimeout(function() {
        backBtn.classList.add('active');
    }, 2000);
    insertBtn.style = 'display: none;';
})

//close Create Image Form
backBtn.addEventListener('click', () => {
    insertBtn.style = 'display: block;';
    createAlbumForm.classList.remove('active');
    backBtn.classList.remove('active');
    document.querySelector('input[name="url"]').value = '';
    document.querySelector('input[name="name"]').value = '';
})

// save New Image for Album
saveAlbum.addEventListener('click', () => {
    checkUrl();
    document.querySelector('input[name="url"]').value = '';
    document.querySelector('input[name="name"]').value = '';
})

// Check Url hop le
function checkUrl() {
    var urlAlbum = document.querySelector('input[name="url"]').value;
    var nameAlbum = document.querySelector('input[name="name"]').value;
    var isJpgLink = urlAlbum.includes('.jpg'); 
    var isPngLink = urlAlbum.includes('.png');
    if (urlAlbum !== '' && nameAlbum !== '' && isJpgLink  || isPngLink) { 
        handleCreateAlbum(urlAlbum, nameAlbum); //url hop le
    }
    else{
        errorMessage()
    }
}
// logic Create Album
function handleCreateAlbum(url, name) {
    var newAlbum = {
        title:name,
        url: url
    }
    var options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newAlbum)
    }
    fetch(urlAlbums, options)
            .then(response => response.json())
            .then((newAlbum) => {
                insertNewAlbum(newAlbum);
                successMessage('Upload Success!');
            })
            .catch(() => {errorMessage()})
};

const insertNewAlbum = newAlbum => {
    var html = `
        <li class = "album_item album_item-${newAlbum.id}">
            <img src="${newAlbum.url}" alt="img ${newAlbum.id}">
            <div class="set-btn">
                <div class="delete-btn" onclick="deleteAlbum(${newAlbum.id})">Delete</div>     
                <div class="edit-btn" onclick="handleEditAlbum(${newAlbum.id})">Chỉnh sửa</div>
            </div>
            <h4 class="album_name">${newAlbum.title}</h4>
        </li>
    `
    listAlbum.insertAdjacentHTML('beforeend', html);
}

//get Album
const getAlbum = callback => {
    fetch(urlAlbums)
        .then(response => response.json())
        .then(callback)
        .catch(()=>{errorMessage()})
}

 //render Album
const render = albums => {
    var htmls = albums.map(album => {
        return `
            <li class = "album_item album_item-${album.id}">
                <img src="${album.url}" alt="img ${album.id}">
                <div class="set-btn">
                    <div class="delete-btn" onclick="deleteAlbum(${album.id})">Delete</div>     
                    <div class="edit-btn" onclick="handleEditAlbum(${album.id})">Chỉnh sửa</div>
                </div>
                <h4 class="album_name">${album.title}</h4>
            </li>
        `
    })
    return listAlbum.innerHTML = htmls.join('');
}

// delete 
const deleteAlbum = id => {
    var options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    }
    fetch(urlAlbums + '/' + id, options)
        .then(response => response.json())
        .then(() => {
            var deleteAlbum = document.querySelector('.album_item-' + id);
            if (deleteAlbum) {
                deleteAlbum.remove();
            }
            successMessage('Delete Success!');
        })
        .catch(() => {errorMessage()})
};
//change
var FormEdit = document.querySelector('.form_edit'); // form chinh sưa
var saveFormEdit = document.querySelector('#save-edit');
//close form edit
var closeFormEdit = document.querySelector('.backEdit-btn');
closeFormEdit.addEventListener('click', function() {
    FormEdit.style = 'display: none';
    document.querySelector('input[name="rename"]').value = '';
    document.querySelector('input[name="newUrl"]').value = '';
});
//handle for update
function handleEditAlbum(id) {
    openFormEdit();
    saveFormEdit.addEventListener('click', function() {
        getAndCheck(id);
        document.querySelector('input[name="rename"]').value = '';
        document.querySelector('input[name="newUrl"]').value = '';
    });
};
//open form edit
function openFormEdit() {
    FormEdit.style = 'display: flex';
}
//Check url for edit
function getAndCheck(id) {
    var reName = document.querySelector('input[name="rename"]').value;
    var newUrl = document.querySelector('input[name="newUrl"]').value;
    var isJpgLink = newUrl.includes('.jpg'); 
    var isPngLink = newUrl.includes('.png');
    if (reName == '' && newUrl !== '') {
        var data = isJpgLink || isPngLink ? {url: newUrl} : errorMessage();
    }
    else if(reName != '' && newUrl == '' ) {data = {title: reName}}
    else if(reName != '' && newUrl != '') {data = {title: reName, url: newUrl}}
    else {errorMessage()}
    
    if (data !== undefined) {
        updateAlbum(data, id);
    }
}
//update Album
const updateAlbum = (data, id) => {
    var option = {
        method:'PATCH',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }
    fetch(urlAlbums + '/' + id, option)
        .then(response => response.json())
        .then(() => {
            getAlbum(render);
            successMessage('Updated Your Album!')
        })
}

function start() {
    getAlbum(render);
    window.addEventListener('load', function() {
        var loader = this.document.querySelector('.loader');
        loader.style = 'display: flex';
        this.setTimeout(function() {
            loader.style = 'display: none';
        }, 5000)
    })
};

start();

const setBackgroundBtn = document.querySelector('.backgound--color');
const albumTitle = document.querySelector('.album_title');
const pageElement = document.querySelector('.page');
setBackgroundBtn.addEventListener('click', () => {
        pageElement.classList.toggle('ligthOff');
        albumTitle.classList.toggle('ligthOff');
        listAlbum.classList.toggle('lightOff');
})