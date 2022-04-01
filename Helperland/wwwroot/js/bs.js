$(document).ready(function () {
    $("select").change(function () {
        $(this).find("option:selected").each(function () {
            var optionValue1 = $(this).attr("value1");
            if (optionValue1) {
                $(".hour").not("." + optionValue1).hide();
                $("." + optionValue1).show();
            } else {
                // $(".hour").hide();
            }
        });
    }).change();
});
$(document).ready(function () {
    $("select").change(function () {
        $(this).find("option:selected").each(function () {
            var optionValue = $(this).attr("value");
            if (optionValue) {
                $(".time").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else {
                // $(".time").hide();
            }
        });
    }).change();
});

function Tab1Click() {
  $("#tab1").addClass("active-tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tab3").removeClass("active-tab").addClass("tab");
  $("#tab4").removeClass("active-tab").addClass("tab");
  
  $("#tabContent2").hide();
  $("#tabContent3").hide();
  $("#tabContent4").hide();
  $("#tabContent1").show();
}

function Tab2Click() {
    $("#tab2").removeAttribute("onclick");
  $("#tab2").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
  $("#tab3").removeClass("active-tab").addClass("tab");
  $("#tab4").removeClass("active-tab").addClass("tab");

  $("#tabContent1").hide();
  $("#tabContent3").hide();
  $("#tabContent4").hide();
  $("#tabContent2").show();
}
function Tab3Click() {
    $("#tab3").removeAttribute("onclick");
  $("#tab3").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tab4").removeClass("active-tab").addClass("tab");

  $("#tabContent1").hide();
  $("#tabContent2").hide();
  $("#tabContent4").hide();
  $("#tabContent3").show();
    $("#divAddress").html("Loading Address view...");
      
}
function Tab4Click() {
    $("#tab4").removeAttribute("onclick");
  $("#tab4").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tab3").removeClass("active-tab").addClass("tab");

  $("#tabContent1").hide();
  $("#tabContent2").hide();
  $("#tabContent3").hide();
  $("#tabContent4").show();
}


function checkAvailabilityOfSP() {
    var spnAvailability = document.getElementById("spnCheckAvailability");
    spnAvailability.innerHTML = "";
    var zipcode = document.getElementById("txtzipcode").value.trim();
    if (zipcode.length > 0) {
        if (zipcode.length < 6) {
            spnAvailability.innerHTML = "Enter valid Postal Code!!";
        }
        else {
            $.ajax({
                type: "post",
                url: "/Home/checkAvailabilitySP",
                data: { "zipcode": zipcode },
                success: function (response) {
                    if (response) {
                        $("#tab2").addClass("active-tab");
                        $("#tab1").removeClass("active-tab").addClass("tab");
                        $("#tabContent1").hide();
                        $("#tabContent2").show();
                       
                    }
                    else {
                        spnAvailability.innerHTML = "We are not providing service in this area. We’ll notify you if any Helper would start working near your area!!";
                    }
                },
                error: function (response) {
                    alert("error: " + response.responseText);
                }
            })
        }
    }
    else {
        spnAvailability.innerHTML = "Enter Postal Code!!";
    }
}

function SaveServiceDetail() {
    getAllUserAddressesbyPostalcode();
  $("#tab3").addClass("active-tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tabContent2").hide();
  $("#tabContent4").hide();
    $("#tabContent3").show();
}
function SaveAddress() {
  $("#tab4").addClass("active-tab");
  $("#tab3").removeClass("active-tab").addClass("tab");
  $("#tabContent3").hide();
    $("#tabContent4").show();
    
    $("#confirmZipCode").html($("#txtzipcode").val());
}



function initialyExtraServices(){
  document.getElementById("ser-cabinet-selected").style.display="none";
  document.getElementById("ser-cabinet").style.display="block";
  document.getElementById("ser-fridge-selected").style.display="none";
  document.getElementById("ser-fridge").style.display="block";
  document.getElementById("ser-oven-selected").style.display="none";
  document.getElementById("ser-oven").style.display="block";
  document.getElementById("ser-laundry-selected").style.display="none";
  document.getElementById("ser-laundry").style.display="block";
  document.getElementById("ser-windows-selected").style.display="none";
  document.getElementById("ser-windows").style.display="block";
}
function selectUnselectSerCabinet(){
  if(document.getElementById("dv-ser-cabinet").classList.contains('serselected-border')){
    document.getElementById("dv-ser-cabinet").classList.remove("serselected-border");
  }
  else{
    document.getElementById("dv-ser-cabinet").classList.add("serselected-border");
  }
}
function selectUnselectSerFridge(){
  if(document.getElementById("dv-ser-fridge").classList.contains('serselected-border')){
    document.getElementById("dv-ser-fridge").classList.remove("serselected-border");
  }
  else{
    document.getElementById("dv-ser-fridge").classList.add("serselected-border");
  }
}
function selectUnselectSerOven(){
  if(document.getElementById("dv-ser-oven").classList.contains('serselected-border')){
    document.getElementById("dv-ser-oven").classList.remove("serselected-border");
  }
  else{
    document.getElementById("dv-ser-oven").classList.add("serselected-border");
  }
}
function selectUnselectSerLaundry(){
  if(document.getElementById("dv-ser-laundry").classList.contains('serselected-border')){
    document.getElementById("dv-ser-laundry").classList.remove("serselected-border");
  }
  else{
    document.getElementById("dv-ser-laundry").classList.add("serselected-border");
  }
}
function selectUnselectSerWindows(){
  if(document.getElementById("dv-ser-windows").classList.contains('serselected-border')){
    document.getElementById("dv-ser-windows").classList.remove("serselected-border");
  }
  else{
    document.getElementById("dv-ser-windows").classList.add("serselected-border");
  }
}


function getAllUserAddressesbyPostalcode() {
   
    document.getElementById("dvcontainer-useraddresses").innerHTML = "";
    document.getElementById("txtPostalCode").value = document.getElementById("txtzipcode").value;
    $.ajax({
        type: "get",
        url: "/Home/getAllUserAddressesbyPostalcode",
        data: { "postalcode": document.getElementById("txtPostalCode").value },
        dataType: "json",
        success: function (data) {
            /*if (data == "") {
                document.getElementById("btnContinuetoMakepayment").classList.add("btndisable");
                document.getElementById("btnContinuetoMakepayment").disabled = true;
            }
            
                document.getElementById("btnContinuetoMakepayment").classList.remove("btndisable");
                document.getElementById("btnContinuetoMakepayment").disabled = false;*/
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
                document.getElementById("dvcontainer-useraddresses").innerHTML = strAddresses;
            
        },
        error: function (response) {
            alert("error: " + response.responseText);
        }
    })
}



function showAddNewAddressBlock() {
    document.getElementById("btnAddNewAddress").classList.remove("d-block");
    document.getElementById("btnAddNewAddress").classList.add("d-none");
    document.getElementById("dvAddNewAddress").classList.remove("d-none");
    document.getElementById("dvAddNewAddress").classList.add("d-block");
}
function showAddNewAddressBtn() {
    document.getElementById("txtStreetName").value = "";
    document.getElementById("txtHouseNumber").value = "";
    document.getElementById("txtMobile").value = "";
    document.getElementById("spnMobile").innerHTML = "";
    document.getElementById("btnAddNewAddress").classList.remove("d-none");
    document.getElementById("btnAddNewAddress").classList.add("d-block");
    document.getElementById("dvAddNewAddress").classList.remove("d-block");
    document.getElementById("dvAddNewAddress").classList.add("d-none");
}

function saveUserNewAddress() {
    
    var count = 0;
    if (document.getElementById("txtStreetName").value.length > 0) {
        document.getElementById("spnStreetName").innerHTML = "";
        count++;
    }
    else {
        document.getElementById("spnStreetName").innerHTML = "Enter Street name!!";
        count--;
    }
    if (document.getElementById("txtHouseNumber").value.length > 0) {
        document.getElementById("spnHouseNumber").innerHTML = "";
        count++;
    }
    else {
        document.getElementById("spnHouseNumber").innerHTML = "Enter House number!!";
        count--;
    }
    if (document.getElementById("txtMobile").value.length > 0) {
        if (document.getElementById("txtMobile").value.length < 10) {
            document.getElementById("spnMobile").innerHTML = "Enter valid Mobile number!!";
            count--;
        }
        else {
            document.getElementById("spnMobile").innerHTML = "";
            count++;
        }
    }
    else {
        document.getElementById("spnMobile").innerHTML = "Enter Mobile number!!";
        count--;
    }
    if (count > 0) {
        var data = {};
        data.addressLine1 = $("#txtStreetName").val();
        data.addressLine2 = $("#txtHouseNumber").val();
        data.state = $("#selcityfornewadd").val();
        data.city = $("#selcityfornewadd").val();
        data.postalCode = $("#txtPostalCode").val();
        data.mobile = $("#txtMobile").val();
        
        $.ajax({
            type: "post",
            dataType: "JSON",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/Home/addNewAddress",
            success: function (response) {
                if (response > 0) {
                    getAllUserAddressesbyPostalcode();
                    showAddNewAddressBtn();
                }
            },
            error: function (response) {
                alert("error: " + response.responseText);
            }
        })
    }
}

function CompleteBooking() {
    var completebooking = {}
    completebooking.zipcode = $("#txtzipcode").val();
    completebooking.serviceDate = $("#StartDate").val();
    completebooking.serviceTime = $("#StartTime option:selected").text();
    totalamount = 30;
    completebooking.subtotal = totalamount;
    completebooking.totalcost = totalamount;
    completebooking.comment = $("#txtcomment").val();
    completebooking.haspets = $("#chkHasPet").prop('checked');
    completebooking.addressId = $("input[type='radio'][name='rbuseradd']:checked").val();
    $.ajax({
        url: '/Home/Completebooking',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(completebooking),
        success: function (resp) {
            if (resp) {
                showCompleteBooking(resp);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function showCompleteBooking(ServiceRequestID) {
    Swal.fire({
        icon: 'success',
        title: 'Booking has been successfully submitted!!',
        text: 'Service Request Id: ' + ServiceRequestID + "!!"
    })
        .then(function () {
        window.location = "/home/servicehistory";
    });
}