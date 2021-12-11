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
        url: 'http://localhost:8080/staffsbuilding/all',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
        $('#btnAdderCustomer').click(btnAddOnClick);
        /*$('tr').dblclick(trUpdateOnDbClick);*/
        $('#cancelBtn').click(btnCancelOnClick);
        $('#updateBtn').click(btnUpdateOnClick);
        $('#saveBtn').click(btnSaveOnClick);
        /* $('#deleteBtn').click(btnDeleteOnClick)*/

    }).fail(function (response) {

    })
})

var id;
var objectData;

function loadData(response) {
    $('#staffBuildingTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var staffBuildingId = item['id'];
        var staffBuildingCode = item['codeStaff'];
        var staffBuildingName = item['name'];
        var staffBuildingBirthday = item['dateOfBirth'];
        var staffBuildingAddress = item['address'];
        var staffBuildingPhone = item['phone'];
        var staffBuildingLevel = item['level'];
        var staffBuildingPosition = item['position'];

        console.log(staffBuildingId);
        var trHTML = `<tr id="${staffBuildingId}" value=${staffBuildingId} ondblclick='trUpdateOnDbClick(${staffBuildingId})' >
                        <td>${staffBuildingCode}</td>
                        <td>${staffBuildingName}</td>
                        <td>${staffBuildingBirthday}</td>
                        <td>${staffBuildingAddress}</td>
                        <td>${staffBuildingPhone}</td>
                        <td>${staffBuildingLevel}</td>
                        <td>${staffBuildingPosition}</td>
                        <td><Button id="deleteBtn" value=${staffBuildingId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
}

function trUpdateOnDbClick(ctl) {
    dialog.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    document.getElementById('updateBtn').value = ctl;
    /*var id = $(ctl).val();*/
    $.ajax({
        url: 'http://localhost:8080/staffsbuilding/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        $('#staffBuildingCode').val(response["codeStaff"]);
        $('#staffBuildingName').val(response["name"]);
        $('#staffBuildingBirthday').val(response["dateOfBirth"]);
        $('#staffBuildingAddress').val(response["address"]);
        $('#staffBuildingPhone').val(response["phone"]);
        $('#staffBuildingLevel').val(response["level"]);
        $('#staffBuildingPosition').val(response["position"]);
        $('#staffBuildingEarnPerDay').val(response["earnPerDay"]);


    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchService').val();

    if (!key) {
        $.ajax({
            url: 'http://localhost:8080/staffsbuilding/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if (key === "") {
        $.ajax({
            url: 'http://localhost:8080/staffsbuilding/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else {
        $.ajax({
            url: 'http://localhost:8080/staffsbuilding/filter/' + key,
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
    $.ajax({
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        url: 'http://localhost:8080/staffsbuilding/create',
    }).done(function (response) {
        console.log(response);
        $.ajax({
            url: 'http://localhost:8080/staffsbuilding/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);

        }).fail(function (response) {

        })
    }).fail(function (response) {
        console.log(response);

    });
    btnCancelOnClick();
}

function btnUpdateOnClick() {
    objectData = getDataDialog();
    var id = $('#updateBtn').val();
    var tmp = 'http://localhost:8080/staffsbuilding/update/' + id;
    $.ajax({
        url: tmp,
        method: 'POST',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {
        $.ajax({
            url: 'http://localhost:8080/staffsbuilding/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })


    }).fail(function (response) {
        alert("cập nhật không thành công");
    });
    dialog.dialog('close');
}

function productDelete(ctl) {
    var id = $(ctl).val();
    $(ctl).parents("tr").remove();
    console.log(id);
    $.ajax({
        contentType: 'application/json',
        type: 'DELETE',
        url: 'http://localhost:8080/staffsbuilding/delete/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function getDataDialog() {
    var check = true;
    var code = $('#staffBuildingCode').val();
    var name = $('#staffBuildingName').val();
    var birthday = $('#staffBuildingBirthday').val();
    var address = $('#staffBuildingAddress').val();
    var phone = $('#staffBuildingPhone').val();
    var level = $('#staffBuildingLevel').val();
    var position = $('#staffBuildingPosition').val();
    var earnPerDay = $('#staffBuildingEarnPerDay').val();
 
   



    var Data = {
        "codeStaff": code,
        "name": name,
        "dateOfBirth": birthday,
        "address": address,
        "phone": phone,
        "level": level,
        "position": position,
        "earnPerDay": earnPerDay,
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

function btnAddOnClick() {
    dialog.dialog('open');
    $("#updateBtn").hide();
    $("#saveBtn").show();
}

function btnCancelOnClick() {

    dialog.dialog('close');
}