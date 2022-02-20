using Helperland.Data;
using Helperland.Enums;
using Helperland.Models;
using Helperland.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Controllers
{
    public class ServiceProviderController : Controller
    {
        private readonly HelperLandContext helperLandContext;
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
    }
}
