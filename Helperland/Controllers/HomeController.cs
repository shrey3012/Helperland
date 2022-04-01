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
using Helperland.Repository;
using Newtonsoft.Json;

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
        private readonly IUserAddressRepository userAddressRepository;
        private readonly IServiceRequestAddressRepository serviceRequestAddressRepository;

        public object Session { get; private set; }

        public HomeController(ILogger<HomeController> logger,
                              HelperLandContext helperLandContext,
                              IUserAddressRepository userAddressRepository,
                              IHostingEnvironment hostingEnvironment,
                              IConfiguration configuration,
                               IServiceRequestAddressRepository serviceRequestAddressRepository,
                              IDataProtectionProvider dataProtectionProvider)
        {
            _logger = logger;
            this.helperLandContext = helperLandContext;
            this.configuration = configuration;
            this._hostingEnvironment = hostingEnvironment;
            this._dataProtectionProvider = dataProtectionProvider;
            this.userAddressRepository = userAddressRepository;
            this.serviceRequestAddressRepository = serviceRequestAddressRepository;
        }

        public async Task<IActionResult> index()
        {
            /*var EmailId = HttpContext.Request.Cookies["EmailId"];
            var Password = HttpContext.Request.Cookies["Password"];
            if (EmailId != null && Password != null)
            {
                User user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == EmailId && e.Password == Password);
                *//*if (HttpContext.Request.Cookies["EmailId"] != null && HttpContext.Request.Cookies["Password"] != null)
                {
                    User user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == HttpContext.Request.Cookies["EmailId"] && e.Password == HttpContext.Request.Cookies["Password"]);*//*

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
                  
                }
                return View();
            }
            else
                return View();*/
            if (HttpContext.Request.Cookies["EmailId"] != null && HttpContext.Request.Cookies["Password"] != null)
            {
                User user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == HttpContext.Request.Cookies["EmailId"] && e.Password == HttpContext.Request.Cookies["Password"]);
                if (user != null && user.IsApproved == true)
                {
                    HttpContext.Session.SetInt32("UserType", user.UserTypeId);
                    HttpContext.Session.SetString("UserName", user.FirstName + ' ' + user.LastName);
                    if (user.UserTypeId == (int)UserTypeIdEnum.Customer)
                        return RedirectToAction("servicehistory", "Home");
                    else if (user.UserTypeId == (int)UserTypeIdEnum.ServiceProvider)
                        return RedirectToAction("upcomingservice", "serviceprovider");
                    else
                        return RedirectToAction("index", "admin");
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
                    filename = model.attachment.FileName;
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
                    UploadFileName = filename,
                    CreatedOn = DateTime.Now,
                };
                helperLandContext.Add(Newcontact);
                helperLandContext.SaveChanges();
                TempData["msg"] = "Your query has been submitted successfully. Our helpdesk team will contact you soon!";
                EmailModel emailmodel = new EmailModel
                {
                    From = "",
                    To = "",
                    Subject = Newcontact.Subject,
                    Body = "Custname :" + Newcontact.Name + "<br> Email :" + Newcontact.Email + "<br> Mobile :" + Newcontact.PhoneNumber + "<br> Message :" + Newcontact.Message,
                    Attachment = filepath
                };
                MailHelper mailhelp = new MailHelper(configuration);

                mailhelp.SendContectUs(emailmodel);
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
                var user = HttpContext.Session.GetInt32("UserId");

                var data = helperLandContext.ServiceRequests.ToList().Where(x => x.UserId == user);
                if (HttpContext.Session.GetInt32("redirectToBookService") == 1)
                    return RedirectToAction("bookservice", "home");
                else
                    return View(data);
            }
            else
                return RedirectToAction("index", "home");
        }

        public IActionResult bookservice()
        {
            if (HttpContext.Session.GetInt32("UserType") == null)
            {

                ViewBag.openLoginModel = true;
                HttpContext.Session.SetInt32("redirectToBookService", 1);
                return View("~/Views/home/index.cshtml");
            }
            else
            {
                HttpContext.Session.GetInt32("UserId");
                HttpContext.Session.GetString("UserName");
                return View();
            }
        }


        [HttpPost]
        public JsonResult checkAvailabilitySP(string zipcode)
        {
            var isExist = helperLandContext.Zipcodes.Where(z => z.ZipcodeValue == zipcode).Count();
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
                    TempData["msg"] = "Account created Successfully";
                    return RedirectToAction("customersignup", "home");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return View();
        }

        [HttpPost]
        [HttpGet]
        public async Task<IActionResult> IsEmailAlreadyRegistered(string email)
        {
            var user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == email);
            if (user == null)
                return Json(true);
            else
                return Json($"This Email {email} is Already Registered!!");
        }

        [HttpPost]
        /*[Route("home/index")]*/
        public async Task<IActionResult> loginUser(LoginAndForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                User user = await helperLandContext.Users.FirstOrDefaultAsync(e => e.Email == model.Login.email && e.Password == model.Login.password);
                if (user != null && user.IsActive == true)
                {
                    if (model.Login.isRemember == true)
                    {
                        CookieOptions cookieOptions = new CookieOptions();
                        HttpContext.Response.Cookies.Append("EmailId", user.Email, cookieOptions);
                        HttpContext.Response.Cookies.Append("Password", user.Password, cookieOptions);
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
                else if (user != null && user.IsActive == false)
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
        /* [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]*/
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public JsonResult getAllUserAddressesbyPostalcode(string postalcode)
        {
            if (HttpContext.Request.Cookies["UserId"] != null)
                return Json(helperLandContext.UserAddresses.Where(a => a.UserId.Equals(Int32.Parse(HttpContext.Request.Cookies["UserId"])) && a.PostalCode.Equals(postalcode)).ToList());
            else
                return Json(helperLandContext.UserAddresses.Where(a => a.UserId.Equals(HttpContext.Session.GetInt32("UserId")) && a.PostalCode.Equals(postalcode)).ToList());
        }
        [HttpGet]
        public JsonResult getAllUserAddresses()
        {
            if (HttpContext.Request.Cookies["UserId"] != null)
                return Json(helperLandContext.UserAddresses.Where(a => a.UserId.Equals(Int32.Parse(HttpContext.Request.Cookies["UserId"]))));
            else
                return Json(helperLandContext.UserAddresses.Where(a => a.UserId.Equals(HttpContext.Session.GetInt32("UserId"))));
        }

        public JsonResult getUserDetails()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            var data = helperLandContext.Users.Where(x => x.UserId == user);
            return Json(data);
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
        [HttpPost]
        public JsonResult updateUser([FromBody] UpdateUserViewModel model)
        {
            var user = HttpContext.Session.GetInt32("UserId");
            _user = helperLandContext.Users.Where(x => x.UserId == user).AsNoTracking().First();
            _user.FirstName = model.firstname;
            _user.LastName = model.lastname;
            _user.Mobile = model.mobile;

            helperLandContext.Users.Update(_user);
            helperLandContext.SaveChanges();

            return Json(model);
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
            /*helperLandContext.Add(userAddress);
            helperLandContext.SaveChanges();
            var result = userAddress;*/
            var result = userAddressRepository.AddUserAddress(userAddress);
            return Json(result);
        }

        [HttpPost]
        public JsonResult Completebooking([FromBody] ServiceRequestViewModel model)
        {
            int userid = 0;
            if (HttpContext.Request.Cookies["UserId"] != null)
                userid = Int32.Parse(HttpContext.Request.Cookies["UserId"]);
            else
                userid = (int)HttpContext.Session.GetInt32("UserId");
            ServiceRequest serviceRequest = new ServiceRequest
            {
                UserId = userid,
                ServiceId = 0,
                ServiceStartDate = Convert.ToDateTime(model.ServiceStartDate.ToString() + " " + model.ServiceStarttime.ToString()),
                ZipCode = model.ZipCode.ToString().Trim(),
                ServiceHourlyRate = 30,
                ServiceHours = 3,
                ExtraHours = 0,
                SubTotal = model.SubTotal,
                TotalCost = model.TotalCost,
                Comments = model.Comments.ToString(),
                PaymentDone = true,
                PaymentDue = false,
                //ServiceProviderId = 1,
                HasPets = model.HasPets,
                CreatedDate = DateTime.Now,
                ModifiedDate = DateTime.Now,
                // ModifiedBy = model.UserId,
                RecordVersion = Guid.NewGuid(),
                Distance = 25,
            };
            helperLandContext.Add(serviceRequest);
            helperLandContext.SaveChanges();
            model.ServiceRequestID = serviceRequest.ServiceRequestId;

            UserAddress userAddress = userAddressRepository.GetAddressByAddressId(Convert.ToInt32(model.UserAddressID));
            ServiceRequestAddress serviceRequestAddress = new ServiceRequestAddress
            {
                ServiceRequestId = serviceRequest.ServiceRequestId,
                AddressLine1 = userAddress.AddressLine1,
                AddressLine2 = userAddress.AddressLine2,
                City = userAddress.City,
                State = userAddress.State,
                PostalCode = userAddress.PostalCode,
                Mobile = userAddress.Mobile,
                Email = userAddress.Email
            };
            serviceRequestAddressRepository.saveServiceRequestAddress(serviceRequestAddress);

            EmailModel emailModel;
            List<User> availableSPsInGivenZipcode = (from u in helperLandContext.Users
                                                     join fb in helperLandContext.FavoriteAndBlockeds on u.UserId equals fb.UserId into fb1
                                                     from fb in fb1.DefaultIfEmpty()
                                                     where u.ZipCode == serviceRequest.ZipCode && u.IsApproved == true && u.UserTypeId == (int)UserTypeIdEnum.ServiceProvider && Convert.ToInt16(model.UserId) != fb.TargetUserId
                                                     select u).ToList();

            foreach (var sps in availableSPsInGivenZipcode)
            {
                emailModel = new EmailModel
                {
                    To = sps.Email,
                    Subject = "Service Request Available!!",
                    Body = "Service Request ID: " + serviceRequest.ServiceRequestId
                };
                MailHelper mailhelper = new MailHelper(configuration);
                mailhelper.Send(emailModel);
            }
            return Json(serviceRequest.ServiceRequestId);
        }
        [HttpPost]
        public JsonResult checkUserPassword()
        {
            var user = HttpContext.Session.GetInt32("UserId");
            var x = helperLandContext.Users.Where(p => p.UserId == user).FirstOrDefault();
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

        public JsonResult GetCustomerDashboard()
        {
            var userid = HttpContext.Session.GetInt32("UserId");
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on cs.UserId equals sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.Users on sr.ServiceProviderId equals sp.UserId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where cs.UserId == userid && sr.Status != 1 && sr.Status != 3
                          select new
                          {
                              CustomerId = (int?)cs.UserId,
                              ServiceRequestId = (int?)sr.ServiceRequestId,
                              ServiceDateTime = (DateTime?)sr.ServiceStartDate,
                              ServiceProviderId = (int?)sr.ServiceProviderId,
                              ServiceProviderName = sp.FirstName + " " + sp.LastName,
                              ServiceProviderProfile = sp.UserProfilePicture,
                              Payment = (int?)sr.TotalCost,
                              ServiceHours = (decimal?)sr.ServiceHours,
                              SPRate = helperLandContext.Ratings.Where(x => x.RatingTo == (int?)sp.UserId).Select(z => z.Ratings).AsEnumerable()
                          }).ToList();
            return Json(result);
        }
        [HttpGet]
        public JsonResult getServiceDetails(int servicerequestid)
        {
            var result = (from sr in helperLandContext.ServiceRequests
                          join sra in helperLandContext.ServiceRequestAddresses on sr.ServiceRequestId equals sra.ServiceRequestId
                          where sr.ServiceRequestId == servicerequestid
                          select new
                          {
                              ServiceProviderId = sr.ServiceProviderId,
                              ServiceStartDateTime = sr.ServiceStartDate,
                              ServiceDuration = sr.ServiceHours,
                              ServiceNetAmount = sr.TotalCost,
                              Comments = sr.Comments,
                              HasPets = sr.HasPets,
                              AddressId = sra.Id,
                              AddressLine1 = sra.AddressLine1,
                              AddressLine2 = sra.AddressLine2,
                              City = sra.City,
                              State = sra.State,
                              Postalcode = sra.PostalCode,
                              Mobile = sra.Mobile,
                          }).ToList();
            return Json(result);
        }
        [HttpGet]
        public JsonResult getCustomerServiceHistory()
        {
            var userid = HttpContext.Session.GetInt32("UserId");
            var result = (from cs in helperLandContext.Users
                          join sr in helperLandContext.ServiceRequests on (int?)cs.UserId equals (int?)sr.UserId into sr1
                          from sr in sr1.DefaultIfEmpty()
                          join sp in helperLandContext.Users on (int?)sr.ServiceProviderId equals (int?)sp.UserId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where (int?)cs.UserId == userid && (int?)sr.Status == 1 || sr.Status == 3
                          select new
                          {
                              CustomerId = (int?)cs.UserId,
                              ServiceRequestId = (int?)sr.ServiceRequestId,
                              ServiceDateTime = (DateTime?)sr.ServiceStartDate,
                              ServiceProviderId = (int?)sr.ServiceProviderId,
                              ServiceProviderName = sp.FirstName + " " + sp.LastName,
                              ServiceProviderProfile = sp.UserProfilePicture,
                              Payment = (int?)sr.TotalCost,
                              ServiceHours = (decimal?)sr.ServiceHours,
                              /*SPRate = helperLandContext.Ratings.Where(x => x.RatingTo == (int?)sp.UserId).Select(z => z.Ratings).AsEnumerable(),*/
                              ServiceStatus = (int?)sr.Status
                          }).ToList();
            return Json(result);
        }
        [HttpPost]
        public JsonResult cancelServiceRequest(int servicerequestid)
        {
            var userid = HttpContext.Session.GetInt32("UserId");
            ServiceRequest serviceRequest = helperLandContext.ServiceRequests.Where(s => s.ServiceRequestId == servicerequestid).FirstOrDefault();
            if (serviceRequest != null)
            {
                serviceRequest.Status = 3;
                serviceRequest.ModifiedBy = userid;
                serviceRequest.ModifiedDate = DateTime.Now;
            }
            helperLandContext.ServiceRequests.Update(serviceRequest);
            var emails = (from sr in helperLandContext.ServiceRequests
                          join u in helperLandContext.Users on sr.UserId equals u.UserId
                          join sp in helperLandContext.Users on sr.ServiceProviderId equals sp.UserId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where sr.ServiceRequestId == servicerequestid
                          select new
                          {
                              serviceProviderEmail = sp.Email,
                              availableSps = (from u in helperLandContext.Users
                                              join fb in helperLandContext.FavoriteAndBlockeds on u.UserId equals fb.UserId into fb1
                                              from fb in fb1.DefaultIfEmpty()
                                              where u.ZipCode == sr.ZipCode && u.IsApproved == true && u.UserTypeId == (int)UserTypeIdEnum.ServiceProvider && Convert.ToInt16(userid) != fb.TargetUserId
                                              select u.Email).AsNoTracking().ToList()
                          }).AsNoTracking().ToList();
            EmailModel emailModel = new EmailModel();
            string stremails = "";
            var vCount = 0;
            foreach (var e in emails)
            {
                if (e.serviceProviderEmail != null)
                {
                    stremails += e.serviceProviderEmail;
                }
                else
                {
                    foreach (var sps in e.availableSps)
                    {
                        if (vCount == 0)
                        {
                            stremails += sps;
                            vCount++;
                        }
                        else
                        {
                            stremails += "," + sps;
                        }
                    }
                }
            }
            emailModel.To = stremails;
            emailModel.Subject = "Service Request Cancelled by Customer!";
            emailModel.Body = "Cancelled Service ID: <strong>" + servicerequestid + "</strong>";
            MailHelper mailhelper = new MailHelper(configuration);
            mailhelper.Send(emailModel);
            return Json(helperLandContext.SaveChanges());
        }
        [HttpPost]
        public JsonResult updateServiceRequest([FromBody] updateServiceReqViewModel model)
        {
            var userid = HttpContext.Session.GetInt32("UserId");
            ServiceRequest serviceRequest = helperLandContext.ServiceRequests.Where(s => s.ServiceRequestId == model.ServiceRequestId).FirstOrDefault();
            if (serviceRequest != null)
            {
                serviceRequest.ServiceStartDate = Convert.ToDateTime(model.ServiceStartDate.ToString().Trim() + " " + model.ServiceStartTime.ToString().Trim());
                serviceRequest.ModifiedBy = userid;
                serviceRequest.ModifiedDate = DateTime.Now;
            }
            helperLandContext.ServiceRequests.Update(serviceRequest);
            var emails = (from sr in helperLandContext.ServiceRequests
                          join u in helperLandContext.Users on sr.UserId equals u.UserId
                          join sp in helperLandContext.Users on sr.ServiceProviderId equals sp.UserId into sp1
                          from sp in sp1.DefaultIfEmpty()
                          where sr.ServiceRequestId == model.ServiceRequestId
                          select new
                          {
                              serviceProviderEmail = sp.Email,
                              availableSps = (from u in helperLandContext.Users
                                              join fb in helperLandContext.FavoriteAndBlockeds on u.UserId equals fb.UserId into fb1
                                              from fb in fb1.DefaultIfEmpty()
                                              where u.ZipCode == sr.ZipCode && u.IsApproved == true && u.UserTypeId == (int)UserTypeIdEnum.ServiceProvider && Convert.ToInt16(userid) != fb.TargetUserId
                                              select u.Email).AsNoTracking().ToList()
                          }).AsNoTracking().ToList();
            EmailModel emailModel = new EmailModel();
            string stremails = "";
            var vCount = 0;
            foreach (var e in emails)
            {
                if (e.serviceProviderEmail != null)
                {
                    stremails += e.serviceProviderEmail;
                }
                else
                {
                    foreach (var sps in e.availableSps)
                    {
                        if (vCount == 0)
                        {
                            stremails += sps;
                            vCount++;
                        }
                        else
                        {
                            stremails += "," + sps;
                        }
                    }
                }
            }
            emailModel.To = stremails;
            emailModel.Subject = "Service Request Reschedule by Customer!";
            emailModel.Body = "Service ID: <strong>" + model.ServiceRequestId + "</strong><br/><br/>Reschedule Service Date & Time: <strong>" + model.ServiceStartDate + " " + model.ServiceStartTime + "</strong>";
            MailHelper mailhelper = new MailHelper(configuration);
            mailhelper.Send(emailModel);
            return Json(helperLandContext.SaveChanges());
        }

    }

}
