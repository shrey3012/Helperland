using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Helperland1.Data;
using Helperland1.Models;

namespace Helperland1.Controllers
{
    public class UsersController : Controller
    {
        private readonly Helperland1Context _context;

        public UsersController(Helperland1Context context)
        {
            _context = context;
        }

        // GET: Users/Create
        public IActionResult Create()
        {
            return View();
        }

        public IActionResult BeSP()
        {
            return View();
        }

        // POST: Users/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to, for 
        // more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("UserId,FirstName,LastName,Email,Password,Mobile,UserTypeId,Gender,DateOfBirth,UserProfilePicture,IsRegisteredUser,PaymentGatewayUserRef,ZipCode,WorksWithPets,LanguageId,NationalityId,CreatedDate,ModifiedDate,ModifiedBy,IsApproved,IsActive,IsDeleted,Status,BankTokenId,TaxNo")] User user)
        {
            if (ModelState.IsValid)
            {
                _context.Add(user);
                await _context.SaveChangesAsync();
                TempData["AlertMessage"] = "Account created Successfully...Login Now!";
                /*return RedirectToAction("Index","Home");*/
            }
            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> BeSP([Bind("UserId,FirstName,LastName,Email,Password,Mobile,UserTypeId,Gender,DateOfBirth,UserProfilePicture,IsRegisteredUser,PaymentGatewayUserRef,ZipCode,WorksWithPets,LanguageId,NationalityId,CreatedDate,ModifiedDate,ModifiedBy,IsApproved,IsActive,IsDeleted,Status,BankTokenId,TaxNo")] User user)
        {
            if (ModelState.IsValid)
            {
                _context.Add(user);
                await _context.SaveChangesAsync();
                TempData["AlertMessage"] = "Account created Successfully...Login Now!";
            }
            return View();
        }

    }
}
