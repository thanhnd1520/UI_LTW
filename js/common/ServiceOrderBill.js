
$(document).ready(function () {
    console.log("get data");
    dialog = $(".dialog_detail").dialog({
        autoOpen: false,
        width: 700,
        modal: true
    }),
    dialog_detail = $(".dialog_bill_detail").dialog({
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
        url: 'http://localhost:8080/order-bill/list',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
        loadElement()
        $('#btnAdderCustomer').click(btnAddOnClick);
        $('#cancelBtn').click(btnCancelOnClick);
        $('#createBtn').click(btnCreateBillOnClick);
    }).fail(function (response) {

    });
})

var id;
var objectData;

function getAll() {
    $.ajax({
        url: 'http://localhost:8080/order-bill/list',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
    });
}

function loadData(response) {
    $('#serviceOrderBillTableBody tr ').remove();
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var serviceOrderBillId = item['id'];
        var createDate = getDate(item['dateCreate']);
        var companyId = item['companyId'];
        var total = item['total'];
        var status = item['status'];
        var tmp;
        if (status) {
            tmp = "Đã thanh toán";
        } else {
            tmp = `<button value = ${serviceOrderBillId} onclick = 'pay(${serviceOrderBillId})' >Thanh toán</button >`;
           
        }

        var trHTML = `<tr id="${serviceOrderBillId}" value=${serviceOrderBillId} ondblclick='trUpdateOnDbClick(${serviceOrderBillId})' >
                        <td>${serviceOrderBillId}</td>
                        <td>${companyId}</td>
                        <td>${createDate}</td>
                        <td>${total}</td>
                        <td>${tmp}</td>
                        <td><Button id="deleteBtn" value=${serviceOrderBillId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
    loadElement();
}

function trUpdateOnDbClick(ctl) {
    dialog_detail.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    $.ajax({
        url: 'http://localhost:8080/order-bill/get/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        console.log(response);
        $('#serviceBillDetailTableBody tr ').remove();
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var serviceOrderId = item['serviceOrderId'];
            var startDate = getDate(item['startDate']);
            var endDate = getDate(item['endDate']);
            var serviceName = item['serviceName'];
            var numberDay = item['numberDay'];
            var tiSuat = item['tiSuat'];
            var soNguoiSuDung = item['soNguoiSuDung'];
            var dienTichSan = item['dienTichSan'];
            var total = item['total'];
            var trHTML = `<tr><td>${serviceOrderId}</td>
                        <td>${serviceName}</td>
                        <td>${startDate}</td>
                        <td>${endDate}</td>
                        <td>${numberDay}</td>
                        <td>${soNguoiSuDung}</td>
                        <td>${dienTichSan}</td>
                        <td>${tiSuat}</td>
                        <td>${total}</td>
                     </tr>`
            $('#tbBillDetail tbody').append(trHTML);
        }
    }).fail(function (response) {

    })
}

function pay(ctl) {
    $.ajax({
        url: 'http://localhost:8080/order-bill/pay-bill/' + ctl,
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

function search() {
    var companyId = $('#companySelect2').val();
    var startDate = $('#startDateOrder2').val();
    var endDate = $('#endDateOrder2').val();
    var startMonth = -1;
    var startYear = -1;
    var endMonth = -1;
    var endYear = -1;
    if (isNaN(startDate) || isNaN(endDate)) {
        var array1 = startDate.split("-");
        var array2 = endDate.split("-");
        startMonth = array1[1];
        startYear = array1[0];
        endMonth = array2[1];
        endYear = array2[0];
    } else {
       
    }
    if (companyId == 0) {
        companyId = -1;
    }
    
    var data = {
        "companyId": companyId,
        "startMonth": startMonth,
        "startYear": startYear,
        "endMonth": endMonth,
        "endYear": endYear
    }
    $.ajax({
        url: 'http://localhost:8080/order-bill/filter',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
    }).fail(function (response) {
        console.log(response);
    });
    console.log("hi");
}

function btnCreateBillOnClick() {
    var monthCreate = $('#monthSelect').val();
    if (monthCreate == "") {
        alert("Vui lòng chọn tháng cần tạo bill");
        return;
    }
    var array = monthCreate.split("-");
    var month = array[1];
    var year = array[0];
    var companyId = $('#companySelect2').val();
    var data;
    if (companyId == 0) {
        data = {
            "month": month,
            "year": year
        };
    }
    else {
        data = {
            "month": month,
            "year": year,
            "companyId": companyId
        };
    }
    $.ajax({
        data: JSON.stringify(data),
        contentType: 'application/json',
        type: 'POST',
        url: 'http://localhost:8080/order-bill/create',
    }).done(function (response) {
        var code = response['code'];
        var message = response['message'];
        if (code === 400) {
            alert(message);
            return;
        }
        getAll();
        btnCancelOnClick();
    }).fail(function (response) {
        console.log(response);
        getAll();
        btnCancelOnClick();
    })
}


function productDelete(ctl) {
    var id = $(ctl).val();
    $(ctl).parents("tr").remove();
    console.log(id);
    $.ajax({
        contentType: 'application/json',
        type: 'DELETE',
        url: 'http://localhost:8080/order-bill/delete/' + id,
    }).done(function (response) {
        alert("Xóa thành công");
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
         + month + '/'
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

function btnAddOnClick() {
    dialog.dialog('open');
    $("#updateBtn").hide();
    $("#saveBtn").show();
    loadElement();
}

function btnCancelOnClick() {
    dialog.dialog('close');
    dialog_detail.dialog('close');
}
function loadElement() {
    $('#companySelect').find('option').remove();
    $("#companySelect").append(new Option("All", 0));

    $('#companySelect2').find('option').remove();
    $("#companySelect2").append(new Option("All", 0));
    $.ajax({
        contentType: 'application/json',
        type: 'GET',
        url: 'http://localhost:8080/company',
    }).done(function (response) {
        for (var i = 0; i < response.length; i++) {
            var item = response[i];
            var companyId = item['id'];
            var companyName = item['name'];
            var optionText = companyName;
            $("#companySelect").append(new Option(optionText, companyId));
            $("#companySelect2").append(new Option(optionText, companyId));
        }
    }).fail(function (response) {
        console.log(response);
    });
}
