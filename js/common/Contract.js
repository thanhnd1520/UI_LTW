var dataContract = null;
var dataRoom =null;
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
        url: 'http://localhost:8080/contract',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        dataContract = response;
        console.log("dataContract", dataContract);
        loadData(response);
        $('#btnAdderCustomer').click(btnAddOnClick);
        $('#cancelBtn').click(btnCancelOnClick);
        $('#updateBtn').click(btnUpdateOnClick);
        $('#saveBtn').click(btnSaveOnClick);
    }).fail(function (response) {

    });
    $.ajax({
        url: 'http://localhost:8080/room',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        dataRoom = response;
        console.log("typeof dataRoom", typeof(dataRoom))
    }).fail(function (response) {

    });
})

var id;
var objectData;

function getAll() {
    $.ajax({
        url: 'http://localhost:8080/contract',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
    });
}

function loadData(response) {
    $('#contractTableBody tr ').remove();
    console.log("response", response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var contractId = item['id'];
        var name = item['name'];
        var roomName = item['room'].roomName;
        var companyName = item['company'].name;
        var description = item['description'];
        var square = item['square'];
        var costPerSquare = item['costPerSquare'];
        // var startDate = getDate(new Date(item['startDate']));
        var startDate = new Date(Date.parse(item['startDate'])).toLocaleDateString();
        var endDate = new Date(Date.parse(item['endDate'])).toLocaleDateString();
        var totalCost = item['totalCost'];
        var status = item['status'];
        var tmp;
        if (status) {
            tmp = "Đã thanh toán";
        } else {
            tmp = `<button value = ${contractId} onclick = 'pay(${contractId})' >Thanh toán</button >`;
           
        }
        var trHTML = `<tr id="${contractId}" value=${contractId} ondblclick='trUpdateOnDbClick(${contractId})' >
                        <td>${name}</td>
                        <td>${roomName}</td>
                        <td>${companyName}</td>
                        <td>${description}</td>
                        <td>${square}</td>
                        <td>${costPerSquare}</td>
                        <td>${startDate}</td>
                        <td>${endDate}</td>
                        <td>${totalCost}</td>
                        <td>${tmp}</td>
                        <td><Button id="deleteBtn" value=${contractId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
}
function findStatus()
{
    $.ajax({
        url: 'http://localhost:8080/contract/findStatus' ,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
    })
}
function pay(contractId) {
    $.ajax({
        url: 'http://localhost:8080/contract/pay/' + contractId,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        alert("Thanh toán thành công");
        getAll();
    }).fail(function (response) {
        alert("Thanh toán không thành công");
    })
}
function trUpdateOnDbClick(ctl) {
    dialog.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    document.getElementById('updateBtn').value = ctl;
    loadElement();
    $.ajax({
        url: 'http://localhost:8080/contract/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        var startDate = response['startDate'];
        console.log("startDate", startDate)
        var endDate = response['endDate'];
        console.log("endDate", endDate);
        var roomId = response['room'].id;
        var companyId = response['company'].id;
        $('#name').val(response["name"]);
        $("#companySelect select").val(companyId).change();
        $("#roomSelect select").val(roomId).change();
        $('#description').val(response["description"]);
        $('#square').val(response["square"]);
        $('#costPerSquare').val(response["costPerSquare"]);
        $("#startDate").val(startDate);
        $("#endDate").val(endDate);
        $('#totalCost').val(response["totalCost"]);
    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchContract').val();
    var companyId = $('#searchContract').val();
    // var startDate = $('#searchServiceOrder').val();
    // var endDate = $('#searchServiceOrder').val();
    $('#contractTableBody tr ').remove();
    if (!key) {
        key = "";
    } else {
        key = "/filter/" + key;
    }
    $.ajax({
        url: 'http://localhost:8080/contract' + key,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {

    })
}
function getRoomSquare(dataRoom, roomId){
    var result =null;
    for(let i=0;i<dataRoom.length;i++)
    {
        if(dataRoom[i].id == roomId)
        result = dataRoom[i].restSquare;
    }
    return result;
}
function btnSaveOnClick() {
    data = getDataDialog();
    console.log("data", Object.keys(data)[2]);
    var value = true;
    Object.keys(data).map(function (key, index) {
        if (data[key] === "")
            value = false;
    });
    if (!value) {
        alert("Các trường dữ liệu không được trống")
        return;
    } else {
        var roomId = data[Object.keys(data)[2]];
        var squareContract = data[Object.keys(data)[4]];
        var restSquare = getRoomSquare(dataRoom, roomId);
        console.log("restSquare", restSquare);
        console.log("roomId", roomId);
        console.log("dataSquareContract",data[Object.keys(data)[4]])
        if(getRoomSquare(dataRoom, roomId )>squareContract){
            for (let i = 0; i < dataContract.length; i++) {
                if (dataContract[i].company.id == data.companyId)
                    alert("Đã ký hợp đồng với công ty", dataContract[i].company.name)
                break;
            }
            $.ajax({
                data: JSON.stringify(data),
                contentType: 'application/json',
                type: 'POST',
                url: 'http://localhost:8080/contract',
            }).done(function (response) {
                getAll();
                btnCancelOnClick();
            }).fail(function (response) {
                // alert("Đã ký hợp đồng với công ty")
            })
        }else
            alert("Phòng không đủ diện tích");
    }
}

function btnUpdateOnClick() { // chưa có api
    objectData = getDataDialog();
    var id = $('#updateBtn').val();
    var tmp = 'http://localhost:8080/contract/update/' + id;
    $.ajax({
        url: tmp,
        method: 'PUT',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {
        $.ajax({
            url: 'http://localhost:8080/contract',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
            btnCancelOnClick();
        }).fail(function (response) {

        })
    }).fail(function (response) {
        alert("cập nhật không thành công");
    });
}

function productDelete(ctl) {
    var id = $(ctl).val();
    $(ctl).parents("tr").remove();
    console.log(id);
    $.ajax({
        contentType: 'application/json',
        type: 'DELETE',
        url: 'http://localhost:8080/contract/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function getDataDialog() {
    var name = $('#name').val();
    var companyId = $('#companySelect').val();
    var roomId = $('#roomSelect').val();
    var description = $('#description').val();
    var square = $('#square').val();
    var costPerSquare = $('#costPerSquare').val();
    var startDate = new Date($('#startDate').val())
    var endDate = new Date($('#endDate').val());


    var Data = {
        "name": name,
        "companyId": companyId,
        "roomId": roomId,
        "description": description,
        "square": square,
        "costPerSquare": costPerSquare,
        "startDate": startDate,
        "endDate": endDate,
        "startDate": startDate,
        "totalCost": square * costPerSquare
    };
    console.log(Data);
    return Data;
}

function getDate(date) {
    d = new Date(date);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' +
        + (month < 10 ? '0' : '') + month + '/'
        + d.getFullYear();
    return output;
}

function getDateImport(date) {
    d = new Date(date);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = d.getFullYear() + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day
    return output;
}

function getGender(gender) {
    if (gender == 1)
        return "Nam";
    if (gender == 2)
        return "Khác";
    if (gender == 0)
        return "Nữ";
    return "";
}
function getStatusJob(status) {
    if (status == 1)
        return "Đang làm việc";
    if (status == 2)
        return "Đang thử việc";
    if (status == 3)
        return "Đã nghỉ hưu";
    if (status == 0)
        return "Đã nghỉ việc";
    return "";
}
function btnAddOnClick() {
    dialog.dialog('open');
    $("#updateBtn").hide();
    $("#saveBtn").show();
    loadElement();
}

function btnCancelOnClick() {

    dialog.dialog('close');
}
function loadElement() {
    $('#roomSelect')
        .find('option')
        .remove();
    $.ajax({
        contentType: 'application/json',
        type: 'GET',
        url: 'http://localhost:8080/room',
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var roomId = item['id'];
            var roomName = item['roomName'];
            var optionText = roomName;
            $("#roomSelect").append(new Option(optionText, roomId));
        }
    }).fail(function (response) {
        console.log(response);
    })

    // render selection của company
    $('#companySelect')
        .find('option')
        .remove();
    $.ajax({
        contentType: 'application/json',
        type: 'GET',
        url: 'http://localhost:8080/company',
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var companyId = item['id'];
            var name = item['name'];
            var optionText = name;
            $("#companySelect").append(new Option(optionText, companyId));
        }
    }).fail(function (response) {
        console.log(response);
    })
}