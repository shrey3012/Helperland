using Helperland1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
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
