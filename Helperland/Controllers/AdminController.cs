using Helperland.Core;
using Helperland.Data;
using Helperland.Enums;
using Helperland.Models;
using Helperland.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;


namespace Helperland.Controllers
{
    public class AdminController : Controller
    {
        private readonly HelperLandContext helperLandContext;
        private readonly IConfiguration configuration;

        public AdminController(HelperLandContext helperLandContext, IConfiguration configuration)
        {
            this.helperLandContext = helperLandContext;
            this.configuration = configuration;
        }

        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("UserType") == (int)UserTypeIdEnum.Admin)
                return View();
            else
                return RedirectToAction("index", "home");
            
        }
        public JsonResult getSpDashboard()
        {
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          
                          where (int?)cs.UserTypeId == 2 
                          select new
                          {
                              ServiceRequestId = (int?)sr.ServiceRequestId,
                              ServiceDateTime = (DateTime?)sr.ServiceStartDate,
                              UserName = cs.FirstName + " " + cs.LastName,
                              UserAddress = sp.AddressLine1 + " " + sp.AddressLine2 + "<br>&nbsp&nbsp&nbsp&nbsp " + sp.City + " " + sp.State + " " + sp.PostalCode,
                              Payment = (int?)sr.TotalCost,
                              ServiceHours = (decimal?)sr.ServiceHours
                          }).ToList();
            return Json(result);
        }
        public JsonResult getServiceRequestDetails(int servicerequestid)
        {
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()

                          where sr.ServiceRequestId == servicerequestid
                          select new
                          {
                              ServiceStartDateTime = sr.ServiceStartDate,
                              ServiceDuration = sr.ServiceHours,
                              ServiceNetAmount = sr.TotalCost,
                              Comments = sr.Comments,
                              HasPets = sr.HasPets,
                              AddressId = sp.Id,
                              AddressLine1 = sp.AddressLine1,
                              AddressLine2 = sp.AddressLine2,
                              City = sp.City,
                              State = sp.State,
                              Postalcode = sp.PostalCode,
                              Mobile = sp.Mobile,
                              Email = cs.Email,
                              customerName = cs.FirstName + " " + cs.LastName,
                          }).ToList();
            return Json(result);
        }
        public JsonResult getUserDetails()
        {
            var result = (from cs in helperLandContext.Users
                          where cs.UserTypeId != 1
                          select new
                          {
                              firstname = cs.FirstName + " " + cs.LastName,
                              date = cs.CreatedDate,
                              usertype = cs.UserTypeId,
                              mobile = cs.Mobile,
                              postalcode = cs.ZipCode,
                          }).ToList();
            return Json(result);
        }

        public JsonResult getServiceDetail(int servicerequestid)
        {
            
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          
                          where sr.ServiceRequestId == servicerequestid
                          select new
                          {
                              date = sr.ServiceStartDate.ToLongTimeString(),
                              time = sr.ServiceStartDate.ToString("HH:mm"),
                              AddressId = sp.Id,
                              AddressLine1 = sp.AddressLine1,
                              AddressLine2 = sp.AddressLine2,
                              City = sp.City,
                              Postalcode = sp.PostalCode,
                              ServiceRequestId = sp.ServiceRequestId,
                          }).ToList();
            return Json(result);
        }
        [HttpPost]
        public JsonResult updateReq([FromBody] UpdateByAdminViewModel model)
        {
            ServiceRequest serviceRequest = helperLandContext.ServiceRequests.Where(s => s.ServiceRequestId == model.serviceRequestId).FirstOrDefault();
            if (serviceRequest != null)
            {
                serviceRequest.ServiceStartDate = Convert.ToDateTime(model.serviceStartDate.ToString().Trim() + " " + model.serviceStartTime.ToString().Trim());
                serviceRequest.ZipCode = model.postalCode;
                serviceRequest.ModifiedDate = DateTime.Now;
            }
            helperLandContext.ServiceRequests.Update(serviceRequest);
            ServiceRequestAddress serviceRequestAddress = helperLandContext.ServiceRequestAddresses.Where(a => a.ServiceRequestId == model.serviceRequestId).FirstOrDefault();
            if (serviceRequestAddress != null)
            {
                serviceRequestAddress.AddressLine1 = model.addressLine1;
                serviceRequestAddress.AddressLine2 = model.addressLine2;
                serviceRequestAddress.City = model.city;
                serviceRequestAddress.PostalCode = model.postalCode;
            }
            helperLandContext.ServiceRequestAddresses.Update(serviceRequestAddress);
            var emails = (from sr in helperLandContext.ServiceRequests
                          join u in helperLandContext.Users on sr.UserId equals u.UserId
                          join sp in helperLandContext.Users on sr.ServiceProviderId equals sp.UserId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where sr.ServiceRequestId == model.serviceRequestId
                          select new
                          {
                              customerEmail = u.Email,
                              serviceProviderEmail = sp.Email,
                              availableSps = (helperLandContext.Users.Where(u => u.ZipCode == sr.ZipCode && u.IsApproved == true && u.UserTypeId == (int)UserTypeIdEnum.ServiceProvider).Select(u => u.Email).AsNoTracking().ToList())
                          }).AsNoTracking().ToList();
            EmailModel emailModel = new EmailModel();
            string stremails = "";
            foreach (var e in emails)
            {
                stremails += e.customerEmail;
                if (e.serviceProviderEmail != null)
                {
                    stremails += "," + e.serviceProviderEmail;
                }
                else
                {
                    foreach (var sps in e.availableSps)
                    {
                        stremails += "," + sps;
                    }
                }
            }
            emailModel.To = stremails;
            emailModel.Subject = "Service Request Reschedule by Admin!";
            emailModel.Body = "Service ID: <strong>" + model.serviceRequestId + "</strong><br/><br/><strong>Updated Data:</strong><br/>Service Date & Time: <strong>" + model.serviceStartDate + " " + model.serviceStartTime + "</strong><br/>Service Address:<br/><strong>" + model.addressLine1 + " " + model.addressLine2 + ",<br/>" + model.city + "-" + model.state + " " + model.postalCode + "</strong>";
            MailHelper mailhelper = new MailHelper(configuration);
            mailhelper.Send(emailModel);
            helperLandContext.SaveChanges();
            return Json(model);
        }
    }
}
