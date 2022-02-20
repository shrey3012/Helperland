using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class ResetPasswordViewModel
    {
        public string email { get; set; }
        [Required]
        [RegularExpression(@"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,14}$",
                            ErrorMessage = "Password must be 6 to 14 Characters long, must contain at least one Upper case, one Lower case, one Digit and one Special character!")]
        public string newPassword { get; set; }


        [Compare("newPassword", ErrorMessage = "Password And Confirm password must match")]
        public string newConfirmPassword { get; set; }

        public string token { get; set; }
    }
}
