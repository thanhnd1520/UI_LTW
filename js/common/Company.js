var companyResponse = null;
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
        url: 'http://localhost:8080/company',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
        companyResponse = response;
        console.log("companyResponse", companyResponse)
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
    $('#companyTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var companyId = item['id'];
        var taxCode = item['taxCode'];
        var name = item['name'];
        var charterCapital = item['charterCapital'];
        var businessAreas = item['businessAreas'];
        var phone = item['phone'];
        var numberStaff = item['numberStaff'];

        var trHTML = `<tr id="${companyId}" value=${companyId} ondblclick='trUpdateOnDbClick(${companyId})' >
                        <td>${taxCode}</td>
                        <td>${name}</td>
                        <td>${charterCapital}</td>
                        <td>${businessAreas}</td>
                        <td>${phone}</td>
                        <td>${numberStaff}</td>
                        <td><Button id="deleteBtn" value=${companyId} onclick='productDelete(this);'>Xóa</Button></td>
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
        url: 'http://localhost:8080/company/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        $('#taxCode').val(response["taxCode"]);
        $('#name').val(response["name"]);
        $('#charterCapital').val(response["charterCapital"]);
        $('#businessAreas').val(response["businessAreas"]);
        $('#phone').val(response["phone"]);
        $('#numberStaff').val(response["numberStaff"]);
        $('#area').val(response["area"]);

    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchCompany').val();
    $('#companyTableBody tr ').remove();
    if (!key) {
        $.ajax({
            url: 'http://localhost:8080/company',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if (key === "") {
        $.ajax({
            url: 'http://localhost:8080/company',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else {
        $.ajax({
            url: 'http://localhost:8080/company/filter/' + key,
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
    console.log("datalength", data.length);
    console.log("dataname", data.name);
    var value = true;
    Object.keys(data).map(function (key, index) {
        if (data[key] === "")
            value = false;
    });
    if (!value) {
        alert ("Các trường dữ liệu không được trống")
        return;
    } else {
        for (let i = 0; i < companyResponse.length; i++) {
            console.log("name", companyResponse[i].name)
            if (companyResponse[i].name == data.name) {
                alert("Công ty đã tồn tại")
                break;
            }
        }
        $.ajax({
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            url: 'http://localhost:8080/company',
        }).done(function (response) {
            console.log(response);
            $.ajax({
                url: 'http://localhost:8080/company',
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
    var id = $('#updateBtn').val();
    var tmp = 'http://localhost:8080/company/' + id;
    $.ajax({
        url: tmp,
        method: 'PUT',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {
        $.ajax({
            url: 'http://localhost:8080/company',
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
    dialog.dialog('close');
}

function productDelete(ctl) {
    var id = $(ctl).val();
    $(ctl).parents("tr").remove();
    console.log(id);
    $.ajax({
        contentType: 'application/json',
        type: 'DELETE',
        url: 'http://localhost:8080/company/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}
function getDataDialog() {
    var check = true;
    var code = $('#taxCode').val();
    var name = $('#name').val();
    var charterCapital = $('#charterCapital').val();
    var businessAreas = $('#businessAreas').val();
    var phone = $('#phone').val();
    var numberStaff = $('#numberStaff').val();
    var area = $('#area').val();
    var Data = {
        "taxCode": code,
        "name": name,
        "charterCapital": charterCapital,
        "businessAreas": businessAreas,
        "phone": phone,
        "numberStaff": numberStaff,
        "area": area,
    };
    // console.log(Data);
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
