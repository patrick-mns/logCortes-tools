const player = document.querySelector('video');
const inputTimes = document.getElementsByClassName('inputTimes');
const saves = document.getElementById('saves');

function preview_image(event) {
    try {
        player.src = URL.createObjectURL(event.target.files[0])
    } catch {
        helpsFunc('Houve algum problema ao importar o video...')
    }
}

const input = document.querySelector('#velocidade');
input.addEventListener('change', function() {
    const rate = parseInt(this.value, 10) / 100;
    player.playbackRate = rate;
});

function helpsFunc(message) {
    swal(String(message));
}

function hhMMSS(s) {
    var date = new Date(null);
    date.setSeconds(s);
    var result = date.toISOString().substr(11, 8);
    return (result)
}

function inSeconds(hms) {
    var x = hms.split(':');
    var seconds = (+x[0]) * 60 * 60 + (+x[1]) * 60 + (+x[2]);
    return (seconds)
}

function CurrentTime() {
    return (hhMMSS(parseInt(player.currentTime)))
}

function timerPoint(id) {
    let timer = CurrentTime();
    switch (id) {
        case 0:
            inputTimes[id].value = timer;
            inputTimes[1].value = '00:00:00';
            break;
        case 1:
            if (inSeconds(inputTimes[0].value) > inSeconds(timer)) {
                helpsFunc('Erro, o ponto B não pode ser menor que o ponto A.')
            } else {
                inputTimes[id].value = timer;
            }
            break;
        case 2:
            // thumb em thumbnail
            inputTimes[id].value = timer;
            break;
        default:
            helpsFunc('Erro desconhecido...')
            break;
    }
}

function confirmDelete(div_id) {
    const div = document.getElementById(div_id)
    var x = confirm("Deseja mesmo excluir o corte?");
    if (x == true) {
        div.remove()
    } else {
        console.log('ufaa...')
    }
}

function create() {
    var div_id = randId();
    const title = document.getElementById('title').value;
    const thumbMessage = document.getElementById('thumbMessage').value;

    if (inSeconds(inputTimes[0].value) >= inSeconds(inputTimes[1].value)) {
        return (helpsFunc('Error, o ponto B não pode ser menor ou igual ao ponto A.'))
    }

    if (!title) {
        return (helpsFunc('Não  pode  ser vazio... Escolha um title...'))
    }

    if (!thumbMessage) {
        return (helpsFunc('Não  pode  ser vazio... Escolha uma mensagem...'))
    }

    const div = document.createElement('div');
    const input = document.createElement('input');
    const message = document.createElement('span');

    let dataBase = JSON.stringify({
        'id': div_id,
        'pointA': inSeconds(inputTimes[0].value),
        'pointB': inSeconds(inputTimes[1].value),
        'pointT': inSeconds(inputTimes[2].value),
        'title': title,
        'message': thumbMessage
    })

    input.style.display = 'none';
    input.className = 'list';
    input.value = dataBase;

    div.style.margin = '5px';
    div.style.padding = '10px';
    div.style.borderRadius = '11px';
    div.style.backgroundColor = '#f2f2f2';
    div.style.color = 'rgb(56, 56, 56)';
    div.style.width = 'auto';
    div.style.cursor = 'pointer';

    div.id = div_id;
    div.innerHTML = '<p style="margin:2px; font-size:14px;">' + inputTimes[0].value + ' | ' + inputTimes[1].value + '</p><p style="margin:2px; font-weight: bold;">' + title + '</p><p style="margin: 2px; font-size: 11px;">' + thumbMessage + '</p>';

    div.setAttribute('onclick', 'confirmDelete("' + div_id + '")')
    div.appendChild(message)
    div.appendChild(input)
    saves.appendChild(div)

}

function saveCortes() {
    data = []
    for (i = 0; document.getElementsByClassName('list').length > i; i++) {
        data.push(JSON.parse(document.getElementsByClassName('list')[i].value))
    }
    data = JSON.stringify({
        data
    })

    var blob = new Blob([data], {
        type: "application/json;charset=utf-8"
    });

    fileName = 'cortes.json';
    aDownload = document.createElement('a');
    aDownload.href = URL.createObjectURL(blob);
    aDownload.setAttribute('download', fileName);
    document.body.appendChild(aDownload)
    aDownload.click()

}

function randId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}