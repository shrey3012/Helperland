function getAllUserAddressesbyPostalcode() {
    $.ajax({
        type: "get",
        url: "/Home/getAllUserAddresses",
        data: { "IsDefault": true },
        dataType: "json",
        success: function (data) {
            var strAddresses = "";
            var count = 0;
            $.each(data, function (i, v) {
                if (count == 0) {
                    strAddresses += "<div class='dvuseradd mb-2 px-4 py-3'><div style='float:left;' class='me-3 mt-3'><input type='radio' checked class='rbuseradd' name='rbuseradd' id='rbuseradd" + v.addressId + "' value='" + v.addressId + "' /></div><div><div><span class='fw-bold'>Address: </span>" + v.addressLine1 + " " + v.addressLine2 + ", " + v.city + " " + v.postalCode + "</div><div><span class='point fw-bold'>Phone number: </span>" + v.mobile + "</div></div></div>";
                    count++;
                }
                else {
                    strAddresses += "<div class='dvuseradd mb-2 px-4 py-3'><div style='float:left;' class='me-3 mt-3'><input type='radio' class='rbuseradd' name='rbuseradd' id='rbuseradd" + v.addressId + "' value='" + v.addressId + "' /></div><div><div><span class='fw-bold'>Address: </span>" + v.addressLine1 + " " + v.addressLine2 + ", " + v.city + " " + v.postalCode + "</div><div><span class='point fw-bold'>Phone number: </span>" + v.mobile + "</div></div></div>";
                }
            });
            document.getElementById("useraddresses").innerHTML = strAddresses;

        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function showdetails() {
    $.ajax({
        type: 'get',
        url: "/home/getUserDetails",
        dataType: "Json",
        

        success: function (data) {
            $("#firstName").val(data[0].firstName);
            $("#lastname").val(data[0].lastName);
            $("#email").val(data[0].email)
            $("#mobile").val(data[0].mobile)
        },
        error: function (data) {
            alert("error");
        }
    });

}
function updateUserDetails() {
    var data = {};
    data.firstName = $("#firstName").val();
    data.lastName = $("#lastname").val();
    data.mobile = $("#mobile").val();
    $.ajax({
        type: 'post',
        url: "/home/updateUser",
        dataType: "Json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {

        },
        error: function (resp) {
            console.log(err);
        }
    });
}
function changepwd() {
    var count = 0;
    if (document.getElementById("pwd").value.length > 0) {
        document.getElementById("pwd").innerHTML = "";
        count++;
    }
    else {
        document.getElementById("pwd").innerHTML = "Enter Old Password!!";
        count--;
    }
    if (document.getElementById("newPassword").value.length > 0) {
        document.getElementById("newPassword").innerHTML = "";
        count++;
    }
    else {
        document.getElementById("newPassword").innerHTML = "Enter New Password!!";
        count--;
    }
    if (document.getElementById("confirmPwd").value.length > 0) {
        document.getElementById("confirmPwd").innerHTML = "";
        count++;
    }
    else {
        document.getElementById("confirmPwd").innerHTML = "Enter New Password!!";
        count--;
    }
    if (document.getElementById("newPassword").value != document.getElementById("confirmPwd").value) {
        document.getElementById("confirmPwd").innerHTML = "New password & Confirm Password is not same";
        count--;
    }
    if (count == 3) {
        var data = {};
        data.password = $("#pwd").val();
        data.newPassword = $("#newPassword").val();
        data.newConfirmPassword = $("#confirmPwd").val();
        $.ajax({
            type: 'post',
            url: "/home/changePassword",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (resp) {

            },
            error: function (resp) {
                console.log(err);
            }
        })
    }
    else {
        alert("Error");
    }
}