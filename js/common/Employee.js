
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
        height:150
    }) ;
    $.ajax({
        url: 'http://localhost:8080/service/list',
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
    $('#serviceTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var serviceId = item['id'];
        var serviceCode = item['serviceCode'];
        var name = item['name'];
        var type = item['type'];
        var cost = item['cost'];

        console.log(serviceCode);
        var trHTML = `<tr id="${serviceId}" value=${serviceId} ondblclick='trUpdateOnDbClick(${serviceId})' >
                        <td>${serviceCode}</td>
                        <td>${name}</td>
                        <td>${type}</td>
                        <td>${cost}</td>
                        <td><Button id="deleteBtn" value=${serviceId} onclick='productDelete(this);'>Xóa</Button></td>
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
        url: 'http://localhost:8080/service/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        $('#serviceCode').val(response["serviceCode"]);
        $('#serviceName').val(response["name"]);
        $('#typeService').val(response["type"]);
        $('#costService').val(response["cost"]);
        
    }).fail(function (response) {

    })
}

function search() {
    var key = $('#searchService').val();
    
    if (!key) {
        $.ajax({
            url: 'http://localhost:8080/service/list',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if(key === ""){
        $.ajax({
            url: 'http://localhost:8080/service/list',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    }else {
        $.ajax({
            url: 'http://localhost:8080/service/filter/' + key,
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
        url: 'http://localhost:8080/service/create',
    }).done(function (response) {
        console.log(response);
        $.ajax({
            url: 'http://localhost:8080/service/list',
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
    var tmp = 'http://localhost:8080/service/update/' + id;
    $.ajax({
        url: tmp,
        method: 'POST',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {
        $.ajax({
            url: 'http://localhost:8080/service/list',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (s) {
            loadData(s);
        }).fail(function (s) {

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
        url: 'http://localhost:8080/service/delete/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function getDataDialog() {
    var check = true;
    var code = $('#serviceCode').val();
    var name = $('#serviceName').val();
    var type = $('#typeService').val();
    var cost = $('#costService').val();
    
    
    var Data = {
        "serviceCode": code,
        "name": name,
        "type": type,
        "cost": cost,
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
