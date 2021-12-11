$(document).ready(function () {
    console.log("get data");
    dialog = $(".dialog_detail").dialog({
        autoOpen: false,
        width: 1000,
        modal: true
    }),
        dialog1 = $(".dialog_daywork").dialog({
            autoOpen: false,
            modal: true,
            width: 900,
            height: 300
        });
    $.ajax({
        url: 'http://localhost:8080/salary/all',
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
        var salaryId = item['id'];
        var salaryCode = item['codeStaff'];
        var salaryName = item['name'];
        var salaryLevel = item['level'];
        var salaryPosition = item['position'];
        var salaryTotal = item['salaryTotal'];
        var salaryMonth = getDate(item['month']);

        console.log(salaryId);
        var trHTML = `<tr id="${salaryId}" value=${salaryId} ondblclick='trUpdateOnDbClick(${salaryId})' >
                        <td>${salaryCode}</td>
                        <td>${salaryName}</td>
                        <td>${salaryLevel}</td>
                        <td>${salaryPosition}</td>
                        <td>${salaryTotal}</td>
                        <td>${salaryMonth}</td>
                        <td><Button id="deleteBtn" value=${salaryId} onclick='productDelete(this);'>Xóa</Button></td>
                     </tr>`
        $('#tbListData tbody').append(trHTML);
    }
}

function trUpdateOnDbClick(ctl) {
    dialog1.dialog('open');
    document.getElementById('updateBtn').value = ctl;
    $('#tbListDataDayWork tbody').empty();
    $.ajax({
        url: 'http://localhost:8080/salary/' + ctl,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        var item = response[0];
        var staffBillId = item["staffBill"]["id"];
        console.log(staffBillId);
        getDayWork(staffBillId);
    }).fail(function (response) {

    })
    
}
function getDayWork(id) {
    $.ajax({
        url: 'http://localhost:8080/salary/daywork/' + id,
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        console.log(response);
        var list = response["listDayWorks"];
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var dayWorkId = item["id"];
            var dayWorkDate = getDate(item["date"]);

            var trHTML = `<tr id="${dayWorkId}" value=${dayWorkId} ondblclick='trUpdateOnDbClick(${dayWorkId})' >
                        <td>${dayWorkId}</td>
                        <td>${dayWorkDate}</td>
                     </tr>`
            $('#tbListDataDayWork tbody').append(trHTML);
        }
        $('#cancelBtn').click(btnCancelOnClick);
    }).fail(function (response) {

    })
}
function search() {
    var key = $('#searchService').val();

    if (!key) {
        $('#tbListData tbody').empty();
        $.ajax({
            url: 'http://localhost:8080/salary/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else if (key === "") {
        console.log("abc")
        $('#tbListData tbody').empty();
        $.ajax({
            url: 'http://localhost:8080/salary/all',
            method: 'GET',
            data: 'NULL',
            contentType: 'application/json'
        }).done(function (response) {
            loadData(response);
        }).fail(function (response) {

        })
    } else {
        $('#tbListData tbody').empty();
        $.ajax({
            url: 'http://localhost:8080/salary/filter/' + key,
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
        url: 'http://localhost:8080/salary/salaryByMonth',
    }).done(function (response) {
        $('#tbListData tbody').empty();
        $.ajax({
            url: 'http://localhost:8080/salary/all',
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
    dialog.dialog('close');
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
    var staffBuildingCode = $('#staffBuildingCode').val();
    var month = $('#month').val();
    var year = $('#year').val();
  


    var Data = {
        "id": staffBuildingCode,
        "month": month,
        "year": year,
 
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

   // dialog.dialog('close');
    dialog1.dialog('close');
}