using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModels
{
    public class ContactUsViewModel
    {
        [Required]
        public string firstname { get; set; }
        public string lastname { get; set; }
        [Required]
        [RegularExpression(@"^([0-9]{10})$", ErrorMessage = "Enter valid Mobile Number!")]
        public string mobile { get; set; }
        [Required]
        [EmailAddress(ErrorMessage = "Enter valid Email Id!")]
        public string email { get; set; }
        public string subject { get; set; }
        [Required]
        public string message { get; set; }
        public IFormFile attachment { get; set; }
    }
}
