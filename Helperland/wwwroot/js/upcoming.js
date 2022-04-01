﻿
$(document).ready(function () {
    getSpDashboard();
    upcomingSer();
    getHistory();
    BlockTab();
    
});
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
            url: "/ServiceProvider/changePassword",
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

function getSpDashboard() {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/getSpDashboard",
        dataType: "json",
        success: function (data) {
            var countForNoServiceRequestAvailable = 0;
            if (data.length == 1) {
                $.each(data, function (i, v) {
                    if (v.serviceRequestId == null) {
                        countForNoServiceRequestAvailable = 0;
                    }
                    else {
                        countForNoServiceRequestAvailable++;
                    }
                })
            }
            else {
                countForNoServiceRequestAvailable++;
            }
            var example = $('#example').DataTable();
            if (countForNoServiceRequestAvailable > 0) {
                for (var i = 0; i < data.length; i++) {
                    var serStartDate = new Date(data[i].serviceDateTime).toLocaleDateString('en-GB');
                    var serStartTime = new Date(data[i].serviceDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    var serEndTime = new Date(data[i].serviceDateTime).getHours() + data[i].serviceHours;
                    example.row.add([
                        "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                        "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'><div><img src='../../img/cal.png'><span class='fw-bold'> " + serStartDate + "</span></div><div><img src='../../img/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                        "<lable>&nbsp&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "<br> <img src='../../img/home.png' alt=''> "+ data[i].userAddress + "</lable>",
                        "<label class='spnEuro'>&euro;&nbsp;" + data[i].payment + "</label>",
                        "<div class='btn' onclick='AcceptServiceRequest(" + data[i].serviceRequestId + ");'>Accept</div>",
                    ]).draw(false);
                }
            }
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function showServiceRequestDetails(serviceRequestId) {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/getServiceRequestDetails",
        data: { "servicerequestid": serviceRequestId },
        dataType: "json",
        success: function (data) {
            var str = "";
            $.each(data, function (i, v) {
                str += "<div class='fw-bold fs2'>" + new Date(v.serviceStartDateTime).toLocaleDateString('en-GB') + " " + new Date(v.serviceStartDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + "-" +  new Date(v.serviceStartDateTime).getHours() + v.serviceDuration + "</div>";
                str += "<div><span class='fw-bold'>Duration: </span>" + v.serviceDuration + " Hrs</div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Service Id: </span>" + serviceRequestId + "</div>";
                
                str += "<div class='fw-bold'>Net Amount: <span class='dv-percleaning fs3'>" + v.serviceNetAmount + "&nbsp;&euro;</span></div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Customer Name: </span>"+ v.customerName + "</div>"
                str += "<div><span class='fw-bold'>Service Address: </span>" + v.addressLine1 + " " + v.addressLine2 + ", " + v.postalcode + " " + v.city + " " + v.state + "</div>";
                str += "<div><span class='fw-bold'>Phone: </span>" + v.mobile + "</div>";
                str += "<div><span class='fw-bold'>Email: </span>" + v.email + "</div>";
                str += "<hr/>";
                str += "<div class='fw-bold mb-1'>Comments</div>";
                if (v.hasPets) {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../img/included.png' class='me-2' />I don have pets at home</div>";
                }
                else {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../img/not-included.png' class='me-2' />I don't have pets at home</div>";
                }
                
                document.getElementById("dvServiceDetailsModalBody").innerHTML = str;
                $("#showServiceRequestDetailsModal").modal("show");
            });
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function getSpdetails() {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/getSpDetails",
        dataType: "json",
        success: function (data) {
            $("#firstName").val(data[0].firstName);
            $("#lastname").val(data[0].lastName);
            $("#email").val(data[0].email)
            $("#mobile").val(data[0].mobile)
            $("#streetName").val(data[0].streetName)
            $("#house").val(data[0].house)
            $("#postal").val(data[0].postal)
            $("#city").val(data[0].city)
            $("input[name=rbGenderSP][value=" + data[0].gender + "]").attr('checked', 'checked');
        },
        error: function (data) {
            alert("error");
        }
    })
}
function validateNewPassword() {
    document.getElementById("txtnewpwdUserchangepwd").removeAttribute("onfocusout");
    document.getElementById("txtnewpwdUserchangepwd").setAttribute("onkeyup", "validateNewPassword()");
    if (document.getElementById("txtnewpwdUserchangepwd").value.trim().length > 0) {
        if (document.getElementById("txtnewpwdUserchangepwd").value.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,14}$/) != null) {
            document.getElementById("spnnewpwdUserchangepwd").innerHTML = "";
            validateConfirmNewPassword();
            validateOldPassword();
        }
        else {
            document.getElementById("spnnewpwdUserchangepwd").innerHTML = "Password must be 6 to 14 Characters long, must contain at least one Upper case, one Lower case, one Digit and one Special character!";
        }
    }
    else {
        document.getElementById("spnnewpwdUserchangepwd").innerHTML = "Enter new password!";
    }
}
function validateConfirmNewPassword() {
    document.getElementById("txtconfirmnewpwdUserchangepwd").removeAttribute("onfocusout");
    document.getElementById("txtconfirmnewpwdUserchangepwd").setAttribute("onkeyup", "validateConfirmNewPassword()");
    if (document.getElementById("txtconfirmnewpwdUserchangepwd").value.trim().length > 0) {
        if (document.getElementById("txtconfirmnewpwdUserchangepwd").value == document.getElementById("txtnewpwdUserchangepwd").value) {
            document.getElementById("spnconfirmnewpwdUserchangepwd").innerHTML = "";
            validateOldPassword();
        }
        else {
            document.getElementById("spnconfirmnewpwdUserchangepwd").innerHTML = "Password and Confirm password must be same!";
        }
    }
    else {
        disableCustomerChangePasswordbtn();
        document.getElementById("spnconfirmnewpwdUserchangepwd").innerHTML = "Enter confirm password!";
    }
}
function validateOldPassword() {
    document.getElementById("txtoldpwdUserchangepwd").setAttribute("onkeyup", "validateOldPassword()");
    if (document.getElementById("txtoldpwdUserchangepwd").value.trim().length > 0 && document.getElementById("txtnewpwdUserchangepwd").value.trim().length > 0 && document.getElementById("txtconfirmnewpwdUserchangepwd").value.trim().length > 0 && document.getElementById("spnnewpwdUserchangepwd").innerHTML.trim().length == 0 && document.getElementById("spnconfirmnewpwdUserchangepwd").innerHTML.trim().length == 0) {
        document.getElementById("btnCusChangepassword").classList.remove("btnContinueSetupSerProcDisable");
        document.getElementById("btnCusChangepassword").disabled = false;
    }
   
}
function changeCusPassword() {
    $.ajax({
        type: "post",
        dataType: "JSON",
        url: "/ServiceProvider/checkUserPassword",
        success: function (response) {
            debugger;
            document.getElementById("spnoldpwdUserchangepwd").innerHTML = "";
            if (response.password != document.getElementById("txtoldpwdUserchangepwd").value) {
                document.getElementById("spnoldpwdUserchangepwd").innerHTML = "Incorrect old password!";
            }
            else if ($("#txtnewpwdUserchangepwd").val() != $("#txtconfirmnewpwdUserchangepwd").val()) {
                document.getElementById("spnconfirmnewpwdUserchangepwd").innerHTML = "Password & confirm password value are not same!";
            }
            else {
                updateUserPassword();
            }
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function updateUserPassword() {
    $.ajax({
        type: "post",
        dataType: "JSON",
        data: { "password": document.getElementById("txtnewpwdUserchangepwd").value.trim() },
        url: "/ServiceProvider/updateUserPassword",
        success: function (response) {
            $("#txtoldpwdUserchangepwd").val("");
            $("#txtnewpwdUserchangepwd").val("");
            $("#txtconfirmnewpwdUserchangepwd").val("");
            alert("Your Password changed Successfully");
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}

function upcomingSer() {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/UpcomingSerReq",
        dataType: "json",
        success: function (data) {
            var countForNoServiceRequestAvailable = 0;
            if (data.length == 1) {
                $.each(data, function (i, v) {
                    if (v.serviceRequestId == null) {
                        countForNoServiceRequestAvailable = 0;
                    }
                    else {
                        countForNoServiceRequestAvailable++;
                    }
                })
            }
            else {
                countForNoServiceRequestAvailable++;
            }
            var upcoming = $('#upcoming').DataTable();
            if (countForNoServiceRequestAvailable > 0) {
                for (var i = 0; i < data.length; i++) {
                    var serStartDate = new Date(data[i].serviceDateTime).toLocaleDateString('en-GB');
                    var serStartTime = new Date(data[i].serviceDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    var serEndTime = new Date(data[i].serviceDateTime).getHours() + data[i].serviceHours;
                    upcoming.row.add([
                        "<div onclick='showUpcomingRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                        "<div onclick='showUpcomingRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'><div><img src='../../img/cal.png'><span class='fw-bold'> " + serStartDate + "</span></div><div><img src='../../img/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                        "<lable>&nbsp&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "<br> <img src='../../img/home.png' alt=''> " + data[i].userAddress + "</lable>",
                        "<label class='spnEuro'>&euro;&nbsp;" + data[i].payment + "</label>",
                        "<div class='btn' onclick='canclereq(" + data[i].serviceRequestId + ");'>Cancle</div>",
                    ]).draw(false);
                }
            }
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function AcceptServiceRequest(serviceRequestId) {
    $.ajax({
        type: "post",
        url: "/ServiceProvider/AcceptService",
        dataType: "json",
        data: { 'serviceRequestId': serviceRequestId },
        success: function () {
            alert("Service has been accepted successfully.");  
            location.reload(true);
        },
        error: function () {
            alert("Error while inserting data");
        }
    });
}
function canclereq(serviceRequestId) {
    $.ajax({
        type: "post",
        url: "/ServiceProvider/CancleService",
        dataType: "json",
        data: { 'serviceRequestId': serviceRequestId },
        success: function () {
            alert("Service has been canclled successfully.");
            location.reload(true);
        },
        error: function () {
            alert("Error while inserting data");
        }
    });
}
function showUpcomingRequestDetails(serviceRequestId) {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/getUpcomingeRequestDetails",
        data: { "servicerequestid": serviceRequestId },
        dataType: "json",
        success: function (data) {
            var str = "";
            $.each(data, function (i, v) {
                str += "<div class='fw-bold fs2'>" + new Date(v.serviceStartDateTime).toLocaleDateString('en-GB') + " " + new Date(v.serviceStartDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + "-" + new Date(v.serviceStartDateTime).getHours() + v.serviceDuration + "</div>";
                str += "<div><span class='fw-bold'>Duration: </span>" + v.serviceDuration + " Hrs</div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Service Id: </span>" + serviceRequestId + "</div>";

                str += "<div class='fw-bold'>Net Amount: <span class='dv-percleaning fs3'>" + v.serviceNetAmount + "&nbsp;&euro;</span></div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Customer Name: </span>" + v.customerName + "</div>"
                str += "<div><span class='fw-bold'>Service Address: </span>" + v.addressLine1 + " " + v.addressLine2 + ", " + v.postalcode + " " + v.city + " " + v.state + "</div>";
                str += "<div><span class='fw-bold'>Phone: </span>" + v.mobile + "</div>";
                str += "<div><span class='fw-bold'>Email: </span>" + v.email + "</div>";
                str += "<hr/>";
                str += "<div class='fw-bold mb-1'>" + v.Comments + "</div>";
                if (v.hasPets) {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../images/service-history/included.png' class='me-2' />I don have pets at home</div>";
                }
                else {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../images/service-history/not-included.png' class='me-2' />I don't have pets at home</div>";
                }
                str += "<div class='btn' onclick='canclereq(" + serviceRequestId + ");'>Cancle</div>";
                str += "<div class='btn btn-success' onclick='completereq(" + serviceRequestId + ");'>Complete</div>";
                document.getElementById("dvServiceDetailsModalBody").innerHTML = str;
                $("#showServiceRequestDetailsModal").modal("show");
            });
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function completereq(serviceRequestId) {
    $.ajax({
        type: "post",
        url: "/ServiceProvider/CompleteService",
        dataType: "json",
        data: { 'serviceRequestId': serviceRequestId },
        success: function () {
            alert("Service Completed.");
            location.reload(true);
        },
        error: function () {
            alert("Error while inserting data");
        }
    });
}
function getHistory() {
    $.ajax({
        type: "get",
        url: "/ServiceProvider/getServiceHistory",
        dataType: "json",
        success: function (data) {
            var countForNoServiceRequestAvailable = 0;
            if (data.length == 1) {
                $.each(data, function (i, v) {
                    if (v.serviceRequestId == null) {
                        countForNoServiceRequestAvailable = 0;
                    }
                    else {
                        countForNoServiceRequestAvailable++;
                    }
                })
            }
            else {
                countForNoServiceRequestAvailable++;
            }
            var example = $('#history').DataTable();
            if (countForNoServiceRequestAvailable > 0) {
                for (var i = 0; i < data.length; i++) {
                    var serStartDate = new Date(data[i].serviceDateTime).toLocaleDateString('en-GB');
                    var serStartTime = new Date(data[i].serviceDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    var serEndTime = new Date(data[i].serviceDateTime).getHours() + data[i].serviceHours;
                    example.row.add([
                        "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                        "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'><div><img src='../../img/cal.png'><span class='fw-bold'> " + serStartDate + "</span></div><div><img src='../../img/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                        "<lable>&nbsp&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "<br> <img src='../../img/home.png' alt=''> " + data[i].userAddress + "</lable>",
                        
                    ]).draw(false);
                }
            }
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    });
}
function selectedAvatarImage(selectedImageId) {
    var imgs = ["img-avatar-car", "img-avatar-female", "img-avatar-hat", "img-avatar-iron", "img-avatar-male", "img-avatar-ship"];
    for (var i = 0; i < imgs.length; i++) {
        if (imgs[i] == selectedImageId) {
            document.getElementById(imgs[i]).classList.remove('unselectedAvatar');
            document.getElementById(imgs[i]).classList.add('selectedAvatar');
            document.getElementById("dvspProfile").innerHTML = "<img id='imgSPProfie' src='../../img/" + imgs[i].split('-')[1] + "-" + imgs[i].split('-')[2] + ".png' />";
        }
        else {
            document.getElementById(imgs[i]).classList.remove('selectedAvatar');
            document.getElementById(imgs[i]).classList.add('unselectedAvatar');
        }
    }
}
function BlockTab() {
    $.ajax({
        url: '/ServiceProvider/getCustomersForSPBlockedData',
        type: 'get',
        success: function (response) {
            var tblspBlockCustomer = $('#tblspBlockCustomer').DataTable();
            tblspBlockCustomer.clear().draw();
            response.forEach(function (e) {
                var strBtnBlockUnblock = "";
                if (e.blockeduser != null ) {
                    strBtnBlockUnblock = "<button class='btnratesp px-4 py-2 ' onclick='UnBlockCustomerByLoggedinSP(" + e.customeruserid + ")'>Unblock</button>";
                }
                else {
                    strBtnBlockUnblock = "<button class='tblCancel px-4 py-2 ' onclick='BlockCustomerByLoggedinSP(" + e.customeruserid + ")'>Block</button>";
                }
                tblspBlockCustomer.row.add([
                    "<img src='../../img/avatar-hat.png' />",
                    "<label class='fw-bold mt-2'>" + e.customername + "</label>",
                    strBtnBlockUnblock
                ]).draw(false);
            });
        }
    });
}
function BlockCustomerByLoggedinSP(targetuserid) {
    $.ajax({
        url: '/ServiceProvider/BlockCustomerByLoggedinSP',
        type: 'post',
        data: { 'targetuserid': targetuserid },
        success: function (response) {
            if (response > 0) {
                BlockTab();
            }
        }
    });
}
function UnBlockCustomerByLoggedinSP(targetuserid) {
    $.ajax({
        url: '/ServiceProvider/UnBlockCustomerByLoggedinSP',
        type: 'post',
        data: { 'targetuserid': targetuserid },
        success: function (response) {
            if (response > 0) {
                BlockTab();
            }
        }
    });
}
function saveSPDetails() {
    var vSPDetailsCount = 0;
    if ($("#firstName").val().trim().length > 0) {
       
        $("#spnFirstnameSPMydetails").html("");
        vSPDetailsCount++;
    }
    else {
        $("#spnFirstnameSPMydetails").html("Enter First name!!");
        vSPDetailsCount--;
    }
    if ($("#lastname").val().trim().length > 0) {
        document.getElementById("spnLastnameSPMydetails").innerHTML = "";
        vSPDetailsCount++;
    }
    else {
        
        document.getElementById("spnLastnameSPMydetails").innerHTML = "Enter Last name!!";
        vSPDetailsCount--;
    }
    if ($("#mobile").val().trim().length > 0) {
        if ($("#mobile").val().trim().length < 10) {
            document.getElementById("spnMobileSPMydetails").innerHTML = "Enter valid Phone number!!";
            vSPDetailsCount--;
        }
        else {
            
            document.getElementById("spnMobileSPMydetails").innerHTML = "";
            vSPDetailsCount++;
        }
    }
    else {
        document.getElementById("spnMobileSPMydetails").innerHTML = "Enter Phone number!!";
        vSPDetailsCount--;

    }
    if ($("#postal").val().trim().length == 0) {
        document.getElementById("spnPostalCodeSPAdd").innerHTML = "Enter valid Postal code!!";
        vSPDetailsCount--;

    }
    else if ($("#postal").val().trim().length < 6 || $("#postal").val().trim().length > 6) {
        document.getElementById("spnPostalCodeSPAdd").innerHTML = "Enter valid Postal code!!";
        vSPDetailsCount--;
    }
        else  {
            document.getElementById("spnPostalCodeSPAdd").innerHTML == ""
            vSPDetailsCount++;
        }
    if ($("#streetName").val().trim().length > 0) {

        $("#spnStreetNameSPAdd").html("");
        vSPDetailsCount++;
    }
    else {
        $("#spnStreetNameSPAdd").html("Enter Street name!!");
        vSPDetailsCount--;
    }
    if ($("#house").val().trim().length > 0) {

        $("#spnHouseNumberSPAdd").html("");
        vSPDetailsCount++;
    }
    else {
        $("#spnHouseNumberSPAdd").html("Enter House num!!");
        vSPDetailsCount--;
    }
    if ($("#city").val().trim().length > 0) {

        $("#spncity").html("");
        vSPDetailsCount++;
    }
    else {
        $("#spncity").html("Enter City Name!");
        vSPDetailsCount--;
    }
    
    
    if (vSPDetailsCount == 7) {
        var data = {};
        data.firstName = $("#firstName").val();
        data.LastName= $("#lastname").val();
        data.Email= $("#email").val();
        data.Mobile= $("#mobile").val();
        data.Gender = $('#gender:checked').val();
        data.AddressLine1 = $("#streetName").val();
        data.AddressLine2= $("#house").val();
        data.PostalCode= $("#postal").val();
        data.City= $("#city").val();
        
        if ($("#imgSPProfie").attr("src").toString().includes('..')) {
            data.SPProfilePicture = $("#imgSPProfie").attr("src").toString().split('..')[2];
        }
        else {
            data.SPProfilePicture = $("#imgSPProfie").attr('src');
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/ServiceProvider/updateSPDetails",
            success: function (response) {
                if (response) {
                    alert("Data updated successfully");
                    //$('.nav-tabs a[href="#v-pills-home-tab"]').tab('show');
                    $("#v-pills-home-tab").tab('show');
                }
            },
            error: function (response) {
                alert("error: " + response.responseText);
            }
        });
    }
}
