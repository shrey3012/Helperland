using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required(ErrorMessage = "Enter your Email Address!")]
        [EmailAddress(ErrorMessage = "Enter valid Email Address!")]
        public string email { get; set; }
    }
}
