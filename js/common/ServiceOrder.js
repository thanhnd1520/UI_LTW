
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
        url: 'http://localhost:8080/service-order/list',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
        $('#btnAdderCustomer').click(btnAddOnClick);
        $('#cancelBtn').click(btnCancelOnClick);
        $('#saveBtn').click(btnSaveOnClick);
    }).fail(function (response) {

    });
})

var id;
var objectData;

function getAll() {
    $.ajax({
        url: 'http://localhost:8080/service-order/list',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
    });
}

function loadData(response) {
    $('#serviceOrderTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var serviceOrderId = item['id'];
        var startDAte = getDate(new Date(item['startDate']));
        var endDate = getDate(new Date(item['endDate']));
        var serviceName = item['service'].name;
        var companyName = item['company'].name;
        var staffBuildingName = item['staffBuilding'].name;

        var trHTML = `<tr id="${serviceOrderId}" value=${serviceOrderId} ondblclick='trUpdateOnDbClick(${serviceOrderId})' >
                        <td>${serviceOrderId}</td>
                        <td>${serviceName}</td>
                        <td>${companyName}</td>
                        <td>${staffBuildingName}</td>
                        <td>${startDAte}</td>
                        <td>${endDate}</td>
                        <td><Button id="deleteBtn" value=${serviceOrderId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
}

function trUpdateOnDbClick(ctl) {
    dialog.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    document.getElementById('updateBtn').value = ctl;
    loadElement();
    $.ajax({
        url: 'http://localhost:8080/service-order/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        var startDate = getDateImport(new Date(response['startDate']));
        var endDate = getDateImport(new Date(response['endDate']));
        var serviceId = response['service'].id;
        var companyId = response['company'].id;
        var staffBuildingId = response['staffBuilding'].id;

        $("#companySelect select").val(companyId).change();
        $("#serviceSelect select").val(serviceId).change();
        $("#staffBuildingSelect select").val(staffBuildingId).change();
        $("#startDateOrder").val(startDate);
        $("#endDateOrder").val(endDate);
    }).fail(function (response) {

    })
}

function search() {
    var companyId = $('#searchServiceOrder').val();
    var startDate = $('#searchServiceOrder').val();
    var endDate = $('#searchServiceOrder').val();
    $('#serviceTableBody tr ').remove();
    if (!key) {
        key = "";
    } else {
        key = "/filter/" + key;
    }
    $.ajax({
        url: 'http://localhost:8080/service' + key,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {

    })
}

function btnSaveOnClick() {
    data = getDataDialog();
    $.ajax({
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        url: 'http://localhost:8080/service-order/insert',
    }).done(function (response) {
        getAll();
        btnCancelOnClick();
    }).fail(function (response) {
        console.log(response);
    })
}

function btnUpdateOnClick() { // chưa có api
    objectData = getDataDialog();
    var id = $('#updateBtn').val();
    var tmp = 'http://localhost:8080/service-order/update/' + id;
    $.ajax({
        url: tmp,
        method: 'POST',
        data: JSON.stringify(objectData),
        contentType: 'application/json'
    }).done(function (response) {

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
        url: 'http://localhost:8080/service-order/delete/' + id,
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function getDataDialog() {
    var companyId = $('#companySelect').val();
    var serviceId = $('#serviceSelect').val();
    var staffBuildingId = $('#staffBuildingSelect').val();
    var startDate = new Date($('#startDateOrder').val()).getTime();
    var endDate = new Date($('#endDateOrder').val()).getTime();
   
    
    var Data = {
        "staffBuildingId": staffBuildingId,
        "companyId": companyId,
        "serviceId": serviceId,
        "startDate": startDate,
        "endDate": endDate
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
    $('#serviceSelect')
        .find('option')
        .remove();
    $.ajax({
        contentType: 'application/json',
        type: 'GET',
        url: 'http://localhost:8080/service/list',
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var serviceId = item['id'];
            var serviceCode = item['serviceCode'];
            var name = item['name'];
            var optionText = serviceCode + "-" + name;
            $("#serviceSelect").append(new Option(optionText, serviceId));
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


    $('#staffBuildingSelect')
        .find('option')
        .remove();
    $.ajax({
        contentType: 'application/json',
        type: 'GET',
        url: 'http://localhost:8080/staffsbuilding',
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var staffId = item['id'];
            var name = item['name'];
            var codeStaff = item['codeStaff'];
            var optionText = codeStaff + "-" + name;
            $("#staffBuildingSelect").append(new Option(optionText, staffId));
        }
    }).fail(function (response) {
        console.log(response);
    })
}
