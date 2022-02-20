using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public partial class LoginAndForgotPasswordViewModel
    {
        public LoginViewModel Login { get; set; }
        public ForgotPasswordViewModel ForgotPassword { get; set; }
    }
}
