using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland1.Models
{
    public partial class Login
    {   
        [Required]
        public string  Email { get; set; }
        public string Password { get; set; }
    }
}
