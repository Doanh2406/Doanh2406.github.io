const socket = io('https://doanh2406.github.io/');

$('#div-chat').hide();

socket.on('DANH_SACH_ONLINE', arrUserInfo => {
    $('#div-chat').show();
    $('#div-dang-ki').hide();

    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);

    });
    socket.on('CO_NGUOI_DUNG_MOI', user => { 
        const { ten, peerId } = user;
        $('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
    
    });

    socket.on('AI_DO_NGAT_KET_NOI',peerId =>{
        $(`#${peerId}`).remove();
    });
    
});

socket.on('DANG_KI_THAT_BAI',()=> alert('Vui long chon UserName khac!!'));

function openStream() {
    const congfig = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(congfig);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}

``


const peer = new Peer({ key: 'peerjs',host:'quydi-peerjs.herokuapp.com', secure: true, port: 443 });
peer.on('open', id => {
    $('#my-peer').append(id);
    $('#btnSignup').click(() => {
        const userName = $('#txtUsername').val();
        socket.emit('NGUOI_DUNG_DANG_KI', { ten: userName, peerId: id });
    });
});


$('#btnCall').click(() => {
    const id = $('#remoreId').val();
    openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        });
});


peer.on('call', call => {
    openStream()
        .then(stream => {
            call.answer(stream);
            playStream('localStream', stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        });
});


$('#ulUser').on('click','li', function() {
    const id = $(this).attr('id');
    openStream()
    .then(stream => {
        playStream('localStream', stream);
        const call = peer.call(id, stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    });
});