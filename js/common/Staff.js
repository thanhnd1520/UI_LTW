var dataContract = null;
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
        url: 'http://localhost:8080/staffs',
        method: 'GET',
        data: 'NULL',
        contentType: 'text'
    }).done(function (response) {
        dataContract = response;
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
function getAll() {
    $.ajax({
        url: 'http://localhost:8080/staffs',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
    });
}
function loadData(response) {
    $('#staffTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var staffId = item['id'];
        var code = item['code'];
        var name = item['name'];
        var dateOfBirth = item['dateOfBirth'];
        var phone = item['phone'];

        var trHTML = `<tr id="${staffId}" value=${staffId} ondblclick='trUpdateOnDbClick(${staffId})' >
                        <td>${code}</td>
                        <td>${name}</td>
                        <td>${dateOfBirth}</td>
                        <td>${phone}</td>
                        <td><Button id="deleteBtn" value=${staffId} onclick='productDelete(this);'>Xóa</Button></td>
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
        url: 'http://localhost:8080/staffs/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        $('#code').val(response["code"]);
        $('#name').val(response["name"]);
        $('#dateOfBirth').val(response["dateOfBirth"]);
        $('#phone').val(response["phone"]);

    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchStaff').val();
    $('#staffTableBody tr ').remove();
    if (!key) {
        $.ajax({
            url: 'http://localhost:8080/staffs',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if (key === "") {
        $.ajax({
            url: 'http://localhost:8080/staffs',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else {
        $.ajax({
            url: 'http://localhost:8080/staffs/filter/' + key,
            method: 'GET',
            data: 'NULL' ,
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    }

}

function btnSaveOnClick() {
    data = getDataDialog();
    var value = true;
    Object.keys(data).map(function (key, index) {
        if (data[key] === "")
            value = false;
    });
    if (!value) {
        alert("Các trường dữ liệu không được trống")
        return;
    } else {
        for (let i = 0; i < dataContract.length; i++) {
            if (dataContract[i].code == data.code)
                alert("Nhân viên đã tồn tại", dataContract[i].code)
            break;
        }
        $.ajax({
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            url: 'http://localhost:8080/staffs',
        }).done(function (response) {
            getAll();
            btnCancelOnClick();
        }).fail(function (response) {
            // alert("Đã ký hợp đồng với công ty")
        })
    }
    
}

function btnUpdateOnClick() {
    objectData = getDataDialog();
    var id = $('#updateBtn').val();
    var tmp = 'http://localhost:8080/staffs/' + id;
    $.ajax({
        url: tmp,
        method: 'PUT',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {
        $.ajax({
            url: 'http://localhost:8080/staffs',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
            btnCancelOnClick();
        }).fail(function(response){

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
        url: 'http://localhost:8080/staffs/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}
function getDataDialog() {
    var check = true;
    var code = $('#code').val();
    var name = $('#name').val();
    var dateOfBirth = $('#dateOfBirth').val();
    var phone = $('#phone').val();
    var Data = {
        "code": code,
        "name": name,
        "dateOfBirth": dateOfBirth,
        "phone": phone,
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