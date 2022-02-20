using Helperland.Core;
using Helperland.Data;
using Helperland.Enums;
using Helperland.Models;
using Helperland.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;


namespace Helperland.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly HelperLandContext helperLandContext;
        private readonly IConfiguration configuration;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IDataProtectionProvider _dataProtectionProvider;
        private readonly string _key = "HELPERLAND";
        private readonly object _context;
        private User _user;
        private object _helperlandContext;
        private object helperlandContext;

        public object Session { get; private set; }

        public HomeController(ILogger<HomeController> logger, HelperLandContext helperLandContext,
                                   IHostingEnvironment hostingEnvironment, IConfiguration configuration,
                                   IDataProtectionProvider dataProtectionProvider)
        {
            _logger = logger;
            this.helperLandContext = helperLandContext;
            this.configuration = configuration;
            this._hostingEnvironment = hostingEnvironment;
            this._dataProtectionProvider = dataProtectionProvider;
        }

        public async Task<IActionResult> index()
        {
            var EmailId = HttpContext.Request.Cookies["EmailId"];
            var Password = HttpContext.Request.Cookies["Password"];
            if (EmailId != null && Password != null)
            {
                User user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == EmailId && e.Password == Password);
                if (user != null && user.IsApproved == true)
                {
                    HttpContext.Session.SetInt32("UserType", user.UserTypeId);
                    HttpContext.Session.SetString("UserName", user.FirstName);
                    if (user.UserTypeId == (int)UserTypeIdEnum.Customer)
                        return RedirectToAction("servicehistory", "home");
                    else if (user.UserTypeId == (int)UserTypeIdEnum.ServiceProvider)
                        return RedirectToAction("upcomingservice", "serviceprovider");
                    else
                        return RedirectToAction("index", "admin");
                    //userTypewiseRedirection(user.UserTypeId, user.FirstName);
                }
                return View();
            }
            else
                return View();
        }
        public IActionResult faq()
        {
            return View();
        }
        public IActionResult prices()
        {
            return View();
        }
        public IActionResult contactus()
        {
            return View();
        }

        [HttpPost]
        public IActionResult contactus(ContactUsViewModel model)
        {
            if (ModelState.IsValid)
            {
                string filepath = "";
                string filename = "";
                if (model.attachment != null)
                {
                    string UploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "upload\\contactus_attachment");
                    filename = Guid.NewGuid().ToString() + "_" + model.attachment.FileName;
                    filepath = Path.Combine(UploadsFolder, filename);
                    using (var fileStream = new FileStream(filepath, FileMode.Create))
                    {
                        model.attachment.CopyTo(fileStream);
                    }
                }
                ContactUs Newcontact = new ContactUs()
                {
                    Name = model.firstname + " " + model.lastname,
                    Email = model.email,
                    Subject = model.subject,
                    PhoneNumber = model.mobile,
                    Message = model.message,
                    UploadFileName = filename
                };
                helperLandContext.Add(Newcontact);
                helperLandContext.SaveChanges();
                /*EmailModel emailmodel = new EmailModel
                {
                    From = "",
                    To = "",
                    Subject = Newcontact.Subject,
                    Body = Newcontact.Message,
                    Attachment = filepath
                };
                MailHelper mailhelp = new MailHelper(configuration);

                mailhelp.SendContectUs(emailmodel);*/
                return RedirectToAction();
            }
            return View();
        }
        public IActionResult aboutus()
        {
            return View();
        }
        public IActionResult servicehistory()
        {
            if (HttpContext.Session.GetInt32("UserType") == (int)UserTypeIdEnum.Customer)
            {
                ViewBag.UserName = HttpContext.Session.GetString("UserName");
                if (HttpContext.Session.GetInt32("redirectToBookService") == 1)
                    return RedirectToAction("bookservice", "home");
                else
                    return View();
            }
            else
                return RedirectToAction("index", "home");
        }
        public IActionResult bookservice()
        {
            if (HttpContext.Session.GetInt32("UserType") == null)
            {
                HttpContext.Session.SetInt32("redirectToBookService", 1);
                ViewBag.openLoginModel = true;
                return View("~/Views/home/index.cshtml");
            }
            else
            {
                HttpContext.Session.GetInt32("UserId");
                return View();
            } 
        }
        /* [HttpPost]
         public ActionResult booking([FromBody] ServiceRequest booking)
         {
             if (booking == null)
                 return Json(new SingeEntity<ServiceRequest>() { Result = null, Status = "ERROR", ErrorMessage = "Error in deserializing submitted data into booking object" }
                     , new System.Text.Json.JsonSerializerOptions()
                     {
                         PropertyNameCaseInsensitive = false
                     });
             else
             {
                 var result = new System.Dynamic.ExpandoObject();
                 return Json(new SingeEntity<ServiceRequest>() { Result = booking, Status = "OK" }
                     , new System.Text.Json.JsonSerializerOptions()
                     {
                         PropertyNameCaseInsensitive = false
                     });
             }
         }
         public class SingeEntity<T> where T : class
         {
             public T Result { get; set; }
             public string Status { get; set; }
             public string ErrorMessage { get; set; }
         }*/

        [HttpPost]
        public JsonResult checkAvailabilitySP(string zipcode)
        {
            var isExist = helperLandContext.Users.Where(z => z.ZipCode == zipcode).Count();
            bool result = false;
            if (isExist > 0)
                result = true;
            return Json(result);
        }
       
        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult customersignup()
        {
            return View();
        }

        [HttpPost]
        public IActionResult customersignup(SignupViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    User user = new User
                    {
                        FirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(model.firstname),
                        LastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(model.lastname),
                        Email = model.email,
                        Mobile = model.mobile,
                        Password = model.password,
                        CreatedDate = DateTime.Now,
                        UserTypeId = (int)UserTypeIdEnum.Customer,
                        IsApproved = true,
                        ModifiedBy = (int)UserTypeIdEnum.Customer,
                        ModifiedDate = DateTime.Now
                    };
                    helperLandContext.Add(user);
                    helperLandContext.SaveChanges();
                    TempData["msg"] = "Account Created Successfully!!";
                    return RedirectToAction("customersignup", "home");
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return View();
        }

      /*  [HttpPost]
        [HttpGet]
        public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
        {
            var user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == email);
            if (user == null)
                return Json(true);
            else
                return Json($"This Email {email} is Already Registered!!");
        }*/

        [HttpPost]
        [Route("home/index")]
        public async Task<IActionResult> loginUser(LoginAndForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = await helperLandContext.Users.FirstOrDefaultAsync(e=>e.Email == model.Login.email && e.Password == model.Login.password);
                if (user != null && user.IsApproved == true)
                {
                    if (model.Login.isRemember == true)
                    {
                        HttpContext.Response.Cookies.Append("EmailId", user.Email);
                        HttpContext.Response.Cookies.Append("Password", user.Password);
                    }
                    HttpContext.Session.SetInt32("UserType", user.UserTypeId);
                    HttpContext.Session.SetString("UserName", user.FirstName);
                    HttpContext.Session.SetInt32("UserId", user.UserId);
                    if (user.UserTypeId == (int)UserTypeIdEnum.Customer)
                        return RedirectToAction("servicehistory", "home");
                    else if (user.UserTypeId == (int)UserTypeIdEnum.ServiceProvider)
                        return RedirectToAction("upcomingservice", "serviceprovider");
                    else
                        return RedirectToAction("index", "admin");                  
                }
                else if (user != null && user.IsApproved == false)
                    TempData["errMsg"] = "Still you are not Approved by Admin!!";
                else
                    TempData["errMsg"] = "Invalid Username/Password";                
            }
            ViewBag.openLoginModel = true;
            return View("~/Views/home/index.cshtml", model);
        }

        [HttpPost]
        public IActionResult forgotPassword(LoginAndForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = helperLandContext.Users.Where(x => x.Email == model.ForgotPassword.email).FirstOrDefault();
                if (user != null)
                {
                    var plaintextbytes = System.Text.Encoding.UTF8.GetBytes(user.Password);
                    var OldPassword = System.Convert.ToBase64String(plaintextbytes);
                    string input = model.ForgotPassword.email + "_!_" + DateTime.Now.ToString() + "_!_" + OldPassword;
                    var protector = _dataProtectionProvider.CreateProtector(_key);
                    string encrypt = protector.Protect(input);
                    EmailModel emailModel = new EmailModel
                    {
                        To = model.ForgotPassword.email,
                        Subject = "Helperland Reset Password",
                        Body = "<h2>Reset Password Link:</h2><br/> " + "http://" + this.Request.Host.ToString() + "/home/resetpassword?token=" + encrypt                        
                    };
                    MailHelper mailhelper = new MailHelper(configuration);
                    mailhelper.Send(emailModel);
                }
                ViewBag.ForgotPasswordResetLinksend = true;
                return RedirectToAction("index");
            }
            return View();
        }

        public IActionResult resetPassword(string token)
        {
            if (ModelState.IsValid)
            {
                if (token != null)
                {
                    checkPassword(token);
                    return View();
                }
            }
            return View();
        }

        public bool checkPassword(string token)
        {
            string decrypt = "";
            try
            {
                var protector = _dataProtectionProvider.CreateProtector(_key);
                decrypt = protector.Unprotect(token);
            }
            catch
            {
                ViewBag.errMsg = "Link is InValid";
                return true;
            }
            string[] resetpasswordToken = decrypt.Split("_!_");
            _user = helperLandContext.Users.Where(x => x.Email == resetpasswordToken[0]).FirstOrDefault();
            DateTime tokendate = Convert.ToDateTime(resetpasswordToken[1]).AddMinutes(30);
            DateTime dateTime = DateTime.Now;
            var Base64EncodeBytes = System.Convert.FromBase64String(resetpasswordToken[2]);
            var oldPassword = System.Text.Encoding.UTF8.GetString(Base64EncodeBytes);
            if (tokendate < dateTime || oldPassword != _user.Password)
            {
                ViewBag.errMsg = "Link is Expaired";
                return false;
            }
            return true;
        }

        [HttpPost]
        public IActionResult resetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (!checkPassword(model.token))
                {
                    return View();
                }
                else
                {
                    ViewBag.errMsg = "Success";
                    ViewBag.msg = "true";
                }
                _user.Password = model.newPassword;
                _user.ModifiedDate = DateTime.Now;
                helperLandContext.Users.Update(_user);
                helperLandContext.SaveChanges();
            }
            return View();
        }

        public IActionResult logout()
        {
            foreach (var cookie in Request.Cookies.Keys)
                Response.Cookies.Delete(cookie);
            HttpContext.Session.Clear();
            return RedirectToAction("index", "home");
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        [HttpPost]
        public JsonResult addNewAddress([FromBody] UserAddressViewModel userAddressViewModel)
        {
            int userid = 0;
            if (HttpContext.Request.Cookies["UserId"] != null)
                userid = Int32.Parse(HttpContext.Request.Cookies["UserId"]);
            else
                userid = (int)HttpContext.Session.GetInt32("UserId");
            UserAddress userAddress = new UserAddress
            {
                UserId = userid,
                AddressLine1 = userAddressViewModel.addressLine1,
                AddressLine2 = userAddressViewModel.addressLine2,
                City = userAddressViewModel.city,
                State = userAddressViewModel.state,
                PostalCode = userAddressViewModel.postalCode,
                Mobile = userAddressViewModel.mobile,
                IsDefault = true,
                IsDeleted = false
            };
            helperLandContext.Add(userAddress);
            helperLandContext.SaveChanges();

            return Json(userAddress);
        }
        
    }

    
}
