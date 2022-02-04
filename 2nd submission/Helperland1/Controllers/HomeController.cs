using Helperland1.Data;
using Helperland1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Dynamic;

namespace Helperland1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly Helperland1Context _context;

        public HomeController(ILogger<HomeController> logger, Helperland1Context context)
        {
            _logger = logger;
            _context = context;
        }
        /*Home page*/
        public IActionResult Index()
        {
            return View();
        }
        /*Price page*/
        public IActionResult Price()
        {
            return View();
        }
        /*Contact page Action*/
        public IActionResult Contact()
        {
            return View();
        }
        /*About page Action*/
        public IActionResult About()
        {
            return View();
        }
        /*Service provider signUp page Action*/
        public IActionResult BecomeSP()
        {
            return View();
        }
        /*FAQ page Action*/
        public IActionResult Faq()
        {
            return View();
        }
        /*SignUp page Action*/
        public IActionResult SignUp()
        {
            return View();
        }
        public IActionResult BookService()
        {
            return View();
        }
        public IActionResult History()
        {
            return View();
        }
        public IActionResult Upcomming()
        {
            return View();
        }


        /*[HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login([Bind("Email,Password")] Login user)
        {
            User loggedInUser = new User();
            if (ModelState.IsValid)
            {
                loggedInUser = await _context.Users.FirstOrDefaultAsync(us => us.Email == user.Email);
                if (loggedInUser.Email != "")
                {
                    if (loggedInUser.Password == user.Password)
                    {
                        return RedirectToAction("Index");
                    }
                }
                else
                {
                    TempData["AlertMessage"] = "Email or password is wrong. Try again with valid email and password";
                    
                    return RedirectToAction("Contact");
                }
                Console.WriteLine("Failed");
                return RedirectToAction( "Faq");
            } else
            {
                Console.WriteLine("Failed");
                return RedirectToAction( "Price");
            }
            

        }*/
        [HttpPost]
        [ValidateAntiForgeryToken]
        public  IActionResult Login([Bind("Email,Password")] Login user)
        {
            User loggedInUser = new User();
            User UserId = new User();
            if (ModelState.IsValid)
            {
                loggedInUser =  _context.Users.FirstOrDefault(us => us.Email == user.Email);
                if (loggedInUser != null && loggedInUser.Email != "")
                {
                    if (loggedInUser.Password == user.Password)
                    {
                        if (loggedInUser.UserTypeId == 1)
                        {
                            return RedirectToAction("History");
                        }
                        else if(loggedInUser.UserTypeId ==2)
                        {
                            return RedirectToAction("price");
                        }
                        else
                        {
                            RedirectToAction("");
                        }
                    }
                }
                else
                {
                    TempData["AlertMessage"] = "Email or password is wrong. Try again with valid email and password";

                   /* return RedirectToAction("Contact");*/
                }
                TempData["AlertMessage"] = "Email or password is wrong. Try again with valid email and password";
                return View();
            }
            else
            {
                TempData["AlertMessage"] = "Email or password is wrong. Try again with valid email and password";
                return View();
                /*return RedirectToAction("Price");*/
            }


        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
