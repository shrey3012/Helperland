using Helperland.Data;
using Helperland.Enums;
using Helperland.Models;
using Helperland.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Controllers
{
    public class ServiceProviderController : Controller
    {
        private readonly HelperLandContext helperLandContext;
        private User _user;
        private ServiceRequest _serviceprovider;

        public ServiceProviderController(HelperLandContext helperLandContext)
        {
            this.helperLandContext = helperLandContext;
        }
        public IActionResult becomeaprovider()
        {
            return View();
        }
        [HttpPost]
        public IActionResult becomeaprovider(SignupViewModel model)
        {

                if (ModelState.IsValid)
                {
                    User user = new User
                    {
                        FirstName = model.firstname,
                        LastName = model.lastname,
                        Email = model.email,
                        Mobile = model.mobile,
                        Password = model.password,
                        CreatedDate = DateTime.Now,
                        UserTypeId = (int)UserTypeIdEnum.ServiceProvider,
                        IsApproved = true,
                        ModifiedBy = (int)UserTypeIdEnum.ServiceProvider,
                        ModifiedDate = DateTime.Now
                    };
                    helperLandContext.Add(user);
                    helperLandContext.SaveChanges();
                    TempData["msg"] = "Registration completed Successfully!";
                    return RedirectToAction("becomeaprovider", "ServiceProvider");
                }
            
            
            return View();
        }
        public IActionResult upcomingservice()
        {
            if (HttpContext.Session.GetInt32("UserType") == (int)UserTypeIdEnum.ServiceProvider)
            {
                ViewBag.UserName = HttpContext.Session.GetString("UserName");
                return View();
            }               
            else
                return RedirectToAction("index", "home");
        }
        public int getLoggedinUserId()
        {
            if (HttpContext.Request.Cookies["UserId"] != null)
                return Int32.Parse(HttpContext.Request.Cookies["UserId"]);
            else
                return (int)HttpContext.Session.GetInt32("UserId");
        }
       

        [HttpPost]
        public JsonResult changePassword([FromBody] ChangePwdViewModel model)
        {
            var user = HttpContext.Session.GetInt32("UserId");
            _user = helperLandContext.Users.Where(x => x.UserId == user).AsNoTracking().First();
            if (ModelState.IsValid)
            {
                if (_user.Password == model.password)
                {
                    _user.Password = model.newPassword;
                    helperLandContext.Users.Update(_user);
                    helperLandContext.SaveChanges();
                }
                else
                {
                    TempData["errMsg"] = "Invalid Password";
                }
            }
            return Json(model);
        }
        [HttpGet]
        public JsonResult getSpDashboard()
        {
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where( (int?)cs.UserTypeId == 2 && sr.ServiceProviderId == null)
                          select new
                          {
                              ServiceRequestId = (int?)sr.ServiceRequestId,
                              ServiceDateTime = (DateTime?)sr.ServiceStartDate,
                              UserName = cs.FirstName + " " + cs.LastName,
                              UserAddress = sp.AddressLine1+ " "+ sp.AddressLine2+ "<br>&nbsp&nbsp&nbsp&nbsp " + sp.City + " " +sp.State + " " +sp.PostalCode,
                              Payment = (int?)sr.TotalCost,
                              ServiceHours = (decimal?)sr.ServiceHours
                              // SPRate = helperLandContext.Ratings.Where(x => x.RatingTo == (int?)sp.UserId).Select(z => z.Ratings).AsEnumerable()
                          }).ToList();
            return Json(result);
        }
        [HttpGet]
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
                              customerName = cs.FirstName +" "+cs.LastName,
                          }).ToList();
            return Json(result);
        }
        public JsonResult getSpDetails()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.UserAddresses on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          where cs.UserId == user
                          select new
                          {
                              firstName = cs.FirstName,
                              lastName = cs.LastName,
                              mobile = cs.Mobile,
                              email = cs.Email,
                              gender = cs.Gender,
                              streetName = sr.AddressLine1,
                              house = sr.AddressLine2,
                              postal = sr.PostalCode,
                              city = sr.City
                          });
            return Json(result);
        }
        [HttpPost]
        public JsonResult checkUserPassword()
        {
            var x = helperLandContext.Users.Where(p => p.UserId == getLoggedinUserId()).FirstOrDefault();
            return Json(x);
        }

        [HttpPost]
        public JsonResult updateUserPassword(string password)
        {
            var userid = HttpContext.Session.GetInt32("UserId");
            User user = helperLandContext.Users.Where(u => u.UserId == userid).FirstOrDefault();
            if (user != null)
            {
                user.Password = password;
            }
            helperLandContext.Users.Update(user);
            helperLandContext.SaveChanges();
            return Json(password);
        }
        public JsonResult UpcomingSerReq()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where( (int?)cs.UserTypeId == 2 && sr.ServiceProviderId == user && sr.Status != 1)
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
        public JsonResult AcceptService(int serviceRequestId)
        {
            var user = HttpContext.Session.GetInt32("UserId");
            _serviceprovider = helperLandContext.ServiceRequests.Where(x=>x.ServiceRequestId == serviceRequestId).AsNoTracking().First();
            _serviceprovider.ServiceProviderId = user;
            _serviceprovider.SpacceptedDate = DateTime.Now;
            helperLandContext.ServiceRequests.Update(_serviceprovider);
            helperLandContext.SaveChanges();
            return Json(serviceRequestId);
        }
        public JsonResult CancleService(int serviceRequestId)
        {
            var user = HttpContext.Session.GetInt32("UserId");
            _serviceprovider = helperLandContext.ServiceRequests.Where(x => x.ServiceRequestId == serviceRequestId).AsNoTracking().First();
            _serviceprovider.ServiceProviderId = null;
            _serviceprovider.SpacceptedDate = null;
            helperLandContext.ServiceRequests.Update(_serviceprovider);
            helperLandContext.SaveChanges();
            return Json(serviceRequestId);
        }
        public JsonResult getUpcomingeRequestDetails(int servicerequestid)
        {
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()

                          where (sr.ServiceRequestId == servicerequestid && sr.Status != 1)
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
        public JsonResult CompleteService(int serviceRequestId)
        {
            var user = HttpContext.Session.GetInt32("UserId");
            _serviceprovider = helperLandContext.ServiceRequests.Where(x => x.ServiceRequestId == serviceRequestId).AsNoTracking().First();
            _serviceprovider.ServiceProviderId = user;
            _serviceprovider.Status = 1;
            _serviceprovider.SpacceptedDate = DateTime.Now;
            helperLandContext.ServiceRequests.Update(_serviceprovider);
            helperLandContext.SaveChanges();
            return Json(serviceRequestId);
        }
        public JsonResult getServiceHistory()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.ServiceRequestAddresses on (int?)sr.ServiceRequestId equals (int?)sp.ServiceRequestId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where ((int?)cs.UserTypeId == 2 && sr.Status == 1 && sr.ServiceProviderId == user)
                          select new
                          {
                              ServiceRequestId = (int?)sr.ServiceRequestId,
                              ServiceDateTime = (DateTime?)sr.ServiceStartDate,
                              UserName = cs.FirstName + " " + cs.LastName,
                              UserAddress = sp.AddressLine1 + " " + sp.AddressLine2 + "<br>&nbsp&nbsp&nbsp&nbsp " + sp.City + " " + sp.State + " " + sp.PostalCode,
                              Payment = (int?)sr.TotalCost,
                              ServiceHours = (decimal?)sr.ServiceHours
                              // SPRate = helperLandContext.Ratings.Where(x => x.RatingTo == (int?)sp.UserId).Select(z => z.Ratings).AsEnumerable()
                          }).ToList();
            return Json(result);
        }
    }
}
