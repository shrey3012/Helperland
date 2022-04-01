$(document).ready(function () {
    getcustomerdashboard();
    getCustomerServiceHistory();
});
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
    var count = 0;
    if (!document.getElementById("firstName").value) {
        document.getElementById("txtfirstname").innerHTML = "First name required !";
        count--;
    }
    else {
        document.getElementById("txtfirstname").innerHTML = "";
        count++;
    }
    if (!document.getElementById("lastname").value) {
        document.getElementById("txtlastname").innerHTML = "Last name required !";
        count--;
    }
    else {
        document.getElementById("txtlastname").innerHTML = "";
        count++;
    }
    if (!document.getElementById("mobile").value) {
        document.getElementById("txtmobile").innerHTML = "Mobile number required !";
        count--;
    }
    else {
        document.getElementById("txtmobile").innerHTML = "";
        count++;
    }

    if (count == 3) {
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
                alert("Data Updated Successfully");
            },
            error: function (resp) {
                console.log(err);
            }
        });
    }
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
        url: "/Home/checkUserPassword",
        success: function (response) {
            document.getElementById("spnoldpwdUserchangepwd").innerHTML = "";
            if (response.password == document.getElementById("txtoldpwdUserchangepwd").value) {
                updateUserPassword();
            }
            else {
                document.getElementById("spnoldpwdUserchangepwd").innerHTML = "Incorrect old password!";
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
        url: "/Home/updateUserPassword",
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
function getcustomerdashboard() {
    $.ajax({
        type: "get",
        url: "/Home/GetCustomerDashboard",
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
            var custdashboard = $('#custdashboard').DataTable();
            custdashboard.clear().draw();
            if (countForNoServiceRequestAvailable > 0) {
                for (var i = 0; i < data.length; i++) {
                    var serStartDate = new Date(data[i].serviceDateTime).toLocaleDateString('en-GB');
                    var serStartTime = new Date(data[i].serviceDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    var serEndTime = new Date(data[i].serviceDateTime).getHours() + data[i].serviceHours;
                    var serProviderName = "";
                    if (data[i].serviceProviderId != null) {
                        serProviderName = data[i].serviceProviderName;
                        /*serProviderProfile = "<img src='../../images/service-history/imghatprofile.png'>";*/
                        /*if (data[i].spRate.length > 0) {
                            for (var j = 0; j < data[i].spRate.length; j++) {
                                spRate += data[i].spRate[j];
                            }
                            spRate = (spRate / data[i].spRate.length).toFixed(1);
                            serProviderRateImages = getSPRateImages(spRate);
                        }*/
                        custdashboard.row.add([
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'><div><img src='../../img/cal.png' alt=''><span class='d-none'>" + new Date(data[i].serviceDateTime).getFullYear().toString() + ((new Date(data[i].serviceDateTime).getMonth() + 1).toString()) + (new Date(data[i].serviceDateTime).getDate().toString()) + "</span><span class='fw-bold'>" + serStartDate + "</span></div><div><img src='../../img/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                            "<div class='media-object'><div class='float-start dvProimgContainer d-flex justify-content-center align-items-center me-2'></div><div><label>" + serProviderName + "</label><div class='d-flex align-items-center'><label class='ps-2'></label></div></div></div>",
                            "<label class='payment'>&euro;&nbsp;" + data[i].payment + "</label>",
                            "<a href='#' class='resbtn' onclick='rescheduleServiceRequest(" + data[i].serviceRequestId +  ", " + data[i].serviceProviderId + " );'>Reschedule</a><a href='#' class='canclebtn' onclick='cancelServiceRequest(" + data[i].serviceRequestId + ");'>Cancel</a>"
                        ]).draw(false);
                    }
                    else {
                        custdashboard.row.add([
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 1 + ");' class='onHover'><div><img src='../../img/cal.png' alt=''><span class='d-none'>" + new Date(data[i].serviceDateTime).getFullYear().toString() + ((new Date(data[i].serviceDateTime).getMonth() + 1).toString()) + (new Date(data[i].serviceDateTime).getDate().toString()) + "</span> <span class='fw-bold'>" + serStartDate + "</span></div><div><img src='../../img/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                            "",
                            "<label class='payment'>&euro;&nbsp;" + data[i].payment + "</label>",
                            "<a href='#' class='resbtn' onclick='rescheduleServiceRequest(" + data[i].serviceRequestId + ", " + data[i].serviceProviderId + " );'>Reschedule</a><a href='#' class='canclebtn' onclick='cancelServiceRequest(" + data[i].serviceRequestId + ");'>Cancel</a>"
                        ]).draw(false);
                    }
                }
            }
        },
        error: function (response) {
            $("#dvLoader").removeClass("is-active");
            console.log("service_history.js->getCustomerDashboardData error: " + response.responseText);
        }
    });

}
function showServiceRequestDetails(serviceRequestId) {
    $.ajax({
        type: "get",
        url: "/home/getServiceDetails",
        data: { "servicerequestid": serviceRequestId },
        dataType: "json",
        success: function (data) {
            var str = "";
            
            $.each(data, function (i, v) {
                str += "<div class='fw-bold fs2'>" + new Date(v.serviceStartDateTime).toLocaleDateString('en-GB') + " " + new Date(v.serviceStartDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + "</div>";
                str += "<div><span class='fw-bold'>Duration: </span>" + v.serviceDuration + " Hrs</div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Service Id: </span>" + serviceRequestId + "</div>";
                
                str += "<div class='fw-bold'>Net Amount: <span class='dv-percleaning fs3'>" + v.serviceNetAmount + "&nbsp;&euro;</span></div>";
                str += "<hr/>";
                str += "<div><span class='fw-bold'>Service Address: </span>" + v.addressLine1 + " " + v.addressLine2 + ", " + v.postalcode + " " + v.city + " " + v.state + "</div>";
                str += "<div><span class='fw-bold'>Billing Address: </span>Same as cleaning Address</div>";
                str += "<div><span class='fw-bold'>Phone: </span>" + v.mobile + "</div>";
                str += "<hr/>"; 
                str += "<div class='fw-bold mb-1'>Comments</div>";
                if (v.hasPets) {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../img/included.png' class='me-2' />I do have pets at home</div>";
                }
                else {
                    str += "<div class='d-flex justify-align-center align-items-center'><img src='../../img/not-included.png' class='me-2' />I don't have pets at home</div>";
                }
                    str += "<hr/>";
                str += "<button class='canclebtn' onclick='cancelServiceRequest(" + serviceRequestId + ")'><span class='d-flex justify-align-center align-items-center'>Cancel</span></button></div>";
                
                document.getElementById("dvServiceDetailsModalBody").innerHTML = str;
                $("#showServiceRequestDetailsModal").modal("show");
            });
        },
        error: function (response) {
            console.log("error: " + response.responseText);
        }
    });
}
function getCustomerServiceHistory() {
    $.ajax({
        type: "get",
        url: "/home/getCustomerServiceHistory",
        dataType: "json",
        success: function (data) {
            var countForNoServiceHistoryAvailable = 0;
            if (data.length == 1) {
                $.each(data, function (i, v) {
                    if (v.serviceRequestId == null) {
                        countForNoServiceHistoryAvailable = 0;
                    }
                    else {
                        countForNoServiceHistoryAvailable++;
                    }
                })
            }
            else {
                countForNoServiceHistoryAvailable++;
            }
            var serviceHistory = $('#serviceHistory').DataTable();
            serviceHistory.clear().draw();
            if (countForNoServiceHistoryAvailable > 0) {
                for (var i = 0; i < data.length; i++) {
                    var serStartDate = new Date(data[i].serviceDateTime).toLocaleDateString('en-GB');
                    var serStartTime = new Date(data[i].serviceDateTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                    var serEndTime = new Date(data[i].serviceDateTime).getHours() + data[i].serviceHours;
                    var serProviderName = "";
                    var statusCol = "";
                    var spRateBtnCol = "";
                    if (data[i].serviceProviderId != null) {
                        serProviderName = data[i].serviceProviderName;
                      
                        if (data[i].serviceStatus == 3) {
                            statusCol = "<label class='status-badge danger py-1 px-3'>Cancelled</label>";
                        }
                        else if (data[i].serviceStatus == 1) {
                            statusCol = "<label class='status-badge success py-1 px-3'>Completed</label>";
                            spRateBtnCol = "<a href='#' class='btn ' onclick='openRateSPModal(" + data[i].serviceRequestId + ", " + data[i].serviceProviderId + ", " + "\"" + "" + serProviderName + " " + "\"" + ")'>Rate SP</a>";
                        }
                        serviceHistory.row.add([
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 0 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 0 + ");' class='onHover'><div><img src='../../img/cal.png' alt=''><span class='d-none'>" + new Date(data[i].serviceDateTime).getFullYear().toString()  + "</span> <span class='fw-bold'>" + serStartDate + "</span></div><div><img src='../../images/upcoming-service/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                            "<div class='media-object'><div class='float-start dvProimgContainer d-flex justify-content-center align-items-center me-2'></div><div><label>" + serProviderName + "</label><div class='d-flex align-items-center'><label class='ps-2'></label></div></div></div>",
                            "<label class='payment'>&euro;&nbsp;" + data[i].payment + "</label>",
                            statusCol,
                            spRateBtnCol
                        ]).draw(false);
                    }
                    else {
                        statusCol = "<label class='status-badge danger py-1 px-3'>Cancelled</label>";
                       
                        serviceHistory.row.add([
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 0 + ");' class='onHover'>" + data[i].serviceRequestId + "</div>",
                            "<div onclick='showServiceRequestDetails(" + data[i].serviceRequestId + ", " + 0 + ");' class='onHover'><div><img src='../../img/cal.png' alt=''><span class='d-none'>" + new Date(data[i].serviceDateTime).getFullYear().toString() + "</span> <span class='fw-bold'>" + serStartDate + "</span></div><div><img src='../../images/upcoming-service/clock.png' alt=''> " + serStartTime + " - " + serEndTime + "</div></div>",
                            "",
                            "<label class='payment'>&euro;&nbsp;" + data[i].payment + "</label>",
                            statusCol,
                            spRateBtnCol
                        ]).draw(false);
                    }
                }
            }
        },
        error: function (response) {
            console.log("error: " + response.responseText);
        }
    });
}
function cancelServiceRequest(serviceRequestId) {
    $.ajax({
        type: "post",
        dataType: "JSON",
        data: { "servicerequestid": serviceRequestId },
        url: "/Home/cancelServiceRequest",
        success: function (response) {
            debugger;
            if (response > 0) {
                alert("Deleted");
                getcustomerdashboard();
                getCustomerServiceHistory();
                $("#showServiceRequestDetailsModal").modal("hide");
            }
        },
        error: function (response) {
            console.log(" error: " + response.responseText);
        }
    });
}
function rescheduleServiceRequest(serviceRequestId, serviceProviderId) {
    document.getElementById("hdnServiceRequestIdOfRescheduleSR").value = serviceRequestId;
    document.getElementById("hdnServiceProviderIdOfRescheduleSR").value = serviceProviderId;
    $("#rescheduleServiceRequestModal").modal("show");
}
function rescheduleService() {
    var data = {};
    data.ServiceRequestId = document.getElementById("hdnServiceRequestIdOfRescheduleSR").value;
    data.ServiceStartDate = document.getElementById("dtRescheduleDateForService").value;
    if (document.getElementById("selRescheduleTimeForService").value.includes(".")) {
        data.ServiceStartTime = document.getElementById("selRescheduleTimeForService").value.split('.')[0] + ":30";
    }
    else {
        data.ServiceStartTime = document.getElementById("selRescheduleTimeForService").value + ":00";
    }
    $.ajax({
        type: "post",
        dataType: "JSON",
        data: JSON.stringify(data),
        contentType: "application/json",
        url: "/home/updateServiceRequest",
        success: function (response) {
            $("#dvLoader").removeClass("is-active");
            if (response > 0) {
                alert("Updated");
                getcustomerdashboard();
            }
        },
        error: function (response) {
            console.log("error: " + response.responseText);
        }
    });
}