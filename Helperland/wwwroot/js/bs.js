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
  $("#tab3").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tab4").removeClass("active-tab").addClass("tab");

  $("#tabContent1").hide();
  $("#tabContent2").hide();
  $("#tabContent4").hide();
  $("#tabContent3").show();
  $("#divAddress").html("Loading Address view...")
      ;
}
function Tab4Click() {
  $("#tab4").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tab3").removeClass("active-tab").addClass("tab");

  $("#tabContent1").hide();
  $("#tabContent2").hide();
  $("#tabContent3").hide();
  $("#tabContent4").show();
}
/*function SearchZipCode() {
  $("#tab2").addClass("active-tab");
  $("#tab1").removeClass("active-tab").addClass("tab");
    $("#tabContent1").hide();
    $("#tabContent2").show();
    *//*var pin = document.getElementbyId("enterZipcode")
    if (pin.length > 0) {
        if (pin.length < 6) {
            pin.innerHTML = "Enter valid potalcode";
        }
        else {
            $.ajax({
                type: "post",
                url: '@Url.Action("Searchzipcode","Home")',
                data: { '$("#ZipCode").val()' },
                success: function (response) {
                    showtabContent2();
                }
            })
        }
    }*//*
}*/

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
                        spnAvailability.innerHTML = "We are not providing service in this area. We�ll notify you if any Helper would start working near your area!!";
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
  $("#tab3").addClass("active-tab");
  $("#tab2").removeClass("active-tab").addClass("tab");
  $("#tabContent2").hide();
  $("#tabContent4").hide();
  $("#tabContent3").show();

  $("#divAddress").html("Loading Address view...")
      .load('@Url.Action("GetAddress", "BookServiceRequest")');
}
function SaveAddress() {
  $("#tab4").addClass("active-tab");
  $("#tab3").removeClass("active-tab").addClass("tab");
  $("#tabContent3").hide();
  $("#tabContent4").show();
    $("#confirmZipCode").html($("#txtzipcode").val());
}

/*function CompleteBooking() {
  
    var booking = {};
    
  booking.zipCode = $("#ZipCode").val();
  booking.bookingStartTime = $("#StartDate").val() + " " + $("#StartTime").val();
  booking.hours = $("#Hours").val();
    booking.address1 = $("#Address1").val();
    booking.SubTotal = 50;
    booking.TotalCost = 50;
    booking.PaymentDue = 0;
    booking.CreatedDate = Date.now();
    booking.ModifiedDate = Date.now();
    booking.Distance = 10;
   

  $.ajax({
      url: '@Url.Action("booking", "Home")',
      type: 'post',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(booking),
      success: function (resp) {
         
          $("#successMessage").show();
          var html = "<br/><br/>Congratulations!<br/> Your Booking hass been confirmed for <br/><b>Service Date</b>: " + resp.Result.bookingStartTime + "<br/>" +
              "<b>Service Hours</b>: " + resp.Result.hours + "<br/>" +
              "<b>Zip Code</b>: " + resp.Result.zipCode + "<br/>";
          $("#successMessage").html(html).fadeOut(7000);
      }
      error: function (err) {
          
          alert(err.responseText);
      }
  });
}*/


function CompleteBooking() {
    Swal.fire({
        icon: 'success',
        title: 'Booking has been successfully submitted!!',
       
    });
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
        var data = {
            addressLine1: document.getElementById("txtStreetName").value,
            addressLine2: document.getElementById("txtHouseNumber").value,
            state: document.getElementById("selcityfornewadd").value,
            city: document.getElementById("selcityfornewadd").value,
            postalCode: document.getElementById("txtPostalCode").value,
            mobile: document.getElementById("txtMobile").value
        };
        $.ajax({
            type: "post",
            dataType: "JSON",
            data: JSON.stringify(data),
            contentType: "application/json",
            url: "/Home/addNewAddress",
            success: function (response) {
                if (response > 0) {
                    showAddNewAddressBtn();
                }
            },
            error: function (response) {
                alert("error: " + response.responseText);
            }
        })
    }
}