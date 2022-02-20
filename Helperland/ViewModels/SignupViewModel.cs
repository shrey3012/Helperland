using Helperland.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class SignupViewModel
    {
        [Required]
        public string firstname { get; set; }

        [Required]
        public string lastname { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Enter valid Email Id!")]
        [Remote(action: "isEmailAlreadyRegistered", controller: "Customer")]
        public string email { get; set; }

        [Required]
        [RegularExpression(@"^([0-9]{10})$", ErrorMessage = "Enter valid Mobile Number!")]
        public string mobile { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,14}$",
                            ErrorMessage = "Password must be 6 to 14 Characters long, must contain at least one Upper case, one Lower case, one Digit and one Special character!")]
        public string password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("password", ErrorMessage = "Password And Confirm Password must be Same!")]
        public string confirmpassword { get; set; }
    }
}
