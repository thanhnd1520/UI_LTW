$(document).ready(function () {
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
        url: 'https://localhost:44300/api/Employees',
        method: 'GET',
        data: 'NULL',
        contentType: 'application/json'
    }).done(function (response) {
        loadData(response);
        $('#btnAdderCustomer').click(btnAddOnClick);
        $('tr').dblclick(trUpdateOnDbClick);
        $('#cancelBtn').click(btnCancelOnClick);
        //$('#updateBtn').click(btnUpdateOnClick);
        $('#saveBtn').click(btnSaveOnClick);
        
    }).fail(function (response) {

    })
})

var id;
var objectData;

function loadData(response) {
    console.log(response);
    for (var i = 0; i < response.length; i++) {
        var item = response[i];
        var employeeId = item['EmployeeId'];
        var employeeCode = item['EmployeeCode'];
        var fullName = item['FullName'];
        var genderName = getGender(item['Gender']);
        var dateOfBirth = item['DateOfBirth'];
        var phoneNumber = item['PhoneNumber'];
        var email = item['Email'];
        var position = item['PositionId'];
        var department = item['DepartmentId'];
        var salary = item['Salary'];
        var status = item['StatusJob'];
        var statusJob = getStatusJob(status);

        var date = getDate(dateOfBirth);
        var trHTML = `<tr id="${employeeId}">
                        <td>${employeeCode}</td>
                        <td>${fullName}</td>
                        <td>${genderName}</td>
                        <td>${date}</td>
                        <td>${phoneNumber}</td>
                        <td>${email}</td>
                        <td>${position}</td>
                        <td>${department}</td>
                        <td>${salary}</td>
                        <td>${statusJob}</td>
                        <td><Button id="deleteBtn">Xóa</Button></td>
                     </tr>`
        $('#tbListData tr:last').after(trHTML);
    }
}

function trUpdateOnDbClick() {
    dialog.dialog('open');
    $("#saveBtn").hide();
    $("#updateBtn").show();
    id = $(this).attr('id');
   
}

function btnSaveOnClick() {
    
    objectData = getDataDialog();
    $.ajax({
        data: JSON.stringify(objectData),
        contentType: 'application/json',
        type: 'POST',
        url: 'https://localhost:44300/api/Employees',
    }).done(function (response) {
        console.log(response);
    }).fail(function (response) {
        console.log(response);
    })
}

function btnUpdateOnClick() {
    objectData = getDataDialog();
}

function getDataDialog() {
    var check = true;
    var employeeCode = $('#employeeCodeIN').val();
    var fullName = $('#salaryIN').val();
    var genderName = $('#genderIN').val();
    var dateOfBirth = $('#dateOfBirthIN').val();
    var phoneNumber = $('#phoneNumberIN').val();
    var email = $('#emailIN').val();
    var position = $('#positionIN').val();
    var department = $('#departmentIN').val();
    var salary = $('#salaryIN').val();
    var status = $('#statusJobIN').val();
    var identityCardCode = $('#identityCardCodeIN').val();
    var identityCardDate = $('#identityCardDateIN').val();
    var identityCardPalce = $('#identityCardPalceIN').val();
    var taxCode = $('#textCodeIN').val();
    if (employeeCode == "") {
        dialog1.after("Mã nhân viên không được để trống \n");
        check = false;
    }
    if (fullName == "") {
        dialog1.after("Họ và tên không được để trống \n"); check = false;
    }
    if (identityCardCode == "") {
        dialog1.after("CMTDN/Căn cước không được để trống \n"); check = false;
    }
    if (email == "") {
        dialog1.after("Email không được để trống \n"); check = false;
    }
    if (phoneNumber == "") {
        dialog1.after("Số điện thoại không được để trống \n"); check = false;
    }
    if (check == false) {
        dialog1.dialog("open");
        return;
    }
    var Data = {
        "EmployeeId": id,
        "EmployeeCode": employeeCode,
        "FullName": fullName,
        "GenderName": genderName,
        "DateOfBirth": dateOfBirth,
        "PhoneNumber": phoneNumber,
        "Email": email,
        "Position": position,
        "Department": department,
        "Salary": salary,
        "StatusJob": status,
        "IdentityCardCode": identityCardCode,
        "IdentityCardDate": identityCardDate,
        "IdentityCardPalce": identityCardPalce,
        "TaxCode": taxCode
    };
    console.log(Data);
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
}

function btnCancelOnClick() {
    
    dialog.dialog('close');
}
