var a = null;
var totalSquare = null;
var roomResponse = null;
var contractResponse = null;
$(document).ready(function () {
    console.log("get data");
    dialog = $(".dialog_detail").dialog({
        autoOpen: false,
        width: 700,
        modal: true
    }),
        dialog1 = $(".pop-up").dialog({
            autoOpen: false,
            modal: true,
            with: 700,
            height: 150
        });
    $.ajax({
        url: 'http://localhost:8080/room',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        roomResponse = response;
        console.log("roomResponse", roomResponse);
        loadData(response);
        $('#btnAdderCustomer').click(btnAddOnClick);
        /*$('tr').dblclick(trUpdateOnDbClick);*/
        $('#cancelBtn').click(btnCancelOnClick);
        /*$('#updateBtn').click(btnUpdateOnClick);*/
        $('#saveBtn').click(btnSaveOnClick);
        /* $('#deleteBtn').click(btnDeleteOnClick)*/

    }).fail(function (response) {

    })
    $.ajax({
        url: 'http://localhost:8080/contract',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        // console.log("totalSquareContract", getTotalSquareContract(response));
        // console.log("totalSquareContract", getTotalSquareContract(response));
        totalSquare = getTotalSquareContract(response)
        console.log(totalSquare);
        contractResponse = response;
        console.log("contractResponse", contractResponse);
        // return restSquare;
    }).fail(function (response) {
    });
})

var id;
var objectData;
function getTotalSquareContract(response) {
    var result = null;
    for (let i = 0; i < response.length; i++) {
        result += response[i].square;
    }
    return result;
}
function getTotalSquareContractEqualId(response, roomId) {
    var result = null;
    for (let i = 0; i < response.length; i++) {
        if (response[i].room.id === roomId)
            result += response[i].square;
    }
    return result;
}
function loadData(response) {
    $('#roomTableBody tr ').remove();
    // console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var roomId = item['id'];
        var description = item['description'];
        var roomName = item['roomName'];
        var square = item['square'];
        var restSquare = item['restSquare'];
        var level = item['level'];

        var trHTML = `<tr id="${roomId}" value=${roomId} ondblclick='trUpdateOnDbClick(${roomId})' >
                        <td>${roomName}</td>
                        <td>${description}</td>
                        <td>${square}</td>
                        <td>${restSquare}</td>
                        <td>${level}</td>
                        <td><Button id="deleteBtn" value=${roomId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
}

function trUpdateOnDbClick(ctl) {
    dialog.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    /*var id = $(ctl).val();*/
    $.ajax({
        url: 'http://localhost:8080/room/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        $('#roomName').val(response["roomName"]);
        $('#square').val(response["square"]);
        $('#restSquare').val(response["restSquare"]);
        $('#description').val(response["description"]);
        $('#level').val(response["level"]);

    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchRoom').val();
    $('#roomTableBody tr ').remove();
    if (!key) {
        $.ajax({
            url: 'http://localhost:8080/room',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if (key === "") {
        $.ajax({
            url: 'http://localhost:8080/room',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else {
        $.ajax({
            url: 'http://localhost:8080/room/filter/' + key,
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    }

}

function btnSaveOnClick() {
    data = getDataDialog();
    console.log("data", data);
    var value = true;
    Object.keys(data).map(function (key, index) {
        if (data[key] === "")
            value = false;
    });
    if (!value) {
        alert("Các trường dữ liệu không được trống")
        return;
    } else {
        for (let i = 0; i < roomResponse.length; i++) {
            if (roomResponse[i].roomName == data.roomName && roomResponse[i].level == data.level)
                alert("phòng đã tồn tại");
        }
        $.ajax({
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            url: 'http://localhost:8080/room',
        }).done(function (response) {
            console.log(response);
            $.ajax({
                url: 'http://localhost:8080/room',
                method: 'GET',
                data: 'NULL',
                contentType: 'application/json'
            }).done(function (response) {
                loadData(response);
                btnCancelOnClick();

            }).fail(function (response) {

            })
        }).fail(function (response) {
            console.log(response);
        })
    }
}

function btnUpdateOnClick() {
    objectData = getDataDialog();
}

function productDelete(ctl) {
    var id = $(ctl).val();
    $(ctl).parents("tr").remove();
    console.log(id);
    $.ajax({
        contentType: 'application/json',
        type: 'DELETE',
        url: 'http://localhost:8080/room/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}
function getDataDialog() {
    var check = true;
    var roomName = $('#roomName').val();
    var description = $('#description').val();
    var square = $('#square').val();
    var level = $('#level').val();
    var restSquare = square - totalSquare;
    console.log("totalSquare", totalSquare);
    console.log("restSquare", restSquare);
    var Data = {
        "roomName": roomName,
        "description": description,
        "square": square,
        "restSquare": restSquare,
        "level": level,
    };
    console.log(Data);
    return Data;
}
console.log("roomSquare", getRoomSquare());
console.log("contractSquare", getTotalSquareContract());
console.log("restSquare", getSquare());
function getDate(date) {
    d = new Date(date);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' +
        + (month < 10 ? '0' : '') + month + '/'
        + d.getFullYear();
    return output;
}

function btnAddOnClick() {
    dialog.dialog('open');
    $("#updateBtn").hide();
    $("#saveBtn").show();
}

function btnCancelOnClick() {

    dialog.dialog('close');
}
