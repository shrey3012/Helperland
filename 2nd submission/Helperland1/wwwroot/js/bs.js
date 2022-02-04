// function setActive(linkid)
// {
//   var sidebarlinks1 = ['lnk-dashboard1', 'lnk-new-ser-req1', 'lnk-upcoming-services1', 'lnk-ser-schedule1', 'lnk-ser-history1', 'lnk-myratings1', 'lnk-block-cus1'];
//   var sidebarlinks2 = ['lnk-dashboard', 'lnk-new-ser-req', 'lnk-upcoming-services', 'lnk-ser-schedule', 'lnk-ser-history', 'lnk-myratings', 'lnk-block-cus'];
//   giveHoverEffectToLinks(sidebarlinks1);
//   giveHoverEffectToLinks(sidebarlinks2);
//   activateShowLink(linkid);
//   if(linkid.includes(1))
//     linkid=linkid.substring(0,linkid.length-1);
//   else
//     linkid+='1';
//   activateShowLink(linkid);
// }
// function giveHoverEffectToLinks(links){
//   for(i=0;i<links.length;i++)
//   { 
//     document.getElementById(links[i]).style.backgroundColor="#1d7a8c";
//     document.getElementById(links[i]).style.pointerEvents = "auto";
//     document.getElementById(links[i]).onmouseover = function() {ChangeColorBack(this.id)};  
//     document.getElementById(links[i]).onmouseout = function() {ChangeColorBack2(this.id)}; 
//   }
// }
// function activateShowLink(linkid){
//     document.getElementById(linkid).style.backgroundColor="#146371";
//     document.getElementById(linkid).style.pointerEvents = "none";
//     document.getElementById(linkid).setAttribute("onmouseover", "");
//     document.getElementById(linkid).setAttribute("onmouseout", "");
// }
// function ChangeColorBack(id)
// {
//   document.getElementById(id).style.backgroundColor="#146371";
// }
// function ChangeColorBack2(id)
// {
//   document.getElementById(id).style.backgroundColor="#1d7a8c";
// }

// document.addEventListener("click", (evt) => {
//   const navbar = document.getElementById("navbarCollapse");
//   let targetElement = evt.target;
//   do {
//       if (targetElement == navbar) {
//           return;
//       }
//       targetElement = targetElement.parentNode;
//   } while (targetElement);
//   $("#navbarCollapse").removeClass("show");
// });

// function checkForCustomerSignup(){
//   var fn=document.getElementById("txtFirstName").value.trim().length;
//   var ln=document.getElementById("txtLastName").value.trim().length;
//   var email=document.getElementById("txtEmail").value.trim().length;
//   var mbl=document.getElementById("txtMobile").value.trim().length;
//   var pwd=document.getElementById("pwd").value.trim().length;
//   var cpwd=document.getElementById("confirmpwd").value.trim().length;
//   var privacypolicy=document.getElementById("cbprivacypolicy").checked;
//   var reg=document.getElementById("sbmtcusreg");
//   if(fn>0 && ln>0 && email>0 && mbl>0 && pwd>0 && cpwd>0 && privacypolicy){
//     reg.disabled=false;
//     if(reg.classList.contains('btndisable'))
//       reg.classList.remove('btndisable');
//     reg.classList.add('btnCustomerSignup');
//   }
//   else{
//     reg.disabled=true;
//     if(reg.classList.contains('btnCustomerSignup'))
//       reg.classList.remove('btnCustomerSignup');
//     reg.classList.add('btndisable');
//   }
// }

