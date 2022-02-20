using Helperland.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.Controllers
{
    public class AdminController : Controller
    {
        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("UserType") == (int)UserTypeIdEnum.Admin)
                return View();
            else
                return RedirectToAction("index", "home");
            
        }
    }
}
