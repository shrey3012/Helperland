$(document).ready(function () {
    getSpDashboard();
    getUserDetails();
});

function getSpDashboard() {
    $.ajax({
        type: "get",
        url: "/Admin/getSpDashboard",
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
                        "<lable>&nbsp&nbsp&nbsp&nbsp&nbsp" + data[i].userName + "<br> <img src='../../img/home.png' alt=''> " + data[i].userAddress + "</lable>",
                        "<label class='spnEuro'>&euro;&nbsp;" + data[i].payment + "</label>",
                        "<div class='status-badge success'>Settled </div>",
                        "<div class='btn' onclick='chnginService(" + data[i].serviceRequestId + ");'>Edit</div>",
                        
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
        url: "/Admin/getServiceRequestDetails",
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
function getUserDetails(){
    $.ajax({
        type: "get",
        url: "/Admin/getUserDetails",
        dataType: "json",
        success: function (data) {
            var usermgmt = $('#usermgmt').DataTable();
                for (var i = 0; i < data.length; i++) {
                    var regdate = new Date(data[i].date).toLocaleDateString('en-GB');
                    usermgmt.row.add([
                        "<div>" + data[i].firstname + "</div>",
                        "<div>" + regdate + "</div>",
                        "<div>" + data[i].usertype+ "</div>",
                        "<div>" + data[i].mobile + "</div>",
                        "<div>" + data[i].postalcode + "</div>",
                        "",
                        "",
                    ]).draw(false);
                }
        },
        error: function (data) {
            alert("error: " + response.responseText);
        }
    });
}
function chnginService(serviceRequestId) {

    $.ajax({
        type: 'get',
        url: "/Admin/getServiceDetail",
        dataType: "Json",
        data: { "servicerequestid": serviceRequestId },

        success: function (data) {
            var servicedate = data[0].date;
            document.getElementById("date").innerHTML = servicedate;
            //$("#date").val(data.date);
            $("#time").val(data[0].time);
            $("#address1").val(data[0].addressLine1);
            $("#address2").val(data[0].addressLine2);
            $("#postalcode").val(data[0].postalcode);
            $("#city").val(data[0].city);
            console.log(data[0].date)
            $("#serviceRequestId").val(data[0].serviceRequestId);
            console.log(data[0].serviceRequestId)
            $('#changeReq').modal('show');
        },
        error: function (data) {
            alert("error");
        }
    });
}

function updateReq() {
    var data = {}
    data.serviceStartDate = $("#date").val();
    data.serviceStartTime = $("#time").val();
    data.addressLine1 = $("#address1").val();
    data.addressLine2 = $("#address2").val();
    data.postalcode = $("#postalcode").val();
    data.serviceRequestId = $("#serviceRequestId").val();
    data.city = $("#city").val();
    $.ajax({
        type: 'post',
        url: "/Admin/updateReq",
        dataType: "Json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (resp) {
            debugger;
            if (resp) {
                alert("Changed");
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}