// function showSetupServiceBlock(){
// 	var setupser=document.getElementById("lnk-setup-service");
// 	var scheduleplan=document.getElementById("lnk-schedule-plan");
//   var details=document.getElementById("lnk-details");
// 	var makepay=document.getElementById("lnk-make-payment");
//   setupser.classList.remove('nonactive-setupcleaningsertab');
//   setupser.classList.add('active-setupcleaningsertab');
//   scheduleplan.classList.remove('active-setupcleaningsertab');
//   scheduleplan.classList.add('nonactive-setupcleaningsertab');
//   details.classList.remove('active-setupcleaningsertab');
//   details.classList.add('nonactive-setupcleaningsertab');
//   makepay.classList.remove('active-setupcleaningsertab');
//   makepay.classList.add('nonactive-setupcleaningsertab');
// 	document.getElementById("dv-setup-service").style.display="block";
//   document.getElementById("dv-schedule-plan").style.display="none";
//   document.getElementById("dv-details").style.display="none";
//   document.getElementById("dv-make-payment").style.display="none";
//   document.getElementById("img-setser").style.display="none";
//   document.getElementById("img-setser-white").style.display="block";
//   document.getElementById("img-scheduleplan").style.display="block";
//   document.getElementById("img-scheduleplan-white").style.display="none";
//   document.getElementById("img-details").style.display="block";
//   document.getElementById("img-details-white").style.display="none";
//   document.getElementById("img-makepay").style.display="block";
//   document.getElementById("img-makepay-white").style.display="none";
// }
// function showSchedulePlanBlock(){
//   var setupser=document.getElementById("lnk-setup-service");
// 	var scheduleplan=document.getElementById("lnk-schedule-plan");
//   var details=document.getElementById("lnk-details");
// 	var makepay=document.getElementById("lnk-make-payment");
//   setupser.classList.remove('active-setupcleaningsertab');
//   setupser.classList.add('nonactive-setupcleaningsertab');
//   scheduleplan.classList.remove('nonactive-setupcleaningsertab');
//   scheduleplan.classList.add('active-setupcleaningsertab');
//   details.classList.remove('active-setupcleaningsertab');
//   details.classList.add('nonactive-setupcleaningsertab');
//   makepay.classList.remove('active-setupcleaningsertab');
//   makepay.classList.add('nonactive-setupcleaningsertab');
// 	document.getElementById("dv-setup-service").style.display="none";
//   document.getElementById("dv-schedule-plan").style.display="block";
//   document.getElementById("dv-details").style.display="none";
//   document.getElementById("dv-make-payment").style.display="none";
//   document.getElementById("img-setser").style.display="block";
//   document.getElementById("img-setser-white").style.display="none";
//   document.getElementById("img-scheduleplan").style.display="none";
//   document.getElementById("img-scheduleplan-white").style.display="block";
//   document.getElementById("img-details").style.display="block";
//   document.getElementById("img-details-white").style.display="none";
//   document.getElementById("img-makepay").style.display="block";
//   document.getElementById("img-makepay-white").style.display="none";
// }
// function showDetailsBlock(){
//   var setupser=document.getElementById("lnk-setup-service");
// 	var scheduleplan=document.getElementById("lnk-schedule-plan");
//   var details=document.getElementById("lnk-details");
// 	var makepay=document.getElementById("lnk-make-payment");
//   setupser.classList.remove('active-setupcleaningsertab');
//   setupser.classList.add('nonactive-setupcleaningsertab');
//   scheduleplan.classList.remove('active-setupcleaningsertab');
//   scheduleplan.classList.add('nonactive-setupcleaningsertab');
//   details.classList.remove('nonactive-setupcleaningsertab');
//   details.classList.add('active-setupcleaningsertab');
//   makepay.classList.remove('active-setupcleaningsertab');
//   makepay.classList.add('nonactive-setupcleaningsertab');
// 	document.getElementById("dv-setup-service").style.display="none";
//   document.getElementById("dv-schedule-plan").style.display="none";
//   document.getElementById("dv-details").style.display="block";
//   document.getElementById("dv-make-payment").style.display="none";
//   document.getElementById("img-setser").style.display="block";
//   document.getElementById("img-setser-white").style.display="none";
//   document.getElementById("img-scheduleplan").style.display="block";
//   document.getElementById("img-scheduleplan-white").style.display="none";
//   document.getElementById("img-details").style.display="none";
//   document.getElementById("img-details-white").style.display="block";
//   document.getElementById("img-makepay").style.display="block";
//   document.getElementById("img-makepay-white").style.display="none";
// }
// function showPaymentBlock(){
//   var setupser=document.getElementById("lnk-setup-service");
// 	var scheduleplan=document.getElementById("lnk-schedule-plan");
//   var details=document.getElementById("lnk-details");
// 	var makepay=document.getElementById("lnk-make-payment");
//   setupser.classList.remove('active-setupcleaningsertab');
//   setupser.classList.add('nonactive-setupcleaningsertab');
//   scheduleplan.classList.remove('active-setupcleaningsertab');
//   scheduleplan.classList.add('nonactive-setupcleaningsertab');
//   details.classList.remove('active-setupcleaningsertab');
//   details.classList.add('nonactive-setupcleaningsertab');
//   makepay.classList.remove('nonactive-setupcleaningsertab');
//   makepay.classList.add('active-setupcleaningsertab');
// 	document.getElementById("dv-setup-service").style.display="none";
//   document.getElementById("dv-schedule-plan").style.display="none";
//   document.getElementById("dv-details").style.display="none";
//   document.getElementById("dv-make-payment").style.display="block";
//   document.getElementById("img-setser").style.display="block";
//   document.getElementById("img-setser-white").style.display="none";
//   document.getElementById("img-scheduleplan").style.display="block";
//   document.getElementById("img-scheduleplan-white").style.display="none";
//   document.getElementById("img-details").style.display="block";
//   document.getElementById("img-details-white").style.display="none";
//   document.getElementById("img-makepay").style.display="none";
//   document.getElementById("img-makepay-white").style.display="block";
// }

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
